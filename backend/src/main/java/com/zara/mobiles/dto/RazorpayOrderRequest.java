package com.zara.mobiles.dto;

import jakarta.validation.constraints.NotNull;

public class RazorpayOrderRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    public RazorpayOrderRequest() {}

    public RazorpayOrderRequest(Long orderId) {
        this.orderId = orderId;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
}
