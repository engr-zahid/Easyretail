import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Eye,
  Download,
  Filter,
  ChevronRight,
  BarChart3,
  RefreshCw,
  Plus,
  Search,
  ChevronLeft,
} from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setAnimateStats(true);
    const timer = setTimeout(() => setAnimateStats(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Stats cards with accent bars
  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,580',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      accentBar: 'bg-blue-500',
      borderColor: 'border-l-blue-500',
    },
    {
      title: 'Total Orders',
      value: '1,248',
      change: '+5.2%',
      trend: 'up',
      icon: ShoppingBag,
      accentBar: 'bg-emerald-500',
      borderColor: 'border-l-emerald-500',
    },
    {
      title: 'Total Customers',
      value: '892',
      change: '+3.4%',
      trend: 'up',
      icon: Users,
      accentBar: 'bg-purple-500',
      borderColor: 'border-l-purple-500',
    },
    {
      title: 'Total Products',
      value: '342',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      accentBar: 'bg-amber-500',
      borderColor: 'border-l-amber-500',
    },
  ];

  // Recent orders data
  const recentOrders = [
    { 
      id: '#ORD-001', 
      customer: 'John Doe', 
      date: 'Jan 15, 2024', 
      amount: '$249.99', 
      status: 'completed',
      items: 3,
    },
    { 
      id: '#ORD-002', 
      customer: 'Jane Smith', 
      date: 'Jan 15, 2024', 
      amount: '$129.99', 
      status: 'processing',
      items: 2,
    },
    { 
      id: '#ORD-003', 
      customer: 'Robert Johnson', 
      date: 'Jan 14, 2024', 
      amount: '$89.99', 
      status: 'pending',
      items: 1,
    },
    { 
      id: '#ORD-004', 
      customer: 'Alice Brown', 
      date: 'Jan 14, 2024', 
      amount: '$199.99', 
      status: 'completed',
      items: 4,
    },
    { 
      id: '#ORD-005', 
      customer: 'Michael Wilson', 
      date: 'Jan 13, 2024', 
      amount: '$349.99', 
      status: 'completed',
      items: 5,
    },
  ];

  // Top products
  const topProducts = [
    { name: 'Premium T-Shirt', sales: 342, revenue: '$4,104', growth: '+24%' },
    { name: 'Wireless Earbuds', sales: 289, revenue: '$3,755', growth: '+18%' },
    { name: 'Smart Watch', sales: 256, revenue: '$6,400', growth: '+32%' },
    { name: 'Laptop Backpack', sales: 198, revenue: '$1,980', growth: '+12%' },
    { name: 'Water Bottle', sales: 167, revenue: '$835', growth: '+8%' },
  ];

  // Revenue chart data
  const revenueData = [
    { day: 'Mon', amount: 4200, target: 4000 },
    { day: 'Tue', amount: 5200, target: 4500 },
    { day: 'Wed', amount: 3800, target: 4200 },
    { day: 'Thu', amount: 6100, target: 5000 },
    { day: 'Fri', amount: 4900, target: 4800 },
    { day: 'Sat', amount: 7200, target: 6000 },
    { day: 'Sun', amount: 5800, target: 5500 },
  ];

  const maxAmount = Math.max(...revenueData.map(d => Math.max(d.amount, d.target)));

  // Quick stats
  const quickStats = [
    { 
      label: 'Avg. Order Value', 
      value: '$89.42', 
      change: '+4.3%',
      icon: DollarSign,
      color: 'blue',
    },
    { 
      label: 'Conversion Rate', 
      value: '3.24%', 
      change: '+0.5%',
      icon: TrendingUp,
      color: 'emerald',
    },
    { 
      label: 'Return Rate', 
      value: '2.8%', 
      change: '-0.7%',
      icon: TrendingDown,
      color: 'amber',
    },
  ];

  // Quick actions
  const quickActions = [
    { label: 'New Order', icon: ShoppingBag, color: 'blue' },
    { label: 'Add Product', icon: Package, color: 'emerald' },
    { label: 'Add Customer', icon: Users, color: 'purple' },
    { label: 'Generate Report', icon: BarChart3, color: 'amber' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      {/* Main Content Area */}
      <div className="relative">
        {/* Header */}
        <div className="px-3 sm:px-4 lg:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
              <div className="flex items-center bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                {['today', 'week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium capitalize transition-all duration-300 ${
                      timeRange === range
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50/50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              
              <button className="p-2 sm:p-2.5 bg-white rounded-xl border border-gray-300 shadow-sm hover:bg-blue-50/50 transition-all duration-300 hover:scale-105">
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-3 sm:px-4 lg:px-6 pb-6 sm:pb-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.title}
                  className="group relative bg-white rounded-xl border border-gray-300 shadow-sm 
                    hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden"
                >
                  {/* Accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${stat.accentBar}`}></div>
                  
                  <div className="p-4 sm:p-5 lg:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 font-medium">
                          {stat.title}
                        </p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">
                          {stat.value}
                        </p>
                        <div className="flex items-center gap-2">
                          {stat.trend === 'up' ? (
                            <>
                              <div className="p-1 sm:p-1.5 rounded-lg bg-emerald-50">
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-emerald-500">
                                {stat.change}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="p-1 sm:p-1.5 rounded-lg bg-red-50">
                                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-red-500">
                                {stat.change}
                              </span>
                            </>
                          )}
                          <span className="text-xs text-gray-500 hidden xs:block">
                            from last month
                          </span>
                        </div>
                      </div>
                      
                      <div className={`${stat.accentBar.replace('bg-', 'bg-').replace('-500', '-50')} p-2 sm:p-3 rounded-xl`}>
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.accentBar.replace('bg-', 'text-').replace('-500', '-500')}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts and Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Revenue Overview
                      </h2>
                      <p className="text-sm text-gray-600">
                        Weekly revenue performance
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
                      <button className="flex items-center gap-1 sm:gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300">
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        Export
                      </button>
                      <button className="flex items-center gap-1 sm:gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-blue-50/50 rounded-lg transition-all duration-300">
                        View Details
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div className="h-48 sm:h-56 lg:h-64 flex items-end justify-between gap-1 sm:gap-2">
                      {revenueData.map((item, index) => {
                        const amountHeight = (item.amount / maxAmount) * 100;
                        const targetHeight = (item.target / maxAmount) * 100;
                        return (
                          <div key={item.day} className="flex-1 flex flex-col items-center group/bar">
                            <div className="relative w-full max-w-[30px] sm:max-w-[35px] lg:max-w-[40px]">
                              {/* Target line */}
                              <div
                                className="absolute w-full bg-gray-300 rounded-t transition-all duration-300"
                                style={{ height: `${targetHeight}%` }}
                              />
                              
                              {/* Revenue bar */}
                              <div
                                className="relative w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t transition-all duration-300"
                                style={{ height: `${amountHeight}%` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-t"></div>
                              </div>
                              
                              {/* Tooltip */}
                              <div className="absolute -top-12 sm:-top-14 left-1/2 -translate-x-1/2 bg-white border border-gray-300 shadow-lg rounded-lg p-2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 pointer-events-none z-10 min-w-[100px] sm:min-w-[120px]">
                                <div className="text-center">
                                  <div className="font-semibold text-gray-900 text-xs sm:text-sm">${item.amount.toLocaleString()}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">Target: ${item.target.toLocaleString()}</div>
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-300 rotate-45"></div>
                              </div>
                            </div>
                            <span className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 font-medium">
                              {item.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 sm:pt-6 border-t border-gray-300 gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded bg-gradient-to-t from-blue-500 to-blue-600"></div>
                          <span className="text-xs sm:text-sm text-gray-600">Revenue</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded bg-gray-400"></div>
                          <span className="text-xs sm:text-sm text-gray-600">Target</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-semibold text-gray-900">$42,800</p>
                        <div className="flex items-center justify-end gap-1 sm:gap-2 text-xs sm:text-sm mt-0.5 sm:mt-1">
                          <div className="p-1 rounded-lg bg-emerald-50">
                            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
                          </div>
                          <span className="text-emerald-500 font-medium">+12.5%</span>
                          <span className="text-gray-500">from last week</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                const bgColor = stat.color === 'blue' ? 'bg-blue-50' : 
                              stat.color === 'emerald' ? 'bg-emerald-50' : 'bg-amber-50';
                const textColor = stat.color === 'blue' ? 'text-blue-600' : 
                               stat.color === 'emerald' ? 'text-emerald-500' : 'text-amber-500';
                
                return (
                  <div 
                    key={stat.label}
                    className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className={`${bgColor} p-2 sm:p-2.5 rounded-xl`}>
                              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor}`} />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {stat.label}
                            </h3>
                          </div>
                          <p className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                            {stat.value}
                          </p>
                          <div className="flex items-center gap-2">
                            {stat.change.startsWith('-') ? (
                              <>
                                <div className="p-1 sm:p-1.5 rounded-lg bg-amber-50">
                                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-red-500">
                                  {stat.change}
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="p-1 sm:p-1.5 rounded-lg bg-emerald-50">
                                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-emerald-500">
                                  {stat.change}
                                </span>
                              </>
                            )}
                            <span className="text-xs text-gray-500 hidden xs:block">this month</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders and Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-gray-300">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recent Orders
                    </h2>
                    <p className="text-sm text-gray-600">
                      Latest orders from your store
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 w-full"
                      />
                    </div>
                    <button className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-xs sm:text-sm">
                      View All
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-medium text-gray-900 text-xs sm:text-sm">
                                {order.id}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-gray-900 text-xs sm:text-sm">{order.customer}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                                {order.amount}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                order.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                'bg-amber-50 text-amber-600 border-amber-200'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-1 sm:space-x-2">
                                <button className="p-1 hover:bg-blue-50/50 rounded-lg transition-all duration-300 hover:scale-110">
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                                </button>
                                <button className="p-1 hover:bg-blue-50/50 rounded-lg transition-all duration-300 hover:scale-110">
                                  <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 border-t border-gray-300 bg-gray-50">
                  <button className="w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 group">
                    Load more orders
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Top Products and Quick Actions */}
            <div className="space-y-4 sm:space-y-6">
              {/* Top Products */}
              <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Top Products
                      </h2>
                      <p className="text-sm text-gray-600">
                        Best selling items this month
                      </p>
                    </div>
                    <button className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-300">
                      See all
                    </button>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {topProducts.map((product, index) => (
                      <div 
                        key={product.name}
                        className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-blue-50/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-200 text-gray-700 font-medium border border-gray-300 text-xs sm:text-sm">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.sales} sold
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                            {product.revenue}
                          </p>
                          <div className="flex items-center justify-end gap-0.5 sm:gap-1 text-xs mt-0.5">
                            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">
                              {product.growth}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {quickActions.map((action) => {
                      const bgColor = action.color === 'blue' ? 'bg-blue-50' : 
                                    action.color === 'emerald' ? 'bg-emerald-50' : 
                                    action.color === 'purple' ? 'bg-purple-50' : 'bg-amber-50';
                      const iconColor = action.color === 'blue' ? 'text-blue-600' : 
                                       action.color === 'emerald' ? 'text-emerald-500' : 
                                       action.color === 'purple' ? 'text-purple-600' : 'text-amber-500';
                      
                      return (
                        <button
                          key={action.label}
                          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300"
                        >
                          <div className={`p-2 sm:p-3 rounded-xl ${bgColor} mb-2 sm:mb-3`}>
                            {React.createElement(action.icon, {
                              className: `h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`
                            })}
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">
                            {action.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;