import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('access_token');
        if (token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                const {access} = response.data;
                localStorage.setItem('access_token', access)

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            }catch (refreshError){
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  verifyEmail: (token) => api.post('/auth/verify-email/', { token }),
  resendVerification: (email) => api.post('/auth/resend-verification/', { email }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/update/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
  requestVendorRole: (data) => api.post('/auth/request-vendor-role/', data),
  getMyVendorRequest: () => api.get('/auth/my-vendor-request/'),
  getVendorRequests: (status) => api.get('/auth/vendor-requests/', { params: { status } }),
  reviewVendorRequest: (id, data) => api.post(`/auth/vendor-requests/${id}/review/`, data),
};

// Product APIs
export const productAPI = {
  getProducts: (params) => api.get('/products/', { params }),
  getProduct: (slug) => api.get(`/products/${slug}/`),
  createProduct: (data) => api.post('/products/', data),
  updateProduct: (slug, data) => api.put(`/products/${slug}/update/`, data),
  deleteProduct: (slug) => api.delete(`/products/${slug}/delete/`),
  getCategories: () => api.get('/products/categories/'),
  createCategory: (data) => api.post('/products/categories/', data),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addToCart: (data) => api.post('/cart/add/', data),
  updateCartItem: (id, data) => api.patch(`/cart/items/${id}/update/`, data),
  removeFromCart: (id) => api.delete(`/cart/items/${id}/remove/`),
  clearCart: () => api.delete('/cart/clear/'),
};

// Order APIs
export const orderAPI = {
  getOrders: () => api.get('/orders/'),
  getOrder: (id) => api.get(`/orders/${id}/`),
  createOrder: (data) => api.post('/orders/create/', data),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel/`),
  updateOrderStatus: (id, data) => api.patch(`/orders/${id}/status/`, data),
};

// Payment APIs
export const paymentAPI = {
  getPayments: () => api.get('/payments/'),
  getPayment: (id) => api.get(`/payments/${id}/`),
  createPaymentIntent: (data) => api.post('/payments/create-intent/', data),
  confirmPayment: (data) => api.post('/payments/confirm/', data),
  cashOnDelivery: (data) => api.post('/payments/cash-on-delivery/', data),
  createRefund: (data) => api.post('/payments/refunds/create/', data),
  getRefunds: () => api.get('/payments/refunds/'),
};

export const adminPage = {

}
export default api;
