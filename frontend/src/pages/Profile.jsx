// src/pages/Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <div className="text-center mt-10">User not found</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <FaUserCircle className="text-6xl text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h2>
        <p className="text-gray-500 mb-6">Welcome back, {user.name} 👋</p>

        <div className="text-left space-y-3">
          <p>
            <span className="font-semibold text-gray-700">Name:</span>{" "}
            {user.name}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Phone:</span>{" "}
            {user.phone}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Address:</span>{" "}
            {user.address || "Not provided"}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Role:</span>{" "}
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
              {user.role}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
