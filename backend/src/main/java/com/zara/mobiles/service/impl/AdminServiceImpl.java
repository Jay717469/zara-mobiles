package com.zara.mobiles.service.impl;

import com.zara.mobiles.dto.*;
import com.zara.mobiles.entity.*;
import com.zara.mobiles.exception.BadRequestException;
import com.zara.mobiles.exception.ResourceNotFoundException;
import com.zara.mobiles.repository.*;
import com.zara.mobiles.service.AdminService;
import com.zara.mobiles.service.OrderService;
import com.zara.mobiles.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final ProductService productService;
    private final OrderService orderService;

    public AdminServiceImpl(
            ProductRepository productRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            InventoryTransactionRepository inventoryTransactionRepository,
            ProductService productService,
            OrderService orderService) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
        this.productService = productService;
        this.orderService = orderService;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardOverview() {
        AdminDashboardResponse response = new AdminDashboardResponse();

        BigDecimal sales = orderRepository.sumTotalSales();
        response.setTotalSales(sales != null ? sales : BigDecimal.ZERO);
        response.setTotalOrders(orderRepository.count());
        response.setTotalCustomers(userRepository.countByRole(User.Role.CUSTOMER));
        response.setTotalProducts(productRepository.count());

        // Low stock threshold < 10
        response.setLowStockCount(productRepository.countByStockQuantityLessThanAndIsActiveTrue(10));
        response.setOutOfStockCount(productRepository.countByStockQuantityEqualsAndIsActiveTrue(0));
        response.setPendingOrdersCount(orderRepository.countByOrderStatus(Order.OrderStatus.PLACED) +
                orderRepository.countByOrderStatus(Order.OrderStatus.CONFIRMED));

        // Recent 5 orders
        PagedResponse<OrderResponse> recentOrdersPage = orderService.getAllOrders(null, null, 0, 5);
        response.setRecentOrders(recentOrdersPage.getContent());

        // Low stock products list
        List<Product> lowStock = productRepository.findByStockQuantityLessThanOrderByStockQuantityAsc(10);
        response.setLowStockProducts(lowStock.stream()
                .map(p -> productService.getProductById(p.getId()))
                .collect(Collectors.toList()));

        // Orders by status
        Map<String, Long> statusMap = new HashMap<>();
        for (Order.OrderStatus status : Order.OrderStatus.values()) {
            statusMap.put(status.name(), orderRepository.countByOrderStatus(status));
        }
        response.setOrdersByStatus(statusMap);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerSummaryDto> getAllCustomers() {
        List<User> customers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.CUSTOMER)
                .collect(Collectors.toList());

        return customers.stream().map(c -> {
            long orders = orderRepository.findByUserIdOrderByCreatedAtDesc(c.getId(), PageRequest.of(0, 1)).getTotalElements();
            return new CustomerSummaryDto(
                    c.getId(),
                    c.getFullName(),
                    c.getEmail(),
                    c.getMobileNumber(),
                    c.getStatus().name(),
                    orders,
                    c.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateCustomerStatus(Long customerId, User.Status status) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));

        if (user.getRole() == User.Role.ADMIN) {
            throw new BadRequestException("Cannot modify status of an administrator");
        }

        user.setStatus(status);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getInventoryOverview() {
        return productRepository.findAll().stream()
                .map(p -> productService.getProductById(p.getId()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponse adjustStock(Long productId, StockAdjustmentRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        int newStock = product.getStockQuantity() + request.getQuantityChange();
        if (newStock < 0) {
            throw new BadRequestException("Adjustment would cause negative stock (" + newStock + ")");
        }

        product.setStockQuantity(newStock);
        productRepository.save(product);

        inventoryTransactionRepository.save(new InventoryTransaction(
                product,
                request.getTransactionType(),
                request.getQuantityChange(),
                newStock,
                request.getReason(),
                request.getReferenceId() != null ? request.getReferenceId() : "ADMIN-ADJUST"
        ));

        return productService.getProductById(productId);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<InventoryTransactionDto> getInventoryTransactions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<InventoryTransaction> txPage = inventoryTransactionRepository.findAllByOrderByCreatedAtDesc(pageable);

        List<InventoryTransactionDto> content = txPage.getContent().stream().map(tx -> {
            InventoryTransactionDto dto = new InventoryTransactionDto();
            dto.setId(tx.getId());
            dto.setProductId(tx.getProduct().getId());
            dto.setProductName(tx.getProduct().getName());
            dto.setProductSku(tx.getProduct().getSku());
            dto.setTransactionType(tx.getTransactionType());
            dto.setQuantityChange(tx.getQuantityChange());
            dto.setQuantityAfter(tx.getQuantityAfter());
            dto.setReason(tx.getReason());
            dto.setReferenceId(tx.getReferenceId());
            dto.setCreatedAt(tx.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                txPage.getNumber(),
                txPage.getSize(),
                txPage.getTotalElements(),
                txPage.getTotalPages(),
                txPage.isLast()
        );
    }
}
