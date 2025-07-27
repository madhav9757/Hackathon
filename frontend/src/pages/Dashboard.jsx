import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaClipboardList, FaUsers, FaBell, FaChartBar } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();

  const actions = [
    {
      title: "View Orders",
      icon: <FaClipboardList size={24} />,
      bg: "bg-blue-100",
      path: "/orders",
    },
    {
      title: "Manage Users",
      icon: <FaUsers size={24} />,
      bg: "bg-green-100",
      path: "/users",
    },
    {
      title: "Notifications",
      icon: <FaBell size={24} />,
      bg: "bg-yellow-100",
      path: "/notifications",
    },
    {
      title: "Analytics",
      icon: <FaChartBar size={24} />,
      bg: "bg-purple-100",
      path: "/analytics",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome back, {user.name} 👋</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-6 cursor-pointer shadow-md hover:shadow-lg transition ${item.bg}`}
            onClick={() => window.location.href = item.path}
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

      {/* Optional: Add recent activity, graphs, or role-specific tips below */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Quick Tips</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Use the navigation above to manage your responsibilities.</li>
          <li>Check your notifications regularly.</li>
          <li>Visit the Analytics tab to monitor performance.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
