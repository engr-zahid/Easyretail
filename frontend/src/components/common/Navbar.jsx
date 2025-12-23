import React, { useState, useEffect, useRef } from "react";
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  Sun, 
  Moon,
  User,
  Settings,
  Sparkles,
} from "lucide-react";

const Navbar = ({ onMenuClick, sidebarCollapsed = false }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav 
      className={`
        fixed top-0 right-0 h-16 transition-all duration-300
        ${sidebarCollapsed ? 'lg:left-20 lg:right-0' : 'lg:left-64 lg:right-0'}
        bg-gradient-to-r from-slate-900 to-slate-800
        border-b border-slate-700/50
        shadow-lg
        z-40
      `}
    >
      <div className="h-full px-4 lg:px-6">
        <div className="flex h-full items-center justify-between">
          
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800/50"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">ShopSphere</span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 rounded-lg bg-slate-800/80 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800/50"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-400" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg text-slate-300 hover:bg-slate-800/50 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/50"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">AU</span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 rounded-lg shadow-xl border border-slate-700/50 z-50">
                  <div className="p-3 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">AU</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Admin User</h4>
                        <p className="text-xs text-slate-400">admin@shop.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <a href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50">
                      <User className="h-4 w-4" />
                      My Profile
                    </a>
                    <a href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50">
                      <Settings className="h-4 w-4" />
                      Settings
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

