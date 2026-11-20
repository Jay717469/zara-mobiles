package com.zara.mobiles.service.impl;

import com.zara.mobiles.dto.CategoryDto;
import com.zara.mobiles.entity.Category;
import com.zara.mobiles.exception.BadRequestException;
import com.zara.mobiles.exception.ResourceNotFoundException;
import com.zara.mobiles.repository.CategoryRepository;
import com.zara.mobiles.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAllByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return mapToDto(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
        return mapToDto(category);
    }

    @Override
    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new BadRequestException("A category with this name already exists");
        }

        String slug = dto.getSlug() != null && !dto.getSlug().isBlank()
                ? dto.getSlug()
                : dto.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");

        if (categoryRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Category category = new Category(dto.getName(), slug, dto.getDescription(), dto.getImageUrl());
        Category saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        if (dto.getName() != null && !dto.getName().equals(category.getName())) {
            if (categoryRepository.existsByName(dto.getName())) {
                throw new BadRequestException("A category with this name already exists");
            }
            category.setName(dto.getName());
        }

        if (dto.getDescription() != null) category.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) category.setImageUrl(dto.getImageUrl());
        if (dto.getIsActive() != null) category.setIsActive(dto.getIsActive());

        Category updated = categoryRepository.save(category);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        category.setIsActive(false);
        categoryRepository.save(category);
    }

    private CategoryDto mapToDto(Category cat) {
        return new CategoryDto(cat.getId(), cat.getName(), cat.getSlug(), cat.getDescription(), cat.getImageUrl(), cat.getIsActive());
    }
}
