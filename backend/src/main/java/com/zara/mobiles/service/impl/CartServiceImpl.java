package com.zara.mobiles.service.impl;

import com.zara.mobiles.dto.AddToCartRequest;
import com.zara.mobiles.dto.CartItemResponse;
import com.zara.mobiles.dto.CartResponse;
import com.zara.mobiles.entity.*;
import com.zara.mobiles.exception.BadRequestException;
import com.zara.mobiles.exception.ResourceNotFoundException;
import com.zara.mobiles.repository.*;
import com.zara.mobiles.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            ProductImageRepository productImageRepository,
            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productImageRepository = productImageRepository;
        this.userRepository = userRepository;
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            Cart newCart = new Cart(user);
            return cartRepository.save(newCart);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return buildCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItemToCart(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (!product.getIsActive()) {
            throw new BadRequestException("This product is currently inactive and cannot be added to cart");
        }

        ProductVariant variant = null;
        BigDecimal unitPrice = product.getFinalPrice();
        int availableStock = product.getStockQuantity();

        if (request.getVariantId() != null) {
            variant = productVariantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant", "id", request.getVariantId()));
            if (variant.getPriceAdjustment() != null) {
                unitPrice = unitPrice.add(variant.getPriceAdjustment());
            }
            availableStock = variant.getStockQuantity();
        }

        Optional<CartItem> existingItem = variant != null
                ? cartItemRepository.findByCartIdAndProductIdAndVariantId(cart.getId(), product.getId(), variant.getId())
                : cartItemRepository.findByCartIdAndProductIdAndVariantIsNull(cart.getId(), product.getId());

        int newQuantity = request.getQuantity();
        if (existingItem.isPresent()) {
            newQuantity += existingItem.get().getQuantity();
        }

        if (newQuantity > availableStock) {
            throw new BadRequestException("Requested quantity (" + newQuantity + ") exceeds available stock (" + availableStock + ")");
        }

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(newQuantity);
            item.setUnitPrice(unitPrice);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem(cart, product, variant, request.getQuantity(), unitPrice);
            cartItemRepository.save(item);
        }

        return buildCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItemQuantity(Long userId, Long itemId, int quantity) {
        if (quantity <= 0) {
            return removeItemFromCart(userId, itemId);
        }

        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to your cart");
        }

        int availableStock = item.getVariant() != null
                ? item.getVariant().getStockQuantity()
                : item.getProduct().getStockQuantity();

        if (quantity > availableStock) {
            throw new BadRequestException("Requested quantity (" + quantity + ") exceeds available stock (" + availableStock + ")");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return buildCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItemFromCart(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to your cart");
        }

        cartItemRepository.delete(item);
        return buildCartResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
    }

    private CartResponse buildCartResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartIdOrderByCreatedAtDesc(cart.getId());
        CartResponse response = new CartResponse();
        response.setId(cart.getId());

        List<CartItemResponse> itemResponses = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : items) {
            CartItemResponse ir = new CartItemResponse();
            ir.setId(item.getId());
            ir.setProductId(item.getProduct().getId());
            ir.setProductName(item.getProduct().getName());
            ir.setProductBrand(item.getProduct().getBrand());
            ir.setProductModel(item.getProduct().getModel());
            ir.setProductSku(item.getProduct().getSku());

            // Always take freshest price from product
            BigDecimal currentPrice = item.getProduct().getFinalPrice();
            if (item.getVariant() != null && item.getVariant().getPriceAdjustment() != null) {
                currentPrice = currentPrice.add(item.getVariant().getPriceAdjustment());
            }
            ir.setUnitPrice(currentPrice);
            ir.setQuantity(item.getQuantity());

            BigDecimal itemSubtotal = currentPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            ir.setSubtotal(itemSubtotal);
            subtotal = subtotal.add(itemSubtotal);
            totalItems += item.getQuantity();

            int stock = item.getVariant() != null ? item.getVariant().getStockQuantity() : item.getProduct().getStockQuantity();
            ir.setStockAvailable(stock);

            if (item.getVariant() != null) {
                ir.setVariantId(item.getVariant().getId());
                ir.setVariantDescription(
                        (item.getVariant().getColor() != null ? item.getVariant().getColor() + " " : "") +
                        (item.getVariant().getRam() != null ? item.getVariant().getRam() + " / " : "") +
                        (item.getVariant().getStorage() != null ? item.getVariant().getStorage() : "")
                );
            }

            List<ProductImage> imgs = productImageRepository.findByProductIdOrderByDisplayOrderAsc(item.getProduct().getId());
            if (!imgs.isEmpty()) {
                ir.setPrimaryImageUrl(imgs.get(0).getImageUrl());
            }

            itemResponses.add(ir);
        }

        response.setItems(itemResponses);
        response.setTotalItems(totalItems);
        response.setSubtotal(subtotal);

        // 18% GST standard or calculated tax, shipping free over ₹1000
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal shippingFee = (subtotal.compareTo(BigDecimal.ZERO) > 0 && subtotal.compareTo(new BigDecimal("1000")) < 0)
                ? new BigDecimal("100.00")
                : BigDecimal.ZERO;

        BigDecimal total = subtotal.add(tax).add(shippingFee);

        response.setTax(tax);
        response.setShippingFee(shippingFee);
        response.setTotal(total);

        return response;
    }
}
