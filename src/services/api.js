import axios from "axios";
import Swal from "sweetalert2";
import ReactGA from "react-ga4";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 🔐 otomatis kirim token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && localStorage.getItem("token")) {
      Swal.fire({
        icon: "warning",
        title: "Sesi berakhir",
        text: "Silakan login kembali",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      });
      ReactGA.event({ category: "Auth", action: "Auto Logout 401",});
    }

    return Promise.reject(error);
  }
);

export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);

export const getProducts = () => api.get("/products");
export const getImages = (productId) =>
  api.get(`/products/${productId}/image`, {
    responseType: "blob"
  });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getCart = () => api.get("/cart");
export const addToCart = (productId, quantity = 1) =>
  api.post("/cart", { productId, quantity });
export const updateCartItem = (productId, quantity) =>
  api.put(`/cart/${productId}`, { quantity });
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`);
export const clearCart = () => api.delete("/cart");

export const checkout = (paymentMethod) =>
  api.post("/orders/checkout", { paymentMethod });
export const checkPayment = (orderId) =>
  api.post(`/orders/${orderId}/check-payment`);
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);
export const getOrders = () => api.get("/orders");

export const adminGetAllOrders = () => api.get("/admin/orders");
export const adminGetOrderById = (orderId) =>
  api.get(`/admin/orders/${orderId}`);
export const adminUpdateOrderStatus = (orderId, orderStatus) =>
  api.put(`/admin/orders/${orderId}/status`, { orderStatus });

export default api;
