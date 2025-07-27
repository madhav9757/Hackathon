import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../api/productAxios";
import { useNavigate } from "react-router-dom";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProductById(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Products</h1>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-red-500 text-lg">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200"
              >
                {product.image?.[0] ? (
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}

                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                  <p className="text-sm text-gray-600 capitalize">
                    Category: {product.category}
                  </p>
                  <p className="text-sm text-gray-700">
                    Price: ₹{product.pricePerUnit} per unit
                  </p>
                  <p className="text-sm text-gray-700">
                    Available: {product.availableQuantity}
                  </p>
                  <p className={`text-sm font-medium ${product.isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                    {product.isOutOfStock ? "Out of Stock" : "In Stock"}
                  </p>

                  {product.supplierId?.name && (
                    <p className="text-xs text-gray-500">
                      Supplier: {product.supplierId.name}
                    </p>
                  )}

                  {product.attachments?.length > 0 && (
                    <a
                      href={product.attachments[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Attachment
                    </a>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => navigate(`/supplier/edit-product/${product._id}`)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
