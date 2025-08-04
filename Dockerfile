# Simple production Dockerfile for Live Polling System
# Note: For Railway/Vercel deployment, use platform-specific configs instead

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy all source files
COPY . .

# Build frontend
RUN npm run build

# Change to server directory for backend
WORKDIR /app/server

# Install backend dependencies
COPY server/package*.json ./
RUN npm install --only=production

# Copy backend source
COPY server/ ./

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the backend server
CMD ["npm", "start"]
