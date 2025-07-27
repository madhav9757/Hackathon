import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;

  const roleDashboard = () => {
    switch (user?.role) {
      case "admin":
        return "/admin-dashboard";
      case "vendor":
        return "/vendor-dashboard";
      case "delivery":
        return "/delivery-dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <nav className="bg-gray-950 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold tracking-wide hover:text-blue-400 transition">
          MyApp 🚀
        </Link>

        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6 items-center">
          {!loading && user && (
            <>
              <Link
                to={roleDashboard()}
                className={`hover:text-blue-400 transition ${
                  isActive(roleDashboard()) ? "text-blue-400 underline" : ""
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`hover:text-blue-400 transition ${
                  isActive("/profile") ? "text-blue-400 underline" : ""
                }`}
              >
                Profile
              </Link>
              <span className="text-sm text-gray-400 italic">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          )}

          {!loading && !user && (
            <>
              <Link to="/login" className="hover:text-blue-400 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-400 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-4 space-y-2 bg-gray-900 text-sm">
          {!loading && user && (
            <>
              <Link
                to={roleDashboard()}
                onClick={() => setMenuOpen(false)}
                className={`block py-1 ${
                  isActive(roleDashboard()) ? "text-blue-400 underline" : "hover:text-blue-400"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className={`block py-1 ${
                  isActive("/profile") ? "text-blue-400 underline" : "hover:text-blue-400"
                }`}
              >
                Profile
              </Link>
              <span className="block py-1 text-gray-400">
                {user.name} ({user.role})
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-600 hover:bg-red-700 w-full py-1 rounded text-white"
              >
                Logout
              </button>
            </>
          )}

          {!loading && !user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-blue-400">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-blue-400">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
