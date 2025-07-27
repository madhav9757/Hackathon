import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createProductRequest = async (req, res) => {
  try {
    const { name, pricePerUnit, availableQuantity, category, isOutOfStock } =
      req.body;
    const supplierId = req.user?._id;
    const isSupplier = req.user?.role === "supplier";

    if (!isSupplier) throw new ApiError(401, "Unauthorized");

    if (!supplierId) throw new ApiError(401, "Unauthorized");

    if (
      !name ||
      !pricePerUnit ||
      !availableQuantity ||
      !category ||
      isOutOfStock === undefined
    ) {
      throw new ApiError(400, "All fields are required");
    }

    if (
      !req.files ||
      !Array.isArray(req.files.image) ||
      req.files.image.length === 0
    ) {
      throw new ApiError(400, "At least one image is required");
    }

    const imageUploadPromises = req.files.image.map((file) =>
      uploadOnCloudinary(file.path)
    );
    const attachmentUploadPromises = Array.isArray(req.files.attachments)
      ? req.files.attachments.map((file) => uploadOnCloudinary(file.path))
      : [];

    const [uploadedImages, uploadedAttachments] = await Promise.all([
      Promise.all(imageUploadPromises),
      Promise.all(attachmentUploadPromises),
    ]);

    const imageURLs = uploadedImages
      .filter((file) => file && file.secure_url)
      .map((file) => file.secure_url);

    const attachmentURLs = uploadedAttachments
      .filter((file) => file && file.secure_url)
      .map((file) => file.secure_url);

    const product = await Product.create({
      supplierId,
      name,
      pricePerUnit,
      availableQuantity,
      image: imageURLs,
      category,
      isOutOfStock,
      attachments: attachmentURLs,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    console.error("Product creation error:", error);
    const status = error.statusCode || 500;
    res.status(status).json(new ApiError(status, "Server Error"));
  }
};


const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      deleteImageUrls = [],
      deleteAttachmentUrls = [],
      isOutOfStock,
      name,
      pricePerUnit,
      availableQuantity,
      category
    } = req.body;

    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    if (product.supplierId.toString() !== userId.toString()) {
      throw new ApiError(403, "Forbidden: Not your product");
    }

    // Filter images and attachments to delete
    const updatedImages = product.image.filter(
      (url) => !deleteImageUrls.includes(url)
    );
    const updatedAttachments = product.attachments.filter(
      (url) => !deleteAttachmentUrls.includes(url)
    );

    // New uploads (if any)
    const newImageUploads = req.files?.image || [];
    const newAttachmentUploads = req.files?.attachments || [];

    const MAX_IMAGES = 5;
    const MAX_ATTACHMENTS = 10;

    if (updatedImages.length + newImageUploads.length > MAX_IMAGES) {
      throw new ApiError(400, `Max ${MAX_IMAGES} images allowed`);
    }

    if (updatedAttachments.length + newAttachmentUploads.length > MAX_ATTACHMENTS) {
      throw new ApiError(400, `Max ${MAX_ATTACHMENTS} attachments allowed`);
    }

    // Upload new media
    const uploadedImageResults = await Promise.all(
      newImageUploads.map((file) => uploadOnCloudinary(file.path))
    );
    const newImageURLs = uploadedImageResults.map((f) => f.secure_url);

    const uploadedAttachmentResults = await Promise.all(
      newAttachmentUploads.map((file) => uploadOnCloudinary(file.path))
    );
    const newAttachmentURLs = uploadedAttachmentResults.map((f) => f.secure_url);

    // Assign new media arrays
    product.image = [...updatedImages, ...newImageURLs];
    product.attachments = [...updatedAttachments, ...newAttachmentURLs];

    // Dynamically update allowed fields
    if (typeof isOutOfStock === "boolean") {
      product.isOutOfStock = isOutOfStock;
    }
    if (name) product.name = name;
    if (pricePerUnit !== undefined) product.pricePerUnit = pricePerUnit;
    if (availableQuantity !== undefined) product.availableQuantity = availableQuantity;
    if (category) product.category = category;

    // Save updated product
    await product.save();

    res.status(200).json(
      new ApiResponse(200, product, "Product updated successfully")
    );
  } catch (error) {
    console.error("Product update error:", error);
    const status = error.statusCode || 500;
    res.status(status).json(
      new ApiError(status, error.message || "Server Error")
    );
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body; // or req.body if sent via body
    const userId = req.user._id;

    // Find product and ensure it belongs to the logged-in user
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    if (product.supplierId.toString() !== userId.toString()) {
      throw new ApiError(403, "Forbidden: Not your product");
    }

    // Delete the product
    await product.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (error) {
    console.error("Error deleting product:", error);
    const status = error.statusCode || 500;
    res.status(status).json(new ApiError(status, error.message));
  }
};

const getProducts = async (req, res) => {
  try {
    const supplierId = req.user._id; // Comes from auth middleware

    const products = await Product.find({ supplierId }).sort({ createdAt: -1 });

    res.status(200).json(
      new ApiResponse(200, products, "Your products fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching supplier's products:", error);
    res.status(500).json(new ApiError(500, "Failed to fetch products"));
  }
};


export { createProductRequest, updateProduct, deleteProduct, getProducts };
