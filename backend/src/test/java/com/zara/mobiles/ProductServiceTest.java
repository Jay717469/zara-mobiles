package com.zara.mobiles;

import com.zara.mobiles.dto.ProductCreateRequest;
import com.zara.mobiles.dto.ProductResponse;
import com.zara.mobiles.dto.ProductUpdateRequest;
import com.zara.mobiles.entity.Category;
import com.zara.mobiles.entity.Product;
import com.zara.mobiles.repository.*;
import com.zara.mobiles.service.impl.ProductServiceImpl;
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
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private InventoryTransactionRepository inventoryTransactionRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Category sampleCategory;
    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleCategory = new Category("Flagships", "flagships", "desc", "img");
        sampleCategory.setId(1L);

        sampleProduct = new Product();
        sampleProduct.setId(10L);
        sampleProduct.setName("Galaxy S24");
        sampleProduct.setBrand("Samsung");
        sampleProduct.setModel("S24");
        sampleProduct.setSku("SAM-S24");
        sampleProduct.setPrice(new BigDecimal("80000.00"));
        sampleProduct.setDiscountPercentage(new BigDecimal("10.00"));
        sampleProduct.setFinalPrice(new BigDecimal("72000.00"));
        sampleProduct.setStockQuantity(15);
        sampleProduct.setIsActive(true);
        sampleProduct.setCategory(sampleCategory);
    }

    @Test
    void getProductById_Success() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));
        when(productImageRepository.findByProductIdOrderByDisplayOrderAsc(10L)).thenReturn(Collections.emptyList());
        when(productVariantRepository.findByProductIdAndIsActiveTrue(10L)).thenReturn(Collections.emptyList());

        ProductResponse res = productService.getProductById(10L);

        assertNotNull(res);
        assertEquals("Galaxy S24", res.getName());
        assertEquals(new BigDecimal("72000.00"), res.getFinalPrice());
        assertTrue(res.getInStock());
    }

    @Test
    void createProduct_Success() {
        ProductCreateRequest req = new ProductCreateRequest();
        req.setCategoryId(1L);
        req.setName("Galaxy S24");
        req.setBrand("Samsung");
        req.setModel("S24");
        req.setSku("SAM-S24");
        req.setPrice(new BigDecimal("80000.00"));
        req.setDiscountPercentage(new BigDecimal("10.00"));
        req.setStockQuantity(15);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> {
            Product p = inv.getArgument(0);
            p.setId(10L);
            return p;
        });
        when(productImageRepository.findByProductIdOrderByDisplayOrderAsc(10L)).thenReturn(Collections.emptyList());
        when(productVariantRepository.findByProductIdAndIsActiveTrue(10L)).thenReturn(Collections.emptyList());

        ProductResponse res = productService.createProduct(req);

        assertNotNull(res);
        assertEquals("Galaxy S24", res.getName());
        verify(productRepository, times(1)).save(any(Product.class));
        verify(inventoryTransactionRepository, times(1)).save(any());
    }

    @Test
    void deleteProduct_SoftDeactivates() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));

        productService.deleteProduct(10L);

        assertFalse(sampleProduct.getIsActive());
        verify(productRepository, times(1)).save(sampleProduct);
    }
}
