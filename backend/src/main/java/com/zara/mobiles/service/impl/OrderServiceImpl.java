package com.zara.mobiles.service.impl;

import com.zara.mobiles.dto.*;
import com.zara.mobiles.entity.*;
import com.zara.mobiles.exception.BadRequestException;
import com.zara.mobiles.exception.ResourceNotFoundException;
import com.zara.mobiles.repository.*;
import com.zara.mobiles.service.AddressService;
import com.zara.mobiles.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final AddressRepository addressRepository;
    private final AddressService addressService;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            ProductImageRepository productImageRepository,
            AddressRepository addressRepository,
            AddressService addressService,
            StoreRepository storeRepository,
            UserRepository userRepository,
            InventoryTransactionRepository inventoryTransactionRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productImageRepository = productImageRepository;
        this.addressRepository = addressRepository;
        this.addressService = addressService;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(Long userId, OrderCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));

        List<CartItem> cartItems = cartItemRepository.findByCartIdOrderByCreatedAtDesc(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty. Please add items before placing an order.");
        }

        // Validate fulfilment details
        Address deliveryAddress = null;
        Store pickupStore = null;

        if (request.getFulfilmentType() == Order.FulfilmentType.HOME_DELIVERY) {
            if (request.getDeliveryAddressId() != null) {
                deliveryAddress = addressRepository.findByIdAndUserId(request.getDeliveryAddressId(), userId)
                        .orElseThrow(() -> new BadRequestException("Selected delivery address does not exist or does not belong to you"));
            } else if (request.getNewDeliveryAddress() != null) {
                AddressDto createdAddrDto = addressService.createAddress(userId, request.getNewDeliveryAddress());
                deliveryAddress = addressRepository.findById(createdAddrDto.getId())
                        .orElseThrow(() -> new BadRequestException("Failed to save delivery address"));
            } else {
                throw new BadRequestException("Delivery address is required for Home Delivery orders");
            }
        } else if (request.getFulfilmentType() == Order.FulfilmentType.STORE_PICKUP) {
            if (request.getPickupStoreId() == null) {
                throw new BadRequestException("Store selection is required for Store Pickup orders");
            }
            pickupStore = storeRepository.findById(request.getPickupStoreId())
                    .orElseThrow(() -> new BadRequestException("Selected pickup store does not exist"));

            if (Boolean.FALSE.equals(pickupStore.getIsActive())) {
                throw new BadRequestException("The selected store is currently not accepting pickup orders");
            }
        }

        // Recalculate totals and check/reserve stock atomically
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItemsToSave = new ArrayList<>();

        for (CartItem ci : cartItems) {
            Product product = productRepository.findById(ci.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", ci.getProduct().getId()));

            if (!product.getIsActive()) {
                throw new BadRequestException("Product '" + product.getName() + "' is no longer active");
            }

            int availableStock = product.getStockQuantity();
            ProductVariant variant = ci.getVariant();
            if (variant != null) {
                availableStock = variant.getStockQuantity();
            }

            if (ci.getQuantity() > availableStock) {
                throw new BadRequestException("Insufficient stock for '" + product.getName() + "'. Available: " + availableStock + ", Requested: " + ci.getQuantity());
            }

            // Fresh unit price calculation
            BigDecimal unitPrice = product.getFinalPrice();
            if (variant != null && variant.getPriceAdjustment() != null) {
                unitPrice = unitPrice.add(variant.getPriceAdjustment());
            }

            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            // Reserve stock
            product.setStockQuantity(product.getStockQuantity() - ci.getQuantity());
            productRepository.save(product);

            if (variant != null) {
                variant.setStockQuantity(variant.getStockQuantity() - ci.getQuantity());
                productVariantRepository.save(variant);
            }

            // Record inventory reservation
            inventoryTransactionRepository.save(new InventoryTransaction(
                    product,
                    InventoryTransaction.TransactionType.ORDER_RESERVATION,
                    -ci.getQuantity(),
                    product.getStockQuantity(),
                    "Stock reserved for pending order",
                    "USER-" + userId
            ));

            // Snapshot data
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductNameSnapshot(product.getName());
            orderItem.setProductSkuSnapshot(product.getSku());
            orderItem.setPurchasePrice(unitPrice);
            orderItem.setQuantity(ci.getQuantity());
            orderItem.setTotalPrice(itemTotal);

            List<ProductImage> imgs = productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
            if (!imgs.isEmpty()) {
                orderItem.setProductImageSnapshot(imgs.get(0).getImageUrl());
            }

            if (variant != null) {
                orderItem.setVariantInfoSnapshot(
                        (variant.getColor() != null ? variant.getColor() + " " : "") +
                        (variant.getRam() != null ? variant.getRam() + " / " : "") +
                        (variant.getStorage() != null ? variant.getStorage() : "")
                );
            }

            orderItemsToSave.add(orderItem);
        }

        BigDecimal tax = subtotal.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal shippingFee = (request.getFulfilmentType() == Order.FulfilmentType.HOME_DELIVERY && subtotal.compareTo(new BigDecimal("1000")) < 0)
                ? new BigDecimal("100.00")
                : BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(tax).add(shippingFee);

        // Generate unique order number
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String orderNumber = "ZM-" + datePrefix + "-" + randomSuffix;

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setFulfilmentType(request.getFulfilmentType());
        order.setDeliveryAddress(deliveryAddress);
        order.setPickupStore(pickupStore);
        order.setPickupDateTime(request.getPickupDateTime());
        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setShippingFee(shippingFee);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setTotalAmount(totalAmount);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setCustomerNotes(request.getCustomerNotes());

        if (request.getPaymentMethod() == Order.PaymentMethod.COD) {
            order.setOrderStatus(Order.OrderStatus.CONFIRMED);
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
        } else {
            order.setOrderStatus(Order.OrderStatus.PLACED);
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
        }

        Order savedOrder = orderRepository.save(order);

        for (OrderItem oi : orderItemsToSave) {
            oi.setOrder(savedOrder);
            orderItemRepository.save(oi);
        }

        savedOrder.setItems(orderItemsToSave);

        // Clear user cart
        cartItemRepository.deleteByCartId(cart.getId());

        return mapToOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getUserOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<OrderResponse> content = orderPage.getContent().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            // Check if user is admin
            User user = userRepository.findById(userId).orElseThrow();
            if (user.getRole() != User.Role.ADMIN) {
                throw new BadRequestException("You do not have permission to view this order");
            }
        }

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            User user = userRepository.findById(userId).orElseThrow();
            if (user.getRole() != User.Role.ADMIN) {
                throw new BadRequestException("You do not have permission to cancel this order");
            }
        }

        if (order.getOrderStatus() == Order.OrderStatus.SHIPPED ||
            order.getOrderStatus() == Order.OrderStatus.OUT_FOR_DELIVERY ||
            order.getOrderStatus() == Order.OrderStatus.READY_FOR_PICKUP ||
            order.getOrderStatus() == Order.OrderStatus.COMPLETED) {
            throw new BadRequestException("Order cannot be cancelled at this stage (" + order.getOrderStatus() + ")");
        }

        if (order.getOrderStatus() == Order.OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        order.setOrderStatus(Order.OrderStatus.CANCELLED);
        if (order.getPaymentStatus() == Order.PaymentStatus.COMPLETED) {
            order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
        }

        // Release stock back to inventory
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        for (OrderItem oi : items) {
            Product p = oi.getProduct();
            p.setStockQuantity(p.getStockQuantity() + oi.getQuantity());
            productRepository.save(p);

            inventoryTransactionRepository.save(new InventoryTransaction(
                    p,
                    InventoryTransaction.TransactionType.ORDER_CANCELLATION,
                    oi.getQuantity(),
                    p.getStockQuantity(),
                    "Stock restored after order cancellation: " + order.getOrderNumber(),
                    order.getOrderNumber()
            ));
        }

        Order saved = orderRepository.save(order);
        return mapToOrderResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getAllOrders(Order.OrderStatus status, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.searchOrders(status, keyword, pageable);

        List<OrderResponse> content = orderPage.getContent().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        Order.OrderStatus current = order.getOrderStatus();
        Order.OrderStatus target = request.getStatus();

        // Validate state transitions
        if (current == Order.OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot update status of a cancelled order");
        }
        if (current == Order.OrderStatus.COMPLETED && target != Order.OrderStatus.COMPLETED) {
            throw new BadRequestException("Cannot change status of a completed order");
        }

        if (target == Order.OrderStatus.CANCELLED) {
            return cancelOrder(order.getUser().getId(), orderId);
        }

        order.setOrderStatus(target);
        Order saved = orderRepository.save(order);
        return mapToOrderResponse(saved);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCustomerId(order.getUser().getId());
        dto.setCustomerName(order.getUser().getFullName());
        dto.setCustomerEmail(order.getUser().getEmail());
        dto.setCustomerPhone(order.getUser().getMobileNumber());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setFulfilmentType(order.getFulfilmentType());
        dto.setPickupDateTime(order.getPickupDateTime());
        dto.setSubtotal(order.getSubtotal());
        dto.setTax(order.getTax());
        dto.setShippingFee(order.getShippingFee());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setCustomerNotes(order.getCustomerNotes());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getDeliveryAddress() != null) {
            Address addr = order.getDeliveryAddress();
            AddressDto adto = new AddressDto();
            adto.setId(addr.getId());
            adto.setFullName(addr.getFullName());
            adto.setMobileNumber(addr.getMobileNumber());
            adto.setStreet(addr.getStreet());
            adto.setCity(addr.getCity());
            adto.setState(addr.getState());
            adto.setPinCode(addr.getPinCode());
            adto.setDeliveryInstructions(addr.getDeliveryInstructions());
            dto.setDeliveryAddress(adto);
        }

        if (order.getPickupStore() != null) {
            Store store = order.getPickupStore();
            StoreDto sdto = new StoreDto();
            sdto.setId(store.getId());
            sdto.setName(store.getName());
            sdto.setAddress(store.getAddress());
            sdto.setCity(store.getCity());
            sdto.setState(store.getState());
            sdto.setPinCode(store.getPinCode());
            sdto.setPhone(store.getPhone());
            sdto.setOpeningHours(store.getOpeningHours());
            dto.setPickupStore(sdto);
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        dto.setItems(items.stream().map(oi -> {
            OrderItemResponse oir = new OrderItemResponse();
            oir.setId(oi.getId());
            oir.setProductId(oi.getProduct().getId());
            oir.setProductName(oi.getProductNameSnapshot());
            oir.setProductSku(oi.getProductSkuSnapshot());
            oir.setProductImage(oi.getProductImageSnapshot());
            oir.setVariantInfo(oi.getVariantInfoSnapshot());
            oir.setPurchasePrice(oi.getPurchasePrice());
            oir.setQuantity(oi.getQuantity());
            oir.setTotalPrice(oi.getTotalPrice());
            return oir;
        }).collect(Collectors.toList()));

        return dto;
    }
}
