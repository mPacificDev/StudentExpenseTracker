package com.studentexpensetracker.config;

import com.studentexpensetracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final CategoryService categoryService;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            try {
                categoryService.initializeDefaultCategories();
                System.out.println("Default categories initialized successfully");
            } catch (Exception e) {
                System.out.println("Categories already exist or error occurred: " + e.getMessage());
            }
        };
    }
}
