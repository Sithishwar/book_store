package com.brix.BookStore.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class BookStoreService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean registerUser(String username, String password) {
        try {
            jdbcTemplate.update("INSERT INTO users (username, password) VALUES (?, ?)", username, password);
            return true;
        } catch (Exception e) {
            System.out.println("Error registering user: " + e.getMessage());
            return false;
        }
    }

    public boolean loginUser(String username, String password) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE username=? AND password=?",
                Integer.class, username, password
            );
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    public List<Map<String, Object>> getAllBooks() {
        return jdbcTemplate.queryForList("SELECT * FROM books");
    }

    public boolean addToCart(int userId, int bookId, int qty) {
        try {
            jdbcTemplate.update(
                "INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)",
                userId, bookId, qty
            );
            return true;
        } catch (Exception e) {
            System.out.println("Error adding to cart: " + e.getMessage());
            return false;
        }
    }

    public boolean placeOrder(int userId) {
        try {
            jdbcTemplate.update(
                "INSERT INTO orders (user_id, order_date) VALUES (?, NOW())",
                userId
            );
            jdbcTemplate.update(
                "DELETE FROM cart WHERE user_id = ?",
                userId
            );
            return true;
        } catch (Exception e) {
            System.out.println("Error placing order: " + e.getMessage());
            return false;
        }
    }

    public List<Map<String, Object>> getUserOrders(int userId) {
        return jdbcTemplate.queryForList(
            "SELECT * FROM orders WHERE user_id = ?", userId
        );
    }

    public boolean testConnection() {
        try {
            jdbcTemplate.execute("SELECT 1");
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
