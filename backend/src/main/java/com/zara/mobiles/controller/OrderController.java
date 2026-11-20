package com.zara.mobiles.controller;

import com.zara.mobiles.dto.ApiResponse;
import com.zara.mobiles.dto.OrderCreateRequest;
import com.zara.mobiles.dto.OrderResponse;
import com.zara.mobiles.dto.PagedResponse;
import com.zara.mobiles.security.UserPrincipal;
import com.zara.mobiles.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@Tag(name = "Orders", description = "Customer order checkout and order history")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Place order (Home Delivery or Store Pickup, COD or Razorpay)")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody OrderCreateRequest request
    ) {
        OrderResponse response = orderService.createOrder(currentUser.getId(), request);
        return new ResponseEntity<>(ApiResponse.ok("Order placed successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get current customer's order history")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<OrderResponse> response = orderService.getUserOrders(currentUser.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        OrderResponse response = orderService.getOrderById(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel order if allowed by order status")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        OrderResponse response = orderService.cancelOrder(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled successfully", response));
    }
}
