package com.zara.mobiles.controller;

import com.zara.mobiles.dto.ApiResponse;
import com.zara.mobiles.dto.WishlistResponse;
import com.zara.mobiles.security.UserPrincipal;
import com.zara.mobiles.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
@Tag(name = "Wishlist", description = "Customer wishlist operations")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    @Operation(summary = "Get current customer's wishlist")
    public ResponseEntity<ApiResponse<WishlistResponse>> getWishlist(@AuthenticationPrincipal UserPrincipal currentUser) {
        WishlistResponse response = wishlistService.getWishlist(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/items/{productId}")
    @Operation(summary = "Add product to wishlist")
    public ResponseEntity<ApiResponse<WishlistResponse>> addToWishlist(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long productId
    ) {
        WishlistResponse response = wishlistService.addToWishlist(currentUser.getId(), productId);
        return ResponseEntity.ok(ApiResponse.ok("Added to wishlist", response));
    }

    @DeleteMapping("/items/{productId}")
    @Operation(summary = "Remove product from wishlist")
    public ResponseEntity<ApiResponse<WishlistResponse>> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long productId
    ) {
        WishlistResponse response = wishlistService.removeFromWishlist(currentUser.getId(), productId);
        return ResponseEntity.ok(ApiResponse.ok("Removed from wishlist", response));
    }

    @PostMapping("/items/{productId}/move-to-cart")
    @Operation(summary = "Move product from wishlist to cart")
    public ResponseEntity<ApiResponse<Void>> moveToCart(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long productId
    ) {
        wishlistService.moveToCart(currentUser.getId(), productId);
        return ResponseEntity.ok(ApiResponse.ok("Moved to cart"));
    }
}
