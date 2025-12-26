import React, { useState } from 'react';
import { Calendar, Store, ChevronDown } from 'lucide-react';

const DashboardHeader = ({ 
  storeFilter, 
  stores, 
  onStoreChange, 
  dateRange, 
  dateRanges, 
  onDateRangeChange 
}) => {
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Title & Store Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time insights and analytics</p>
          </div>
          
          {/* Store Selector */}
          <div className="relative">
            <button
              onClick={() => setShowStoreDropdown(!showStoreDropdown)}
              className="flex items-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Store className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {stores.find(s => s.id === storeFilter)?.name || 'Select Store'}
              </span>
              <ChevronDown className="w-4 h-4 ml-2 text-gray-500 dark:text-gray-400" />
            </button>

            {showStoreDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowStoreDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg 
                              shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2">
                  {stores.map(store => (
                    <button
                      key={store.id}
                      onClick={() => {
                        onStoreChange(store.id);
                        setShowStoreDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 
                               transition-colors ${storeFilter === store.id 
                                 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' 
                                 : 'text-gray-900 dark:text-gray-300'
                               }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${storeFilter === store.id 
                          ? 'bg-amber-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                        {store.name}
                        {store.id === storeFilter && (
                          <span className="ml-auto text-xs bg-amber-500 text-white px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Date Range & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {dateRanges.find(d => d.id === dateRange)?.label || 'Select Date'}
              </span>
              <ChevronDown className="w-4 h-4 ml-2 text-gray-500 dark:text-gray-400" />
            </button>

            {showDateDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDateDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg 
                              shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2">
                  {dateRanges.map(range => (
                    <button
                      key={range.id}
                      onClick={() => {
                        onDateRangeChange(range.id);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 
                               transition-colors ${dateRange === range.id 
                                 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' 
                                 : 'text-gray-900 dark:text-gray-300'
                               }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg 
                             font-medium transition-colors">
              Export Report
            </button>
            <button className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 
                             hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium 
                             text-gray-700 dark:text-gray-300 transition-colors">
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;