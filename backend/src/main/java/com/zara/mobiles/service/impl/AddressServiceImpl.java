package com.zara.mobiles.service.impl;

import com.zara.mobiles.dto.AddressDto;
import com.zara.mobiles.entity.Address;
import com.zara.mobiles.entity.User;
import com.zara.mobiles.exception.BadRequestException;
import com.zara.mobiles.exception.ResourceNotFoundException;
import com.zara.mobiles.repository.AddressRepository;
import com.zara.mobiles.repository.UserRepository;
import com.zara.mobiles.service.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressDto> getUserAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AddressDto getAddressById(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or does not belong to you"));
        return mapToDto(address);
    }

    @Override
    @Transactional
    public AddressDto createAddress(Long userId, AddressDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId).ifPresent(oldDef -> {
                oldDef.setIsDefault(false);
                addressRepository.save(oldDef);
            });
        } else {
            // If this is user's first address, make it default
            List<Address> existing = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
            if (existing.isEmpty()) {
                dto.setIsDefault(true);
            }
        }

        Address address = new Address();
        address.setUser(user);
        address.setFullName(dto.getFullName().trim());
        address.setMobileNumber(dto.getMobileNumber().trim());
        address.setStreet(dto.getStreet().trim());
        address.setCity(dto.getCity().trim());
        address.setState(dto.getState().trim());
        address.setPinCode(dto.getPinCode().trim());
        address.setDeliveryInstructions(dto.getDeliveryInstructions());
        address.setIsDefault(Boolean.TRUE.equals(dto.getIsDefault()));

        Address saved = addressRepository.save(address);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public AddressDto updateAddress(Long userId, Long addressId, AddressDto dto) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or does not belong to you"));

        if (Boolean.TRUE.equals(dto.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId).ifPresent(oldDef -> {
                oldDef.setIsDefault(false);
                addressRepository.save(oldDef);
            });
        }

        address.setFullName(dto.getFullName().trim());
        address.setMobileNumber(dto.getMobileNumber().trim());
        address.setStreet(dto.getStreet().trim());
        address.setCity(dto.getCity().trim());
        address.setState(dto.getState().trim());
        address.setPinCode(dto.getPinCode().trim());
        address.setDeliveryInstructions(dto.getDeliveryInstructions());
        if (dto.getIsDefault() != null) {
            address.setIsDefault(dto.getIsDefault());
        }

        Address updated = addressRepository.save(address);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or does not belong to you"));
        addressRepository.delete(address);
    }

    private AddressDto mapToDto(Address addr) {
        AddressDto dto = new AddressDto();
        dto.setId(addr.getId());
        dto.setFullName(addr.getFullName());
        dto.setMobileNumber(addr.getMobileNumber());
        dto.setStreet(addr.getStreet());
        dto.setCity(addr.getCity());
        dto.setState(addr.getState());
        dto.setPinCode(addr.getPinCode());
        dto.setDeliveryInstructions(addr.getDeliveryInstructions());
        dto.setIsDefault(addr.getIsDefault());
        return dto;
    }
}
