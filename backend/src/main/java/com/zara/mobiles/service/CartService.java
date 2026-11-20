package com.zara.mobiles.service;

import com.zara.mobiles.dto.AddToCartRequest;
import com.zara.mobiles.dto.CartResponse;

public interface CartService {
    CartResponse getCart(Long userId);
    CartResponse addItemToCart(Long userId, AddToCartRequest request);
    CartResponse updateCartItemQuantity(Long userId, Long itemId, int quantity);
    CartResponse removeItemFromCart(Long userId, Long itemId);
    void clearCart(Long userId);
}
