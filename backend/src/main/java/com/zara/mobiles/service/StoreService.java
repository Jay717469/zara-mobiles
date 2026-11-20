package com.zara.mobiles.service;

import com.zara.mobiles.dto.StoreDto;
import java.util.List;

public interface StoreService {
    List<StoreDto> getActiveStores();
    List<StoreDto> getAllStores();
    StoreDto getStoreById(Long id);
    StoreDto createStore(StoreDto dto);
    StoreDto updateStore(Long id, StoreDto dto);
    void deleteStore(Long id);
}
