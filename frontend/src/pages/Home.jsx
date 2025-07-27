// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our App 🚀</h1>
      {user ? (
        <>
          <p className="mb-4 text-lg">Hello, <strong>{user.name}</strong>! 👋</p>
          <Link
            to="/profile"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Go to Dashboard
          </Link>
        </>
      ) : (
        <>
          <p className="mb-6">Please login or register to continue.</p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Register
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
