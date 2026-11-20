package com.zara.mobiles.service;

import com.zara.mobiles.dto.OrderCreateRequest;
import com.zara.mobiles.dto.OrderResponse;
import com.zara.mobiles.dto.OrderStatusUpdateRequest;
import com.zara.mobiles.dto.PagedResponse;
import com.zara.mobiles.entity.Order;

public interface OrderService {
    OrderResponse createOrder(Long userId, OrderCreateRequest request);
    PagedResponse<OrderResponse> getUserOrders(Long userId, int page, int size);
    OrderResponse getOrderById(Long userId, Long orderId);
    OrderResponse cancelOrder(Long userId, Long orderId);

    // Admin endpoints
    PagedResponse<OrderResponse> getAllOrders(Order.OrderStatus status, String keyword, int page, int size);
    OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request);
}
