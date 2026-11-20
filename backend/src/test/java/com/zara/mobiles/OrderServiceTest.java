package com.zara.mobiles;

import com.zara.mobiles.dto.AddressDto;
import com.zara.mobiles.dto.OrderCreateRequest;
import com.zara.mobiles.dto.OrderResponse;
import com.zara.mobiles.entity.*;
import com.zara.mobiles.repository.*;
import com.zara.mobiles.service.AddressService;
import com.zara.mobiles.service.impl.OrderServiceImpl;
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
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

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
    private AddressRepository addressRepository;

    @Mock
    private AddressService addressService;

    @Mock
    private StoreRepository storeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InventoryTransactionRepository inventoryTransactionRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User sampleUser;
    private Cart sampleCart;
    private Product sampleProduct;
    private CartItem sampleCartItem;
    private Address sampleAddress;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Charlie", "charlie@example.com", "pass", "+919999999999", User.Role.CUSTOMER);
        sampleUser.setId(7L);

        sampleCart = new Cart(sampleUser);
        sampleCart.setId(2L);

        sampleProduct = new Product();
        sampleProduct.setId(10L);
        sampleProduct.setName("Phone A");
        sampleProduct.setBrand("BrandA");
        sampleProduct.setSku("SKU-A");
        sampleProduct.setPrice(new BigDecimal("20000.00"));
        sampleProduct.setFinalPrice(new BigDecimal("20000.00"));
        sampleProduct.setStockQuantity(10);
        sampleProduct.setIsActive(true);

        sampleCartItem = new CartItem(sampleCart, sampleProduct, null, 2, new BigDecimal("20000.00"));
        sampleCartItem.setId(20L);

        sampleAddress = new Address();
        sampleAddress.setId(50L);
        sampleAddress.setUser(sampleUser);
        sampleAddress.setFullName("Charlie");
        sampleAddress.setMobileNumber("+919999999999");
        sampleAddress.setStreet("123 Street");
        sampleAddress.setCity("Mumbai");
        sampleAddress.setState("Maharashtra");
        sampleAddress.setPinCode("400001");
    }

    @Test
    void createOrder_HomeDeliveryCOD_Success() {
        OrderCreateRequest req = new OrderCreateRequest();
        req.setFulfilmentType(Order.FulfilmentType.HOME_DELIVERY);
        req.setDeliveryAddressId(50L);
        req.setPaymentMethod(Order.PaymentMethod.COD);

        when(userRepository.findById(7L)).thenReturn(Optional.of(sampleUser));
        when(cartRepository.findByUserId(7L)).thenReturn(Optional.of(sampleCart));
        when(cartItemRepository.findByCartIdOrderByCreatedAtDesc(2L)).thenReturn(Collections.singletonList(sampleCartItem));
        when(addressRepository.findByIdAndUserId(50L, 7L)).thenReturn(Optional.of(sampleAddress));
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));

        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(1001L);
            return o;
        });

        OrderResponse res = orderService.createOrder(7L, req);

        assertNotNull(res);
        assertEquals(Order.OrderStatus.CONFIRMED, res.getOrderStatus());
        assertEquals(Order.PaymentStatus.PENDING, res.getPaymentStatus());
        assertEquals(Order.PaymentMethod.COD, res.getPaymentMethod());
        assertEquals(8, sampleProduct.getStockQuantity()); // Deducted 2

        verify(productRepository, times(1)).save(sampleProduct);
        verify(inventoryTransactionRepository, times(1)).save(any(InventoryTransaction.class));
        verify(cartItemRepository, times(1)).deleteByCartId(2L);
    }
}
