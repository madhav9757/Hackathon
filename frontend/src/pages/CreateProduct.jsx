import React, { useState, useEffect } from "react";
import { createProduct } from "../api/productAxios";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/authAxios";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    pricePerUnit: "",
    availableQuantity: "",
    category: "",
    image: [],
    attachments: [],
    supplierId: "",
  });

  // ✅ Get user profile on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
        setFormData((prev) => ({
          ...prev,
          supplierId: profile?._id || "",
        }));
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
    setFormData((prev) => ({ ...prev, [type]: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formData);
      alert("Product created!");
      navigate("/products");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to create product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Create New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Price per Unit</label>
            <input
              type="number"
              name="pricePerUnit"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Available Quantity</label>
            <input
              type="number"
              name="availableQuantity"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            name="category"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Images (Optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, "image")}
            className="block w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Attachments (Optional)</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, "attachments")}
            className="block w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition duration-300"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
