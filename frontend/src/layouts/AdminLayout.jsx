// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMobileMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Layout Container */}
      <div className="relative">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Sidebar - Mobile */}
        <div className="lg:hidden">
          <Sidebar 
            isMobileOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            collapsed={false}
          />
        </div>

        {/* Main Content Area */}
        <div className={`
          lg:pl-0 transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}>
          <Navbar 
            onMenuClick={handleMobileMenuToggle}
            sidebarCollapsed={sidebarCollapsed}
          />
          <main className="py-6 px-4 sm:px-6 lg:px-8 mt-16 lg:mt-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;