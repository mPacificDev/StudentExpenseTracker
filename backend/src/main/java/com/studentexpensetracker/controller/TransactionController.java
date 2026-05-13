package com.studentexpensetracker.controller;

import com.studentexpensetracker.dto.TransactionRequest;
import com.studentexpensetracker.dto.TransactionResponse;
import com.studentexpensetracker.model.User;
import com.studentexpensetracker.service.JwtService;
import com.studentexpensetracker.service.TransactionService;
import com.studentexpensetracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;
    private final JwtService jwtService;

    private Long getUserIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtService.extractUserId(token);
        }
        throw new IllegalArgumentException("Invalid authorization header");
    }

    private User getUserFromToken(String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        return userService.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody TransactionRequest request) {
        try {
            User user = getUserFromToken(authHeader);
            TransactionResponse response = transactionService.createTransaction(user, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions(
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);
            List<TransactionResponse> transactions = transactionService.getTransactionsByUser(user);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<?> getTransactionsByDateRange(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            User user = getUserFromToken(authHeader);
            List<TransactionResponse> transactions = transactionService.getTransactionsByDateRange(user, startDate, endDate);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/income")
    public ResponseEntity<List<TransactionResponse>> getIncomeTransactions(
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);
            List<TransactionResponse> transactions = transactionService.getIncomeTransactions(user);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/expense")
    public ResponseEntity<List<TransactionResponse>> getExpenseTransactions(
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);
            List<TransactionResponse> transactions = transactionService.getExpenseTransactions(user);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            Optional<TransactionResponse> transaction = transactionService.getTransactionById(id);
            if (transaction.isPresent()) {
                return ResponseEntity.ok(transaction.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody TransactionRequest request) {
        try {
            getUserFromToken(authHeader); // Verify authorization
            TransactionResponse response = transactionService.updateTransaction(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            getUserFromToken(authHeader); // Verify authorization
            transactionService.deleteTransaction(id);
            return ResponseEntity.ok(new MessageResponse("Transaction deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    public static class ErrorResponse {
        public String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }

    public static class MessageResponse {
        public String message;

        public MessageResponse(String message) {
            this.message = message;
        }
    }
}
