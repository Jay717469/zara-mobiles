package com.zara.mobiles.dto;

import java.time.LocalDateTime;

public class CustomerSummaryDto {
    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private String status;
    private long totalOrders;
    private LocalDateTime registeredAt;

    public CustomerSummaryDto() {}

    public CustomerSummaryDto(Long id, String fullName, String email, String mobileNumber, String status, long totalOrders, LocalDateTime registeredAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.status = status;
        this.totalOrders = totalOrders;
        this.registeredAt = registeredAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
}
