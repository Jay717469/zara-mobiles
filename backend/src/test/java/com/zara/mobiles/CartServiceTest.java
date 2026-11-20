package com.zara.mobiles;

import com.zara.mobiles.dto.AddToCartRequest;
import com.zara.mobiles.dto.CartResponse;
import com.zara.mobiles.entity.Cart;
import com.zara.mobiles.entity.Category;
import com.zara.mobiles.entity.Product;
import com.zara.mobiles.entity.User;
import com.zara.mobiles.exception.BadRequestException;
import com.zara.mobiles.repository.*;
import com.zara.mobiles.service.impl.CartServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    private User sampleUser;
    private Cart sampleCart;
    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Bob", "bob@example.com", "pass", "+919999999999", User.Role.CUSTOMER);
        sampleUser.setId(5L);

        sampleCart = new Cart(sampleUser);
        sampleCart.setId(1L);

        Category category = new Category("Phones", "phones", "desc", "img");
        category.setId(1L);

        sampleProduct = new Product();
        sampleProduct.setId(100L);
        sampleProduct.setName("Flagship Phone");
        sampleProduct.setBrand("BrandX");
        sampleProduct.setModel("X1");
        sampleProduct.setSku("BX-X1");
        sampleProduct.setPrice(new BigDecimal("50000.00"));
        sampleProduct.setFinalPrice(new BigDecimal("50000.00"));
        sampleProduct.setStockQuantity(5);
        sampleProduct.setIsActive(true);
        sampleProduct.setCategory(category);
    }

    @Test
    void addItemToCart_Success() {
        AddToCartRequest req = new AddToCartRequest();
        req.setProductId(100L);
        req.setQuantity(2);

        when(cartRepository.findByUserId(5L)).thenReturn(Optional.of(sampleCart));
        when(productRepository.findById(100L)).thenReturn(Optional.of(sampleProduct));
        when(cartItemRepository.findByCartIdAndProductIdAndVariantIsNull(1L, 100L)).thenReturn(Optional.empty());
        when(cartItemRepository.findByCartIdOrderByCreatedAtDesc(1L)).thenReturn(Collections.emptyList());

        CartResponse res = cartService.addItemToCart(5L, req);

        assertNotNull(res);
        verify(cartItemRepository, times(1)).save(any());
    }

    @Test
    void addItemToCart_ExceedsStock_ThrowsBadRequest() {
        AddToCartRequest req = new AddToCartRequest();
        req.setProductId(100L);
        req.setQuantity(10); // Exceeds available 5

        when(cartRepository.findByUserId(5L)).thenReturn(Optional.of(sampleCart));
        when(productRepository.findById(100L)).thenReturn(Optional.of(sampleProduct));

        assertThrows(BadRequestException.class, () -> cartService.addItemToCart(5L, req));
    }
}
