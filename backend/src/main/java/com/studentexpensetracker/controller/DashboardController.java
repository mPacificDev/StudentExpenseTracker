package com.studentexpensetracker.controller;

import com.studentexpensetracker.dto.DashboardSummary;
import com.studentexpensetracker.model.User;
import com.studentexpensetracker.service.JwtService;
import com.studentexpensetracker.service.TransactionService;
import com.studentexpensetracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TransactionService transactionService;
    private final UserService userService;
    private final JwtService jwtService;

    private User getUserFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Long userId = jwtService.extractUserId(token);
            return userService.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
        }
        throw new IllegalArgumentException("Invalid authorization header");
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getDashboardSummary(
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);

            DashboardSummary summary = new DashboardSummary();
            summary.setUserId(user.getId());
            summary.setUserName(user.getName());
            summary.setTotalIncome(transactionService.getTotalIncome(user));
            summary.setTotalExpenses(transactionService.getTotalExpenses(user));
            summary.setCurrentBalance(transactionService.getCurrentBalance(user));
            summary.setTotalTransactions(transactionService.getTotalTransactionsCount(user));

            return ResponseEntity.ok(summary);
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
}
