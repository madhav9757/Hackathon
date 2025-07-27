import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const createOrder = async (req, res) => {
  try {
    const {
      totalPrice,
      productId,
      paymentMethod,
      quantityRequired,
      priceAtPurchase,
    } = req.body;

    if (
      !totalPrice ||
      !productId ||
      !paymentMethod ||
      !quantityRequired ||
      !priceAtPurchase
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const isVendor = req.user.role;

    if (!isVendor) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const vendorId = req.user._id;

    if (!vendorId) {
      return res
        .status(401)
        .json({ success: false, message: "no vender id found" });
    }

    const supplierId = await Product.findById(productId).select("supplierId name");

    if (!supplierId) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const items = [
      {
        supplierId: supplierId.supplierId,
        vendorId,
        productId,
        name: supplierId.name,
        quantityRequired,
        priceAtPurchase,
      },
    ];

    const newOrder = await Order.create({
      vendorId,
      supplierId,
      items,
      totalPrice,
      paymentMethod,
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

const getOrdersForVendor = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const orders = await Order.find({ vendorId }).populate("items.productId");

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

const getOrdersForSupplier = async (req, res) => {
  try {
    const supplierId = req.user._id;
    const orders = await Order.find({ supplierId }).populate("items.productId");

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const supplierId = req.user._id;
    const isSupplier = req.user.role === "supplier";

    if (!isSupplier) return res.status(401).json({ message: "Unauthorized" });

    if (!supplierId)
      return res.status(401).json({ message: "id not found of supplier" });

    const order = await Order.findOne({ _id: orderId, supplierId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Status update failed" });
  }
};

const rateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, comment } = req.body;
    const vendorId = req.user._id;
    const isVendor = req.user.role === "vendor";

    if (!isVendor) return res.status(401).json({ message: "Unauthorized" });

    if (!vendorId)
      return res.status(401).json({ message: "id not found of vendor" });

    const order = await Order.findOne({ _id: orderId, vendorId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.vendorRating.push({ rating, comment });
    await order.save();

    res.status(200).json({ success: true, message: "Rated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Rating failed" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .select("-vendorRating")
      .populate({
        path: "vendorId",
        select: "name email phoneNumber address",
      })
      .populate({
        path: "supplierId",
        select: "name email phoneNumber address",
      })
      .populate({
        path: "items.productId",
        select: "name pricePerUnit availableQuantity category isOutOfStock",
      });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error retrieving order" });
  }
};

export {
  createOrder,
  getOrdersForVendor,
  getOrdersForSupplier,
  updateOrderStatus,
  rateOrder,
  getOrderDetails,
};
