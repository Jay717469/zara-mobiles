import api from './api';

export const paymentService = {
  createRazorpayOrder: (orderId) => api.post('/payments/create-order', { orderId }),
  verifyRazorpayPayment: (data) => api.post('/payments/verify', data),
  getPaymentForOrder: (orderId) => api.get(`/payments/${orderId}`),
};
