package com.studentexpensetracker.service;

import com.studentexpensetracker.model.Category;
import com.studentexpensetracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getCategoriesByType(Category.CategoryType type) {
        return categoryRepository.findByType(type);
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(String name, Category.CategoryType type) {
        Category category = new Category();
        category.setName(name);
        category.setType(type);
        category.setCreatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, String name) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            category.get().setName(name);
            return categoryRepository.save(category.get());
        }
        throw new IllegalArgumentException("Category not found");
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    // Initialize default categories
    public void initializeDefaultCategories() {
        // Income Categories
        createIfNotExists("Salary", Category.CategoryType.INCOME);
        createIfNotExists("Freelance", Category.CategoryType.INCOME);
        createIfNotExists("Gift", Category.CategoryType.INCOME);
        createIfNotExists("Scholarship", Category.CategoryType.INCOME);
        createIfNotExists("Business", Category.CategoryType.INCOME);

        // Expense Categories
        createIfNotExists("Food", Category.CategoryType.EXPENSE);
        createIfNotExists("Transport", Category.CategoryType.EXPENSE);
        createIfNotExists("Rent", Category.CategoryType.EXPENSE);
        createIfNotExists("Shopping", Category.CategoryType.EXPENSE);
        createIfNotExists("Entertainment", Category.CategoryType.EXPENSE);
        createIfNotExists("Health", Category.CategoryType.EXPENSE);
        createIfNotExists("Education", Category.CategoryType.EXPENSE);
        createIfNotExists("Bills", Category.CategoryType.EXPENSE);
    }

    private void createIfNotExists(String name, Category.CategoryType type) {
        if (!categoryRepository.findByName(name).isPresent()) {
            createCategory(name, type);
        }
    }
}
