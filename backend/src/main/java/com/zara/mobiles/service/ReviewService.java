package com.zara.mobiles.service;

import com.zara.mobiles.dto.ReviewCreateRequest;
import com.zara.mobiles.dto.ReviewDto;

import java.util.List;

public interface ReviewService {
    List<ReviewDto> getReviewsForProduct(Long productId);
    ReviewDto addReview(Long userId, Long productId, ReviewCreateRequest request);
}
