package com.studentexpensetracker.controller;

import com.studentexpensetracker.dto.CategoryResponse;
import com.studentexpensetracker.model.Category;
import com.studentexpensetracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryResponse> responses = categories.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{type}")
    public ResponseEntity<List<CategoryResponse>> getCategoriesByType(@PathVariable String type) {
        try {
            Category.CategoryType categoryType = Category.CategoryType.valueOf(type.toUpperCase());
            List<Category> categories = categoryService.getCategoriesByType(categoryType);
            List<CategoryResponse> responses = categories.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType().toString()
        );
    }
}
