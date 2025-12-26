

import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import RevenueChart from './RevenueChart';
import RecentOrders from './RecentOrder';
import TopProducts from './TopProducts';
import StorePerformance from './StorePerformance';
import QuickActions from './QuickAction';
import SalesOverview from './SalesOverview';
import InventoryAlert from './InventoryAlert';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('today');
  const [storeFilter, setStoreFilter] = useState('all');

  // Mock data for dashboard
  const statsData = {
    revenue: {
      current: 15420.50,
      previous: 12850.75,
      change: 20.1,
      trend: 'up'
    },
    orders: {
      current: 342,
      previous: 298,
      change: 14.8,
      trend: 'up'
    },
    customers: {
      current: 128,
      previous: 105,
      change: 21.9,
      trend: 'up'
    },
    products: {
      current: 1542,
      previous: 1489,
      change: 3.6,
      trend: 'up'
    },
    profit: {
      current: 3851.25,
      previous: 3212.50,
      change: 19.9,
      trend: 'up'
    },
    averageOrder: {
      current: 45.08,
      previous: 43.12,
      change: 4.5,
      trend: 'up'
    }
  };

  const stores = [
    { id: 'all', name: 'All Stores' },
    { id: 'freshmart', name: 'Freshmart' },
    { id: 'grocery-apex', name: 'Grocery Apex' },
    { id: 'grocery-bevy', name: 'Grocery Bevy' },
    { id: 'grocery-eden', name: 'Grocery Eden' }
  ];

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  return (
    <div className="min-h-full">
      {/* Dashboard Header Card - Updated with proper dark mode */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time insights and analytics</p>
            </div>
            <div className="relative">
              <button className="flex items-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-store w-4 h-4 mr-2 text-gray-500 dark:text-gray-400">
                  <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                  <path d="M2 7h20"></path>
                  <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"></path>
                </svg>
                <span className="font-medium text-gray-900 dark:text-white">Grocery Eden</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-4 h-4 ml-2 text-gray-500 dark:text-gray-400">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button className="flex items-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4 mr-2 text-gray-500 dark:text-gray-400">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
                <span className="font-medium text-gray-900 dark:text-white">Today</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-4 h-4 ml-2 text-gray-500 dark:text-gray-400">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">
                Export Report
              </button>
              <button className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 transition-colors">
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Stats Overview */}
        <div>
          <StatsCards stats={statsData} />
        </div>

        {/* Charts and Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <RevenueChart dateRange={dateRange} />
          </div>
          
          {/* Store Performance */}
          <div>
            <StorePerformance />
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>
          
          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="xl:col-span-1">
            <TopProducts />
          </div>
          
          {/* Sales Overview */}
          <div className="xl:col-span-1">
            <SalesOverview />
          </div>
          
          {/* Inventory Alert */}
          <div className="xl:col-span-1">
            <InventoryAlert />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;