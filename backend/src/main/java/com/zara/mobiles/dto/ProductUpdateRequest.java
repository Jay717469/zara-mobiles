package com.zara.mobiles.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductUpdateRequest {
    private Long categoryId;
    private String name;
    private String brand;
    private String model;
    private String sku;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPercentage;
    private Integer stockQuantity;
    private String ram;
    private String storage;
    private String processor;
    private String display;
    private String battery;
    private String camera;
    private String color;
    private String warrantyDetails;
    private Boolean isActive;
    private Boolean isFeatured;
    private Boolean isTrending;
    private Boolean isBestSeller;
    private List<String> imageUrls;
    private List<ProductVariantDto> variants;

    public ProductUpdateRequest() {}

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(BigDecimal discountPercentage) { this.discountPercentage = discountPercentage; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getRam() { return ram; }
    public void setRam(String ram) { this.ram = ram; }

    public String getStorage() { return storage; }
    public void setStorage(String storage) { this.storage = storage; }

    public String getProcessor() { return processor; }
    public void setProcessor(String processor) { this.processor = processor; }

    public String getDisplay() { return display; }
    public void setDisplay(String display) { this.display = display; }

    public String getBattery() { return battery; }
    public void setBattery(String battery) { this.battery = battery; }

    public String getCamera() { return camera; }
    public void setCamera(String camera) { this.camera = camera; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getWarrantyDetails() { return warrantyDetails; }
    public void setWarrantyDetails(String warrantyDetails) { this.warrantyDetails = warrantyDetails; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsTrending() { return isTrending; }
    public void setIsTrending(Boolean isTrending) { this.isTrending = isTrending; }

    public Boolean getIsBestSeller() { return isBestSeller; }
    public void setIsBestSeller(Boolean isBestSeller) { this.isBestSeller = isBestSeller; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public List<ProductVariantDto> getVariants() { return variants; }
    public void setVariants(List<ProductVariantDto> variants) { this.variants = variants; }
}
