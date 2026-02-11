const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productRoutes = require('./routes/productRoute');
const customerRoutes = require('./routes/customerRoute');
const supplierRoutes = require('./routes/supplierRoute');
const orderRoutes = require('./routes/orderRoute');

const app = express();

// Get allowed origins based on environment
const getCorsOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    const productionOrigins = [];
    
    // Add FRONTEND_URL if set
    if (process.env.FRONTEND_URL) {
      productionOrigins.push(process.env.FRONTEND_URL);
    }
    
    // Add VITE_API_URL if set (for frontend)
    if (process.env.VITE_API_URL) {
      productionOrigins.push(process.env.VITE_API_URL.replace('/api', ''));
    }
    
    // Default fallback for production
    return productionOrigins.length > 0 
      ? productionOrigins 
      : ['https://yourdomain.com']; // Change this to your actual domain
  }
  
  // Development origins
  return [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8080'
  ];
};

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = getCorsOrigins();
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Security headers in production
if (process.env.NODE_ENV === 'production') {
  const helmet = require('helmet');
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for now, configure properly later
    crossOriginEmbedderPolicy: false
  }));
}

// Serve static files from uploads directory
const uploadsPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'uploads')
  : path.join(__dirname, '../uploads');

app.use('/uploads', express.static(uploadsPath));

// Request logging
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  next();
});

// Routes
app.use('/api', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shop Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API documentation route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Shop Management API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      products: {
        GET: '/api/products',
        POST: '/api/products',
        PUT: '/api/products/:id',
        DELETE: '/api/products/:id'
      },
      customers: {
        GET: '/api/customers',
        POST: '/api/customers',
        PUT: '/api/customers/:id',
        DELETE: '/api/customers/:id'
      },
      suppliers: {
        GET: '/api/suppliers',
        POST: '/api/suppliers',
        PUT: '/api/suppliers/:id',
        DELETE: '/api/suppliers/:id'
      },
      orders: {
        GET: '/api/orders',
        POST: '/api/orders',
        PUT: '/api/orders/:id',
        DELETE: '/api/orders/:id'
      },
      health: {
        GET: '/health'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.url,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse = {
    success: false,
    message: isDevelopment ? err.message : 'Something went wrong!',
    ...(isDevelopment && { 
      stack: err.stack,
      error: err.message 
    }),
    ...(err.code && { code: err.code })
  };
  
  res.status(statusCode).json(errorResponse);
});

module.exports = app;