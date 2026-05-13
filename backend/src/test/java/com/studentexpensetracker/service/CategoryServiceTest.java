package com.studentexpensetracker.service;

import com.studentexpensetracker.model.Category;
import com.studentexpensetracker.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category incomeCategory;
    private Category expenseCategory;

    @BeforeEach
    void setUp() {
        incomeCategory = new Category();
        incomeCategory.setId(1L);
        incomeCategory.setName("Scholarship");
        incomeCategory.setType(Category.CategoryType.INCOME);

        expenseCategory = new Category();
        expenseCategory.setId(2L);
        expenseCategory.setName("Food");
        expenseCategory.setType(Category.CategoryType.EXPENSE);
    }

    @Test
    void getAllCategories_ShouldReturnAllCategories() {
        when(categoryRepository.findAll()).thenReturn(List.of(incomeCategory, expenseCategory));

        List<Category> result = categoryService.getAllCategories();

        assertEquals(2, result.size());
        assertEquals("Scholarship", result.get(0).getName());
        verify(categoryRepository).findAll();
    }

    @Test
    void getCategoriesByType_ShouldReturnMatchingCategories() {
        when(categoryRepository.findByType(Category.CategoryType.EXPENSE))
                .thenReturn(List.of(expenseCategory));

        List<Category> result = categoryService.getCategoriesByType(Category.CategoryType.EXPENSE);

        assertEquals(1, result.size());
        assertEquals("Food", result.get(0).getName());
        assertEquals(Category.CategoryType.EXPENSE, result.get(0).getType());
        verify(categoryRepository).findByType(Category.CategoryType.EXPENSE);
    }

    @Test
    void createCategory_ShouldPopulateAndSaveCategory() {
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category saved = invocation.getArgument(0);
            saved.setId(3L);
            return saved;
        });

        Category result = categoryService.createCategory("Transport", Category.CategoryType.EXPENSE);

        assertEquals(3L, result.getId());
        assertEquals("Transport", result.getName());
        assertEquals(Category.CategoryType.EXPENSE, result.getType());
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void updateCategory_ShouldChangeNameWhenCategoryExists() {
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(expenseCategory));
        when(categoryRepository.save(expenseCategory)).thenReturn(expenseCategory);

        Category result = categoryService.updateCategory(2L, "Transport");

        assertEquals("Transport", result.getName());
        verify(categoryRepository).findById(2L);
        verify(categoryRepository).save(expenseCategory);
    }

    @Test
    void updateCategory_ShouldThrowWhenCategoryDoesNotExist() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> categoryService.updateCategory(99L, "Unknown")
        );

        assertEquals("Category not found", exception.getMessage());
        verify(categoryRepository).findById(99L);
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void initializeDefaultCategories_ShouldCreateOnlyMissingDefaults() {
        when(categoryRepository.findByName("Salary")).thenReturn(Optional.of(incomeCategory));
        when(categoryRepository.findByName("Freelance")).thenReturn(Optional.empty());
        when(categoryRepository.findByName("Gift")).thenReturn(Optional.empty());
        when(categoryRepository.findByName("Scholarship")).thenReturn(Optional.empty());
        when(categoryRepository.findByName("Business")).thenReturn(Optional.empty());
        when(categoryRepository.findByName("Food")).thenReturn(Optional.of(expenseCategory));
        when(categoryRepository.findByName("Transport")).thenReturn(Optional.empty());
        when(categoryRepository.findByName("Rent")).thenReturn(Optional.empty());
        when(categoryRepository.findByName("Shopping")).thenReturn(Optional.empty());
        when(categoryRepository.findByName("Entertainment")).thenReturn(Optional.empty());
        when(categoryRepository.findByName("Health")).thenReturn(Optional.empty());
        when(categoryRepository.findByName("Education")).thenReturn(Optional.empty());
        when(categoryRepository.findByName("Bills")).thenReturn(Optional.empty());
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> invocation.getArgument(0));

        categoryService.initializeDefaultCategories();

        verify(categoryRepository, times(13)).findByName(any(String.class));
        verify(categoryRepository, times(11)).save(any(Category.class));
    }
}
