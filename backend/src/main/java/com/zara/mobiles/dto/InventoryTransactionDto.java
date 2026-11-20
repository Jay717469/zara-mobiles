package com.zara.mobiles.dto;

import com.zara.mobiles.entity.InventoryTransaction;
import java.time.LocalDateTime;

public class InventoryTransactionDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private InventoryTransaction.TransactionType transactionType;
    private Integer quantityChange;
    private Integer quantityAfter;
    private String reason;
    private String referenceId;
    private LocalDateTime createdAt;

    public InventoryTransactionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductSku() { return productSku; }
    public void setProductSku(String productSku) { this.productSku = productSku; }

    public InventoryTransaction.TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(InventoryTransaction.TransactionType transactionType) { this.transactionType = transactionType; }

    public Integer getQuantityChange() { return quantityChange; }
    public void setQuantityChange(Integer quantityChange) { this.quantityChange = quantityChange; }

    public Integer getQuantityAfter() { return quantityAfter; }
    public void setQuantityAfter(Integer quantityAfter) { this.quantityAfter = quantityAfter; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
