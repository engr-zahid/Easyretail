# Multi-stage build for Shop Management System
# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Build backend and create final image
FROM node:20-alpine

WORKDIR /app

# Install Prisma CLI globally (needed for migrations)
RUN npm install -g prisma@^7.2.0

# Create directory structure
RUN mkdir -p backend frontend

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm ci --only=production

# Copy Prisma schema and config
COPY backend/prisma ./backend/prisma/
COPY backend/prisma.config.ts ./backend/

# Generate Prisma Client
RUN cd backend && npx prisma generate

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create uploads directory
RUN mkdir -p backend/uploads/products

# Set working directory to backend for running the app
WORKDIR /app/backend

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start script that runs migrations and starts server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]