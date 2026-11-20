package com.zara.mobiles.dto;

import java.math.BigDecimal;

public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productBrand;
    private String productModel;
    private String productSku;
    private String primaryImageUrl;
    private Long variantId;
    private String variantDescription;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private Integer stockAvailable;

    public CartItemResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductBrand() { return productBrand; }
    public void setProductBrand(String productBrand) { this.productBrand = productBrand; }

    public String getProductModel() { return productModel; }
    public void setProductModel(String productModel) { this.productModel = productModel; }

    public String getProductSku() { return productSku; }
    public void setProductSku(String productSku) { this.productSku = productSku; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }

    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }

    public String getVariantDescription() { return variantDescription; }
    public void setVariantDescription(String variantDescription) { this.variantDescription = variantDescription; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public Integer getStockAvailable() { return stockAvailable; }
    public void setStockAvailable(Integer stockAvailable) { this.stockAvailable = stockAvailable; }
}
