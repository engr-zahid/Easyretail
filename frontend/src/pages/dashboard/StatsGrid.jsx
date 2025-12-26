import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, CreditCard, BarChart3 } from 'lucide-react';

const StatsGrid = ({ timeRange, storeFilter }) => {
  const stats = [
    {
      id: 1,
      title: 'Total Revenue',
      value: '$45,689',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      prefix: '$',
      suffix: '',
    },
    {
      id: 2,
      title: 'Total Sales',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      prefix: '',
      suffix: '',
    },
    {
      id: 3,
      title: 'Average Order Value',
      value: '89.54',
      change: '+5.7%',
      trend: 'up',
      icon: CreditCard,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      prefix: '$',
      suffix: '',
    },
    {
      id: 4,
      title: 'Total Customers',
      value: '5,678',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-gradient-to-r from-amber-500 to-orange-600',
      prefix: '',
      suffix: '',
    },
    {
      id: 5,
      title: 'Products Sold',
      value: '12,345',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      color: 'bg-gradient-to-r from-indigo-500 to-blue-600',
      prefix: '',
      suffix: '',
    },
    {
      id: 6,
      title: 'Conversion Rate',
      value: '3.24',
      change: '+1.8%',
      trend: 'up',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-red-500 to-rose-600',
      prefix: '',
      suffix: '%',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stat.trend === 'up' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-text-secondary dark:text-gray-400 mb-1">
                {stat.title}
              </p>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-accent-800 dark:text-white">
                  {stat.prefix}{stat.value}{stat.suffix}
                </span>
              </div>
              
              <div className="mt-4 pt-3 border-t border-border dark:border-gray-700">
                <p className="text-xs text-text-muted dark:text-gray-500">
                  Compared to previous period
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;