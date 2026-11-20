package com.zara.mobiles.service;

import com.zara.mobiles.dto.WishlistResponse;

public interface WishlistService {
    WishlistResponse getWishlist(Long userId);
    WishlistResponse addToWishlist(Long userId, Long productId);
    WishlistResponse removeFromWishlist(Long userId, Long productId);
    void moveToCart(Long userId, Long productId);
}
