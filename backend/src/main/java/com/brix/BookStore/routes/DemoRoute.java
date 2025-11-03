package com.brix.BookStore.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class DemoRoute {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public String sayHello() {
        return "Hello";
    }

    @GetMapping("/checkdb")
    public String checkDatabaseConnection() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return "Connected to PostgreSQL successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to connect to PostgreSQL: " + e.getMessage();
        }
    }
}
