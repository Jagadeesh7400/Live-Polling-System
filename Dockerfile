# Multi-stage build for production
FROM node:18-alpine AS frontend-build

# Set working directory for frontend
WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY vite.config.js ./
COPY jsconfig.json ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build frontend
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend

# Set working directory for backend
WORKDIR /app/server

# Copy backend package files
COPY server/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source code
COPY server/ ./

# Production stage
FROM node:18-alpine AS production

# Install PM2 for process management
RUN npm install -g pm2

# Set working directory
WORKDIR /app

# Copy built frontend from frontend-build stage
COPY --from=frontend-build /app/dist ./dist

# Copy backend from backend stage
COPY --from=backend /app/server ./server

# Copy API routes
COPY api/ ./api/

# Copy root package.json for any root-level scripts
COPY package*.json ./

# Expose port
EXPOSE 5000

# Create PM2 ecosystem file
RUN echo '{\
  "apps": [{\
    "name": "live-polling-backend",\
    "script": "./server/server.js",\
    "instances": 1,\
    "exec_mode": "cluster",\
    "env": {\
      "NODE_ENV": "production",\
      "PORT": 5000\
    }\
  }]\
}' > ecosystem.config.json

# Start application with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.json"]
