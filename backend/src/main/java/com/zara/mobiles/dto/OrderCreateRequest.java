package com.zara.mobiles.dto;

import com.zara.mobiles.entity.Order;
import jakarta.validation.constraints.NotNull;

public class OrderCreateRequest {

    @NotNull(message = "Fulfilment type is required (HOME_DELIVERY or STORE_PICKUP)")
    private Order.FulfilmentType fulfilmentType;

    private Long deliveryAddressId;
    private AddressDto newDeliveryAddress;

    private Long pickupStoreId;
    private String pickupDateTime;

    @NotNull(message = "Payment method is required (COD or RAZORPAY)")
    private Order.PaymentMethod paymentMethod;

    private String customerNotes;

    public OrderCreateRequest() {}

    public Order.FulfilmentType getFulfilmentType() { return fulfilmentType; }
    public void setFulfilmentType(Order.FulfilmentType fulfilmentType) { this.fulfilmentType = fulfilmentType; }

    public Long getDeliveryAddressId() { return deliveryAddressId; }
    public void setDeliveryAddressId(Long deliveryAddressId) { this.deliveryAddressId = deliveryAddressId; }

    public AddressDto getNewDeliveryAddress() { return newDeliveryAddress; }
    public void setNewDeliveryAddress(AddressDto newDeliveryAddress) { this.newDeliveryAddress = newDeliveryAddress; }

    public Long getPickupStoreId() { return pickupStoreId; }
    public void setPickupStoreId(Long pickupStoreId) { this.pickupStoreId = pickupStoreId; }

    public String getPickupDateTime() { return pickupDateTime; }
    public void setPickupDateTime(String pickupDateTime) { this.pickupDateTime = pickupDateTime; }

    public Order.PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(Order.PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }
}
