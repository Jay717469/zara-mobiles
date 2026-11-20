import api from './api';
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES, FALLBACK_BRANDS } from './fallbackCatalog';

// Check if running on a live hosted site (like Netlify) without a dedicated cloud backend configured
const isLiveWithoutCustomBackend = 
  typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1' && 
  !import.meta.env.VITE_API_BASE_URL;

// Helper to filter fallback products in memory
function getFilteredFallback(params = {}) {
  let list = [...FALLBACK_PRODUCTS];

  if (params.keyword) {
    const k = params.keyword.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(k) || 
      p.brand.toLowerCase().includes(k) || 
      p.model.toLowerCase().includes(k) ||
      (p.description && p.description.toLowerCase().includes(k))
    );
  }

  if (params.brand) {
    list = list.filter(p => p.brand.toLowerCase() === params.brand.toLowerCase());
  }

  if (params.categoryId) {
    list = list.filter(p => p.categoryId.toString() === params.categoryId.toString());
  }

  if (params.minPrice) {
    list = list.filter(p => (p.finalPrice || p.price) >= Number(params.minPrice));
  }

  if (params.maxPrice) {
    list = list.filter(p => (p.finalPrice || p.price) <= Number(params.maxPrice));
  }

  if (params.sortBy) {
    if (params.sortBy === 'price') {
      list.sort((a, b) => params.sortDir === 'asc' 
        ? (a.finalPrice || a.price) - (b.finalPrice || b.price)
        : (b.finalPrice || b.price) - (a.finalPrice || a.price)
      );
    } else if (params.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }
  }

  return {
    success: true,
    message: "Products loaded",
    data: {
      content: list,
      pageNumber: 0,
      pageSize: list.length,
      totalElements: list.length,
      totalPages: 1,
      last: true
    }
  };
}

export const productService = {
  getProducts: async (params = {}) => {
    // If on live website without cloud backend, instantly serve showroom catalog
    if (isLiveWithoutCustomBackend) {
      return getFilteredFallback(params);
    }

    try {
      const res = await api.get('/products', { params });
      if (res && res.data && res.data.content && res.data.content.length > 0) {
        return res;
      }
      return getFilteredFallback(params);
    } catch (err) {
      console.warn('Backend API unreachable or blocked. Serving built-in showroom catalog.', err);
      return getFilteredFallback(params);
    }
  },

  getProductById: async (id) => {
    if (isLiveWithoutCustomBackend) {
      const found = FALLBACK_PRODUCTS.find(p => p.id.toString() === id.toString());
      return { success: true, data: found || FALLBACK_PRODUCTS[0] };
    }

    try {
      const res = await api.get(`/products/${id}`);
      if (res && res.data) return res;
      const found = FALLBACK_PRODUCTS.find(p => p.id.toString() === id.toString());
      return { success: true, data: found || FALLBACK_PRODUCTS[0] };
    } catch (err) {
      console.warn('Backend API unreachable for product detail. Using showroom data.', err);
      const found = FALLBACK_PRODUCTS.find(p => p.id.toString() === id.toString());
      return { success: true, data: found || FALLBACK_PRODUCTS[0] };
    }
  },

  searchProducts: (keyword, params = {}) => productService.getProducts({ keyword, ...params }),

  getProductsByBrand: (brand) => productService.getProducts({ brand }),

  getProductsByCategory: (categoryId) => productService.getProducts({ categoryId }),

  getFeaturedProducts: async () => {
    if (isLiveWithoutCustomBackend) {
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.isFeatured) };
    }
    try {
      const res = await api.get('/products/featured');
      if (res && res.data && res.data.length > 0) return res;
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.isFeatured) };
    } catch (err) {
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.isFeatured) };
    }
  },

  getTrendingProducts: async () => {
    if (isLiveWithoutCustomBackend) {
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.isTrending) };
    }
    try {
      const res = await api.get('/products/trending');
      if (res && res.data && res.data.length > 0) return res;
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.isTrending) };
    } catch (err) {
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.isTrending) };
    }
  },

  getBestSellers: async () => {
    if (isLiveWithoutCustomBackend) {
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.isBestSeller) };
    }
    try {
      const res = await api.get('/products/best-sellers');
      if (res && res.data && res.data.length > 0) return res;
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.isBestSeller) };
    } catch (err) {
      return { success: true, data: FALLBACK_PRODUCTS.filter(p => p.isBestSeller) };
    }
  },

  getAllBrands: async () => {
    if (isLiveWithoutCustomBackend) {
      return { success: true, data: FALLBACK_BRANDS };
    }
    try {
      const res = await api.get('/products/brands');
      if (res && res.data && res.data.length > 0) return res;
      return { success: true, data: FALLBACK_BRANDS };
    } catch (err) {
      return { success: true, data: FALLBACK_BRANDS };
    }
  },

  // Categories
  getCategories: async () => {
    if (isLiveWithoutCustomBackend) {
      return { success: true, data: FALLBACK_CATEGORIES };
    }
    try {
      const res = await api.get('/categories');
      if (res && res.data && res.data.length > 0) return res;
      return { success: true, data: FALLBACK_CATEGORIES };
    } catch (err) {
      return { success: true, data: FALLBACK_CATEGORIES };
    }
  },

  getCategoryById: async (id) => {
    if (isLiveWithoutCustomBackend) {
      const found = FALLBACK_CATEGORIES.find(c => c.id.toString() === id.toString());
      return { success: true, data: found || FALLBACK_CATEGORIES[0] };
    }
    try {
      return await api.get(`/categories/${id}`);
    } catch (err) {
      const found = FALLBACK_CATEGORIES.find(c => c.id.toString() === id.toString());
      return { success: true, data: found || FALLBACK_CATEGORIES[0] };
    }
  },

  // Reviews
  getReviews: async (productId) => {
    if (isLiveWithoutCustomBackend) {
      return {
        success: true,
        data: [
          {
            id: 1,
            userName: "Aarav Sharma",
            rating: 5,
            headline: "Unbelievable camera and battery life!",
            comment: "Received same-day delivery in pristine condition. All original accessories and warranty verified. Outstanding experience!",
            createdAt: "2026-11-19"
          },
          {
            id: 2,
            userName: "Priya Nair",
            rating: 5,
            headline: "Best smartphone purchase ever",
            comment: "Store pickup at Indiranagar was super quick. They helped with full data transfer from my old phone in 15 minutes.",
            createdAt: "2026-11-18"
          }
        ]
      };
    }
    try {
      return await api.get(`/reviews/product/${productId}`);
    } catch (err) {
      return {
        success: true,
        data: [
          {
            id: 1,
            userName: "Aarav Sharma",
            rating: 5,
            headline: "Unbelievable camera and battery life!",
            comment: "Received same-day delivery in pristine condition. All original accessories and warranty verified. Outstanding experience!",
            createdAt: "2026-11-19"
          },
          {
            id: 2,
            userName: "Priya Nair",
            rating: 5,
            headline: "Best smartphone purchase ever",
            comment: "Store pickup at Indiranagar was super quick. They helped with full data transfer from my old phone in 15 minutes.",
            createdAt: "2026-11-18"
          }
        ]
      };
    }
  },

  addReview: (productId, data) => api.post(`/reviews/product/${productId}`, data),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};
