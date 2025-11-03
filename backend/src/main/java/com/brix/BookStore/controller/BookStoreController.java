package com.brix.BookStore.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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

    @PostMapping("/register")
    public String registerUser(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");

        boolean success = service.registerUser(username, password);
        return success ? "Registration successful!" : "Registration failed!";
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");

        boolean valid = service.loginUser(username, password);
        return valid ? "Login successful!" : "Invalid username or password!";
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
}
