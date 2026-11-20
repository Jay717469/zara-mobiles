package com.zara.mobiles.controller;

import com.zara.mobiles.dto.AddToCartRequest;
import com.zara.mobiles.dto.ApiResponse;
import com.zara.mobiles.dto.CartResponse;
import com.zara.mobiles.dto.UpdateCartItemRequest;
import com.zara.mobiles.security.UserPrincipal;
import com.zara.mobiles.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@Tag(name = "Cart", description = "Shopping cart operations")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get current customer's shopping cart")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal UserPrincipal currentUser) {
        CartResponse cart = cartService.getCart(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    @PostMapping("/items")
    @Operation(summary = "Add product item to cart")
    public ResponseEntity<ApiResponse<CartResponse>> addItemToCart(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody AddToCartRequest request
    ) {
        CartResponse cart = cartService.addItemToCart(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", cart));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<ApiResponse<CartResponse>> updateItemQuantity(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        CartResponse cart = cartService.updateCartItemQuantity(currentUser.getId(), itemId, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.ok("Cart updated", cart));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long itemId
    ) {
        CartResponse cart = cartService.removeItemFromCart(currentUser.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", cart));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear all items from cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserPrincipal currentUser) {
        cartService.clearCart(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared"));
    }
}
