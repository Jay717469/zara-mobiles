package com.zara.mobiles.repository;

import com.zara.mobiles.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByIsActiveTrue();
    Optional<Category> findBySlug(String slug);
    Boolean existsByName(String name);
    Boolean existsBySlug(String slug);
}
