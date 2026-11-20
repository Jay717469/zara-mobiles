package com.zara.mobiles.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String brand;
    private String model;
    private String sku;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPercentage;
    private BigDecimal finalPrice;
    private Integer stockQuantity;
    private Boolean inStock;
    private BigDecimal rating;
    private Integer reviewCount;
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
    private String primaryImageUrl;
    private List<ProductImageDto> images;
    private List<ProductVariantDto> variants;
    private LocalDateTime createdAt;

    public ProductResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

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

    public BigDecimal getFinalPrice() { return finalPrice; }
    public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { 
        this.stockQuantity = stockQuantity;
        this.inStock = stockQuantity != null && stockQuantity > 0;
    }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

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

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }

    public List<ProductImageDto> getImages() { return images; }
    public void setImages(List<ProductImageDto> images) { this.images = images; }

    public List<ProductVariantDto> getVariants() { return variants; }
    public void setVariants(List<ProductVariantDto> variants) { this.variants = variants; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
