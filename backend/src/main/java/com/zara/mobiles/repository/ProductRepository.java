package com.zara.mobiles.repository;

import com.zara.mobiles.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:brand IS NULL OR LOWER(p.brand) = LOWER(:brand)) " +
           "AND (:minPrice IS NULL OR p.finalPrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.finalPrice <= :maxPrice) " +
           "AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.model) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> filterProducts(
            @Param("categoryId") Long categoryId,
            @Param("brand") String brand,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    List<Product> findByIsActiveTrueAndIsFeaturedTrue();

    List<Product> findByIsActiveTrueAndIsTrendingTrue();

    List<Product> findByIsActiveTrueAndIsBestSellerTrue();

    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);

    List<Product> findByBrandIgnoreCaseAndIsActiveTrue(String brand);

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.isActive = true ORDER BY p.brand ASC")
    List<String> findDistinctBrands();

    long countByStockQuantityLessThanAndIsActiveTrue(Integer threshold);

    long countByStockQuantityEqualsAndIsActiveTrue(Integer quantity);

    List<Product> findByStockQuantityLessThanOrderByStockQuantityAsc(Integer threshold);
}
