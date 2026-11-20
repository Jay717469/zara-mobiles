package com.zara.mobiles.controller;

import com.zara.mobiles.dto.*;
import com.zara.mobiles.entity.Order;
import com.zara.mobiles.entity.User;
import com.zara.mobiles.service.AdminService;
import com.zara.mobiles.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin dashboard, order management, customer status, and inventory adjustments")
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    public AdminController(AdminService adminService, OrderService orderService) {
        this.adminService = adminService;
        this.orderService = orderService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard overview metrics and statistics")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        AdminDashboardResponse response = adminService.getDashboardOverview();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get all orders with filtering and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getOrders(
            @RequestParam(required = false) Order.OrderStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PagedResponse<OrderResponse> response = orderService.getAllOrders(status, keyword, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated", response));
    }

    @GetMapping("/customers")
    @Operation(summary = "Get list of all customers")
    public ResponseEntity<ApiResponse<List<CustomerSummaryDto>>> getCustomers() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllCustomers()));
    }

    @PutMapping("/customers/{id}/status")
    @Operation(summary = "Activate or deactivate customer account")
    public ResponseEntity<ApiResponse<Void>> updateCustomerStatus(
            @PathVariable Long id,
            @RequestParam User.Status status
    ) {
        adminService.updateCustomerStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Customer status updated to " + status));
    }

    @GetMapping("/inventory")
    @Operation(summary = "Get inventory stock status and alerts")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getInventory() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getInventoryOverview()));
    }

    @PutMapping("/inventory/{productId}")
    @Operation(summary = "Adjust inventory stock for product")
    public ResponseEntity<ApiResponse<ProductResponse>> adjustStock(
            @PathVariable Long productId,
            @Valid @RequestBody StockAdjustmentRequest request
    ) {
        ProductResponse response = adminService.adjustStock(productId, request);
        return ResponseEntity.ok(ApiResponse.ok("Stock adjusted successfully", response));
    }

    @GetMapping("/inventory/transactions")
    @Operation(summary = "Get inventory transaction history log")
    public ResponseEntity<ApiResponse<PagedResponse<InventoryTransactionDto>>> getInventoryTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getInventoryTransactions(page, size)));
    }
}
