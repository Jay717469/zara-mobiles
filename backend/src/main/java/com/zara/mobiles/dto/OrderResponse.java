package com.zara.mobiles.dto;

import com.zara.mobiles.entity.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Order.OrderStatus orderStatus;
    private Order.FulfilmentType fulfilmentType;
    private AddressDto deliveryAddress;
    private StoreDto pickupStore;
    private String pickupDateTime;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private Order.PaymentMethod paymentMethod;
    private Order.PaymentStatus paymentStatus;
    private String customerNotes;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Order.OrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(Order.OrderStatus orderStatus) { this.orderStatus = orderStatus; }

    public Order.FulfilmentType getFulfilmentType() { return fulfilmentType; }
    public void setFulfilmentType(Order.FulfilmentType fulfilmentType) { this.fulfilmentType = fulfilmentType; }

    public AddressDto getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(AddressDto deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public StoreDto getPickupStore() { return pickupStore; }
    public void setPickupStore(StoreDto pickupStore) { this.pickupStore = pickupStore; }

    public String getPickupDateTime() { return pickupDateTime; }
    public void setPickupDateTime(String pickupDateTime) { this.pickupDateTime = pickupDateTime; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public Order.PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(Order.PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public Order.PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(Order.PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }

    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
