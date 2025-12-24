


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
  Sparkles,
  X,
  ShoppingBag,
  Package,
  TrendingUp,
  MessageSquare
} from "lucide-react";

const Navbar = ({ onMenuClick, sidebarCollapsed = false }) => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // Apply to HTML element
    const html = document.documentElement;
    if (newMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('darkMode', newMode);
    console.log('Dark mode toggled:', newMode);
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [navbarHover, setNavbarHover] = useState(false);
  
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Notifications data
  const notifications = [
    { 
      id: 1, 
      title: "New Order", 
      message: "Order #ORD-245 received from John Doe", 
      time: "5 min ago",
      icon: ShoppingBag,
      color: "from-primary-400/20 to-primary-500/20",
      read: false
    },
    { 
      id: 2, 
      title: "Low Stock", 
      message: "Premium T-Shirt is running low", 
      time: "1 hour ago",
      icon: Package,
      color: "from-primary-300/20 to-primary-400/20",
      read: false
    },
    { 
      id: 3, 
      title: "Sales Alert", 
      message: "Sales increased by 24% today", 
      time: "2 hours ago",
      icon: TrendingUp,
      color: "from-accent-300/20 to-accent-400/20",
      read: true
    },
    { 
      id: 4, 
      title: "New Message", 
      message: "Customer support request from Jane Smith", 
      time: "3 hours ago",
      icon: MessageSquare,
      color: "from-muted-300/20 to-muted-400/20",
      read: true
    },
  ];

  // User menu items
  const userMenuItems = [
    { icon: User, label: "My Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logout clicked");
    alert("Logged out successfully!");
  };

  // Calculate navbar width based on sidebar collapse
  const navbarWidthClass = sidebarCollapsed 
    ? "lg:left-20 lg:w-[calc(100%-5rem)]" 
    : "lg:left-64 lg:w-[calc(100%-16rem)]";

  return (
    <>
      {/* Navbar */}
      <nav 
        onMouseEnter={() => setNavbarHover(true)}
        onMouseLeave={() => setNavbarHover(false)}
        className={`
          fixed top-0 right-0 z-30 transition-all duration-300 h-16
          ${navbarWidthClass}
          bg-gradient-cream dark:bg-gray-900
          border-b border-primary-300/30 dark:border-gray-700
          shadow-soft
          ${navbarHover ? 'shadow-medium' : ''}
        `}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 h-40 w-40 bg-gradient-to-r from-primary-400/10 to-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-40 w-40 bg-gradient-to-r from-accent-700/5 to-accent-800/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 h-full px-3 sm:px-4 lg:px-6">
          <div className="flex h-full items-center justify-between">

            {/* LEFT SECTION */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className="lg:hidden rounded-xl p-2 text-text-primary dark:text-gray-200 transition-all
                  hover:bg-primary-400/20 active:scale-95 border border-primary-300/50
                  hover:shadow-sm"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Logo/Title for mobile */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-golden 
                  flex items-center justify-center shadow-glow">
                  <Sparkles className="h-4 w-4 text-text-primary" />
                </div>
                <span className="font-bold text-text-primary dark:text-gray-200 text-sm sm:text-base">ShopSphere</span>
              </div>

              {/* Desktop Search */}
              <div className="hidden md:block relative" ref={searchRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted dark:text-gray-500" />
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearch(true);
                      }}
                      placeholder="Search products, orders..."
                      className="w-64 lg:w-80 rounded-xl bg-white/80 dark:bg-gray-800/80 py-2 pl-10 pr-4
                        text-sm text-text-primary dark:text-gray-200 placeholder:text-text-muted dark:placeholder:text-gray-500
                        outline-none transition-all duration-300
                        focus:ring-2 focus:ring-primary-400 dark:focus:ring-amber-500 border border-muted-300 dark:border-gray-700
                        focus:border-transparent"
                    />
                  </form>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Mobile Search Button */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden rounded-xl p-2 text-text-primary dark:text-gray-200 transition-all
                  hover:bg-primary-400/20 active:scale-95 border border-primary-300/50
                  hover:shadow-sm"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="rounded-xl p-2 text-text-primary dark:text-gray-200 transition-all
                  hover:bg-primary-400/20 dark:hover:bg-gray-700 active:scale-95 border border-primary-300/50 dark:border-gray-600
                  hover:shadow-sm group"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-primary-500 dark:text-yellow-400 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="h-5 w-5 text-primary-500 dark:text-gray-400 group-hover:rotate-12 transition-transform" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="rounded-xl p-2 text-text-primary dark:text-gray-200 transition-all relative
                    hover:bg-primary-400/20 dark:hover:bg-gray-700 active:scale-95 border border-primary-300/50 dark:border-gray-600
                    hover:shadow-sm group"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full 
                    bg-gradient-to-r from-primary-500 to-primary-400" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-gradient-to-b from-secondary-100 to-white 
                    dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-medium border border-muted-300 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
                    <div className="p-4 border-b border-muted-300 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-text-primary dark:text-gray-200 text-sm sm:text-base">Notifications</h3>
                        <span className="text-xs text-primary-500">
                          {notifications.filter(n => !n.read).length} unread
                        </span>
                      </div>
                    </div>
                    <div className="max-h-64 sm:max-h-96 overflow-y-auto">
                      {notifications.map((notification) => {
                        const Icon = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            className={`p-3 sm:p-4 border-b border-muted-300 dark:border-gray-700 hover:bg-primary-100/50 dark:hover:bg-gray-700/50 
                              transition-colors ${!notification.read ? 'bg-primary-100/30 dark:bg-amber-900/20' : ''}`}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r ${notification.color} 
                                flex items-center justify-center flex-shrink-0 border border-primary-300/20 dark:border-gray-700`}>
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-text-primary dark:text-gray-300" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-text-primary dark:text-gray-200 truncate">{notification.title}</h4>
                                <p className="text-xs text-text-secondary dark:text-gray-400 mt-1 truncate">{notification.message}</p>
                                <p className="text-xs text-text-muted dark:text-gray-500 mt-2">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 bg-secondary-50/50 dark:bg-gray-800/50">
                      <button className="w-full text-sm text-primary-600 hover:text-primary-700 transition-colors">
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
                  className="flex items-center gap-1 sm:gap-2 rounded-xl p-1.5 sm:p-2 transition-all
                    hover:bg-primary-400/20 dark:hover:bg-gray-700 active:scale-95 border border-primary-300/50 dark:border-gray-600
                    hover:shadow-sm"
                >
                  <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full
                    bg-gradient-golden text-xs sm:text-sm font-semibold text-text-primary shadow-soft">
                    AU
                  </div>
                  <ChevronDown className={`hidden sm:block h-4 w-4 text-text-muted dark:text-gray-500 
                    transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-gradient-to-b from-secondary-100 to-white 
                    dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-medium border border-muted-300 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
                    <div className="p-3 sm:p-4 border-b border-muted-300 dark:border-gray-700">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-golden 
                          flex items-center justify-center flex-shrink-0 shadow-soft">
                          <span className="text-xs sm:text-sm font-bold text-text-primary">AU</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-text-primary dark:text-gray-200 text-sm sm:text-base truncate">Admin User</h4>
                          <p className="text-xs text-text-secondary dark:text-gray-400 truncate">admin@shop.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      {userMenuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={index}
                            href={item.path}
                            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm text-text-secondary dark:text-gray-400 
                              hover:bg-primary-100/50 dark:hover:bg-gray-700 transition-colors hover:text-text-primary dark:hover:text-gray-200"
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </a>
                        );
                      })}
                    </div>
                    <div className="p-3 border-t border-muted-300 dark:border-gray-700 bg-secondary-50/30 dark:bg-gray-800/30">
                      <button 
                        onClick={handleLogout}
                        className="w-full rounded-lg bg-gradient-to-r from-accent-700 to-accent-800
                          py-2 text-sm text-secondary-100 dark:text-gray-300 hover:text-white transition-colors
                          hover:shadow-md active:scale-[0.98]"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showSearch && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-cream dark:bg-gray-900 border-t border-muted-300 dark:border-gray-700 p-3 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted dark:text-gray-500" />
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-xl bg-white/80 dark:bg-gray-800/80 py-2.5 pl-10 pr-4
                      text-sm text-text-primary dark:text-gray-200 placeholder:text-text-muted dark:placeholder:text-gray-500
                      outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-amber-500 
                      border border-muted-300 dark:border-gray-700 focus:border-transparent"
                    autoFocus
                  />
                </form>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content spacer - only for desktop */}
      <div className={`hidden lg:block h-16 ${sidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}></div>
    </>
  );
};

export default Navbar;