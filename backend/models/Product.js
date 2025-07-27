import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    image: [
      {
        type: String,
        required: false,
      },
    ],
    category: {
      type: String,
      required: true,
      trim: true,
    },
    isOutOfStock: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        type: String, // URLs to product certificates, etc.
        required: false,
      },
    ],
  },
  { timestamps: true }
);

// Automatically update stock status based on quantity
productSchema.pre("save", function (next) {
  this.isOutOfStock = this.availableQuantity <= 0;
  next();
});

export const Product = mongoose.model("Product", productSchema);
