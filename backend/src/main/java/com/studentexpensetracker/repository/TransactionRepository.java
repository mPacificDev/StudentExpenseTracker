package com.studentexpensetracker.repository;

import com.studentexpensetracker.model.Transaction;
import com.studentexpensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByTransactionDateDesc(User user);

    List<Transaction> findByUserAndTransactionDateBetween(User user, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserAndTypeOrderByTransactionDateDesc(User user, Transaction.TransactionType type);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    BigDecimal sumByUserAndType(@Param("user") User user, @Param("type") Transaction.TransactionType type);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user = :user")
    Integer countByUser(@Param("user") User user);
}
