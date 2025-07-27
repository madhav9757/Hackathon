import { Order } from "../models/order.js";
import { Product } from "../models/Product.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    // The supplierId should ideally come from the authenticated user (req.user.id)
    // if the supplier is creating their own order.
    // However, if an admin or another role is creating an order *on behalf* of a supplier,
    // then supplierId would come from req.body.
    // For this context, assuming the authenticated user (supplier) is creating the order.
    const { vendorId, items, paymentMethod } = req.body;
    const supplierId = req.user.id; // Get supplierId from authenticated user

    if (!vendorId || !items || items.length === 0 || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required order details." });
    }

    let totalPrice = 0;
    const orderItems = [];

    // Calculate total and validate products
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product with ID ${item.productId} not found` });
      }

      if (product.availableQuantity < item.quantityRequired) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}. Available: ${product.availableQuantity}, Required: ${item.quantityRequired}` });
      }

      // Add item details to orderItems array
      orderItems.push({
        productId: product._id,
        quantityRequired: item.quantityRequired,
        priceAtPurchase: product.pricePerUnit,
      });
      
      totalPrice += item.quantityRequired * product.pricePerUnit;

      // Decrease stock
      product.availableQuantity -= item.quantityRequired;
      await product.save();
    }

    const newOrder = new Order({
      supplierId,
      vendorId,
      items: orderItems, // Use the validated and enriched orderItems
      totalPrice,
      paymentMethod,
      // Default status would be 'pending' or similar based on your schema
    });

    await newOrder.save();

    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Get all orders (generic, might be used by an admin or for internal purposes)
// This function is less specific than getMyOrders or getVendorOrders
export const getOrders = async (req, res) => {
  try {
    const { vendorId, supplierId } = req.query; // Allow filtering by query params

    const query = {};
    if (vendorId) query.vendorId = vendorId;
    if (supplierId) query.supplierId = supplierId;

    const orders = await Order.find(query)
      .populate("supplierId", "name email")
      .populate("vendorId", "name email")
      .populate("items.productId", "name image pricePerUnit"); // Populate product details for each item

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// 📄 Supplier: View own orders
export const getMyOrders = async (req, res) => {
  try {
    // Assuming req.user.id is set by the protect middleware
    const supplierId = req.user.id; 

    if (!supplierId) {
      return res.status(401).json({ success: false, message: "Not authorized to view orders." });
    }

    const orders = await Order.find({ supplierId })
      .populate("vendorId", "name email")
      .populate("items.productId", "name image pricePerUnit");

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.error("Get My Orders Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// 📄 Vendor: View orders from suppliers directed to them
export const getVendorOrders = async (req, res) => {
  try {
    // Assuming req.user.id is set by the protect middleware
    const vendorId = req.user.id; 

    if (!vendorId) {
      return res.status(401).json({ success: false, message: "Not authorized to view vendor orders." });
    }

    const orders = await Order.find({ vendorId })
      .populate("supplierId", "name email")
      .populate("items.productId", "name image pricePerUnit");

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.error("Get Vendor Orders Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Update order status (vendor action)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // Corrected to orderId
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(orderId); // Find by orderId
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Optional: Add authorization check here to ensure the vendor trying to update
    // is actually the vendor associated with this order.
    if (req.user.id !== order.vendorId.toString()) {
        return res.status(403).json({ success: false, message: "Not authorized to update this order." });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Delete an order (Note: No route for this in your provided router yet)
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params; // Assuming route would use :orderId

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};