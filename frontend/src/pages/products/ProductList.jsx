import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
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
  RefreshCw,
  X,
  Save,
  Hash,
  Tag,
  Layers,
  DollarSign,
  Upload,
  Sparkles,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import { useProducts } from "../../context/ProductsContext";

const ProductList = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateStats, setAnimateStats] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [deleteAnimation, setDeleteAnimation] = useState(false);
  const [trashAnimation, setTrashAnimation] = useState(false);
  const [addSuccessAnimation, setAddSuccessAnimation] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  const addButtonRef = useRef(null);
  const addModalButtonRef = useRef(null);
  const editModalButtonRef = useRef(null);
  const deleteButtonRefs = useRef({});
  
  // Use products from context
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    clearAllProducts 
  } = useProducts();
  
  // New product state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Clothing',
    price: '',
    stock: '',
    status: 'in-stock',
    description: '',
    image: '📦'
  });

  // Listen for theme changes from Navbar
  useEffect(() => {
    const handleThemeChange = (event) => {
      setIsDarkMode(event.detail);
    };

    window.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    setAnimateStats(true);
    const timer = setTimeout(() => setAnimateStats(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Function to calculate stock status based on stock quantity
  const calculateStockStatus = (stock) => {
    const stockNum = parseInt(stock) || 0;
    if (stockNum === 0) return 'out-of-stock';
    if (stockNum <= 10) return 'low-stock';
    return 'in-stock';
  };

  // Categories with updated counts based on actual products
  const categories = [
    { name: 'All Categories', count: products.length, gradient: 'from-orange-400 via-amber-400 to-yellow-400', icon: '📊', darkGradient: 'from-orange-500 via-amber-500 to-yellow-500' },
    { name: 'Clothing', count: products.filter(p => p.category === 'Clothing').length, gradient: 'from-rose-400 via-pink-400 to-red-400', icon: '👕', darkGradient: 'from-rose-500 via-pink-500 to-red-500' },
    { name: 'Electronics', count: products.filter(p => p.category === 'Electronics').length, gradient: 'from-sky-400 via-blue-400 to-indigo-400', icon: '📱', darkGradient: 'from-sky-500 via-blue-500 to-indigo-500' },
    { name: 'Accessories', count: products.filter(p => p.category === 'Accessories').length, gradient: 'from-emerald-400 via-teal-400 to-cyan-400', icon: '💎', darkGradient: 'from-emerald-500 via-teal-500 to-cyan-500' },
    { name: 'Food', count: products.filter(p => p.category === 'Food').length, gradient: 'from-amber-400 via-orange-400 to-red-400', icon: '🍕', darkGradient: 'from-amber-500 via-orange-500 to-red-500' },
    { name: 'Fitness', count: products.filter(p => p.category === 'Fitness').length, gradient: 'from-red-400 via-rose-400 to-pink-400', icon: '🏋️', darkGradient: 'from-red-500 via-rose-500 to-pink-500' },
  ];

  // Calculate status stats based on actual products - FIXED LOGIC
  const calculateStatusStats = () => {
    // Recalculate status for all products to ensure accuracy
    const productsWithCorrectedStatus = products.map(product => ({
      ...product,
      status: calculateStockStatus(product.stock)
    }));

    const inStock = productsWithCorrectedStatus.filter(p => p.status === 'in-stock').length;
    const lowStock = productsWithCorrectedStatus.filter(p => p.status === 'low-stock').length;
    const outOfStock = productsWithCorrectedStatus.filter(p => p.status === 'out-of-stock').length;
    
    return [
      { 
        label: 'In Stock', 
        count: inStock, 
        gradient: 'from-emerald-400 to-green-400',
        darkGradient: 'from-emerald-500 to-green-500',
        icon: '✅',
        color: isDarkMode ? 'bg-emerald-500' : 'bg-emerald-400'
      },
      { 
        label: 'Low Stock', 
        count: lowStock, 
        gradient: 'from-amber-400 to-orange-400',
        darkGradient: 'from-amber-500 to-orange-500',
        icon: '⚠️',
        color: isDarkMode ? 'bg-amber-500' : 'bg-amber-400'
      },
      { 
        label: 'Out of Stock', 
        count: outOfStock, 
        gradient: 'from-red-400 to-rose-400',
        darkGradient: 'from-red-500 to-rose-500',
        icon: '❌',
        color: isDarkMode ? 'bg-red-500' : 'bg-red-400'
      },
    ];
  };

  const statusStats = calculateStatusStats();

  // Filter products based on search, category, and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.id.toLowerCase().includes(search.toLowerCase()) ||
                         product.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'All Status' || product.status === statusFilter.toLowerCase().replace(' ', '-');
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Animated Add Product button handler
  const handleAddButtonClick = () => {
    if (addButtonRef.current) {
      addButtonRef.current.classList.add('animate-pulse-once');
      addButtonRef.current.classList.add('animate-glow');
      setTimeout(() => {
        addButtonRef.current.classList.remove('animate-pulse-once');
        addButtonRef.current.classList.remove('animate-glow');
      }, 500);
    }
    
    // Add warm sparkle effect
    setIsAddingProduct(true);
    setTimeout(() => {
      setIsAddingProduct(false);
      setShowAddModal(true);
    }, 300);
  };

  // Animated Add Product in modal handler
  const handleAddProductClick = () => {
    if (addModalButtonRef.current) {
      addModalButtonRef.current.classList.add('animate-pulse-once');
      addModalButtonRef.current.classList.add('animate-glow');
      setTimeout(() => {
        addModalButtonRef.current.classList.remove('animate-pulse-once');
        addModalButtonRef.current.classList.remove('animate-glow');
      }, 500);
    }
    
    handleAddProduct();
  };

  // Animated Edit Product in modal handler
  const handleEditProductClick = () => {
    if (editModalButtonRef.current) {
      editModalButtonRef.current.classList.add('animate-pulse-once');
      editModalButtonRef.current.classList.add('animate-glow');
      setTimeout(() => {
        editModalButtonRef.current.classList.remove('animate-pulse-once');
        editModalButtonRef.current.classList.remove('animate-glow');
      }, 500);
    }
    
    handleEditProduct();
  };

  // Delete product function - Updated to show animation on confirm
  const handleDeleteProduct = () => {
    setTrashAnimation(true);
    
    setTimeout(() => {
      if (selectedProduct) {
        deleteProduct(selectedProduct.id);
        setShowDeleteModal(false);
        setSelectedProduct(null);
        // Update status stats after deletion
        setAnimateStats(true);
        setTimeout(() => setAnimateStats(false), 800);
      }
      setTrashAnimation(false);
    }, 800);
  };

  // Edit product function - FIXED COMPLETELY
  const handleEditProduct = () => {
    if (selectedProduct) {
      // Calculate status based on stock before updating
      const updatedProduct = {
        ...selectedProduct,
        price: parseFloat(selectedProduct.price) || 0,
        stock: parseInt(selectedProduct.stock) || 0,
        status: calculateStockStatus(selectedProduct.stock) // Recalculate status
      };
      
      // Call updateProduct with the corrected product
      updateProduct(updatedProduct.id, updatedProduct);
      setShowEditModal(false);
      setSelectedProduct(null);
      setAnimateStats(true);
      setTimeout(() => setAnimateStats(false), 800);
    }
  };

  // Add new product function with success animation - FIXED
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      // Calculate status based on stock before adding
      const stockNum = parseInt(newProduct.stock) || 0;
      const priceNum = parseFloat(newProduct.price) || 0;
      const calculatedStatus = calculateStockStatus(stockNum);
      
      // Generate a unique ID for the new product
      const newProductId = `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const productToAdd = {
        id: newProductId,
        name: newProduct.name,
        category: newProduct.category,
        price: priceNum,
        stock: stockNum,
        status: calculatedStatus,
        description: newProduct.description,
        image: newProduct.image || '📦',
        sales: Math.floor(Math.random() * 100) // Random sales for demo
      };
      
      addProduct(productToAdd);
      
      // Show success animation
      setAddSuccessAnimation(true);
      setTimeout(() => setAddSuccessAnimation(false), 1500);
      
      setShowAddModal(false);
      setNewProduct({
        name: '',
        category: 'Clothing',
        price: '',
        stock: '',
        status: 'in-stock',
        description: '',
        image: '📦'
      });
      
      // Update status stats
      setAnimateStats(true);
      setTimeout(() => setAnimateStats(false), 800);
    } else {
      alert('Please fill in all required fields (Name, Price, Stock)');
    }
  };

  // View product function
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Edit button click - FIXED
  const handleEditClick = (product) => {
    // Create a copy of the product to avoid reference issues
    const productCopy = {
      ...product,
      price: typeof product.price === 'string' && product.price.includes('$') 
        ? parseFloat(product.price.replace('$', '')) 
        : product.price
    };
    
    setSelectedProduct(productCopy);
    setShowEditModal(true);
  };

  // Delete button click with animation
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    
    // Trigger individual button animation (just shake)
    const buttonKey = product.id;
    if (deleteButtonRefs.current[buttonKey]) {
      deleteButtonRefs.current[buttonKey].classList.add('animate-shake');
      setTimeout(() => {
        if (deleteButtonRefs.current[buttonKey]) {
          deleteButtonRefs.current[buttonKey].classList.remove('animate-shake');
        }
      }, 500);
    }
    
    // Show delete modal immediately without the falling animation
    setShowDeleteModal(true);
  };

  // Export function
  const handleExport = () => {
    if (products.length === 0) {
      alert('No products to export!');
      return;
    }
    
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Clear all products function
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all products? This cannot be undone.')) {
      clearAllProducts();
      setSearch('');
      setCategoryFilter('All Categories');
      setStatusFilter('All Status');
      setCurrentPage(1);
      setAnimateStats(true);
      setTimeout(() => setAnimateStats(false), 800);
    }
  };

  // Reset filters function
  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilter('All Categories');
    setStatusFilter('All Status');
    setCurrentPage(1);
  };

  // Calculate average price
  const calculateAveragePrice = () => {
    if (products.length === 0) return '$0.00';
    
    const total = products.reduce((sum, product) => {
      const price = typeof product.price === 'string' 
        ? parseFloat(product.price.replace('$', '')) 
        : product.price;
      return sum + (price || 0);
    }, 0);
    
    return `$${(total / products.length).toFixed(2)}`;
  };

  // Calculate total sales
  const calculateTotalSales = () => {
    return products.reduce((sum, product) => sum + (product.sales || 0), 0);
  };

  // Handle input change for edit modal - FIXED
  const handleEditInputChange = (field, value) => {
    setSelectedProduct(prev => {
      const updatedProduct = {
        ...prev,
        [field]: value
      };
      
      // Automatically update status when stock changes
      if (field === 'stock') {
        updatedProduct.status = calculateStockStatus(value);
      }
      
      return updatedProduct;
    });
  };

  // Handle input change for add modal
  const handleAddInputChange = (field, value) => {
    setNewProduct(prev => {
      const updatedProduct = {
        ...prev,
        [field]: value
      };
      
      // Automatically update status when stock changes
      if (field === 'stock') {
        updatedProduct.status = calculateStockStatus(value);
      }
      
      return updatedProduct;
    });
  };

  // Handle image upload
  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit && selectedProduct) {
          handleEditInputChange('image', reader.result);
        } else {
          handleAddInputChange('image', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Get unique categories for filter dropdown
  const uniqueCategories = ['All Categories', ...new Set(products.map(p => p.category))];

  // Get emoji from image
  const getEmojiFromImage = (image) => {
    if (image.startsWith('http') || image.startsWith('data:image')) {
      return '📦';
    }
    return image || '📦';
  };

  // Add CSS for custom animations with warm gradients and dark mode
  const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-8px) rotate(2deg); }
      66% { transform: translateY(-4px) rotate(-2deg); }
    }
    
    @keyframes gentle-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.03); opacity: 0.9; }
    }
    
    @keyframes warm-gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes slide-up {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes trash-open {
      0% { transform: rotate(0deg) scale(1); }
      30% { transform: rotate(-25deg) scale(1.1); }
      60% { transform: rotate(10deg) scale(1.2); }
      100% { transform: rotate(0deg) scale(1); }
    }
    
    @keyframes product-fall {
      0% { transform: translateY(-100px) scale(1) rotate(0deg); opacity: 1; }
      70% { transform: translateY(20px) scale(0.8) rotate(180deg); opacity: 0.8; }
      100% { transform: translateY(100px) scale(0.5) rotate(360deg); opacity: 0; }
    }
    
    @keyframes border-glow {
      0%, 100% { box-shadow: 0 0 5px rgba(251, 191, 36, 0.3), 0 0 10px rgba(249, 115, 22, 0.2); }
      50% { box-shadow: 0 0 15px rgba(251, 191, 36, 0.5), 0 0 25px rgba(249, 115, 22, 0.3); }
    }
    
    @keyframes border-glow-dark {
      0%, 100% { box-shadow: 0 0 5px rgba(251, 191, 36, 0.5), 0 0 10px rgba(249, 115, 22, 0.4); }
      50% { box-shadow: 0 0 15px rgba(251, 191, 36, 0.7), 0 0 25px rgba(249, 115, 22, 0.5); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-3px); }
      75% { transform: translateX(3px); }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px rgba(251, 191, 36, 0.3); }
      50% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.6), 0 0 30px rgba(249, 115, 22, 0.4); }
    }
    
    @keyframes glow-dark {
      0%, 100% { box-shadow: 0 0 10px rgba(251, 191, 36, 0.5); }
      50% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(249, 115, 22, 0.6); }
    }
    
    @keyframes success-pop {
      0% { transform: scale(0); opacity: 0; }
      70% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes confetti-fall {
      0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes progress-glow {
      0%, 100% { box-shadow: 0 0 5px currentColor; }
      50% { box-shadow: 0 0 15px currentColor; }
    }
    
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
    
    .animate-gentle-pulse {
      animation: gentle-pulse 3s ease-in-out infinite;
    }
    
    .animate-warm-gradient {
      background-size: 200% 200%;
      animation: warm-gradient 6s ease infinite;
    }
    
    .animate-slide-up {
      animation: slide-up 0.5s ease-out;
    }
    
    .animate-fade-in {
      animation: fade-in 0.4s ease-out;
    }
    
    .animate-trash-open {
      animation: trash-open 0.8s ease-in-out;
    }
    
    .animate-product-fall {
      animation: product-fall 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }
    
    .animate-border-glow {
      animation: border-glow 2s ease-in-out infinite;
    }
    
    .animate-border-glow-dark {
      animation: border-glow-dark 2s ease-in-out infinite;
    }
    
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    
    .animate-glow {
      animation: glow 0.5s ease-in-out;
    }
    
    .animate-glow-dark {
      animation: glow-dark 0.5s ease-in-out;
    }
    
    .animate-pulse-once {
      animation: gentle-pulse 0.3s ease-in-out;
    }
    
    .animate-success-pop {
      animation: success-pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }
    
    .animate-progress-glow {
      animation: progress-glow 2s ease-in-out infinite;
    }
    
    .hover-glow:hover {
      animation: glow 1s ease-in-out infinite;
    }
    
    .hover-glow-dark:hover {
      animation: glow-dark 1s ease-in-out infinite;
    }
    
    .hover-lift:hover {
      transform: translateY(-2px);
      transition: transform 0.3s ease;
    }
    
    .card-border {
      position: relative;
      background: linear-gradient(45deg, #ff6b6b, #ffa726, #ffca28, #66bb6a, #42a5f5, #ab47bc);
      background-size: 400% 400%;
      border-radius: 12px;
      padding: 2px;
      animation: warm-gradient 8s ease infinite;
    }
    
    .card-border-dark {
      position: relative;
      background: linear-gradient(45deg, #ff8a00, #ffb74d, #ffd54f, #81c784, #64b5f6, #ba68c8);
      background-size: 400% 400%;
      border-radius: 12px;
      padding: 2px;
      animation: warm-gradient 8s ease infinite;
    }
    
    .card-inner {
      background: white;
      border-radius: 10px;
      width: 100%;
      height: 100%;
    }
    
    .card-inner-dark {
      background: #1f2937;
      border-radius: 10px;
      width: 100%;
      height: 100%;
    }
    
    .input-focus-effect:focus {
      box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.2);
      border-color: #ffa726;
      transition: all 0.3s ease;
    }
    
    .input-focus-effect-dark:focus {
      box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.4);
      border-color: #ffa726;
      transition: all 0.3s ease;
    }
    
    .modal-enter {
      animation: modal-enter 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    @keyframes modal-enter {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    .confetti {
      position: absolute;
      width: 8px;
      height: 8px;
      background: linear-gradient(45deg, #ffa726, #ffca28);
      border-radius: 50%;
      pointer-events: none;
      animation: confetti-fall 1.5s ease-out forwards;
    }
    
    .warm-bg {
      background: linear-gradient(135deg, #fff8e1 0%, #fff3cd 50%, #ffeaa7 100%);
      min-height: 100vh;
    }
    
    .warm-bg-dark {
      background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
      min-height: 100vh;
    }
    
    .gradient-text {
      background: linear-gradient(45deg, #ff6b6b, #ffa726, #ffca28);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-size: 200% 200%;
      animation: warm-gradient 4s ease infinite;
    }
    
    .gradient-text-dark {
      background: linear-gradient(45deg, #ff8a00, #ffb74d, #ffd54f);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-size: 200% 200%;
      animation: warm-gradient 4s ease infinite;
    }
    
    .gradient-button {
      background: linear-gradient(45deg, #ffa726, #ffca28, #ffa726);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      position: relative;
      overflow: hidden;
    }
    
    .gradient-button-dark {
      background: linear-gradient(45deg, #ff8a00, #ffb74d, #ff8a00);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      position: relative;
      overflow: hidden;
    }
    
    .gradient-button::before,
    .gradient-button-dark::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      transform: rotate(30deg);
      transition: transform 0.5s ease;
    }
    
    .gradient-button:hover::before,
    .gradient-button-dark:hover::before {
      transform: rotate(30deg) translateX(50%);
    }
    
    .page-number-active {
      background: linear-gradient(45deg, #ffa726, #ffca28, #ffa726);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      color: white;
      font-weight: bold;
    }
    
    .page-number-active-dark {
      background: linear-gradient(45deg, #ff8a00, #ffb74d, #ff8a00);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      color: white;
      font-weight: bold;
    }
    
    /* Dark mode specific styles */
    .dark-text-primary {
      color: #f9fafb;
    }
    
    .dark-text-secondary {
      color: #d1d5db;
    }
    
    .dark-bg-primary {
      background-color: #1f2937;
    }
    
    .dark-bg-secondary {
      background-color: #374151;
    }
    
    .dark-border {
      border-color: #4b5563;
    }
    
    .dark-border-light {
      border-color: #6b7280;
    }
    
    .dark-input-bg {
      background-color: #374151;
      color: #f9fafb;
    }
    
    .dark-input-bg:focus {
      background-color: #4b5563;
    }
    
    .dark-placeholder::placeholder {
      color: #9ca3af;
    }
    
    .dark-modal-bg {
      background-color: rgba(0, 0, 0, 0.7);
    }
    
    @media (max-width: 640px) {
      .card-border, .card-border-dark {
        padding: 1px;
        border-radius: 10px;
      }
      .card-inner, .card-inner-dark {
        border-radius: 8px;
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
    }
  `;

  return (
    <div className={`${isDarkMode ? 'warm-bg-dark' : 'warm-bg'} transition-all duration-300`}>
      <style>{animationStyles}</style>
      
      <div className="relative">
        {/* Success animation overlay */}
        {addSuccessAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-success-pop">🎉</div>
              <div className="text-xl font-bold gradient-text animate-success-pop">
                Product Added Successfully!
              </div>
            </div>
            {/* Confetti effect */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  animationDelay: `${i * 0.05}s`,
                  background: `linear-gradient(45deg, hsl(${Math.random() * 60 + 30}, 100%, 65%), hsl(${Math.random() * 30 + 40}, 100%, 65%))`,
                }}
              />
            ))}
          </div>
        )}

        {/* Floating decorative elements */}
        {isAddingProduct && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  animationDelay: `${i * 0.1}s`,
                  background: `linear-gradient(45deg, hsl(${Math.random() * 60 + 30}, 100%, 65%), hsl(${Math.random() * 30 + 40}, 100%, 65%))`,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Delete animation overlay - Now shows when confirming delete */}
        {deleteAnimation && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 text-4xl animate-product-fall">
                {getEmojiFromImage(selectedProduct.image)}
              </div>
              <div className="text-6xl animate-trash-open">
                🗑️
              </div>
            </div>
          </div>
        )}

        {/* Header - Fully Responsive */}
        <div className="px-2 sm:px-4 lg:px-6 pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4 lg:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 lg:gap-4">
            <div className="animate-slide-up mobile-text-center sm:text-left">
              <h1 className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold ${isDarkMode ? 'gradient-text-dark' : 'gradient-text'}`}>
                Products Management
              </h1>
              <p className={`mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base flex items-center gap-1 sm:gap-2 justify-center sm:justify-start ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                {products.length === 0 ? 'No products yet. Add your first product!' : `Managing ${products.length} products`}
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 animate-float" />
              </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 mt-2 sm:mt-0 justify-center sm:justify-end">
              <button 
                onClick={handleExport}
                className="flex items-center gap-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover-lift text-xs sm:text-sm lg:text-base animate-slide-up"
                style={{animationDelay: '0.1s'}}
              >
                <Download className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
                <span className="hidden xs:inline">Export</span>
              </button>
              {products.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover-lift text-xs sm:text-sm lg:text-base animate-slide-up"
                  style={{animationDelay: '0.2s'}}
                >
                  <Trash2 className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
                  <span className="hidden xs:inline">Clear All</span>
                </button>
              )}
              <button 
                ref={addButtonRef}
                onClick={handleAddButtonClick}
                className={`flex items-center gap-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover-lift text-xs sm:text-sm lg:text-base animate-slide-up`}
                style={{animationDelay: '0.3s'}}
              >
                {isAddingProduct ? (
                  <Loader2 className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
                )}
                <span className="hidden xs:inline">Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Fully Responsive */}
        <div className="px-2 sm:px-4 lg:px-6 pb-4 sm:pb-6 lg:pb-8">
          {/* Category Filters - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
            {categories.map((category, index) => (
              <div 
                key={category.name}
                className={`${isDarkMode ? 'card-border-dark' : 'card-border'} ${isDarkMode ? 'animate-border-glow-dark' : 'animate-border-glow'}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div 
                  className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'} group cursor-pointer transition-all duration-300 hover-lift mobile-padding-sm`}
                  onClick={() => setCategoryFilter(category.name)}
                >
                  <div className="p-2 sm:p-3 lg:p-4">
                    <div className="flex items-start justify-between">
                      <div className={`text-base sm:text-lg lg:text-xl xl:text-2xl font-bold mb-0.5 sm:mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {category.count}
                      </div>
                      <span className="text-lg sm:text-xl lg:text-2xl transform transition-transform group-hover:scale-110 duration-300">
                        {category.icon}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm lg:text-base font-medium truncate">
                      <span className={`${
                        categoryFilter === category.name 
                          ? (isDarkMode ? 'gradient-text-dark font-bold' : 'gradient-text font-bold') 
                          : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                      }`}>
                        {category.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State - Responsive */}
          {products.length === 0 && (
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} ${isDarkMode ? 'animate-border-glow-dark' : 'animate-border-glow'} mb-4 sm:mb-6 lg:mb-8`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className="p-4 sm:p-6 lg:p-8 text-center">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-r from-amber-200/30 to-orange-200/30 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-3 sm:mb-4 animate-float">
                    <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-amber-500 dark:text-amber-400" />
                  </div>
                  <h3 className={`text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 ${isDarkMode ? 'gradient-text-dark' : 'gradient-text'}`}>
                    No Products Yet
                  </h3>
                  <p className={`mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base ${isDarkMode ? 'text-amber-300/70' : 'text-amber-800/70'}`}>
                    Get started by adding your first product. Manage inventory, track sales, and monitor stock levels.
                  </p>
                  <button 
                    ref={addButtonRef}
                    onClick={handleAddButtonClick}
                    className={`inline-flex items-center gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover-lift text-sm sm:text-base`}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    Add Your First Product
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters - Only show if there are products - Responsive */}
          {products.length > 0 && (
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} mb-3 sm:mb-4 lg:mb-6`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className="p-3 sm:p-4 lg:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 sm:gap-3 lg:gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className={`absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4 -translate-y-1/2 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className={`pl-7 sm:pl-9 lg:pl-11 pr-2 sm:pr-3 lg:pr-4 py-1.5 sm:py-2 lg:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 w-full text-xs sm:text-sm lg:text-base ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder border-amber-800 focus:ring-amber-400' : 'border-amber-200 bg-white input-focus-effect'}`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 lg:gap-3 mobile-full-width">
                      <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 w-full sm:w-auto text-xs sm:text-sm lg:text-base ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder border-amber-800 focus:ring-amber-400' : 'border-amber-200 bg-white input-focus-effect'}`}
                      >
                        {uniqueCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 w-full sm:w-auto text-xs sm:text-sm lg:text-base ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder border-amber-800 focus:ring-amber-400' : 'border-amber-200 bg-white input-focus-effect'}`}
                      >
                        <option>All Status</option>
                        <option>In Stock</option>
                        <option>Low Stock</option>
                        <option>Out of Stock</option>
                      </select>
                      <button 
                        onClick={handleResetFilters}
                        className={`flex items-center justify-center gap-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 font-medium rounded-lg transition-all duration-300 hover-lift text-xs sm:text-sm lg:text-base w-full sm:w-auto ${isDarkMode ? 'bg-amber-900 hover:bg-amber-800 text-amber-100' : 'bg-amber-100 hover:bg-amber-200 text-amber-800 hover:text-amber-900'}`}
                      >
                        <RefreshCw className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Table - Only show if there are products - Fully Responsive */}
          {products.length > 0 && (
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} mb-4 sm:mb-6 lg:mb-8`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className={`p-3 sm:p-4 lg:p-5 border-b ${isDarkMode ? 'border-amber-800' : 'border-amber-100'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                    <div className="mobile-text-center sm:text-left">
                      <h2 className={`text-base sm:text-lg lg:text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>All Products</h2>
                      <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {filteredProducts.length === products.length 
                          ? 'Showing all products' 
                          : `Filtered: ${filteredProducts.length} of ${products.length} products`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0 justify-center sm:justify-end">
                      <button 
                        onClick={handleClearAll}
                        className={`p-1.5 sm:p-2 rounded-lg border transition-all duration-300 hover:scale-105 ${isDarkMode ? 'border-gray-700 bg-gray-800 hover:bg-red-900/30' : 'border-gray-300 bg-gray-50 hover:bg-red-50/50'}`}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Showing <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{paginatedProducts.length}</span> of{' '}
                        <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{filteredProducts.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Mobile Card View for Small Screens */}
                    <div className="lg:hidden space-y-2 p-3 sm:p-4">
                      {paginatedProducts.map((product) => (
                        <div key={product.id} className={`rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900' : 'bg-white border-gray-200'}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden flex-shrink-0">
                                {product.image && (product.image.startsWith('http') || product.image.startsWith('data:image')) ? (
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                                    }}
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-lg">
                                    {getEmojiFromImage(product.image)}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h3 className={`font-medium text-sm sm:text-base truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{product.name}</h3>
                                <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.id}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{product.category}</span>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    product.status === 'in-stock' ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700') :
                                    product.status === 'low-stock' ? (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700') :
                                    (isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700')
                                  }`}>
                                    {product.status === 'in-stock' ? 'In Stock' : 
                                     product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price</div>
                              <div className={`font-semibold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                              </div>
                            </div>
                            <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stock</div>
                              <div className={`font-semibold text-sm ${
                                product.status === 'in-stock' ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') :
                                product.status === 'low-stock' ? (isDarkMode ? 'text-amber-400' : 'text-amber-600') :
                                (isDarkMode ? 'text-red-400' : 'text-red-500')
                              }`}>
                                {product.stock} units
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-300 dark:border-gray-700">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sales: {product.sales || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => handleViewProduct(product)}
                                className={`p-1 rounded transition-all duration-300 ${isDarkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50/50'}`}
                              >
                                <Eye className={`h-3 w-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              </button>
                              <button 
                                onClick={() => handleEditClick(product)}
                                className={`p-1 rounded transition-all duration-300 ${isDarkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50/50'}`}
                              >
                                <Edit className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              </button>
                              <button 
                                ref={el => deleteButtonRefs.current[product.id] = el}
                                onClick={() => handleDeleteClick(product)}
                                className={`p-1 rounded transition-all duration-300 ${isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50/50'}`}
                              >
                                <Trash2 className="h-3 w-3 text-red-500 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Desktop Table View */}
                    <table className="hidden lg:table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <tr>
                          <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            Product
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            Category
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            Price
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            Stock
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            Status
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            Sales
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                        {paginatedProducts.map((product) => (
                          <tr key={product.id} className={`${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                                  {product.image && (product.image.startsWith('http') || product.image.startsWith('data:image')) ? (
                                    <img 
                                      src={product.image} 
                                      alt={product.name}
                                      className="absolute inset-0 w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                                      }}
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-lg">
                                      {getEmojiFromImage(product.image)}
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className={`font-medium text-sm truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{product.name}</div>
                                  <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{product.category}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`font-semibold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold text-sm ${
                                  product.status === 'in-stock' ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') :
                                  product.status === 'low-stock' ? (isDarkMode ? 'text-amber-400' : 'text-amber-600') :
                                  (isDarkMode ? 'text-red-400' : 'text-red-500')
                                }`}>
                                  {product.stock} units
                                </span>
                                {product.status === 'low-stock' && (
                                  <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${
                                product.status === 'in-stock' ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200') :
                                product.status === 'low-stock' ? (isDarkMode ? 'bg-amber-900/30 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200') :
                                (isDarkMode ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-50 text-red-700 border-red-200')
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
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                                <span className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{product.sales || 0}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleViewProduct(product)}
                                  className={`p-1 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50/50'}`}
                                >
                                  <Eye className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                </button>
                                <button 
                                  onClick={() => handleEditClick(product)}
                                  className={`p-1 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50/50'}`}
                                >
                                  <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </button>
                                <button 
                                  ref={el => deleteButtonRefs.current[product.id] = el}
                                  onClick={() => handleDeleteClick(product)}
                                  className={`p-1 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50/50'}`}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className={`p-3 sm:p-4 lg:p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 lg:gap-4">
                    <p className={`text-xs sm:text-sm text-center sm:text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                      Page <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{currentPage}</span> of{' '}
                      <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{totalPages}</span>
                    </p>
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <button 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={`p-1.5 sm:p-2 rounded-lg border transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-700 bg-gray-800 hover:bg-blue-900/30 text-gray-300 hover:text-gray-100' : 'border-gray-300 bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900'}`}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-xs sm:text-sm ${
                            currentPage === index + 1
                              ? (isDarkMode ? 'page-number-active-dark' : 'page-number-active')
                              : (isDarkMode ? 'border border-gray-700 bg-gray-800 text-gray-300 hover:bg-blue-900/30 hover:text-gray-100' : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-blue-50/50 hover:text-gray-900')
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={`p-1.5 sm:p-2 rounded-lg border transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-700 bg-gray-800 hover:bg-blue-900/30 text-gray-300 hover:text-gray-100' : 'border-gray-300 bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900'}`}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid - Only show if there are products - Responsive with FIXED status */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {/* Inventory Status - FIXED with animations */}
              <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
                <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                  <div className="p-3 sm:p-4 lg:p-5">
                    <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                      <div>
                        <h3 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Inventory Status</h3>
                        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Real-time stock overview</p>
                      </div>
                      <div className={`p-1.5 sm:p-2 rounded-lg ${isDarkMode ? 'bg-amber-900/30' : 'bg-amber-50'}`}>
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                      {statusStats.map((stat) => (
                        <div key={stat.label} className="space-y-1 sm:space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stat.label}</span>
                              <span className={`text-xs ${stat.color} text-white px-1.5 py-0.5 rounded-full animate-pulse-once`}>
                                {stat.icon}
                              </span>
                            </div>
                            <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{stat.count} products</span>
                          </div>
                          <div className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 animate-progress-glow ${isDarkMode ? stat.darkGradient : stat.gradient}`}
                              style={{ 
                                width: `${products.length > 0 ? (stat.count / products.length) * 100 : 0}%`,
                                animationDelay: `${Math.random() * 0.5}s`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                      <p className={`text-xs ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                        <span className="font-semibold">Note:</span> Status auto-updates based on stock levels
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
                <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                  <div className="p-3 sm:p-4 lg:p-5">
                    <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                      <div>
                        <h3 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Product Insights</h3>
                        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Key metrics</p>
                      </div>
                      <div className={`p-1.5 sm:p-2 rounded-lg ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                      <div className={`flex justify-between items-center p-2 sm:p-3 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-blue-900/20 hover:bg-blue-900/30' : 'bg-blue-50/30 hover:bg-blue-50/50'}`}>
                        <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Products</span>
                        <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm sm:text-base`}>{products.length}</span>
                      </div>
                      <div className={`flex justify-between items-center p-2 sm:p-3 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-emerald-900/20 hover:bg-emerald-900/30' : 'bg-emerald-50/30 hover:bg-emerald-50/50'}`}>
                        <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Avg. Price</span>
                        <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm sm:text-base`}>{calculateAveragePrice()}</span>
                      </div>
                      <div className={`flex justify-between items-center p-2 sm:p-3 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-purple-900/20 hover:bg-purple-900/30' : 'bg-purple-50/30 hover:bg-purple-50/50'}`}>
                        <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Sales</span>
                        <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm sm:text-base`}>{calculateTotalSales()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card-border md:col-span-2 lg:col-span-1">
                <div className="card-inner">
                  <div className="p-3 sm:p-4 lg:p-5">
                    <h3 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Quick Actions</h3>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <button 
                        onClick={handleAddButtonClick}
                        className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover-lift text-xs sm:text-sm`}
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        Add New Product
                      </button>
                      <button 
                        onClick={handleExport}
                        className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 font-medium rounded-lg border transition-all duration-300 hover-lift text-xs sm:text-sm ${isDarkMode ? 'bg-gray-800 hover:bg-blue-900/30 text-gray-300 hover:text-gray-100 border-gray-700' : 'bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-gray-900 border-gray-300'}`}
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        Export Products
                      </button>
                      <button 
                        onClick={handleClearAll}
                        className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 font-medium rounded-lg border transition-all duration-300 hover-lift text-xs sm:text-sm ${isDarkMode ? 'bg-red-900/30 hover:bg-red-900/40 text-red-300 hover:text-red-200 border-red-800' : 'bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 border-red-200'}`}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        Clear All Products
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal - Responsive */}
      {showDeleteModal && selectedProduct && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-2 sm:p-3 lg:p-4 modal-enter`}>
          <div className="relative w-full max-w-sm sm:max-w-md mx-2 sm:mx-3">
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className="p-3 sm:p-4 lg:p-6">
                  <div className="mb-3 sm:mb-4 lg:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
                      <div className={`h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 dark:from-red-500/30 dark:to-rose-500/30 flex items-center justify-center flex-shrink-0 ${trashAnimation ? 'animate-trash-open' : ''}`}>
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-red-500 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Delete Product</h3>
                        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This action cannot be undone</p>
                      </div>
                    </div>
                    
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-xs sm:text-sm lg:text-base`}>
                      Are you sure you want to delete <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>"{selectedProduct?.name}"</span>? 
                      All product data will be permanently removed.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setSelectedProduct(null);
                      }}
                      className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-105 text-xs sm:text-sm lg:text-base w-full sm:w-auto ${isDarkMode ? 'bg-gray-800 hover:bg-blue-900/30 text-gray-300 hover:text-gray-100 border-gray-700' : 'bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900 border-gray-300'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Show animation first, then delete
                        setTrashAnimation(true);
                        setTimeout(() => {
                          handleDeleteProduct();
                        }, 500);
                      }}
                      className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow hover:scale-105 text-xs sm:text-sm lg:text-base w-full sm:w-auto"
                    >
                      <Trash2 className="inline h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Delete Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal - Responsive */}
      {showViewModal && selectedProduct && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-2 sm:p-3 lg:p-4 modal-enter`}>
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-2xl mx-2 sm:mx-3 lg:mx-4 max-h-[90vh] overflow-hidden">
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className="p-3 sm:p-4 lg:p-6 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-500 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-base sm:text-lg lg:text-xl font-semibold truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Product Details</h3>
                        <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>View product information</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        setSelectedProduct(null);
                      }}
                      className="p-1 sm:p-1.5 lg:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-1 sm:ml-2"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 mx-auto sm:mx-0">
                          {selectedProduct.image && (selectedProduct.image.startsWith('http') || selectedProduct.image.startsWith('data:image')) ? (
                            <img 
                              src={selectedProduct.image} 
                              alt={selectedProduct.name}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl">
                              {getEmojiFromImage(selectedProduct.image)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <h4 className={`font-medium mb-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Product Information</h4>
                          <div className={`rounded-lg p-3 sm:p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className="space-y-2 sm:space-y-3">
                              <div className="flex items-center gap-2">
                                <Package className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500" />
                                <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name: </span>
                                <span className={`font-medium truncate text-sm sm:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedProduct.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500" />
                                <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category: </span>
                                <span className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedProduct.category}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500" />
                                <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>SKU: </span>
                                <span className={`font-medium truncate text-sm sm:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedProduct.id}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500" />
                                <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price: </span>
                                <span className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                  ${typeof selectedProduct.price === 'number' ? selectedProduct.price.toFixed(2) : selectedProduct.price}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Layers className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500" />
                                <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Stock: </span>
                                <span className={`font-medium text-sm sm:text-base ${
                                  selectedProduct.status === 'in-stock' ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') :
                                  selectedProduct.status === 'low-stock' ? (isDarkMode ? 'text-amber-400' : 'text-amber-600') :
                                  (isDarkMode ? 'text-red-400' : 'text-red-500')
                                }`}>
                                  {selectedProduct.stock} units
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className={`font-medium mb-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Description</h4>
                        <p className={`rounded-lg p-3 sm:p-4 text-xs sm:text-sm ${isDarkMode ? 'text-gray-300 bg-gray-700/50' : 'text-gray-700 bg-gray-50'}`}>
                          {selectedProduct.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h4 className={`font-medium mb-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Status</h4>
                        <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                          selectedProduct.status === 'in-stock' ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700') :
                          selectedProduct.status === 'low-stock' ? (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700') :
                          (isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700')
                        }`}>
                          {selectedProduct.status === 'in-stock' ? (
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          ) : (
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                          <span className="font-medium text-sm sm:text-base">
                            {selectedProduct.status === 'in-stock' ? 'In Stock' : 
                             selectedProduct.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className={`font-medium mb-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Sales Performance</h4>
                        <div className={`rounded-lg p-3 sm:p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Sales:</span>
                            <span className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedProduct.sales || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 dark:text-emerald-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Good performance</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-3 sm:pt-4">
                        <button
                          onClick={() => {
                            setShowViewModal(false);
                            handleEditClick(selectedProduct);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          Edit Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal - RESPONSIVE - FIXED */}
      {showEditModal && selectedProduct && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-2 sm:p-3 lg:p-4 modal-enter`}>
          <div className="relative w-full max-w-sm sm:max-w-md mx-2 sm:mx-3 lg:mx-4 max-h-[90vh] overflow-hidden">
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className="p-3 sm:p-4 lg:p-6 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-500 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-base sm:text-lg lg:text-xl font-semibold truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Edit Product</h3>
                        <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Update product information</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                      }}
                      className="p-1 sm:p-1.5 lg:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-1 sm:ml-2"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {/* Image Upload - RESPONSIVE */}
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Product Image
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 mx-auto sm:mx-0">
                          {selectedProduct.image && (selectedProduct.image.startsWith('http') || selectedProduct.image.startsWith('data:image')) ? (
                            <img 
                              src={selectedProduct.image} 
                              alt={selectedProduct.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl lg:text-2xl">
                              {getEmojiFromImage(selectedProduct.image)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <label className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border cursor-pointer transition-colors w-full sm:w-auto ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300'}`}>
                            <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, true)}
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG up to 2MB</p>
                          <input
                            type="text"
                            value={selectedProduct.image}
                            onChange={(e) => handleEditInputChange('image', e.target.value)}
                            className={`w-full mt-2 px-2 sm:px-3 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                            placeholder="Or enter emoji/icon"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.name}
                        onChange={(e) => handleEditInputChange('name', e.target.value)}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300 input-focus-effect'}`}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Category
                      </label>
                      <select
                        value={selectedProduct.category}
                        onChange={(e) => handleEditInputChange('category', e.target.value)}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300 input-focus-effect'}`}
                      >
                        <option value="Clothing">Clothing</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Food">Food</option>
                        <option value="Fitness">Fitness</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          value={typeof selectedProduct.price === 'string' 
                            ? selectedProduct.price.replace('$', '') 
                            : selectedProduct.price}
                          onChange={(e) => handleEditInputChange('price', parseFloat(e.target.value) || 0)}
                          className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300 input-focus-effect'}`}
                          placeholder="0.00"
                          step="0.01"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Stock *
                        </label>
                        <input
                          type="number"
                          value={selectedProduct.stock}
                          onChange={(e) => handleEditInputChange('stock', parseInt(e.target.value) || 0)}
                          className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300 input-focus-effect'}`}
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Status
                      </label>
                      <div className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light' : 'bg-gray-50 border-gray-300'}`}>
                        <span className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full ${
                          selectedProduct.status === 'in-stock' ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700') :
                          selectedProduct.status === 'low-stock' ? (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700') :
                          (isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700')
                        }`}>
                          {selectedProduct.status === 'in-stock' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          <span className="text-xs sm:text-sm">
                            {selectedProduct.status === 'in-stock' ? 'In Stock (Auto-calculated)' : 
                             selectedProduct.status === 'low-stock' ? 'Low Stock (Auto-calculated)' : 
                             'Out of Stock (Auto-calculated)'}
                          </span>
                        </span>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Status is automatically calculated based on stock quantity.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Description
                      </label>
                      <textarea
                        value={selectedProduct.description}
                        onChange={(e) => handleEditInputChange('description', e.target.value)}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300 input-focus-effect'}`}
                        rows="3"
                        placeholder="Enter product description"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-300 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                      }}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2.5 font-medium rounded-lg transition-colors w-full sm:w-auto text-xs sm:text-sm ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    >
                      Cancel
                    </button>
                    <button
                      ref={editModalButtonRef}
                      onClick={handleEditProductClick}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2.5 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover-lift w-full sm:w-auto text-xs sm:text-sm`}
                    >
                      <Save className="inline h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal with RESPONSIVE design */}
      {showAddModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-2 sm:p-3 lg:p-4 modal-enter`}>
          <div className="relative w-full max-w-sm sm:max-w-md mx-2 sm:mx-3 lg:mx-4 max-h-[90vh] overflow-hidden">
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className="p-3 sm:p-4 lg:p-6 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-500 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-base sm:text-lg lg:text-xl font-semibold truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Add New Product</h3>
                        <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create a new product entry</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="p-1 sm:p-1.5 lg:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-1 sm:ml-2"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {/* Image Upload - RESPONSIVE */}
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Product Image
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 mx-auto sm:mx-0">
                          <div className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl lg:text-2xl">
                            {newProduct.image || '📦'}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <label className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border cursor-pointer transition-colors w-full sm:w-auto ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300'}`}>
                            <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, false)}
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG up to 2MB</p>
                          <input
                            type="text"
                            value={newProduct.image}
                            onChange={(e) => handleAddInputChange('image', e.target.value)}
                            className={`w-full mt-2 px-2 sm:px-3 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                            placeholder="Enter emoji or icon"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => handleAddInputChange('name', e.target.value)}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300 input-focus-effect'}`}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Category
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => handleAddInputChange('category', e.target.value)}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300 input-focus-effect'}`}
                      >
                        <option value="Clothing">Clothing</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Food">Food</option>
                        <option value="Fitness">Fitness</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => handleAddInputChange('price', e.target.value)}
                          className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300 input-focus-effect'}`}
                          placeholder="0.00"
                          step="0.01"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Stock *
                        </label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => handleAddInputChange('stock', e.target.value)}
                          className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300 input-focus-effect'}`}
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Status
                      </label>
                      <div className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light' : 'bg-gray-50 border-gray-300'}`}>
                        <span className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full ${
                          newProduct.status === 'in-stock' ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700') :
                          newProduct.status === 'low-stock' ? (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700') :
                          (isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700')
                        }`}>
                          {newProduct.status === 'in-stock' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          <span className="text-xs sm:text-sm">
                            {newProduct.status === 'in-stock' ? 'In Stock (Auto-calculated)' : 
                             newProduct.status === 'low-stock' ? 'Low Stock (Auto-calculated)' : 
                             'Out of Stock (Auto-calculated)'}
                          </span>
                        </span>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Status is automatically calculated based on stock quantity.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Description
                      </label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => handleAddInputChange('description', e.target.value)}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300 input-focus-effect'}`}
                        rows="3"
                        placeholder="Enter product description (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-300 dark:border-gray-700">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2.5 font-medium rounded-lg transition-colors w-full sm:w-auto text-xs sm:text-sm ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    >
                      Cancel
                    </button>
                    <button
                      ref={addModalButtonRef}
                      onClick={handleAddProductClick}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2.5 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover-lift w-full sm:w-auto text-xs sm:text-sm`}
                    >
                      <Save className="inline h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;