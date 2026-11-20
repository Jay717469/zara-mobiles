package com.zara.mobiles.service.impl;

import com.zara.mobiles.dto.StoreDto;
import com.zara.mobiles.entity.Store;
import com.zara.mobiles.exception.ResourceNotFoundException;
import com.zara.mobiles.repository.StoreRepository;
import com.zara.mobiles.service.StoreService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;

    public StoreServiceImpl(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreDto> getActiveStores() {
        return storeRepository.findAllByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreDto> getAllStores() {
        return storeRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StoreDto getStoreById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "id", id));
        return mapToDto(store);
    }

    @Override
    @Transactional
    public StoreDto createStore(StoreDto dto) {
        Store store = new Store();
        store.setName(dto.getName().trim());
        store.setAddress(dto.getAddress().trim());
        store.setCity(dto.getCity().trim());
        store.setState(dto.getState().trim());
        store.setPinCode(dto.getPinCode().trim());
        store.setPhone(dto.getPhone().trim());
        store.setOpeningHours(dto.getOpeningHours().trim());
        store.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        Store saved = storeRepository.save(store);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public StoreDto updateStore(Long id, StoreDto dto) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "id", id));

        if (dto.getName() != null) store.setName(dto.getName().trim());
        if (dto.getAddress() != null) store.setAddress(dto.getAddress().trim());
        if (dto.getCity() != null) store.setCity(dto.getCity().trim());
        if (dto.getState() != null) store.setState(dto.getState().trim());
        if (dto.getPinCode() != null) store.setPinCode(dto.getPinCode().trim());
        if (dto.getPhone() != null) store.setPhone(dto.getPhone().trim());
        if (dto.getOpeningHours() != null) store.setOpeningHours(dto.getOpeningHours().trim());
        if (dto.getIsActive() != null) store.setIsActive(dto.getIsActive());

        Store updated = storeRepository.save(store);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteStore(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "id", id));
        store.setIsActive(false);
        storeRepository.save(store);
    }

    private StoreDto mapToDto(Store s) {
        StoreDto dto = new StoreDto();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setAddress(s.getAddress());
        dto.setCity(s.getCity());
        dto.setState(s.getState());
        dto.setPinCode(s.getPinCode());
        dto.setPhone(s.getPhone());
        dto.setOpeningHours(s.getOpeningHours());
        dto.setIsActive(s.getIsActive());
        return dto;
    }
}
