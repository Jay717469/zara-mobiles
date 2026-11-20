import api from './api';

export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: (page = 0, size = 10) => api.get('/orders/my-orders', { params: { page, size } }),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),

  // Addresses
  getAddresses: () => api.get('/addresses'),
  getAddressById: (id) => api.get(`/addresses/${id}`),
  createAddress: (data) => api.post('/addresses', data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),

  // Stores
  getActiveStores: () => api.get('/stores'),
  getStoreById: (id) => api.get(`/stores/${id}`),
  createStore: (data) => api.post('/stores', data),
  updateStore: (id, data) => api.put(`/stores/${id}`, data),
  deleteStore: (id) => api.delete(`/stores/${id}`),

  // Admin order management
  getAllOrders: (params = {}) => api.get('/admin/orders', { params }),
  updateOrderStatus: (orderId, status, notes = '') => 
    api.put(`/admin/orders/${orderId}/status`, { status, notes }),

  // Admin dashboard & customers & inventory
  getAdminDashboard: () => api.get('/admin/dashboard'),
  getCustomers: () => api.get('/admin/customers'),
  updateCustomerStatus: (id, status) => api.put(`/admin/customers/${id}/status`, null, { params: { status } }),
  getInventory: () => api.get('/admin/inventory'),
  adjustStock: (productId, data) => api.put(`/admin/inventory/${productId}`, data),
  getInventoryTransactions: (page = 0, size = 20) => api.get('/admin/inventory/transactions', { params: { page, size } }),
};
