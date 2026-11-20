package com.zara.mobiles.controller;

import com.zara.mobiles.dto.ApiResponse;
import com.zara.mobiles.dto.ReviewCreateRequest;
import com.zara.mobiles.dto.ReviewDto;
import com.zara.mobiles.security.UserPrincipal;
import com.zara.mobiles.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@Tag(name = "Reviews", description = "Customer reviews and ratings")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get reviews for product")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getReviewsForProduct(@PathVariable Long productId) {
        List<ReviewDto> reviews = reviewService.getReviewsForProduct(productId);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }

    @PostMapping("/product/{productId}")
    @Operation(summary = "Add review for product (Authenticated)")
    public ResponseEntity<ApiResponse<ReviewDto>> addReview(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ReviewCreateRequest request
    ) {
        ReviewDto review = reviewService.addReview(currentUser.getId(), productId, request);
        return new ResponseEntity<>(ApiResponse.ok("Review submitted successfully", review), HttpStatus.CREATED);
    }
}
