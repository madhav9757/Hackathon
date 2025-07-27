import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    address: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);

      if (form.role === "admin") {
        navigate("/admin");
      } else if (
        form.role === "supplier" ||
        form.role === "customer" ||
        form.role === "vendor"
      ) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-green-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <InputField type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <InputField type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <InputField type="text" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <InputField type="text" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
            className="w-full border rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Select your role</option>
            <option value="customer">Customer</option>
            <option value="supplier">Supplier</option>
            <option value="vendor">Vendor</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

// Reusable input field
const InputField = ({ type, placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required
    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
  />
);

export default Register;
