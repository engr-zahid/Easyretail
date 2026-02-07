const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.production' });

// Import your routes
const productRoutes = require('./routes/productRoute');
const customerRoutes = require('./routes/customerRoute');
const supplierRoutes = require('./routes/supplierRoute');
const orderRoutes = require('./routes/orderRoute');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? false
    : process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shop Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = '/app/frontend/dist';
  
  if (fs.existsSync(frontendPath)) {
    console.log('✅ Serving frontend from:', frontendPath);
    app.use(express.static(frontendPath));
    
    // Handle SPA routing - WORKING REGEX
    app.get(/\/(?!api|uploads).*/, (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    console.log('⚠️  Frontend not found at:', frontendPath);
    
    // Try alternate path
    const altPath = path.join(__dirname, '../../frontend/dist');
    if (fs.existsSync(altPath)) {
      console.log('✅ Found at alternate path:', altPath);
      app.use(express.static(altPath));
      app.get(/\/(?!api|uploads).*/, (req, res) => {
        res.sendFile(path.join(altPath, 'index.html'));
      });
    }
  }
}

// API info route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Shop Management API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      products: '/api/products',
      customers: '/api/customers',
      suppliers: '/api/suppliers',
      orders: '/api/orders',
      health: '/health'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Start server with error handling
const PORT = process.env.PORT || 5000;

try {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Listening on port ${PORT}`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
    console.log(`🌐 Frontend: ${fs.existsSync('/app/frontend/dist') ? 'Available' : 'Not found'}`);
  });
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}