// src/pages/Home.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // or "/profile"
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <motion.div
        className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-blue-600 mb-3">
          Welcome to Our App 🚀
        </h1>
        <p className="text-gray-600 mb-6">
          Get started by logging in or creating a new account.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow transition duration-300"
          >
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
