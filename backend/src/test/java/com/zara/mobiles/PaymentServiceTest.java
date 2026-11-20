package com.zara.mobiles;

import com.zara.mobiles.dto.PaymentResponse;
import com.zara.mobiles.dto.RazorpayOrderResponse;
import com.zara.mobiles.dto.RazorpayVerifyRequest;
import com.zara.mobiles.entity.Order;
import com.zara.mobiles.entity.Payment;
import com.zara.mobiles.entity.User;
import com.zara.mobiles.repository.OrderRepository;
import com.zara.mobiles.repository.PaymentRepository;
import com.zara.mobiles.repository.UserRepository;
import com.zara.mobiles.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private User sampleUser;
    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(paymentService, "razorpayKeyId", "rzp_test_zara");
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", "rzp_secret_zara");
        ReflectionTestUtils.setField(paymentService, "currency", "INR");

        sampleUser = new User("David", "david@example.com", "pass", "+919999999999", User.Role.CUSTOMER);
        sampleUser.setId(30L);

        sampleOrder = new Order();
        sampleOrder.setId(500L);
        sampleOrder.setOrderNumber("ZM-2026-TEST");
        sampleOrder.setUser(sampleUser);
        sampleOrder.setTotalAmount(new BigDecimal("99999.00"));
        sampleOrder.setOrderStatus(Order.OrderStatus.PLACED);
        sampleOrder.setPaymentStatus(Order.PaymentStatus.PENDING);
        sampleOrder.setPaymentMethod(Order.PaymentMethod.RAZORPAY);
    }

    @Test
    void createRazorpayOrder_Success() {
        when(orderRepository.findById(500L)).thenReturn(Optional.of(sampleOrder));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(i -> i.getArgument(0));

        RazorpayOrderResponse res = paymentService.createRazorpayOrder(30L, 500L);

        assertNotNull(res);
        assertEquals(500L, res.getOrderId());
        assertEquals("ZM-2026-TEST", res.getOrderNumber());
        assertEquals(new BigDecimal("99999.00"), res.getAmount());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void verifyRazorpayPayment_WithTestSignature_MarksOrderCompleted() {
        RazorpayVerifyRequest req = new RazorpayVerifyRequest();
        req.setOrderId(500L);
        req.setRazorpayOrderId("order_test_123456");
        req.setRazorpayPaymentId("pay_test_789012");
        req.setRazorpaySignature("test_sig_abcxyz");

        when(orderRepository.findById(500L)).thenReturn(Optional.of(sampleOrder));
        when(paymentRepository.findByRazorpayPaymentId("pay_test_789012")).thenReturn(Optional.empty());

        Payment existingPayment = new Payment();
        existingPayment.setOrder(sampleOrder);
        when(paymentRepository.findByRazorpayOrderId("order_test_123456")).thenReturn(Optional.of(existingPayment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(i -> {
            Payment p = i.getArgument(0);
            p.setId(88L);
            return p;
        });

        PaymentResponse res = paymentService.verifyRazorpayPayment(30L, req);

        assertNotNull(res);
        assertEquals(Payment.Status.SUCCESS, res.getStatus());
        assertEquals(Order.OrderStatus.CONFIRMED, sampleOrder.getOrderStatus());
        assertEquals(Order.PaymentStatus.COMPLETED, sampleOrder.getPaymentStatus());
        verify(orderRepository, times(1)).save(sampleOrder);
    }

    @Test
    void verifyRazorpayPayment_DuplicateCallback_Idempotent() {
        RazorpayVerifyRequest req = new RazorpayVerifyRequest();
        req.setOrderId(500L);
        req.setRazorpayOrderId("order_test_123456");
        req.setRazorpayPaymentId("pay_test_already_processed");
        req.setRazorpaySignature("test_sig_abcxyz");

        when(orderRepository.findById(500L)).thenReturn(Optional.of(sampleOrder));

        Payment alreadySuccess = new Payment();
        alreadySuccess.setId(99L);
        alreadySuccess.setOrder(sampleOrder);
        alreadySuccess.setStatus(Payment.Status.SUCCESS);
        alreadySuccess.setRazorpayPaymentId("pay_test_already_processed");

        when(paymentRepository.findByRazorpayPaymentId("pay_test_already_processed")).thenReturn(Optional.of(alreadySuccess));

        PaymentResponse res = paymentService.verifyRazorpayPayment(30L, req);

        assertNotNull(res);
        assertEquals(99L, res.getId());
        assertEquals(Payment.Status.SUCCESS, res.getStatus());
        verify(orderRepository, never()).save(any());
    }
}
