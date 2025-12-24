import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserCog,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  X,
  BarChart3,
  Archive,
  Truck,
  Percent,
  Boxes,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isMobileOpen, onClose }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const { logout } = useAuth();

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    {
      section: 'MAIN',
      items: [
        {
          icon: LayoutDashboard,
          label: 'Dashboard',
          children: [
            { label: 'Admin Dashboard', path: '/dashboard' },
            // { label: 'Sales Dashboard', path: '/dashboard-sales' },
          ],
        },
      ],
    },
    {
      section: 'INVENTORY',
      items: [
        {
          icon: Package,
          label: 'Inventory',
          children: [
            { label: 'Products', path: '/products' },
            { label: 'Create Product', path: '/products/create' },
            { label: 'Expired Products', path: '/products/expired' },
            { label: 'Low Stock', path: '/products/low-stock' },
            { label: 'Categories', path: '/categories' },
            { label: 'Sub Categories', path: '/sub-categories' },
            { label: 'Brands', path: '/brands' },
            { label: 'Units', path: '/units' },
            { label: 'Variants', path: '/variants' },
            { label: 'Warranties', path: '/warranties' },
            { label: 'Print Barcode', path: '/print-barcode' },
            { label: 'Print QR Code', path: '/print-qr' },
          ],
        },
      ],
    },
    {
      section: 'STOCK',
      items: [
        {
          icon: Boxes,
          label: 'Stock',
          children: [
            { label: 'Manage Stock', path: '/stock' },
            { label: 'Stock Adjustment', path: '/stock-adjustment' },
            { label: 'Stock Transfer', path: '/stock-transfer' },
          ],
        },
      ],
    },
    {
      section: 'SALES',
      items: [
        {
          icon: ShoppingCart,
          label: 'Sales',
          children: [
            { label: 'Invoices', path: '/sales/invoices' },
            { label: 'POS', path: '/sales/pos' },
            { label: 'Sales Return', path: '/sales/return' },
            { label: 'Quotation', path: '/sales/quotation' },
          ],
        },
      ],
    },
    {
      section: 'PURCHASE',
      items: [
        {
          icon: Truck,
          label: 'Purchases',
          children: [
            { label: 'Purchase List', path: '/purchases' },
            { label: 'Purchase Order', path: '/purchase-order' },
            { label: 'Purchase Return', path: '/purchase-return' },
          ],
        },
      ],
    },
    {
      section: 'PROMO',
      items: [
        {
          icon: Percent,
          label: 'Promotions',
          children: [
            { label: 'Coupons', path: '/coupons' },
            { label: 'Gift Cards', path: '/gift-cards' },
            { label: 'Discounts', path: '/discounts' },
          ],
        },
      ],
    },
    {
      section: 'PEOPLE',
      items: [
        { icon: Users, label: 'Customers', path: '/customers' },
        { icon: UserCog, label: 'Suppliers', path: '/suppliers' },
        { icon: Archive, label: 'Store Owners', path: '/stores' },
      ],
    },
    {
      section: 'REPORTS',
      items: [
        {
          icon: BarChart3,
          label: 'Reports',
          children: [
            { label: 'Sales Report', path: '/reports/sales' },
            { label: 'Purchase Report', path: '/reports/purchase' },
            { label: 'Inventory Report', path: '/reports/inventory' },
            { label: 'Profit & Loss', path: '/reports/profit-loss' },
          ],
        },
      ],
    },
    {
      section: 'SETTINGS',
      items: [
        { icon: Settings, label: 'General Settings', path: '/settings/general' },
        { icon: Settings, label: 'System Settings', path: '/settings/system' },
        { icon: Settings, label: 'Payment Settings', path: '/settings/payment' },
        { icon: Settings, label: 'Currency Settings', path: '/settings/currency' },
      ],
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && isMobile && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#f9fafb] text-[#1f2937] shadow-lg z-50 flex flex-col
        transform transition-transform duration-300 ease-in-out border-r border-[#e5e7eb]
        ${isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#fef3c7]">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[#fbbf24]" />
            <span className="font-bold text-lg text-[#1f2937]">ShopSphere</span>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#fef3c7] rounded"
            >
              <X className="text-[#1f2937] w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-6 overflow-y-auto sidebar-scroll">
          {menuItems.map((section) => (
            <div key={section.section}>
              <p className="text-xs text-[#6b7280] uppercase mb-2 px-2">
                {section.section}
              </p>

              {section.items.map((item) => {
                const Icon = item.icon;

                if (item.children) {
                  const isOpen = openMenus[item.label];

                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#fef3c7] transition"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-[#6b7280]" />
                          <span className="text-[#1f2937]">{item.label}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-[#9ca3af] transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="ml-9 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              onClick={isMobile ? onClose : undefined}
                              className={({ isActive }) =>
                                `block px-3 py-1.5 rounded-md text-sm ${
                                  isActive
                                    ? 'bg-[#fbbf24] text-white'
                                    : 'text-[#6b7280] hover:text-[#1f2937] hover:bg-[#fef3c7]'
                                }`
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={isMobile ? onClose : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        isActive
                          ? 'bg-[#fbbf24] text-white'
                          : 'hover:bg-[#fef3c7] text-[#1f2937]'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 text-[#6b7280]" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#e5e7eb]">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-red-400 hover:text-red-300"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
