package com.brix.BookStore.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brix.BookStore.service.BookStoreService;

@RestController
@RequestMapping("/api")
public class BookStoreController {

    @Autowired
    private BookStoreService service;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/register")
    public String registerUser(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");

        boolean success = service.registerUser(username, password);
        return success ? "Registration successful!" : "Registration failed!";
    }

    @PostMapping("/login")
    public Map<String, Object> loginUser(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");

        Map<String, Object> response = new HashMap<>();

        Integer userId = service.loginUser(username, password);
        if (userId != null) {
            response.put("status", "success");
            response.put("userId", userId);
        } else {
            response.put("status", "error");
            response.put("message", "Invalid username or password!");
        }

        return response;
    }


    @GetMapping("/books")
    public List<Map<String, Object>> getBooks() {
        return service.getAllBooks();
    }

    @PostMapping("/cart")
    public String addToCart(@RequestBody Map<String, Object> data) {
        int userId = (int) data.get("userId");
        int bookId = (int) data.get("bookId");
        int qty = (int) data.get("qty");

        boolean success = service.addToCart(userId, bookId, qty);
        return success ? "Book added to cart!" : "Failed to add to cart!";
    }


    @PostMapping("/order")
    public String placeOrder(@RequestBody Map<String, Object> data) {
        int userId = (int) data.get("userId");

        boolean success = service.placeOrder(userId);
        return success ? "Order placed successfully!" : "Order failed!";
    }

    @GetMapping("/orders")
    public List<Map<String, Object>> getOrders(@RequestParam int userId) {
        return service.getUserOrders(userId);
    }

    @GetMapping("/test-db")
    public String testDatabaseConnection() {
        return service.testConnection() ? "Database connected!" : "Database connection failed!";
    }

    @GetMapping("/cart/{userId}")
    public List<Map<String, Object>> getCart(@PathVariable int userId) {
        String query = "SELECT c.book_id, b.title, b.author, b.price, c.quantity " +
                    "FROM cart c JOIN books b ON c.book_id = b.id WHERE c.user_id = ?";
        return jdbcTemplate.queryForList(query, userId);
    }

    @DeleteMapping("/cart/{userId}/{bookId}")
    public String removeFromCart(@PathVariable int userId, @PathVariable int bookId) {
        jdbcTemplate.update("DELETE FROM cart WHERE user_id = ? AND book_id = ?", userId, bookId);
        return "Item removed from cart!";
    }

    @PostMapping("/checkout")
    public String checkout(@RequestBody Map<String, Object> data) {
        try {
            // Convert userId safely
            int userId = Integer.parseInt(data.get("userId").toString());

            // Extract list of items
            List<Map<String, Object>> items = (List<Map<String, Object>>) data.get("items");

            for (Map<String, Object> item : items) {
                int bookId = Integer.parseInt(item.get("bookId").toString());
                int qty = Integer.parseInt(item.get("qty").toString());

                jdbcTemplate.update(
                    "INSERT INTO orders (user_id, book_id, quantity) VALUES (?, ?, ?)",
                    userId, bookId, qty
                );
            }

            // Clear the cart after successful order
            jdbcTemplate.update("DELETE FROM cart WHERE user_id = ?", userId);

            return "Order placed successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error during checkout: " + e.getMessage());
            return "Checkout failed!";
        }
    }


}
