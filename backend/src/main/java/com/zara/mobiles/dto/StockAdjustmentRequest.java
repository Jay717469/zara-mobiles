package com.zara.mobiles.dto;

import com.zara.mobiles.entity.InventoryTransaction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StockAdjustmentRequest {

    @NotNull(message = "Quantity change is required (positive for increase, negative for decrease)")
    private Integer quantityChange;

    @NotNull(message = "Transaction type is required")
    private InventoryTransaction.TransactionType transactionType = InventoryTransaction.TransactionType.MANUAL_ADJUSTMENT;

    @NotBlank(message = "Reason is required")
    private String reason;

    private String referenceId;

    public StockAdjustmentRequest() {}

    public Integer getQuantityChange() { return quantityChange; }
    public void setQuantityChange(Integer quantityChange) { this.quantityChange = quantityChange; }

    public InventoryTransaction.TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(InventoryTransaction.TransactionType transactionType) { this.transactionType = transactionType; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
}
