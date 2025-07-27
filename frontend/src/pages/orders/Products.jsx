import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../api/productAxios";
import { createOrder } from "../../api/orderAxios";
import { useAuth } from "../../context/AuthContext"; // Assuming you have auth context

function Products() {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({}); // Stores quantity for each product by its _id
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // New loading state
  const { user } = useAuth(); // get logged in user

  // Function to show and then clear messages
  const displayMessage = (msg, type = "info") => {
    setMessage(msg);
    // You can add different styling based on 'type' if you want
    setTimeout(() => setMessage(""), 5000); // Message disappears after 5 seconds
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const res = await getAllProducts();
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        displayMessage("Failed to load products. Please try again later.", "error");
      } finally {
        setLoading(false); // Set loading to false when fetching ends (success or error)
      }
    };
    fetchProducts();
  }, []);

  const handleOrder = async (product) => {
    if (!user) {
      displayMessage("You must be logged in to place an order.", "error");
      return;
    }
    // Assuming 'customer' and 'vendor' are the roles allowed to order
    if (!["customer", "vendor"].includes(user.role)) {
      displayMessage("Only customers or vendors can place orders.", "error");
      return;
    }

    const qty = parseInt(quantity[product._id], 10); // Ensure quantity is an integer
    if (isNaN(qty) || qty < 1 || qty > product.availableQuantity) {
      displayMessage(
        `Please enter a valid quantity between 1 and ${product.availableQuantity}.`,
        "error"
      );
      return;
    }

    let finalVendorId;

    // If the current user is a vendor, they are the vendor for this order
    if (user.role === "vendor") {
      finalVendorId = user._id;
    } else {
      // If the current user is a customer (or other non-vendor role),
      // the vendor is the product's supplier
      if (!product.supplierId || !product.supplierId._id) {
        displayMessage("Vendor information missing for this product.", "error");
        return;
      }
      finalVendorId = product.supplierId._id;
    }

    try {
      const orderData = {
        vendorId: finalVendorId, // Dynamically set based on user role
        items: [
          {
            productId: product._id,
            quantityRequired: qty,
          },
        ],
        paymentMethod: "cash", // This could come from user input (e.g., a dropdown)
                               // For simplicity, hardcoded to 'cash' here.
      };

      const res = await createOrder(orderData);
      displayMessage("Order placed successfully!", "success");

      // Update product quantity in local state immediately
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === product._id
            ? { ...p, availableQuantity: p.availableQuantity - qty }
            : p
        )
      );

      // Clear the quantity input for the specific product after successful order
      setQuantity((prevQty) => {
        const newQty = { ...prevQty };
        delete newQty[product._id];
        return newQty;
      });

    } catch (error) {
      console.error("Failed to place order:", error);
      // More specific error message if available from the backend response
      const errorMessage = error.response?.data?.message || "Failed to place order. Please try again.";
      displayMessage(errorMessage, "error");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Available Products</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes("success") ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-lg text-gray-600">No products available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col"
            >
              <div className="mb-2 flex-grow">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 capitalize">Category: {product.category}</p>
                {product.supplierId && product.supplierId.name && ( // Ensure supplierId.name exists
                  <p className="text-sm text-gray-600">Vendor: {product.supplierId.name}</p>
                )}
              </div>

              <p className="text-lg font-medium text-green-700">
                ₹{product.pricePerUnit} / unit
              </p>
              <p className="text-sm text-gray-700">
                In stock: {product.availableQuantity}
              </p>

              {product.availableQuantity > 0 ? ( // Use availableQuantity for stock check
                <>
                  <div className="mt-3">
                    <input
                      type="number"
                      min="1"
                      max={product.availableQuantity}
                      placeholder="Quantity"
                      className="w-full border rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={quantity[product._id] || ""}
                      onChange={(e) =>
                        setQuantity({ ...quantity, [product._id]: e.target.value })
                      }
                    />
                  </div>
                  <button
                    onClick={() => handleOrder(product)}
                    className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!user || !["customer", "vendor"].includes(user.role)} // Disable if not authorized role
                  >
                    Order Now
                  </button>
                </>
              ) : (
                <p className="text-red-500 mt-2 font-medium">Out of Stock</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
