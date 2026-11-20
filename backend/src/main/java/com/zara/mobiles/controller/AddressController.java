package com.zara.mobiles.controller;

import com.zara.mobiles.dto.AddressDto;
import com.zara.mobiles.dto.ApiResponse;
import com.zara.mobiles.security.UserPrincipal;
import com.zara.mobiles.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@Tag(name = "Addresses", description = "Customer delivery address book")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    @Operation(summary = "Get all saved addresses for current customer")
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<AddressDto> addresses = addressService.getUserAddresses(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(addresses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get address by ID")
    public ResponseEntity<ApiResponse<AddressDto>> getAddressById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        AddressDto address = addressService.getAddressById(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(address));
    }

    @PostMapping
    @Operation(summary = "Create new address")
    public ResponseEntity<ApiResponse<AddressDto>> createAddress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody AddressDto dto
    ) {
        AddressDto created = addressService.createAddress(currentUser.getId(), dto);
        return new ResponseEntity<>(ApiResponse.ok("Address added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update existing address")
    public ResponseEntity<ApiResponse<AddressDto>> updateAddress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody AddressDto dto
    ) {
        AddressDto updated = addressService.updateAddress(currentUser.getId(), id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Address updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        addressService.deleteAddress(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Address deleted successfully"));
    }
}
