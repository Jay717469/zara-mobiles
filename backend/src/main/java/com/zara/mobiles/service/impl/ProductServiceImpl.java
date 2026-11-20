package com.zara.mobiles.service.impl;

import com.zara.mobiles.dto.*;
import com.zara.mobiles.entity.*;
import com.zara.mobiles.exception.BadRequestException;
import com.zara.mobiles.exception.ResourceNotFoundException;
import com.zara.mobiles.repository.*;
import com.zara.mobiles.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ProductImageRepository productImageRepository,
            ProductVariantRepository productVariantRepository,
            InventoryTransactionRepository inventoryTransactionRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
        this.productVariantRepository = productVariantRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> filterProducts(
            Long categoryId,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productRepository.filterProducts(categoryId, brand, minPrice, maxPrice, keyword, pageable);

        List<ProductResponse> content = products.getContent().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages(),
                products.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToProductResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsActiveTrueAndIsFeaturedTrue().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getTrendingProducts() {
        return productRepository.findByIsActiveTrueAndIsTrendingTrue().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getBestSellers() {
        return productRepository.findByIsActiveTrueAndIsBestSellerTrue().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByBrand(String brand) {
        return productRepository.findByBrandIgnoreCaseAndIsActiveTrue(brand).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllBrands() {
        return productRepository.findDistinctBrands();
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        Product product = new Product();
        product.setCategory(category);
        product.setName(request.getName().trim());
        product.setBrand(request.getBrand().trim());
        product.setModel(request.getModel().trim());
        product.setSku(request.getSku().trim());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPercentage(request.getDiscountPercentage() != null ? request.getDiscountPercentage() : BigDecimal.ZERO);
        product.calculateFinalPrice();
        product.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
        product.setRam(request.getRam());
        product.setStorage(request.getStorage());
        product.setProcessor(request.getProcessor());
        product.setDisplay(request.getDisplay());
        product.setBattery(request.getBattery());
        product.setCamera(request.getCamera());
        product.setColor(request.getColor());
        product.setWarrantyDetails(request.getWarrantyDetails());
        product.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        product.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        product.setIsTrending(request.getIsTrending() != null ? request.getIsTrending() : false);
        product.setIsBestSeller(request.getIsBestSeller() != null ? request.getIsBestSeller() : false);

        Product savedProduct = productRepository.save(product);

        // Save images
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage img = new ProductImage(
                        savedProduct,
                        request.getImageUrls().get(i),
                        i == 0,
                        i + 1
                );
                images.add(productImageRepository.save(img));
            }
            savedProduct.setImages(images);
        }

        // Record initial inventory transaction
        if (savedProduct.getStockQuantity() > 0) {
            inventoryTransactionRepository.save(new InventoryTransaction(
                    savedProduct,
                    InventoryTransaction.TransactionType.INITIAL,
                    savedProduct.getStockQuantity(),
                    savedProduct.getStockQuantity(),
                    "Initial stock upon product creation",
                    "PRODUCT-CREATE-" + savedProduct.getId()
            ));
        }

        return mapToProductResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            product.setCategory(category);
        }

        if (request.getName() != null) product.setName(request.getName().trim());
        if (request.getBrand() != null) product.setBrand(request.getBrand().trim());
        if (request.getModel() != null) product.setModel(request.getModel().trim());
        if (request.getSku() != null) product.setSku(request.getSku().trim());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getDiscountPercentage() != null) product.setDiscountPercentage(request.getDiscountPercentage());
        product.calculateFinalPrice();

        if (request.getStockQuantity() != null && !request.getStockQuantity().equals(product.getStockQuantity())) {
            int diff = request.getStockQuantity() - product.getStockQuantity();
            product.setStockQuantity(request.getStockQuantity());
            inventoryTransactionRepository.save(new InventoryTransaction(
                    product,
                    InventoryTransaction.TransactionType.MANUAL_ADJUSTMENT,
                    diff,
                    product.getStockQuantity(),
                    "Stock updated via product edit form",
                    "MANUAL-UPDATE-" + product.getId()
            ));
        }

        if (request.getRam() != null) product.setRam(request.getRam());
        if (request.getStorage() != null) product.setStorage(request.getStorage());
        if (request.getProcessor() != null) product.setProcessor(request.getProcessor());
        if (request.getDisplay() != null) product.setDisplay(request.getDisplay());
        if (request.getBattery() != null) product.setBattery(request.getBattery());
        if (request.getCamera() != null) product.setCamera(request.getCamera());
        if (request.getColor() != null) product.setColor(request.getColor());
        if (request.getWarrantyDetails() != null) product.setWarrantyDetails(request.getWarrantyDetails());
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());
        if (request.getIsFeatured() != null) product.setIsFeatured(request.getIsFeatured());
        if (request.getIsTrending() != null) product.setIsTrending(request.getIsTrending());
        if (request.getIsBestSeller() != null) product.setIsBestSeller(request.getIsBestSeller());

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            productImageRepository.deleteByProductId(product.getId());
            List<ProductImage> newImages = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage img = new ProductImage(product, request.getImageUrls().get(i), i == 0, i + 1);
                newImages.add(productImageRepository.save(img));
            }
            product.setImages(newImages);
        }

        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setIsActive(false);
        productRepository.save(product);
    }

    private ProductResponse mapToProductResponse(Product product) {
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setBrand(product.getBrand());
        dto.setModel(product.getModel());
        dto.setSku(product.getSku());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setDiscountPercentage(product.getDiscountPercentage());
        dto.setFinalPrice(product.getFinalPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setRam(product.getRam());
        dto.setStorage(product.getStorage());
        dto.setProcessor(product.getProcessor());
        dto.setDisplay(product.getDisplay());
        dto.setBattery(product.getBattery());
        dto.setCamera(product.getCamera());
        dto.setColor(product.getColor());
        dto.setWarrantyDetails(product.getWarrantyDetails());
        dto.setIsActive(product.getIsActive());
        dto.setIsFeatured(product.getIsFeatured());
        dto.setIsTrending(product.getIsTrending());
        dto.setIsBestSeller(product.getIsBestSeller());
        dto.setCreatedAt(product.getCreatedAt());

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }

        List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
        if (!images.isEmpty()) {
            dto.setPrimaryImageUrl(images.get(0).getImageUrl());
            dto.setImages(images.stream()
                    .map(img -> new ProductImageDto(img.getId(), img.getImageUrl(), img.getIsPrimary(), img.getDisplayOrder()))
                    .collect(Collectors.toList()));
        } else {
            dto.setImages(new ArrayList<>());
        }

        List<ProductVariant> variants = productVariantRepository.findByProductIdAndIsActiveTrue(product.getId());
        dto.setVariants(variants.stream().map(v -> {
            ProductVariantDto vdto = new ProductVariantDto();
            vdto.setId(v.getId());
            vdto.setColor(v.getColor());
            vdto.setRam(v.getRam());
            vdto.setStorage(v.getStorage());
            vdto.setSku(v.getSku());
            vdto.setPriceAdjustment(v.getPriceAdjustment());
            vdto.setStockQuantity(v.getStockQuantity());
            vdto.setIsActive(v.getIsActive());
            return vdto;
        }).collect(Collectors.toList()));

        return dto;
    }
}
