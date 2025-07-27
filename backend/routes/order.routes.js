import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";
import {
    createOrder,
    getOrdersForVendor,
    getOrdersForSupplier,
    updateOrderStatus,
    rateOrder,
    getOrderDetails,
} from "../controllers/order.controller.js";

const router = express.Router();

router.route("/create-order").post(protect, asyncHandler(createOrder));

router.route("/vendor/orders").get(protect, asyncHandler(getOrdersForVendor));

router.route("/supplier/orders").get(protect, asyncHandler(getOrdersForSupplier));

router.route("/update-order-status/:orderId").patch(protect, asyncHandler(updateOrderStatus));

router.route("/rate-order/:orderId").patch(protect, asyncHandler(rateOrder));

router.route("/order-details/:orderId").get(protect, asyncHandler(getOrderDetails));

export default router;
