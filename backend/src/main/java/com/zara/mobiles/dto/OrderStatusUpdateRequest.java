package com.zara.mobiles.dto;

import com.zara.mobiles.entity.Order;
import jakarta.validation.constraints.NotNull;

public class OrderStatusUpdateRequest {

    @NotNull(message = "Order status is required")
    private Order.OrderStatus status;

    private String notes;

    public OrderStatusUpdateRequest() {}

    public Order.OrderStatus getStatus() { return status; }
    public void setStatus(Order.OrderStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
