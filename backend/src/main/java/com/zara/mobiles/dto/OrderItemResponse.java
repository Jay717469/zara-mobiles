package com.zara.mobiles.dto;

import java.math.BigDecimal;

public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private String productImage;
    private String variantInfo;
    private BigDecimal purchasePrice;
    private Integer quantity;
    private BigDecimal totalPrice;

    public OrderItemResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductSku() { return productSku; }
    public void setProductSku(String productSku) { this.productSku = productSku; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getVariantInfo() { return variantInfo; }
    public void setVariantInfo(String variantInfo) { this.variantInfo = variantInfo; }

    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
