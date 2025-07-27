import axios from "../utils/axios";
import { PRODUCT_ENDPOINT } from "../constant";

// Create Product
export const createProduct = async (productData) => {
  try {
    const res = await axios.post(PRODUCT_ENDPOINT, productData);
    return res.data;
  } catch (error) {
    console.error("Create Product Error:", error?.response?.data || error.message);
    throw error;
  }
};

// Get All Products
export const getAllProducts = async () => {
  const res = await axios.get(PRODUCT_ENDPOINT);
  return res.data;
};

// Get Single Product by ID
export const getProductById = async (id) => {
  const res = await axios.get(`${PRODUCT_ENDPOINT}/${id}`);
  return res.data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${PRODUCT_ENDPOINT}/${id}`);
  return res.data;
};
