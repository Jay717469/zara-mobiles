package com.zara.mobiles.service;

import com.zara.mobiles.dto.*;
import com.zara.mobiles.entity.User;

import java.util.List;

public interface AdminService {
    AdminDashboardResponse getDashboardOverview();
    List<CustomerSummaryDto> getAllCustomers();
    void updateCustomerStatus(Long customerId, User.Status status);
    List<ProductResponse> getInventoryOverview();
    ProductResponse adjustStock(Long productId, StockAdjustmentRequest request);
    PagedResponse<InventoryTransactionDto> getInventoryTransactions(int page, int size);
}
