import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, TrendingUpIcon, Package2 } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const statConfigs = [
    {
      key: 'revenue',
      label: 'Total Revenue',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      darkColor: 'from-emerald-500 to-emerald-600',
      prefix: '$'
    },
    {
      key: 'orders',
      label: 'Total Orders',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      darkColor: 'from-blue-500 to-blue-600',
      suffix: ''
    },
    {
      key: 'customers',
      label: 'New Customers',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      darkColor: 'from-purple-500 to-purple-600',
      suffix: ''
    },
    {
      key: 'products',
      label: 'Total Products',
      icon: Package,
      color: 'from-amber-500 to-amber-600',
      darkColor: 'from-amber-500 to-amber-600',
      suffix: ''
    },
    {
      key: 'profit',
      label: 'Net Profit',
      icon: TrendingUpIcon,
      color: 'from-emerald-500 to-emerald-600',
      darkColor: 'from-emerald-500 to-emerald-600',
      prefix: '$'
    },
    {
      key: 'averageOrder',
      label: 'Avg. Order Value',
      icon: Package2,
      color: 'from-indigo-500 to-indigo-600',
      darkColor: 'from-indigo-500 to-indigo-600',
      prefix: '$'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statConfigs.map((config) => {
        const stat = stats[config.key];
        const Icon = config.icon;
        
        return (
          <div
            key={config.key}
            className="stat-card hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${statConfigs.indexOf(config) * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary dark:text-gray-400 mb-2">{config.label}</p>
                <div className="flex items-end space-x-2">
                  <h3 className="text-2xl font-bold text-text-primary dark:text-white">
                    {config.prefix || ''}{stat.current.toLocaleString()}{config.suffix || ''}
                  </h3>
                  <span className={`flex items-center text-sm ${stat.trend === 'up' 
                    ? 'text-green-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}%
                  </span>
                </div>
              </div>
              <div className={`stat-icon ${config.color} dark:${config.darkColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-text-secondary dark:text-gray-400 mb-1">
                <span>vs previous period</span>
                <span>{config.prefix || ''}{stat.previous.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${stat.trend === 'up' 
                    ? 'bg-green-500 dark:bg-emerald-500' 
                    : 'bg-red-500 dark:bg-red-500'
                  }`}
                  style={{ width: `${Math.min(stat.change + 20, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;