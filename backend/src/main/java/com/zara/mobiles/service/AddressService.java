package com.zara.mobiles.service;

import com.zara.mobiles.dto.AddressDto;
import java.util.List;

public interface AddressService {
    List<AddressDto> getUserAddresses(Long userId);
    AddressDto getAddressById(Long userId, Long addressId);
    AddressDto createAddress(Long userId, AddressDto dto);
    AddressDto updateAddress(Long userId, Long addressId, AddressDto dto);
    void deleteAddress(Long userId, Long addressId);
}
