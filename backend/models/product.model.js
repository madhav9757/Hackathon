import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  image: [{
    type: String,
    required: true,
  }],
  category: {
    type: String,
    required: true,
  },
  isOutOfStock: {
    type: Boolean,
    required: true,
  },
  attachments: [{
    type: String,
  }],
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
