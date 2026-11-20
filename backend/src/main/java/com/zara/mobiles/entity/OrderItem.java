package com.zara.mobiles.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "product_name_snapshot", nullable = false, length = 200)
    private String productNameSnapshot;

    @Column(name = "product_sku_snapshot", nullable = false, length = 100)
    private String productSkuSnapshot;

    @Column(name = "product_image_snapshot", length = 500)
    private String productImageSnapshot;

    @Column(name = "variant_info_snapshot", length = 150)
    private String variantInfoSnapshot;

    @Column(name = "purchase_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    public OrderItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getProductNameSnapshot() { return productNameSnapshot; }
    public void setProductNameSnapshot(String productNameSnapshot) { this.productNameSnapshot = productNameSnapshot; }

    public String getProductSkuSnapshot() { return productSkuSnapshot; }
    public void setProductSkuSnapshot(String productSkuSnapshot) { this.productSkuSnapshot = productSkuSnapshot; }

    public String getProductImageSnapshot() { return productImageSnapshot; }
    public void setProductImageSnapshot(String productImageSnapshot) { this.productImageSnapshot = productImageSnapshot; }

    public String getVariantInfoSnapshot() { return variantInfoSnapshot; }
    public void setVariantInfoSnapshot(String variantInfoSnapshot) { this.variantInfoSnapshot = variantInfoSnapshot; }

    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
