import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  UserCog,
  Settings,
  LogOut,
  ChevronLeft,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

const Sidebar = ({ onClose, isMobileOpen, collapsed, onToggleCollapse }) => {
  const [activeHover, setActiveHover] = useState(null);
  const [activeGlow, setActiveGlow] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);
  const location = useLocation();

  // Clean menu items
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/',
      notification: 3,
      gradient: 'from-blue-500/20 to-cyan-400/20',
      color: 'blue',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-400'
    },
    { 
      icon: ShoppingCart, 
      label: 'Orders', 
      path: '/orders',
      notification: 12,
      gradient: 'from-emerald-500/20 to-green-400/20',
      color: 'emerald',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-400',
      badge: 'Hot'
    },
    { 
      icon: Package, 
      label: 'Products', 
      path: '/products',
      gradient: 'from-purple-500/20 to-pink-400/20',
      color: 'purple',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-400',
      badge: 'New'
    },
    { 
      icon: Users, 
      label: 'Customers', 
      path: '/customers',
      gradient: 'from-amber-500/20 to-yellow-400/20',
      color: 'amber',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-400'
    },
    { 
      icon: Tag, 
      label: 'Categories', 
      path: '/categories',
      gradient: 'from-indigo-500/20 to-blue-400/20',
      color: 'indigo',
      iconColor: 'text-indigo-400',
      borderColor: 'border-indigo-400'
    },
    { 
      icon: UserCog, 
      label: 'Users', 
      path: '/users',
      gradient: 'from-violet-500/20 to-purple-400/20',
      color: 'violet',
      iconColor: 'text-violet-400',
      borderColor: 'border-violet-400'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings',
      gradient: 'from-slate-500/20 to-gray-400/20',
      color: 'slate',
      iconColor: 'text-slate-400',
      borderColor: 'border-slate-400'
    },
  ];

  useEffect(() => {
    // Add glow effect on page load
    setActiveGlow(true);
    const timer = setTimeout(() => setActiveGlow(false), 1500);
    return () => clearTimeout(timer);
  }, [location]);

  // Close sidebar on mobile when clicking a menu item
  const handleMenuItemClick = () => {
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  return (
    <>
      {/* Mobile Overlay with animation */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container with animations */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
          border-r border-gray-700/50
          shadow-xl
          overflow-y-auto
          ${collapsed ? 'overflow-x-hidden' : ''}
          /* Hide scrollbar */
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          /* Z-index: Sidebar should be ABOVE navbar */
          z-50
        `}
      >
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Sidebar Content */}
        <div className="relative flex flex-col h-full z-10">
          
          {/* Logo Section with Mobile Close Button */}
          <div className={`p-3 sm:p-4 lg:p-6 border-b border-gray-700/50 transition-all duration-300 ${activeGlow ? 'shadow-lg shadow-blue-500/10' : ''}`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'space-x-3'} transition-all`}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-green-400 rounded-full border-2 border-gray-900 shadow-sm"></div>
                </div>
                {!collapsed && (
                  <div className="overflow-hidden flex-1 min-w-0">
                    <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent truncate">
                      ShopSphere
                    </h1>
                    <p className="text-xs text-gray-400 mt-0.5 hidden sm:block truncate">Admin Panel</p>
                  </div>
                )}
              </div>
              
              {/* Mobile Close Button with animation */}
              <button
                onClick={onClose}
                className="lg:hidden flex items-center justify-center h-8 w-8 rounded-lg 
                  bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50
                  transition-all duration-300 transform hover:scale-110 flex-shrink-0"
              >
                <X className="h-4 w-4 text-gray-300" />
              </button>
              
              {/* Desktop Collapse Toggle with animation */}
              <button
                onClick={onToggleCollapse}
                className={`hidden lg:flex items-center justify-center h-8 w-8 rounded-lg 
                  bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50
                  transition-all duration-300 transform hover:scale-110 hover:border-blue-500/50
                  ${collapsed ? 'rotate-180' : ''} flex-shrink-0`}
              >
                <ChevronLeft className="h-4 w-4 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Navigation Menu with animations */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto 
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 ${collapsed ? 'text-center' : ''}`}>
              {!collapsed ? 'Main Menu' : '•••'}
            </div>
            
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleMenuItemClick}
                  onMouseEnter={() => setActiveHover(item.path)}
                  onMouseLeave={() => setActiveHover(null)}
                  className={`
                    group relative flex items-center rounded-xl transition-all duration-300
                    ${collapsed ? 'justify-center px-2 py-3' : 'px-3 sm:px-4 py-3'}
                    ${isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white ${item.borderColor} border-l-4` 
                      : 'hover:bg-gray-800/50 text-gray-300 hover:text-white border-l-4 border-transparent hover:border-gray-700/50'
                    }
                    transform ${activeHover === item.path && !isActive ? 'translate-x-1' : ''}
                  `}
                >
                  {/* Icon with animation */}
                  <div className={`
                    relative flex-shrink-0 transform transition-all duration-300
                    ${isActive 
                      ? `${item.iconColor} scale-110` 
                      : 'text-gray-400 group-hover:' + item.iconColor + ' group-hover:scale-110'
                    }
                  `}>
                    <Icon className="h-5 w-5" />
                    
                    {/* Notification Badge */}
                    {item.notification && !collapsed && (
                      <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-[10px] text-white rounded-full 
                        flex items-center justify-center border-2 border-gray-900 shadow-sm">
                        {item.notification}
                      </span>
                    )}
                  </div>
                  
                  {/* Label */}
                  {!collapsed && (
                    <span className="ml-3 flex-1 font-medium text-sm truncate">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Badge with animation */}
                  {item.badge && !collapsed && (
                    <span className={`
                      ml-2 px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0
                      ${item.badge === 'New' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white' 
                        : 'bg-gradient-to-r from-red-500 to-orange-400 text-white'
                      }
                      transform group-hover:scale-110 transition-transform duration-300
                    `}>
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Tooltip for Collapsed State with animation */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 
                          bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-lg 
                          opacity-0 group-hover:opacity-100 transition-all duration-300 
                          whitespace-nowrap z-50 border border-gray-700/50 shadow-xl pointer-events-none">
                      {item.label}
                      {item.notification && (
                        <span className="ml-2 px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded text-xs">
                          {item.notification}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer Section with animations */}
          <div className="p-3 sm:p-4 border-t border-gray-700/50 space-y-4">
            {/* User Profile */}
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-md opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 
                  flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-white">AU</span>
                </div>
                <div className="absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 bg-green-400 rounded-full border-2 border-gray-900 shadow-sm"></div>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">Admin User</h3>
                  <p className="text-xs text-gray-400 truncate hidden sm:block">Super Admin</p>
                </div>
              )}
            </div>

            {/* Animated Logout Button */}
            <button
              onMouseEnter={() => setLogoutHover(true)}
              onMouseLeave={() => setLogoutHover(false)}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onClose?.();
                }
                // Add your logout logic here
              }}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} py-2 rounded-xl
                bg-gradient-to-r from-red-600/20 via-red-500/20 to-orange-500/20
                text-red-300 hover:text-white
                border border-red-500/30 hover:border-red-400/50
                transition-all duration-300 transform hover:scale-[1.02]
                group relative overflow-hidden`}
            >
              {/* Animated background */}
              <div className={`absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 
                transition-transform duration-1000 ${logoutHover ? 'translate-x-full' : '-translate-x-full'}`}></div>
              
              {/* Icon and text */}
              <div className="relative z-10 flex items-center">
                <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                {!collapsed && <span className="ml-2 text-sm font-medium truncate">Logout</span>}
              </div>
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 
                      bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-lg 
                      opacity-0 group-hover:opacity-100 transition-all duration-300 
                      whitespace-nowrap z-50 border border-gray-700/50 shadow-xl pointer-events-none">
                  Logout
                </div>
              )}
            </button>

            {/* Version Info */}
            {!collapsed && (
              <div className="pt-3 border-t border-gray-700/30">
                <p className="text-xs text-gray-500 text-center">
                  <span className="text-gray-400">v2.5.1</span> • ShopSphere Pro
                </p>
                <div className="flex justify-center mt-2 space-x-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;