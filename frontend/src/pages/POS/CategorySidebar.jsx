
import React, { useRef } from 'react';

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-pos border border-border dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border dark:border-gray-700 bg-gradient-to-r from-accent-50 to-secondary-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-accent-800 dark:text-white flex items-center">
              <span className="mr-2">📁</span>
              Categories
            </h2>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
              Browse products by category
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-lg bg-accent-100 dark:bg-gray-700 text-accent-700 dark:text-gray-300 hover:bg-accent-200 dark:hover:bg-gray-600"
            >
              ◀
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-lg bg-accent-100 dark:bg-gray-700 text-accent-700 dark:text-gray-300 hover:bg-accent-200 dark:hover:bg-gray-600"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
      
      {/* Categories Carousel */}
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-thin py-4 px-4 space-x-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`
                flex-shrink-0 w-40 flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
                ${selectedCategory === category.id 
                  ? 'border-primary-500 dark:border-amber-500 bg-gradient-to-b from-white to-primary-50 dark:from-gray-800 dark:to-amber-900/20 shadow-glow' 
                  : 'border-border dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-amber-700'
                }
              `}
            >
              {/* Category Icon */}
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3
                ${category.color || 'bg-gradient-to-r from-primary-400 to-primary-500'}
                ${selectedCategory === category.id ? 'ring-4 ring-primary-200 dark:ring-amber-900/30' : ''}
              `}>
                {category.icon}
              </div>
              
              {/* Category Info */}
              <h3 className="font-semibold text-text-primary dark:text-gray-200 text-center mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-text-secondary dark:text-gray-400">
                {category.count} items
              </p>
              
              {/* Active Indicator */}
              {selectedCategory === category.id && (
                <div className="mt-2 w-3 h-3 rounded-full bg-primary-500 dark:bg-amber-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Category Stats */}
      <div className="p-4 border-t border-border dark:border-gray-700 bg-gradient-to-r from-muted-100 to-muted-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary dark:text-gray-400">
            Selected: <span className="font-semibold text-accent-700 dark:text-white">
              {categories.find(c => c.id === selectedCategory)?.name || 'All Categories'}
            </span>
          </span>
          <span className="text-text-secondary dark:text-gray-400">
            Total: <span className="font-semibold text-primary-600 dark:text-amber-400">
              {categories.reduce((sum, cat) => sum + cat.count, 0)} products
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;