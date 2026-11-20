package com.zara.mobiles.repository;

import com.zara.mobiles.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartIdOrderByCreatedAtDesc(Long cartId);
    Optional<CartItem> findByCartIdAndProductIdAndVariantId(Long cartId, Long productId, Long variantId);
    Optional<CartItem> findByCartIdAndProductIdAndVariantIsNull(Long cartId, Long productId);
    void deleteByCartId(Long cartId);
}
