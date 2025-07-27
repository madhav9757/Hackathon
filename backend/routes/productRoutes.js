import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Get all products
router.get("/", getAllProducts);

// Public: Get a single product
router.get("/:id", getProductById);

// Protected: Create a product (Vendor/Admin only)
router.post("/", protect, authorizeRoles("supplier", "admin"), createProduct);

// Protected: Update a product (Supplier/Admin only)
router.put("/:id", protect, authorizeRoles("supplier", "admin"), updateProduct);

// Protected: Delete a product (Admin only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);

export default router;
