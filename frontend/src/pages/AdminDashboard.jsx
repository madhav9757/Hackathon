// src/pages/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">👑 Admin Dashboard</h1>
      <p className="text-lg mb-2">
        Welcome, Admin! You have full access to the system.
      </p>

      <div className="mt-4">
        <ul className="list-disc list-inside">
          <li>🛠 Manage users</li>
          <li>📊 View reports</li>
          <li>📝 Edit system settings</li>
          <li>🚀 Deploy new features</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
