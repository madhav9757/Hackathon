import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import CreateProduct from "./pages/CreateProduct";
import ManageProducts from "./pages/supplier/ManageProducts";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes for Admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Shared Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "supplier", "vendor", "customer"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Protected Routes for Supplier Only */}
      <Route element={<ProtectedRoute allowedRoles={["supplier"]} />}>
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/manage-products" element={<ManageProducts />} /> {/* ✅ Added */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
