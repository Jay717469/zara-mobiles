import api from './api';

export const productService = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  searchProducts: (keyword, params = {}) => api.get('/products/search', { params: { keyword, ...params } }),
  getProductsByBrand: (brand) => api.get(`/products/brand/${encodeURIComponent(brand)}`),
  getProductsByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  getTrendingProducts: () => api.get('/products/trending'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getAllBrands: () => api.get('/products/brands'),
  
  // Admin product endpoints
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Categories
  getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // Reviews
  getReviews: (productId) => api.get(`/reviews/product/${productId}`),
  addReview: (productId, data) => api.post(`/reviews/product/${productId}`, data),
};
