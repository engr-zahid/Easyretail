import React from 'react';

const ProductGrid = ({ products, onAddToOrder, selectedCategory }) => {
  // Get emoji from image string
  const getEmojiFromImage = (image) => {
    if (!image) return '📦';
    if (image.startsWith('http') || image.startsWith('data:image')) {
      return null; // Return null to show image
    }
    return image;
  };

  // Show placeholder if no products
  if (products.length === 0) {
    return (
      <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-l-4 border-blue-500 dark:border-amber-500">
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-pulse">📦</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Products Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Try selecting a different category or search term</p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Browse All Products
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
      {/* Grid Header */}
      <div className="p-6 border-b border-gray-300 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="mr-2">🛍️</span>
              Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {products.length} products available in this category
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-4 py-1.5 rounded-full">
              {selectedCategory === 'all' ? 'All Categories' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => {
            const emoji = getEmojiFromImage(product.image);
            
            return (
              <div
                key={product.id}
                className="group relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                         rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden 
                         hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Product Image/Icon */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 
                              flex items-center justify-center relative overflow-hidden">
                  {emoji ? (
                    <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
                      {emoji}
                    </span>
                  ) : (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.className = 'hidden';
                        // Show fallback emoji
                        e.target.parentElement.innerHTML = '<span class="text-6xl transition-transform duration-300 group-hover:scale-110">📦</span>';
                      }}
                    />
                  )}
                  
                  {/* Stock Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                    product.stock > 20 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                    product.stock > 5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {product.stock} left
                  </div>
                  
                  {/* Add to Cart Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                                flex items-center justify-center">
                    <button
                      onClick={() => onAddToOrder(product)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform scale-90 group-hover:scale-100"
                    >
                      <span className="mr-2">+</span>
                      Add to Cart
                    </button>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-5">
                  {/* SKU */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-1">
                    {product.sku || product.id}
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  
                  {/* Category */}
                  <div className="mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {product.category}
                    </span>
                  </div>
                  
                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-amber-400">
                        ${typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Per unit
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onAddToOrder(product)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 
                               hover:shadow-md hover:scale-105 active:scale-95"
                    >
                      <span className="mr-1">+</span>
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Quick Add Button (Bottom) */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => onAddToOrder(product)}
                    className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                             text-gray-700 dark:text-gray-300 rounded-lg text-center transition-all duration-200 
                             hover:border-blue-300 dark:hover:border-blue-600 border border-gray-300 dark:border-gray-600"
                  >
                    Quick Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Grid Footer */}
      <div className="p-6 border-t border-gray-300 dark:border-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
          <span className="mr-2">💡</span>
          <p className="text-sm">
            Click on any product or use the Quick Add button to add items to your order
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;