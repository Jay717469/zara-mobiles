package com.zara.mobiles.dto;

import java.util.ArrayList;
import java.util.List;

public class WishlistResponse {
    private Long id;
    private List<WishlistItemResponse> items = new ArrayList<>();
    private Integer totalItems = 0;

    public WishlistResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<WishlistItemResponse> getItems() { return items; }
    public void setItems(List<WishlistItemResponse> items) { 
        this.items = items;
        this.totalItems = items != null ? items.size() : 0;
    }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }
}
