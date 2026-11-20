package com.zara.mobiles.dto;

import java.math.BigDecimal;

public class ProductVariantDto {
    private Long id;
    private String color;
    private String ram;
    private String storage;
    private String sku;
    private BigDecimal priceAdjustment;
    private Integer stockQuantity;
    private Boolean isActive;

    public ProductVariantDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getRam() { return ram; }
    public void setRam(String ram) { this.ram = ram; }

    public String getStorage() { return storage; }
    public void setStorage(String storage) { this.storage = storage; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public BigDecimal getPriceAdjustment() { return priceAdjustment; }
    public void setPriceAdjustment(BigDecimal priceAdjustment) { this.priceAdjustment = priceAdjustment; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
