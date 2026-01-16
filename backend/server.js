require('dotenv').config();

const app = require('./src/app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API Endpoint: http://localhost:${PORT}/api/products`);
      console.log(`🎯 Test Data: http://localhost:${PORT}/api/test-products`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('HTTP server closed.');
        await prisma.$disconnect();
        console.log('Database connection closed.');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    // process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();