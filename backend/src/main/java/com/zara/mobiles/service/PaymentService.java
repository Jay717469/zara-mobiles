package com.zara.mobiles.service;

import com.zara.mobiles.dto.PaymentResponse;
import com.zara.mobiles.dto.RazorpayOrderResponse;
import com.zara.mobiles.dto.RazorpayVerifyRequest;

public interface PaymentService {
    RazorpayOrderResponse createRazorpayOrder(Long userId, Long orderId);
    PaymentResponse verifyRazorpayPayment(Long userId, RazorpayVerifyRequest request);
    PaymentResponse getPaymentForOrder(Long userId, Long orderId);
}
