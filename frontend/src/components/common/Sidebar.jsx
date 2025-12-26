import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserCog,
  Settings,
  BarChart3,
  Boxes,
  Truck,
  Percent,
  FileText,
  Bell,
  CreditCard,
  Home,
  Database,
  Layers,
  Calculator,
  Tag,
  AlertTriangle,
  Grid,
  Mail,
  Phone,
  Calendar,
  FileBarChart,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';

const Sidebar = ({ collapsed = false, isMobileOpen = false, onClose }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);

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

  // Menu items matching your AppRoutes structure
  const menuItems = [
    {
      section: 'MAIN',
      items: [
        {
          icon: LayoutDashboard,
          label: 'Dashboard',
          path: '/',
          exact: true
        },
      ],
    },
    {
      section: 'INVENTORY',
      items: [
        {
          icon: Package,
          label: 'Products',
          children: [
            { label: 'All Products', path: '/products' },
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
            { label: 'POS', path: '/sales/POSContainer' },
            { label: 'Sales Return', path: '/sales/return' },
            { label: 'Quotation', path: '/sales/quotation' },
          ],
        },
      ],
    },
    {
      section: 'PURCHASES',
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
      section: 'PROMOTIONS',
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
        { icon: Home, label: 'Store Owners', path: '/stores' },
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

  // Quick access for collapsed state
  const quickAccessItems = [
    { icon: Calculator, label: 'Calculator', path: '/tools/calculator' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: Grid, label: 'Apps', path: '/apps' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && isMobile && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col
          transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          shadow-lg
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className={`
          flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700
          ${collapsed ? 'px-2' : 'px-4'}
        `}>
          {collapsed ? (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DP</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">DP</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">Easy Retail</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Inventory Management</p>
              </div>
            </div>
          )}
          
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>

        {/* Quick Access (Visible when collapsed) */}
        {collapsed && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {quickAccessItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    title={item.label}
                    className={({ isActive }) => `
                      flex items-center justify-center p-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-6">
            {menuItems.map((section) => (
              <div key={section.section}>
                {/* Section Header (hidden when collapsed) */}
                {!collapsed && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2 px-2">
                    {section.section}
                  </p>
                )}
                
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    
                    if (item.children) {
                      const isOpen = openMenus[item.label];
                      
                      return (
                        <div key={item.label}>
                          {collapsed ? (
                            <div className="relative group">
                              <button
                                title={item.label}
                                onClick={() => toggleMenu(item.label)}
                                className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 dark:text-gray-400 
                                         hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                <Icon className="h-5 w-5" />
                              </button>
                              {/* Tooltip for collapsed state */}
                              <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg 
                                            opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                {item.label}
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => toggleMenu(item.label)}
                                className="w-full flex items-center justify-between p-2 rounded-lg text-gray-700 dark:text-gray-300 
                                         hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Icon className="h-5 w-5" />
                                  <span>{item.label}</span>
                                </div>
                                <ChevronDown 
                                  className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                />
                              </button>
                              
                              {isOpen && (
                                <div className="ml-8 mt-1 space-y-1">
                                  {item.children.map((child) => (
                                    <NavLink
                                      key={child.path}
                                      to={child.path}
                                      onClick={isMobile ? onClose : undefined}
                                      className={({ isActive }) => `
                                        block px-3 py-2 text-sm rounded-lg transition-colors
                                        ${isActive 
                                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
                                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }
                                      `}
                                    >
                                      {child.label}
                                    </NavLink>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div key={item.path || item.label}>
                        {collapsed ? (
                          <div className="relative group">
                            <NavLink
                              to={item.path}
                              end={item.exact}
                              title={item.label}
                              onClick={isMobile ? onClose : undefined}
                              className={({ isActive }) => `
                                flex items-center justify-center p-2 rounded-lg transition-colors
                                ${isActive 
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                              `}
                            >
                              <Icon className="h-5 w-5" />
                            </NavLink>
                            {/* Tooltip for collapsed state */}
                            <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg 
                                          opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                              {item.label}
                              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                            </div>
                          </div>
                        ) : (
                          <NavLink
                            to={item.path}
                            end={item.exact}
                            onClick={isMobile ? onClose : undefined}
                            className={({ isActive }) => `
                              flex items-center gap-3 p-2 rounded-lg transition-colors
                              ${isActive 
                                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }
                            `}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </NavLink>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile Footer (Visible when not collapsed) */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JS</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">John Smilga</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Super Admin</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapse Toggle (Desktop only) */}
        {!isMobile && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 dark:text-gray-400 
                       hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              <ChevronRight 
                className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;