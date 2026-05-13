package com.studentexpensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    private Long categoryId;
    private BigDecimal amount;
    private String type;
    private String description;
    private LocalDate transactionDate;
}
