package com.zara.mobiles.controller;

import com.zara.mobiles.dto.ApiResponse;
import com.zara.mobiles.dto.PaymentResponse;
import com.zara.mobiles.dto.RazorpayOrderRequest;
import com.zara.mobiles.dto.RazorpayOrderResponse;
import com.zara.mobiles.dto.RazorpayVerifyRequest;
import com.zara.mobiles.security.UserPrincipal;
import com.zara.mobiles.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@Tag(name = "Payments", description = "Razorpay test mode payments and verification")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    @Operation(summary = "Initialize Razorpay payment order")
    public ResponseEntity<ApiResponse<RazorpayOrderResponse>> createPaymentOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody RazorpayOrderRequest request
    ) {
        RazorpayOrderResponse response = paymentService.createRazorpayOrder(currentUser.getId(), request.getOrderId());
        return ResponseEntity.ok(ApiResponse.ok("Razorpay order created", response));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment signature and mark order paid")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody RazorpayVerifyRequest request
    ) {
        PaymentResponse response = paymentService.verifyRazorpayPayment(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Payment verified successfully", response));
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Get payment details for order")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentForOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long orderId
    ) {
        PaymentResponse response = paymentService.getPaymentForOrder(currentUser.getId(), orderId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
