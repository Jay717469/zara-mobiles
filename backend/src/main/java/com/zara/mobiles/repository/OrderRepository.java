package com.zara.mobiles.repository;

import com.zara.mobiles.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.orderStatus = :status) AND " +
           "(:keyword IS NULL OR LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(o.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Order> searchOrders(@Param("status") Order.OrderStatus status, @Param("keyword") String keyword, Pageable pageable);

    long countByOrderStatus(Order.OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = com.zara.mobiles.entity.Order.PaymentStatus.COMPLETED")
    BigDecimal sumTotalSales();
}
