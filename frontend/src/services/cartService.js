import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1, variantId = null) => 
    api.post('/cart/items', { productId, quantity, variantId }),
  updateQuantity: (itemId, quantity) => 
    api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => 
    api.delete(`/cart/items/${itemId}`),
  clearCart: () => 
    api.delete('/cart/clear'),

  // Wishlist
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post(`/wishlist/items/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/items/${productId}`),
  moveToCart: (productId) => api.post(`/wishlist/items/${productId}/move-to-cart`),
};
