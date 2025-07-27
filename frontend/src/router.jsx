import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Public
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Common Protected
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Admin Only
import AdminDashboard from "./pages/AdminDashboard";

// Supplier Only
import CreateProduct from "./pages/CreateProduct";
import ManageProducts from "./pages/supplier/ManageProducts";

// Vendor/Customer Only (Order)
import OrderPage from "./pages/orders/OrderPage";
import MyOrders from "./pages/orders/MyOrders";
import Products from "./pages/orders/Products";

// Fallback
import PageNotFound from "./pages/PageNotFound";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Only Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Shared Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "supplier", "vendor", "customer"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Supplier Only */}
      <Route element={<ProtectedRoute allowedRoles={["supplier"]} />}>
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/manage-products" element={<ManageProducts />} />  
      </Route>

      {/* Vendor or Customer Only (Order-related) */}
      <Route element={<ProtectedRoute allowedRoles={["vendor", "customer"]} />}>
        <Route path="/order" element={<OrderPage />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/products" element={<Products />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
