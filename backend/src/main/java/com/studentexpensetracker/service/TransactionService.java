package com.studentexpensetracker.service;

import com.studentexpensetracker.dto.TransactionRequest;
import com.studentexpensetracker.dto.TransactionResponse;
import com.studentexpensetracker.model.Category;
import com.studentexpensetracker.model.Transaction;
import com.studentexpensetracker.model.User;
import com.studentexpensetracker.repository.CategoryRepository;
import com.studentexpensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public TransactionResponse createTransaction(User user, TransactionRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCategory(category);
        transaction.setAmount(request.getAmount());
        transaction.setType(Transaction.TransactionType.valueOf(request.getType().toUpperCase()));
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate() != null ? 
                request.getTransactionDate() : LocalDate.now());
        transaction.setCreatedAt(LocalDateTime.now());

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponse(savedTransaction);
    }

    public List<TransactionResponse> getTransactionsByUser(User user) {
        List<Transaction> transactions = transactionRepository.findByUserOrderByTransactionDateDesc(user);
        return transactions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByDateRange(User user, LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findByUserAndTransactionDateBetween(user, startDate, endDate);
        return transactions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getIncomeTransactions(User user) {
        List<Transaction> transactions = transactionRepository.findByUserAndTypeOrderByTransactionDateDesc(user, Transaction.TransactionType.INCOME);
        return transactions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getExpenseTransactions(User user) {
        List<Transaction> transactions = transactionRepository.findByUserAndTypeOrderByTransactionDateDesc(user, Transaction.TransactionType.EXPENSE);
        return transactions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Optional<TransactionResponse> getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .map(this::mapToResponse);
    }

    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            transaction.setCategory(category);
        }

        if (request.getAmount() != null) {
            transaction.setAmount(request.getAmount());
        }

        if (request.getType() != null) {
            transaction.setType(Transaction.TransactionType.valueOf(request.getType().toUpperCase()));
        }

        if (request.getDescription() != null) {
            transaction.setDescription(request.getDescription());
        }

        if (request.getTransactionDate() != null) {
            transaction.setTransactionDate(request.getTransactionDate());
        }

        transaction.setUpdatedAt(LocalDateTime.now());
        Transaction updatedTransaction = transactionRepository.save(transaction);

        return mapToResponse(updatedTransaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    public BigDecimal getTotalIncome(User user) {
        BigDecimal total = transactionRepository.sumByUserAndType(user, Transaction.TransactionType.INCOME);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalExpenses(User user) {
        BigDecimal total = transactionRepository.sumByUserAndType(user, Transaction.TransactionType.EXPENSE);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getCurrentBalance(User user) {
        BigDecimal income = getTotalIncome(user);
        BigDecimal expenses = getTotalExpenses(user);
        return income.subtract(expenses);
    }

    public Integer getTotalTransactionsCount(User user) {
        Integer count = transactionRepository.countByUser(user);
        return count != null ? count : 0;
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setUserId(transaction.getUser().getId());
        response.setCategoryId(transaction.getCategory().getId());
        response.setCategoryName(transaction.getCategory().getName());
        response.setAmount(transaction.getAmount());
        response.setType(transaction.getType().toString());
        response.setDescription(transaction.getDescription());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setCreatedAt(transaction.getCreatedAt());
        response.setUpdatedAt(transaction.getUpdatedAt());
        return response;
    }
}
