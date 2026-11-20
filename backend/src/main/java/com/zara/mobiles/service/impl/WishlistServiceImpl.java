package com.zara.mobiles.service.impl;

import com.zara.mobiles.dto.AddToCartRequest;
import com.zara.mobiles.dto.WishlistItemResponse;
import com.zara.mobiles.dto.WishlistResponse;
import com.zara.mobiles.entity.Product;
import com.zara.mobiles.entity.ProductImage;
import com.zara.mobiles.entity.User;
import com.zara.mobiles.entity.Wishlist;
import com.zara.mobiles.entity.WishlistItem;
import com.zara.mobiles.exception.ResourceNotFoundException;
import com.zara.mobiles.repository.ProductImageRepository;
import com.zara.mobiles.repository.ProductRepository;
import com.zara.mobiles.repository.UserRepository;
import com.zara.mobiles.repository.WishlistItemRepository;
import com.zara.mobiles.repository.WishlistRepository;
import com.zara.mobiles.service.CartService;
import com.zara.mobiles.service.WishlistService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    public WishlistServiceImpl(
            WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository,
            ProductRepository productRepository,
            ProductImageRepository productImageRepository,
            UserRepository userRepository,
            CartService cartService) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
    }

    private Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            return wishlistRepository.save(new Wishlist(user));
        });
    }

    @Override
    @Transactional(readOnly = true)
    public WishlistResponse getWishlist(Long userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        return buildWishlistResponse(wishlist);
    }

    @Override
    @Transactional
    public WishlistResponse addToWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId).isEmpty()) {
            wishlistItemRepository.save(new WishlistItem(wishlist, product));
        }

        return buildWishlistResponse(wishlist);
    }

    @Override
    @Transactional
    public WishlistResponse removeFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);
        return buildWishlistResponse(wishlist);
    }

    @Override
    @Transactional
    public void moveToCart(Long userId, Long productId) {
        AddToCartRequest req = new AddToCartRequest();
        req.setProductId(productId);
        req.setQuantity(1);
        cartService.addItemToCart(userId, req);
        removeFromWishlist(userId, productId);
    }

    private WishlistResponse buildWishlistResponse(Wishlist wishlist) {
        List<WishlistItem> items = wishlistItemRepository.findByWishlistIdOrderByCreatedAtDesc(wishlist.getId());
        WishlistResponse response = new WishlistResponse();
        response.setId(wishlist.getId());

        List<WishlistItemResponse> dtoList = new ArrayList<>();
        for (WishlistItem item : items) {
            Product p = item.getProduct();
            WishlistItemResponse dto = new WishlistItemResponse();
            dto.setId(item.getId());
            dto.setProductId(p.getId());
            dto.setProductName(p.getName());
            dto.setProductBrand(p.getBrand());
            dto.setPrice(p.getPrice());
            dto.setDiscountPercentage(p.getDiscountPercentage());
            dto.setFinalPrice(p.getFinalPrice());
            dto.setInStock(p.getStockQuantity() > 0 && p.getIsActive());
            dto.setAddedAt(item.getCreatedAt());

            List<ProductImage> imgs = productImageRepository.findByProductIdOrderByDisplayOrderAsc(p.getId());
            if (!imgs.isEmpty()) {
                dto.setPrimaryImageUrl(imgs.get(0).getImageUrl());
            }

            dtoList.add(dto);
        }

        response.setItems(dtoList);
        return response;
    }
}
