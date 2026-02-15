# ----------------------------
# Multi-stage build for Production
# ----------------------------

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/prisma ./prisma/
RUN npx prisma generate
COPY backend/ ./

# Stage 3: Final Image
FROM node:20-alpine
WORKDIR /app

# Install Prisma CLI
RUN npm install -g prisma@^7.2.0

# Copy backend with node_modules
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend ./backend

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create uploads directory
RUN mkdir -p backend/uploads/products && chmod -R 755 backend/uploads

# Set working directory
WORKDIR /app/backend

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start command
CMD ["sh", "-c", "npx prisma migrate deploy && node src/app.js"]