package com.zara.mobiles.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {

    public enum TransactionType {
        INITIAL,
        ORDER_RESERVATION,
        ORDER_FULFILLMENT,
        ORDER_CANCELLATION,
        MANUAL_ADJUSTMENT,
        RESTOCK
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 30)
    private TransactionType transactionType;

    @Column(name = "quantity_change", nullable = false)
    private Integer quantityChange;

    @Column(name = "quantity_after", nullable = false)
    private Integer quantityAfter;

    @Column(nullable = false, length = 255)
    private String reason;

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public InventoryTransaction() {}

    public InventoryTransaction(Product product, TransactionType transactionType, Integer quantityChange, Integer quantityAfter, String reason, String referenceId) {
        this.product = product;
        this.transactionType = transactionType;
        this.quantityChange = quantityChange;
        this.quantityAfter = quantityAfter;
        this.reason = reason;
        this.referenceId = referenceId;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public Integer getQuantityChange() { return quantityChange; }
    public void setQuantityChange(Integer quantityChange) { this.quantityChange = quantityChange; }

    public Integer getQuantityAfter() { return quantityAfter; }
    public void setQuantityAfter(Integer quantityAfter) { this.quantityAfter = quantityAfter; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
