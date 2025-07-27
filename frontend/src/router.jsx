import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";

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

      {/* Protected Routes for Supplier */}
      <Route element={<ProtectedRoute allowedRoles={["supplier"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Protected Routes for Customer */}
      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Protected Routes for Vendor */}
      <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Common Protected Route for All Roles */}
      <Route
        element={<ProtectedRoute allowedRoles={["admin", "supplier", "customer", "vendor"]} />}
      >
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
