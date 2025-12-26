import React, { useState, useEffect, useRef } from "react";
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  Sun, 
  Moon, 
  LogOut,
  User,
  Settings,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick, sidebarCollapsed = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    // Update localStorage
    localStorage.setItem('darkMode', newMode);
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newMode }));
  };

  // Effect to apply theme on mount and listen for changes
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const notifications = [
    { 
      id: 1, 
      title: "New Order", 
      message: "Order #ORD-245 received from John Doe", 
      time: "5 min ago",
      read: false
    },
    { 
      id: 2, 
      title: "Low Stock", 
      message: "iPhone 14 64GB is running low", 
      time: "1 hour ago",
      read: false
    },
  ];

  const userMenuItems = [
    { icon: User, label: "My Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings/general" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Menu & Logo */}
            <div className="flex items-center space-x-4">
              {/* Menu button - Only show on small screens */}
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DP</span>
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">Easy Retail</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Middle: Search (Desktop only) */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, orders, customers..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                             focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </form>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                title={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {notifications.filter(n => !n.read).length} unread
                      </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                            {!notification.read && <span className="h-2 w-2 bg-blue-500 rounded-full"></span>}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3">
                      <button className="w-full text-center text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.[0] || 'U'}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.role || 'Admin'}
                      </p>
                    </div>
                    <div className="py-2">
                      {userMenuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={index}
                            to={item.path}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="p-3 border-t">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 text-sm text-red-600 hover:text-red-700"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showSearch && (
            <div className="md:hidden pb-4" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    autoFocus
                  />
                </form>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;