// src/pages/OrderPage.jsx
import React, { useState } from "react";
import { createOrder } from "../../api/orderAxios";
import { useNavigate } from "react-router-dom";

export default function OrderPage() {
  const [orderDetails, setOrderDetails] = useState({
    productId: "",
    quantity: 1,
    shippingAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await createOrder(orderDetails);
      setMessage("Order placed successfully!");
      setOrderDetails({ productId: "", quantity: 1, shippingAddress: "" });
      navigate("/my-orders");
    } catch (err) {
      setMessage(err.response?.data?.message || "Order creation failed.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Place Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="productId"
          type="text"
          value={orderDetails.productId}
          onChange={handleChange}
          placeholder="Product ID"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          name="quantity"
          type="number"
          value={orderDetails.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          min={1}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <textarea
          name="shippingAddress"
          value={orderDetails.shippingAddress}
          onChange={handleChange}
          placeholder="Shipping Address"
          className="w-full border border-gray-300 p-2 rounded"
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Placing..." : "Place Order"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </div>
  );
}
