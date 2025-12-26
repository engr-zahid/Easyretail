import React from 'react';
import { TrendingUp, Star, Package } from 'lucide-react';

const TopProducts = () => {
  const products = [
    {
      id: 1,
      name: 'iPhone 14 Pro',
      category: 'Electronics',
      sales: 245,
      revenue: 24500,
      stock: 42,
      rating: 4.8,
      change: '+12.5%',
    },
    {
      id: 2,
      name: 'Nike Air Max',
      category: 'Footwear',
      sales: 189,
      revenue: 18900,
      stock: 156,
      rating: 4.6,
      change: '+8.2%',
    },
    {
      id: 3,
      name: 'MacBook Pro M2',
      category: 'Electronics',
      sales: 156,
      revenue: 31200,
      stock: 23,
      rating: 4.9,
      change: '+15.7%',
    },
    {
      id: 4,
      name: 'Organic Coffee',
      category: 'Groceries',
      sales: 456,
      revenue: 9120,
      stock: 89,
      rating: 4.4,
      change: '+5.3%',
    },
    {
      id: 5,
      name: 'Yoga Mat Pro',
      category: 'Fitness',
      sales: 234,
      revenue: 11700,
      stock: 67,
      rating: 4.7,
      change: '-2.1%',
    },
    {
      id: 6,
      name: 'Wireless Earbuds',
      category: 'Electronics',
      sales: 321,
      revenue: 19260,
      stock: 124,
      rating: 4.5,
      change: '+18.9%',
    },
    {
      id: 7,
      name: 'Designer Watch',
      category: 'Accessories',
      sales: 89,
      revenue: 26700,
      stock: 15,
      rating: 4.8,
      change: '+23.4%',
    },
    {
      id: 8,
      name: 'Gaming Keyboard',
      category: 'Electronics',
      sales: 178,
      revenue: 12460,
      stock: 45,
      rating: 4.3,
      change: '+7.8%',
    },
  ];

  const getStockColor = (stock) => {
    if (stock > 100) return 'text-green-600 dark:text-green-400';
    if (stock > 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-accent-800 dark:text-white mb-1">
            Top Products
          </h2>
          <p className="text-text-secondary dark:text-gray-400 text-sm">
            Best selling products by revenue
          </p>
        </div>
        <button className="text-sm text-primary-600 dark:text-amber-400 hover:text-primary-700 dark:hover:text-amber-300 font-medium">
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center p-3 rounded-lg border border-border dark:border-gray-700 hover:bg-muted-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mr-4">
              <Package className="h-6 w-6 text-primary-600 dark:text-amber-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-accent-800 dark:text-white truncate">
                  {product.name}
                </h4>
                <div className="flex items-center text-xs">
                  <Star className="h-3 w-3 text-amber-500 mr-1" />
                  <span className="text-text-secondary dark:text-gray-400">{product.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-text-secondary dark:text-gray-400">
                  {product.category}
                </span>
                <span className={`text-sm font-medium ${getStockColor(product.stock)}`}>
                  {product.stock} in stock
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="font-bold text-lg text-accent-800 dark:text-white">
                    ${product.revenue.toLocaleString()}
                  </span>
                  <span className="text-sm text-text-muted dark:text-gray-500 ml-2">
                    from {product.sales} sales
                  </span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {product.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary dark:text-gray-400">Total Products</p>
            <p className="text-xl font-bold text-accent-800 dark:text-white">1,245</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary dark:text-gray-400">Low Stock Alert</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">23</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary dark:text-gray-400">Out of Stock</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;