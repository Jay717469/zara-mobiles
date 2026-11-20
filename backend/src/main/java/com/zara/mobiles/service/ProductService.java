package com.zara.mobiles.service;

import com.zara.mobiles.dto.PagedResponse;
import com.zara.mobiles.dto.ProductCreateRequest;
import com.zara.mobiles.dto.ProductResponse;
import com.zara.mobiles.dto.ProductUpdateRequest;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    PagedResponse<ProductResponse> filterProducts(
            Long categoryId,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    ProductResponse getProductById(Long id);
    List<ProductResponse> getFeaturedProducts();
    List<ProductResponse> getTrendingProducts();
    List<ProductResponse> getBestSellers();
    List<ProductResponse> getProductsByBrand(String brand);
    List<ProductResponse> getProductsByCategory(Long categoryId);
    List<String> getAllBrands();

    ProductResponse createProduct(ProductCreateRequest request);
    ProductResponse updateProduct(Long id, ProductUpdateRequest request);
    void deleteProduct(Long id);
}
