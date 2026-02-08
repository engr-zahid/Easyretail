const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ 
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.production' 
});

// Import your routes
const productRoutes = require('./routes/productRoute');
const customerRoutes = require('./routes/customerRoute');
const supplierRoutes = require('./routes/supplierRoute');
const orderRoutes = require('./routes/orderRoute');

const app = express();

// ========== FIX 1: Update CORS Configuration ==========
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://easyretail.sevalla.app', 'https://www.easyretail.sevalla.app']
    : process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ========== FIX 2: Handle OPTIONS preflight requests globally ==========
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ========== FIX 3: API Routes (MUST come before frontend serving) ==========
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

// ========== FIX 4: Serve frontend ONLY in production and ONLY for non-API routes ==========
if (process.env.NODE_ENV === 'production') {
  const frontendPaths = [
    '/app/frontend/dist',
    path.join(__dirname, '../frontend/dist'),
    path.join(__dirname, '../../frontend/dist')
  ];
  
  let staticPath = null;
  
  // Find the frontend build
  for (const frontendPath of frontendPaths) {
    if (fs.existsSync(frontendPath)) {
      staticPath = frontendPath;
      console.log('✅ Serving frontend from:', frontendPath);
      break;
    }
  }
  
  if (staticPath) {
    // Serve static files
    app.use(express.static(staticPath));
    
    // Handle SPA routing - ONLY for non-API, non-upload routes
    app.get('*', (req, res, next) => {
      // Skip API routes, uploads, and static assets
      if (
        req.path.startsWith('/api') || 
        req.path.startsWith('/uploads') ||
        req.path.includes('.')  // Has file extension
      ) {
        return next();
      }
      
      // Serve index.html for all other routes
      res.sendFile(path.join(staticPath, 'index.html'));
    });
  } else {
    console.log('⚠️  Frontend build not found at any expected location');
  }
}

// ========== FIX 5: API 404 handler ==========
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
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
    console.log(`🌍 CORS Allowed Origins: ${process.env.NODE_ENV === 'production' ? 'https://easyretail.sevalla.app' : 'http://localhost:*'}`);
  });
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}