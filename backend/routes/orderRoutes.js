import express from "express";
import {
  createOrder,
  getOrders,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👤 Authenticated Supplier creates order
router.post("/", protect, createOrder);

// 🔒 Get orders (admin, supplier, or vendor depending on filters)
router.get("/", protect, getOrders);

// 👤 Supplier views own orders
router.get("/my-orders", protect, getMyOrders);

// 👤 Vendor views orders directed to them
router.get("/vendor-orders", protect, getVendorOrders);

// ✅ Vendor updates order status
router.put("/:orderId", protect, updateOrderStatus);

// ❌ Delete an order (if needed)
router.delete("/:orderId", protect, deleteOrder);

export default router;
