import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProductRequest,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controllers/product.Controller.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/create-product")
  .post(
    protect,
    upload.fields([{ name: "image" }, { name: "attachments" }]),
    asyncHandler(createProductRequest)
  );

router.route("/update-product").patch(
  protect,
  upload.fields([
    { name: "image", maxCount: 5 },
    { name: "attachments", maxCount: 10 },
  ]),
  asyncHandler(updateProduct)
);

router.route("/delete-product").delete(protect, asyncHandler(deleteProduct));

router.route("/get-products").get(protect, asyncHandler(getProducts));
export default router;
