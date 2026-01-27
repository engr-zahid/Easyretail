// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import AdminLayout from "../layouts/AdminLayout";
// import AuthLayout from "../layouts/AuthLayout";
// import ProtectedRoute from "./ProtectedRoute";

// import Login from "../pages/auth/Login";
// import Signup from "../pages/auth/Signup";
// import Dashboard from "../pages/dashboard/Dashboard";

// // Inventory
// import ProductList from "../pages/products/ProductList";

// // Sales
// import OrderList from "../pages/orders/OrderList";
// import POSContainer from "../pages/POS/POSContainer";

// // Settings
// import Settings from "../pages/settings/Settings";

// // People
// import CustomerList from '../pages/customers/CustomerList';
// import AddEditCustomer from '../pages/customers/AddEditCustomer';
// import CustomerDetail from '../pages/customers/CustomerDetail';
// import SupplierList from '../pages/suppliers/SupplierList';
// import AddEditSupplier from '../pages/suppliers/AddEditSupplier';


// const Page = ({ title }) => <div className="p-6 text-xl font-semibold">{title}</div>;

// const AppRoutes = () => {
//   return (
//     <Routes>

//       {/* ================= AUTH ================= */}
//       <Route element={<AuthLayout />}>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Route>

//       {/* ================= ADMIN ================= */}
//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <AdminLayout />
//           </ProtectedRoute>
//         }
//       >
//         {/* Dashboard */}
//         <Route index element={<Dashboard />} />

//         {/* Inventory */}
//         <Route path="products" element={<ProductList />} />
//         <Route path="products/create" element={<Page title="Create Product" />} />
//         <Route path="products/expired" element={<Page title="Expired Products" />} />
//         <Route path="products/low-stock" element={<Page title="Low Stock Products" />} />
//         <Route path="categories" element={<Page title="Categories" />} />
//         <Route path="sub-categories" element={<Page title="Sub Categories" />} />
//         <Route path="brands" element={<Page title="Brands" />} />
//         <Route path="units" element={<Page title="Units" />} />
//         <Route path="variants" element={<Page title="Variants" />} />
//         <Route path="warranties" element={<Page title="Warranties" />} />
//         <Route path="print-barcode" element={<Page title="Print Barcode" />} />
//         <Route path="print-qr" element={<Page title="Print QR Code" />} />

//         {/* Stock */}
//         <Route path="stock" element={<Page title="Manage Stock" />} />
//         <Route path="stock-adjustment" element={<Page title="Stock Adjustment" />} />
//         <Route path="stock-transfer" element={<Page title="Stock Transfer" />} />

//         {/* Sales */}
//         <Route path="sales/invoices" element={<OrderList />} />
//         <Route path="sales/POSContainer" element={<POSContainer />} />
//         <Route path="sales/return" element={<Page title="Sales Return" />} />
//         <Route path="sales/quotation" element={<Page title="Quotation" />} />

//         {/* Purchases */}
//         <Route path="purchases" element={<Page title="Purchase List" />} />
//         <Route path="purchase-order" element={<Page title="Purchase Order" />} />
//         <Route path="purchase-return" element={<Page title="Purchase Return" />} />

//         {/* Promotions */}
//         <Route path="coupons" element={<Page title="Coupons" />} />
//         <Route path="gift-cards" element={<Page title="Gift Cards" />} />
//         <Route path="discounts" element={<Page title="Discounts" />} />

//         {/* People */}
//         <Route path="customers" element={<CustomerList />} />
//         <Route path="customers/add" element={<AddEditCustomer />} />
//         <Route path="customers/edit/:id" element={<AddEditCustomer />} />
//         <Route path="suppliers" element={<SupplierList />} />
//         <Route path="suppliers/add" element={<AddEditSupplier />} />
//         <Route path="suppliers/edit/:id" element={<AddEditSupplier />} />
//         <Route path="stores" element={<Page title="Store Owners" />} />

//         {/* Reports */}
//         <Route path="reports/sales" element={<Page title="Sales Report" />} />
//         <Route path="reports/purchase" element={<Page title="Purchase Report" />} />
//         <Route path="reports/inventory" element={<Page title="Inventory Report" />} />

//         {/* Settings */}
//         <Route path="settings/general" element={<Settings />} />
//         <Route path="settings/system" element={<Page title="System Settings" />} />
//         <Route path="settings/payment" element={<Page title="Payment Settings" />} />
//         <Route path="settings/currency" element={<Page title="Currency Settings" />} />
//       </Route>

      

//       {/* ================= FALLBACK ================= */}
//       <Route path="*" element={<Navigate to="/" replace />} />

//     </Routes>
//   );
// };

// export default AppRoutes;        <Route path="reports/profit-loss" element={<Page title="Profit & Loss" />} />

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";

// Inventory
import ProductList from "../pages/products/ProductList";

// Sales
import OrderList from "../pages/orders/OrderList";
import POSContainer from "../pages/POS/POSContainer";

// Settings
import Settings from "../pages/settings/Settings";

// People
import CustomerList from '../pages/customers/CustomerList';
import AddEditCustomer from '../pages/customers/AddEditCustomer';
import CustomerDetail from '../pages/customers/CustomerDetail';
import SupplierList from '../pages/suppliers/SupplierList';
import AddEditSupplier from '../pages/suppliers/AddEditSupplier';
import SupplierDetail from '../pages/suppliers/SupplierDetail';

const Page = ({ title }) => <div className="p-6 text-xl font-semibold">{title}</div>;

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Inventory */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/create" element={<Page title="Create Product" />} />
        <Route path="products/expired" element={<Page title="Expired Products" />} />
        <Route path="products/low-stock" element={<Page title="Low Stock Products" />} />
        <Route path="categories" element={<Page title="Categories" />} />
        <Route path="sub-categories" element={<Page title="Sub Categories" />} />
        <Route path="brands" element={<Page title="Brands" />} />
        <Route path="units" element={<Page title="Units" />} />
        <Route path="variants" element={<Page title="Variants" />} />
        <Route path="warranties" element={<Page title="Warranties" />} />
        <Route path="print-barcode" element={<Page title="Print Barcode" />} />
        <Route path="print-qr" element={<Page title="Print QR Code" />} />

        {/* Stock */}
        <Route path="stock" element={<Page title="Manage Stock" />} />
        <Route path="stock-adjustment" element={<Page title="Stock Adjustment" />} />
        <Route path="stock-transfer" element={<Page title="Stock Transfer" />} />

        {/* Sales */}
        <Route path="sales/invoices" element={<OrderList />} />
        <Route path="sales/POSContainer" element={<POSContainer />} />
        <Route path="sales/return" element={<Page title="Sales Return" />} />
        <Route path="sales/quotation" element={<Page title="Quotation" />} />

        {/* Purchases */}
        <Route path="purchases" element={<Page title="Purchase List" />} />
        <Route path="purchase-order" element={<Page title="Purchase Order" />} />
        <Route path="purchase-return" element={<Page title="Purchase Return" />} />

        {/* Promotions */}
        <Route path="coupons" element={<Page title="Coupons" />} />
        <Route path="gift-cards" element={<Page title="Gift Cards" />} />
        <Route path="discounts" element={<Page title="Discounts" />} />

        {/* People */}
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/add" element={<AddEditCustomer />} />
<Route path="customers/edit/:id" element={<AddEditCustomer />} />
<Route path="customers/:id" element={<CustomerDetail />} />

<Route path="suppliers" element={<SupplierList />} />
<Route path="suppliers/add" element={<AddEditSupplier />} />
<Route path="suppliers/edit/:id" element={<AddEditSupplier />} />
<Route path="suppliers/:id" element={<SupplierDetail />} />

        <Route path="stores" element={<Page title="Store Owners" />} />

        {/* Reports */}
        <Route path="reports/sales" element={<Page title="Sales Report" />} />
        <Route path="reports/purchase" element={<Page title="Purchase Report" />} />
        <Route path="reports/inventory" element={<Page title="Inventory Report" />} />
        <Route path="reports/profit-loss" element={<Page title="Profit & Loss" />} />

        {/* Settings */}
        <Route path="settings/general" element={<Settings />} />
        <Route path="settings/system" element={<Page title="System Settings" />} />
        <Route path="settings/payment" element={<Page title="Payment Settings" />} />
        <Route path="settings/currency" element={<Page title="Currency Settings" />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;