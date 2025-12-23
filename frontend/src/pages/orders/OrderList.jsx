import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Download, 
  TrendingUp, 
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  ChevronRight,
  RefreshCw,
  Calendar,
  Plus
} from 'lucide-react';

const OrderList = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setAnimateStats(true);
    const timer = setTimeout(() => setAnimateStats(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const orders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      date: '2024-01-15',
      items: 3,
      amount: '$249.99',
      status: 'completed',
      payment: 'Paid',
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      date: '2024-01-15',
      items: 1,
      amount: '$129.99',
      status: 'processing',
      payment: 'Paid',
    },
    {
      id: '#ORD-003',
      customer: 'Bob Johnson',
      date: '2024-01-14',
      items: 2,
      amount: '$89.99',
      status: 'pending',
      payment: 'Pending',
    },
    {
      id: '#ORD-004',
      customer: 'Alice Brown',
      date: '2024-01-14',
      items: 5,
      amount: '$199.99',
      status: 'completed',
      payment: 'Paid',
    },
    {
      id: '#ORD-005',
      customer: 'Charlie Wilson',
      date: '2024-01-13',
      items: 1,
      amount: '$349.99',
      status: 'shipped',
      payment: 'Paid',
    },
  ];

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const statuses = [
    { 
      value: 'all', 
      label: 'All Orders', 
      count: orders.length,
      color: 'from-blue-500 to-cyan-500',
      icon: Package,
    },
    { 
      value: 'pending', 
      label: 'Pending', 
      count: orders.filter(o => o.status === 'pending').length,
      color: 'from-amber-500 to-orange-500',
      icon: Clock,
    },
    { 
      value: 'processing', 
      label: 'Processing', 
      count: orders.filter(o => o.status === 'processing').length,
      color: 'from-blue-500 to-indigo-500',
      icon: RefreshCw,
    },
    { 
      value: 'shipped', 
      label: 'Shipped', 
      count: orders.filter(o => o.status === 'shipped').length,
      color: 'from-purple-500 to-pink-500',
      icon: Truck,
    },
    { 
      value: 'completed', 
      label: 'Completed', 
      count: orders.filter(o => o.status === 'completed').length,
      color: 'from-emerald-500 to-green-500',
      icon: CheckCircle,
    },
  ];

  // Basic Table Component
  const Table = ({ data, columns }) => {
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-3 whitespace-nowrap">
                  {column.cell ? column.cell({ getValue: () => row[column.accessorKey] }) : row[column.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const columns = [
    {
      header: 'Order ID',
      accessorKey: 'id',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Package className="h-4 w-4 text-blue-400" />
          </div>
          <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">{info.getValue()}</span>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customer',
      cell: (info) => (
        <div className="text-gray-900 text-xs sm:text-sm truncate">{info.getValue()}</div>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (info) => (
        <div className="flex items-center gap-1 sm:gap-2 text-gray-700 text-xs sm:text-sm">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          {info.getValue()}
        </div>
      ),
    },
    {
      header: 'Items',
      accessorKey: 'items',
      cell: (info) => (
        <div className="font-medium text-gray-900 text-xs sm:text-sm">
          {info.getValue()} items
        </div>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (info) => (
        <span className="font-semibold text-gray-900 text-xs sm:text-sm">
          {info.getValue()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info) => {
        const status = info.getValue();
        const statusConfig = {
          completed: {
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            icon: CheckCircle,
          },
          processing: {
            color: 'bg-blue-50 text-blue-700 border-blue-200',
            icon: RefreshCw,
          },
          pending: {
            color: 'bg-amber-50 text-amber-700 border-amber-200',
            icon: Clock,
          },
          shipped: {
            color: 'bg-purple-50 text-purple-700 border-purple-200',
            icon: Truck,
          },
          cancelled: {
            color: 'bg-red-50 text-red-700 border-red-200',
            icon: AlertCircle,
          },
        };
        const Icon = statusConfig[status]?.icon;
        return (
          <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border ${statusConfig[status]?.color} transition-all duration-300 text-xs`}>
            {Icon && <Icon className="h-3 w-3" />}
            <span className="font-medium">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Payment',
      accessorKey: 'payment',
      cell: (info) => {
        const payment = info.getValue();
        return (
          <span className={`font-medium text-xs sm:text-sm ${payment === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {payment}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: () => (
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button className="p-1 hover:bg-blue-50/50 rounded-lg transition-all duration-300 hover:scale-110">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-blue-50/50 rounded-lg transition-all duration-300 hover:scale-110">
            <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      <div className="relative">
        {/* Header */}
        <div className="px-3 sm:px-4 lg:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
                Orders Management
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage and track all customer orders
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
              <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-xs sm:text-sm">
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Export Orders</span>
              </button>
              <button className="p-2 sm:p-2.5 bg-white rounded-xl border border-gray-300 shadow-sm hover:bg-blue-50 transition-all duration-300 hover:scale-105">
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-3 sm:px-4 lg:px-6 pb-6 sm:pb-8">
          {/* Status Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-6">
            {statuses.map((status, index) => {
              const Icon = status.icon;
              return (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className="group relative bg-white rounded-xl border border-gray-300 shadow-sm 
                    hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${status.color}`}></div>
                  
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${status.color.replace('from-', 'from-').replace('to-', 'to-').replace('500', '50')}`}>
                        <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          status.color.includes('blue') ? 'text-blue-600' : 
                          status.color.includes('amber') ? 'text-amber-600' : 
                          status.color.includes('purple') ? 'text-purple-600' : 'text-emerald-600'
                        }`} />
                      </div>
                      <div className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br ${status.color} text-white text-xs font-bold flex items-center justify-center`}>
                        {status.count}
                      </div>
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                      {status.count}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                      {status.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search and Filters */}
          <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out mb-4 sm:mb-6">
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders by ID, customer, or product..."
                      className="pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="relative flex-1">
                      <input
                        type="date"
                        className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 w-full"
                        placeholder="From date"
                      />
                      <Calendar className="absolute left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="date"
                        className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 w-full"
                        placeholder="To date"
                      />
                      <Calendar className="absolute left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-xs sm:text-sm">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden mb-6 sm:mb-8">
            <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <p className="text-sm text-gray-600">Latest customer orders</p>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> orders
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table data={filteredOrders} columns={columns} />
            </div>
            
            <div className="p-4 border-t border-gray-300 bg-gray-50">
              <button className="w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 group">
                Load more orders
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Revenue Summary */}
            <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Summary</h3>
                    <p className="text-sm text-gray-600">Monthly overview</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50/30 hover:bg-blue-50/50 transition-colors duration-300">
                    <span className="text-gray-700">Total Revenue</span>
                    <span className="font-semibold text-gray-900">$1,019.95</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors duration-300">
                    <span className="text-gray-700">Orders This Month</span>
                    <span className="font-semibold text-gray-900">24</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50/30 hover:bg-purple-50/50 transition-colors duration-300">
                    <span className="text-gray-700">Avg Order Value</span>
                    <span className="font-semibold text-gray-900">$85.83</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                    <p className="text-sm text-gray-600">Distribution overview</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {['Completed', 'Processing', 'Pending', 'Shipped'].map((status, index) => {
                    const percentages = [65, 20, 10, 5];
                    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500'];
                    const counts = [8, 3, 2, 1];
                    
                    return (
                      <div key={status} className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{status}</span>
                          <span className="text-sm font-medium text-gray-900">{counts[index]} orders</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[index]} rounded-full transition-all duration-1000`}
                            style={{ width: `${percentages[index]}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
              <div className="p-4 sm:p-5 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
                
                <div className="space-y-2 sm:space-y-3">
                  <button className="w-full flex items-center justify-center gap-1 sm:gap-2 px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    Create New Order
                  </button>
                  <button className="w-full flex items-center justify-center gap-1 sm:gap-2 px-4 py-2.5 sm:py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 transition-all duration-300 text-sm">
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                    Process Pending Orders
                  </button>
                  <button className="w-full flex items-center justify-center gap-1 sm:gap-2 px-4 py-2.5 sm:py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 transition-all duration-300 text-sm">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    Export Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;   