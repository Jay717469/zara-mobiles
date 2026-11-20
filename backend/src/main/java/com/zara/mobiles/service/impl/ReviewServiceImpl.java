package com.zara.mobiles.service.impl;

import com.zara.mobiles.dto.ReviewCreateRequest;
import com.zara.mobiles.dto.ReviewDto;
import com.zara.mobiles.entity.Product;
import com.zara.mobiles.entity.Review;
import com.zara.mobiles.entity.User;
import com.zara.mobiles.exception.BadRequestException;
import com.zara.mobiles.exception.ResourceNotFoundException;
import com.zara.mobiles.repository.ProductRepository;
import com.zara.mobiles.repository.ReviewRepository;
import com.zara.mobiles.repository.UserRepository;
import com.zara.mobiles.service.ReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(r -> new ReviewDto(
                        r.getId(),
                        r.getProduct().getId(),
                        r.getUser().getFullName(),
                        r.getRating(),
                        r.getHeadline(),
                        r.getComment(),
                        r.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewDto addReview(Long userId, Long productId, ReviewCreateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setHeadline(request.getHeadline());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);

        // Recalculate product rating & review count
        List<Review> allReviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        int totalReviews = allReviews.size();
        double sumRating = allReviews.stream().mapToInt(Review::getRating).sum();
        BigDecimal avgRating = BigDecimal.valueOf(sumRating / totalReviews).setScale(2, RoundingMode.HALF_UP);

        product.setRating(avgRating);
        product.setReviewCount(totalReviews);
        productRepository.save(product);

        return new ReviewDto(
                saved.getId(),
                product.getId(),
                user.getFullName(),
                saved.getRating(),
                saved.getHeadline(),
                saved.getComment(),
                saved.getCreatedAt()
        );
    }
}
