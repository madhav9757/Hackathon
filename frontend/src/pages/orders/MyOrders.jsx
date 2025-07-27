// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../api/orderAxios";
import { useAuth } from "../../context/AuthContext"; // Assuming you have an AuthContext

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error messages
  const { user, loading: userLoading } = useAuth(); // Get user and userLoading from AuthContext

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (userLoading) {
        setLoading(true); // Still loading while auth context is determining user
        return;
      }

      if (!user) {
        setLoading(false); // Stop loading if auth context determined no user
        setError("You need to be logged in to view your orders.");
        return;
      }

      setLoading(true);
      setError(null); // Clear any previous errors

      try {
        const res = await getAllOrders();
        const allFetchedOrders = res.orders || [];

        let userSpecificOrders = [];

        // Filter orders based on the logged-in user's role and ID
        if (user.role === "customer") {
          // If the user is a customer, look for orders where customerId matches user._id
          // Assuming order object has a 'customerId' field for customers.
          userSpecificOrders = allFetchedOrders.filter(
            (order) => order.customerId === user._id
          );
        } else if (user.role === "vendor") {
          // If the user is a vendor, look for orders where vendorId._id matches user._id
          // Assuming order object has a 'vendorId' object with an '_id' for vendors.
          userSpecificOrders = allFetchedOrders.filter(
            (order) => order.vendorId && order.vendorId._id === user._id
          );
        } else {
            // Handle other roles if necessary, or show no orders
            setError("Your role does not have associated orders to display.");
            setLoading(false);
            return;
        }

        setOrders(userSpecificOrders);

        if (userSpecificOrders.length === 0) {
          setError("No orders found for your account.");
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        const errorMessage = err.response?.data?.message || "Failed to load your orders. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user, userLoading]);

  let content;
  if (userLoading) {
    content = <p>Checking login status...</p>;
  } else if (error) {
    content = (
      <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
        {error}
      </div>
    );
  } else if (loading) {
    content = <p>Loading your orders...</p>;
  } else if (orders.length === 0) {
    // This message is already set by setError above if no orders are found
    // but keeping it here for clarity if error state isn't used for this.
    content = <p>No orders found for your account.</p>;
  } else {
    content = (
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 p-4 rounded shadow-sm"
          >
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Order Placed By:</strong> {order.customerId?.name || order.vendorId?.name || "Unknown User"}</p>
            
            {order.supplierId && ( // Display the product's supplier (the seller)
                <p><strong>Seller (Supplier):</strong> {order.supplierId.name}</p>
            )}

            {order.items && order.items.length > 0 ? (
                <div>
                    <h4 className="font-semibold mt-2">Items:</h4>
                    <ul className="list-disc pl-5">
                        {order.items.map((item, idx) => (
                            <li key={item.productId?._id || idx}>
                                {item.productId?.name || "Unknown Product"} - Qty: {item.quantityRequired} (Price: ₹{item.priceAtPurchase})
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                // Fallback display if 'items' array is not populated or not standard
                <>
                    <p><strong>Product:</strong> {order.productId?.name || order.productId || "N/A"}</p>
                    <p><strong>Quantity:</strong> {order.quantity || "N/A"}</p>
                </>
            )}
            
            <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
            <p><strong>Status:</strong> <span className="font-semibold capitalize">{order.status}</span></p>
            <p><strong>Payment Method:</strong> <span className="capitalize">{order.paymentMethod || "N/A"}</span></p>
            <p><strong>Payment Status:</strong> <span className="capitalize">{order.paymentStatus || "N/A"}</span></p>
            <p><strong>Shipping Address:</strong> {order.shippingAddress || "Not specified"}</p>
            <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            {order.updatedAt && <p><strong>Last Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {content}
    </div>
  );
}