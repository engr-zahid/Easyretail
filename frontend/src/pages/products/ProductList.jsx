import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Download,
  RefreshCw
} from 'lucide-react';

const ProductList = () => {
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setAnimateStats(true);
    const timer = setTimeout(() => setAnimateStats(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const products = [
    {
      id: 'PROD-001',
      name: 'Premium Cotton T-Shirt',
      category: 'Clothing',
      price: '$29.99',
      stock: 45,
      status: 'in-stock',
      sales: 120,
    },
    {
      id: 'PROD-002',
      name: 'Wireless Bluetooth Earbuds',
      category: 'Electronics',
      price: '$89.99',
      stock: 23,
      status: 'in-stock',
      sales: 89,
    },
    {
      id: 'PROD-003',
      name: 'Stainless Steel Water Bottle',
      category: 'Accessories',
      price: '$24.99',
      stock: 0,
      status: 'out-of-stock',
      sales: 156,
    },
    {
      id: 'PROD-004',
      name: 'Organic Coffee Beans',
      category: 'Food',
      price: '$14.99',
      stock: 12,
      status: 'low-stock',
      sales: 67,
    },
    {
      id: 'PROD-005',
      name: 'Yoga Mat Premium',
      category: 'Fitness',
      price: '$39.99',
      stock: 34,
      status: 'in-stock',
      sales: 42,
    },
  ];

  const categories = [
    { name: 'All Categories', count: 25, color: 'from-blue-500 to-cyan-500' },
    { name: 'Clothing', count: 8, color: 'from-purple-500 to-pink-500' },
    { name: 'Electronics', count: 5, color: 'from-blue-500 to-indigo-500' },
    { name: 'Accessories', count: 6, color: 'from-emerald-500 to-green-500' },
    { name: 'Food', count: 3, color: 'from-amber-500 to-orange-500' },
    { name: 'Fitness', count: 3, color: 'from-red-500 to-rose-500' },
  ];

  const statusStats = [
    { label: 'In Stock', count: 18, color: 'bg-emerald-500' },
    { label: 'Low Stock', count: 4, color: 'bg-amber-500' },
    { label: 'Out of Stock', count: 3, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      <div className="relative">
        {/* Header */}
        <div className="px-3 sm:px-4 lg:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
                Products Management
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage and track all your products
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
              <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-xs sm:text-sm">
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Export</span>
              </button>
              <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-xs sm:text-sm">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-3 sm:px-4 lg:px-6 pb-6 sm:pb-8">
          {/* Category Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
            {categories.map((category, index) => (
              <div 
                key={category.name}
                className="group relative bg-white rounded-xl border border-gray-300 shadow-sm 
                  hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden cursor-pointer"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${category.color}`}></div>
                
                <div className="p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                    {category.count}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                    {category.name}
                  </div>
                </div>
              </div>
            ))}
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
                      placeholder="Search products by name, SKU, or category..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <select className="px-3 sm:pl-10 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 w-full sm:w-auto">
                    <option>All Categories</option>
                    <option>Clothing</option>
                    <option>Electronics</option>
                    <option>Accessories</option>
                  </select>
                  <select className="px-3 sm:pl-10 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 w-full sm:w-auto">
                    <option>All Status</option>
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                  <button className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-xs sm:text-sm">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden mb-6 sm:mb-8">
            <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">All Products</h2>
                  <p className="text-sm text-gray-600">Manage your product inventory</p>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <button className="p-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-blue-50/50 transition-all duration-300 hover:scale-105">
                    <RefreshCw className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">5</span> of <span className="font-semibold text-gray-900">25</span> products
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{product.name}</div>
                              <div className="text-xs text-gray-500 truncate">{product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-gray-700 text-xs sm:text-sm">{product.category}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                            {product.price}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className={`font-semibold text-xs sm:text-sm ${
                              product.status === 'in-stock' ? 'text-emerald-600' :
                              product.status === 'low-stock' ? 'text-amber-600' : 'text-red-500'
                            }`}>
                              {product.stock} units
                            </span>
                            {product.status === 'low-stock' && (
                              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs font-medium ${
                            product.status === 'in-stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            product.status === 'low-stock' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {product.status === 'in-stock' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {product.status === 'in-stock' ? 'In Stock' : product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                            <span className="font-medium text-gray-900 text-xs sm:text-sm">{product.sales}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button className="p-1 hover:bg-blue-50/50 rounded-lg transition-all duration-300 hover:scale-110">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-blue-50/50 rounded-lg transition-all duration-300 hover:scale-110">
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            </button>
                            <button 
                              className="p-1 hover:bg-red-50/50 rounded-lg transition-all duration-300 hover:scale-110"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-gray-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
                  <span className="font-medium text-gray-900">5</span>
                </p>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="p-1.5 sm:p-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  {[1, 2, 3, 4, 5].map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-xs sm:text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-blue-50/50 hover:text-gray-900'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
                    className="p-1.5 sm:p-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 5}
                  >
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Inventory Status */}
            <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Inventory Status</h3>
                    <p className="text-sm text-gray-600">Stock overview</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {statusStats.map((stat, index) => (
                    <div key={stat.label} className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{stat.label}</span>
                        <span className="text-sm font-medium text-gray-900">{stat.count} products</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${stat.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${(stat.count / 25) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Product Insights</h3>
                    <p className="text-sm text-gray-600">Key metrics</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50/30 hover:bg-blue-50/50 transition-colors duration-300">
                    <span className="text-gray-700">Total Products</span>
                    <span className="font-semibold text-gray-900">25</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors duration-300">
                    <span className="text-gray-700">Avg. Price</span>
                    <span className="font-semibold text-gray-900">$39.99</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50/30 hover:bg-purple-50/50 transition-colors duration-300">
                    <span className="text-gray-700">Total Sales</span>
                    <span className="font-semibold text-gray-900">474</span>
                  </div>
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
                    Add New Product
                  </button>
                  <button className="w-full flex items-center justify-center gap-1 sm:gap-2 px-4 py-2.5 sm:py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 transition-all duration-300 text-sm">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    Bulk Import
                  </button>
                  <button className="w-full flex items-center justify-center gap-1 sm:gap-2 px-4 py-2.5 sm:py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 transition-all duration-300 text-sm">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    Low Stock Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="relative w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-2xl p-4 sm:p-5 lg:p-6">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm sm:text-base">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">"{selectedProduct?.name}"</span>? 
                  All product data will be permanently removed.
                </p>
              </div>
              
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 transition-all duration-300 hover:scale-105 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle delete logic here
                    setShowDeleteModal(false);
                  }}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow hover:scale-105 text-sm"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;