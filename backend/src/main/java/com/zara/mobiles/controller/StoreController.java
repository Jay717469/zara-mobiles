package com.zara.mobiles.controller;

import com.zara.mobiles.dto.ApiResponse;
import com.zara.mobiles.dto.StoreDto;
import com.zara.mobiles.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stores")
@Tag(name = "Stores", description = "Physical pickup store locations")
public class StoreController {

    private final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping
    @Operation(summary = "Get all active pickup stores")
    public ResponseEntity<ApiResponse<List<StoreDto>>> getActiveStores() {
        return ResponseEntity.ok(ApiResponse.ok(storeService.getActiveStores()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get store details by ID")
    public ResponseEntity<ApiResponse<StoreDto>> getStoreById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(storeService.getStoreById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create pickup store (ADMIN only)")
    public ResponseEntity<ApiResponse<StoreDto>> createStore(@Valid @RequestBody StoreDto dto) {
        StoreDto created = storeService.createStore(dto);
        return new ResponseEntity<>(ApiResponse.ok("Store created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update pickup store (ADMIN only)")
    public ResponseEntity<ApiResponse<StoreDto>> updateStore(
            @PathVariable Long id,
            @Valid @RequestBody StoreDto dto
    ) {
        StoreDto updated = storeService.updateStore(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Store updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete / deactivate pickup store (ADMIN only)")
    public ResponseEntity<ApiResponse<Void>> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.ok(ApiResponse.ok("Store deactivated successfully"));
    }
}
