import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaClipboardList,
  FaUsers,
  FaBell,
  FaChartBar,
  FaBoxOpen,
  FaStore,
  FaUserTie,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();

  const roleActions = {
    customer: [
      {
        title: "My Orders",
        icon: <FaClipboardList size={24} />,
        bg: "bg-blue-100",
        path: "/my-orders", // for customers
      },
      {
        title: "Notifications",
        icon: <FaBell size={24} />,
        bg: "bg-yellow-100",
        path: "/notifications",
      },
      {
        title: "Browse Products",
        icon: <FaBoxOpen size={24} />,
        bg: "bg-purple-100",
        path: "/products",
      },
    ],
    supplier: [
      {
        title: "Manage Orders",
        icon: <FaClipboardList size={24} />,
        bg: "bg-green-100",
        path: "/orders", // supplier view (OrderPage)
      },
      {
        title: "Manage Products",
        icon: <FaBoxOpen size={24} />,
        bg: "bg-blue-100",
        path: "/manage-products",
      },
      {
        title: "Analytics",
        icon: <FaChartBar size={24} />,
        bg: "bg-indigo-100",
        path: "/analytics",
      },
    ],
    vendor: [
      {
        title: "My Orders",
        icon: <FaStore size={24} />,
        bg: "bg-pink-100",
        path: "my-orders", // vendor view (MyOrders)
      },
      {
        title: "Browse Products",
        icon: <FaUsers size={24} />,
        bg: "bg-teal-100",
        path: "/products",
      },
      {
        title: "Reports",
        icon: <FaChartBar size={24} />,
        bg: "bg-orange-100",
        path: "/vendor/reports",
      },
    ],
  };

  const actions = roleActions[user.role?.toLowerCase()] || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {user.role} Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Welcome back, {user.name} 👋</p>
        {user.address && (
          <p className="text-gray-500 text-sm mt-1">Address: {user.address}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-6 cursor-pointer shadow-md hover:shadow-lg transition ${item.bg}`}
            onClick={() => (window.location.href = item.path)}
          >
            <div className="flex items-center gap-4">
              <div className="text-gray-800">{item.icon}</div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">{item.title}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Quick Tips</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Use the dashboard to manage your daily operations.</li>
          <li>Check your notifications regularly.</li>
          <li>Role-specific tools are available above.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
