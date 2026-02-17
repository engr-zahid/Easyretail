const app = require('./src/app');
require('dotenv').config();
const logger = require('./src/lib/logger');

// Only for development - Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info(`Created uploads directory: ${uploadsDir}`);
}

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📡 Health check: http://localhost:${PORT}/health`);
  logger.info(`📁 API Documentation: http://localhost:${PORT}/`);
  logger.info(`📁 Uploads served from: ${path.join(__dirname, 'uploads')}`);
});