import { Product } from "../models/Product.js";

// @desc Create a new product
export const createProduct = async (req, res) => {
  try {
    const {
      supplierId,
      name,
      pricePerUnit,
      availableQuantity,
      image,
      category,
      attachments,
    } = req.body;

    const newProduct = new Product({
      supplierId,
      name,
      pricePerUnit,
      availableQuantity,
      image,
      category,
      attachments,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create product", error: err.message });
  }
};

// @desc Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("supplierId", "name email");
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products", error: err.message });
  }
};

// @desc Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("supplierId", "name email");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch product", error: err.message });
  }
};

// @desc Update a product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update product", error: err.message });
  }
};

// @desc Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete product", error: err.message });
  }
};
