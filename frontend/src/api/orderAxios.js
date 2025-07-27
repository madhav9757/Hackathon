import axios from "../utils/axios"; // your pre-configured axios instance
import { ORDER_ENDPOINT } from "../constant";

// Create new order
export const createOrder = async (orderData) => {
  const response = await axios.post(`${ORDER_ENDPOINT}`, orderData);
  return response.data;
};

// Get all orders (admin or user)
export const getAllOrders = async () => {
  const response = await axios.get(`${ORDER_ENDPOINT}`);
  return response.data;
};

// Get single order by ID
export const getOrderById = async (orderId) => {
  const response = await axios.get(`${ORDER_ENDPOINT}/${orderId}`);
  return response.data;
};

// Update order status (admin use case)
export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(`${ORDER_ENDPOINT}/${orderId}`, { status });
  return response.data;
};

// Delete an order (admin use case or user cancel)
export const deleteOrder = async (orderId) => {
  const response = await axios.delete(`${ORDER_ENDPOINT}/${orderId}`);
  return response.data;
};
