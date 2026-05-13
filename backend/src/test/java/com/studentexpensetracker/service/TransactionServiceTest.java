package com.studentexpensetracker.service;

import com.studentexpensetracker.dto.TransactionRequest;
import com.studentexpensetracker.dto.TransactionResponse;
import com.studentexpensetracker.model.Category;
import com.studentexpensetracker.model.Transaction;
import com.studentexpensetracker.model.User;
import com.studentexpensetracker.repository.CategoryRepository;
import com.studentexpensetracker.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private TransactionService transactionService;

    private User user;
    private Category expenseCategory;
    private Category incomeCategory;
    private Transaction transaction;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(10L);
        user.setName("Test Student");
        user.setEmail("student@example.com");

        expenseCategory = new Category();
        expenseCategory.setId(2L);
        expenseCategory.setName("Food");
        expenseCategory.setType(Category.CategoryType.EXPENSE);

        incomeCategory = new Category();
        incomeCategory.setId(3L);
        incomeCategory.setName("Scholarship");
        incomeCategory.setType(Category.CategoryType.INCOME);

        transaction = new Transaction();
        transaction.setId(100L);
        transaction.setUser(user);
        transaction.setCategory(expenseCategory);
        transaction.setAmount(new BigDecimal("5000"));
        transaction.setType(Transaction.TransactionType.EXPENSE);
        transaction.setDescription("Lunch");
        transaction.setTransactionDate(LocalDate.of(2026, 5, 11));
    }

    @Test
    void createTransaction_ShouldCreateAndReturnResponse() {
        TransactionRequest request = new TransactionRequest(
                2L,
                new BigDecimal("5000"),
                "EXPENSE",
                "Lunch",
                LocalDate.of(2026, 5, 11)
        );

        when(categoryRepository.findById(2L)).thenReturn(Optional.of(expenseCategory));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        TransactionResponse response = transactionService.createTransaction(user, request);

        assertEquals(100L, response.getId());
        assertEquals(10L, response.getUserId());
        assertEquals("Food", response.getCategoryName());
        assertEquals(new BigDecimal("5000"), response.getAmount());
        assertEquals("EXPENSE", response.getType());
        verify(categoryRepository).findById(2L);
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void createTransaction_ShouldThrowWhenCategoryDoesNotExist() {
        TransactionRequest request = new TransactionRequest(
                99L,
                new BigDecimal("3000"),
                "EXPENSE",
                "Missing category",
                LocalDate.of(2026, 5, 11)
        );

        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> transactionService.createTransaction(user, request)
        );

        assertEquals("Category not found", exception.getMessage());
        verify(categoryRepository).findById(99L);
    }

    @Test
    void getTransactionsByUser_ShouldMapTransactionsToResponses() {
        when(transactionRepository.findByUserOrderByTransactionDateDesc(user))
                .thenReturn(List.of(transaction));

        List<TransactionResponse> result = transactionService.getTransactionsByUser(user);

        assertEquals(1, result.size());
        assertEquals("Lunch", result.get(0).getDescription());
        assertEquals("Food", result.get(0).getCategoryName());
        verify(transactionRepository).findByUserOrderByTransactionDateDesc(user);
    }

    @Test
    void updateTransaction_ShouldApplyNewValues() {
        TransactionRequest request = new TransactionRequest(
                3L,
                new BigDecimal("25000"),
                "INCOME",
                "Scholarship installment",
                LocalDate.of(2026, 5, 12)
        );

        when(transactionRepository.findById(100L)).thenReturn(Optional.of(transaction));
        when(categoryRepository.findById(3L)).thenReturn(Optional.of(incomeCategory));
        when(transactionRepository.save(transaction)).thenAnswer(invocation -> invocation.getArgument(0));

        TransactionResponse response = transactionService.updateTransaction(100L, request);

        assertEquals("Scholarship", response.getCategoryName());
        assertEquals(new BigDecimal("25000"), response.getAmount());
        assertEquals("INCOME", response.getType());
        assertEquals("Scholarship installment", response.getDescription());
        assertEquals(LocalDate.of(2026, 5, 12), response.getTransactionDate());
        assertNotNull(response.getUpdatedAt());
        verify(transactionRepository).findById(100L);
        verify(categoryRepository).findById(3L);
        verify(transactionRepository).save(transaction);
    }

    @Test
    void getCurrentBalance_ShouldSubtractExpensesFromIncome() {
        when(transactionRepository.sumByUserAndType(user, Transaction.TransactionType.INCOME))
                .thenReturn(new BigDecimal("100000"));
        when(transactionRepository.sumByUserAndType(user, Transaction.TransactionType.EXPENSE))
                .thenReturn(new BigDecimal("35000"));

        BigDecimal result = transactionService.getCurrentBalance(user);

        assertEquals(new BigDecimal("65000"), result);
        verify(transactionRepository).sumByUserAndType(user, Transaction.TransactionType.INCOME);
        verify(transactionRepository).sumByUserAndType(user, Transaction.TransactionType.EXPENSE);
    }

    @Test
    void getTotalTransactionsCount_ShouldReturnZeroWhenRepositoryReturnsNull() {
        when(transactionRepository.countByUser(user)).thenReturn(null);

        Integer result = transactionService.getTotalTransactionsCount(user);

        assertEquals(0, result);
        verify(transactionRepository).countByUser(user);
    }
}
