import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashbaord/Dashboard'
import ProductList from '../pages/products/ProductList';
import OrderList from '../pages/orders/OrderList';
import Settings from '../pages/settings/Settings'; // ✅ Imported here

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/customers" element={<div className="p-6">Customers Page</div>} />
        <Route path="/categories" element={<div className="p-6">Categories Page</div>} />
        <Route path="/users" element={<div className="p-6">Users Page</div>} />
        <Route path="/settings" element={<Settings />} /> {/* ✅ Changed this line! */}
        <Route path="/profile" element={<div className="p-6">Profile Page</div>} />
      </Route>

      {/* Redirects */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;