package com.zara.mobiles.controller;

import com.zara.mobiles.dto.ApiResponse;
import com.zara.mobiles.dto.PagedResponse;
import com.zara.mobiles.dto.ProductCreateRequest;
import com.zara.mobiles.dto.ProductResponse;
import com.zara.mobiles.dto.ProductUpdateRequest;
import com.zara.mobiles.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@Tag(name = "Products", description = "Product catalog, search, filtering, and admin CRUD")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Get products with pagination, search, filter and sort")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PagedResponse<ProductResponse> response = productService.filterProducts(
                categoryId, brand, minPrice, maxPrice, keyword, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product details by ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by keyword")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        PagedResponse<ProductResponse> response = productService.filterProducts(
                null, null, null, null, keyword, page, size, "createdAt", "desc"
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/brand/{brand}")
    @Operation(summary = "Get products by brand")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByBrand(@PathVariable String brand) {
        List<ProductResponse> products = productService.getProductsByBrand(brand);
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category ID")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductResponse> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getFeaturedProducts()));
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getTrendingProducts() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getTrendingProducts()));
    }

    @GetMapping("/best-sellers")
    @Operation(summary = "Get best-selling products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getBestSellers() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getBestSellers()));
    }

    @GetMapping("/brands")
    @Operation(summary = "Get list of all distinct brands")
    public ResponseEntity<ApiResponse<List<String>>> getAllBrands() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllBrands()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create product (ADMIN only)")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        ProductResponse response = productService.createProduct(request);
        return new ResponseEntity<>(ApiResponse.ok("Product created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product (ADMIN only)")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductUpdateRequest request
    ) {
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete / deactivate product (ADMIN only)")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deactivated successfully"));
    }
}
