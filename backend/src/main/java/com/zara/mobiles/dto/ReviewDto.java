package com.zara.mobiles.dto;

import java.time.LocalDateTime;

public class ReviewDto {
    private Long id;
    private Long productId;
    private String userFullName;
    private Integer rating;
    private String headline;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDto() {}

    public ReviewDto(Long id, Long productId, String userFullName, Integer rating, String headline, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.userFullName = userFullName;
        this.rating = rating;
        this.headline = headline;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
