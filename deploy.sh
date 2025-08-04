#!/bin/bash

# Live Polling System Deployment Script
echo "🚀 Starting Live Polling System Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Build frontend
echo "🏗️  Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend build successful"

# Test backend
echo "🧪 Testing backend..."
cd server
node -e "
const express = require('express');
const app = express();
console.log('✅ Backend dependencies are working');
process.exit(0);
" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Backend test failed"
    exit 1
fi

cd ..

echo "✅ Backend test successful"

# Deployment options
echo ""
echo "🎯 Choose deployment option:"
echo "1. Local development server"
echo "2. Docker deployment"
echo "3. Manual deployment instructions"
echo "4. Exit"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🖥️  Starting local development server..."
        echo "Frontend will be available at: http://localhost:3000"
        echo "Backend will be available at: http://localhost:5000"
        echo "Press Ctrl+C to stop the servers"
        npm run dev
        ;;
    2)
        if command_exists docker; then
            echo "🐳 Building Docker image..."
            docker build -t live-polling-system .
            echo "🐳 Running Docker container..."
            echo "Application will be available at: http://localhost:5000"
            docker run -p 5000:5000 live-polling-system
        else
            echo "❌ Docker is not installed. Please install Docker first."
        fi
        ;;
    3)
        echo ""
        echo "📋 Manual Deployment Instructions:"
        echo ""
        echo "🌐 Vercel (Frontend):"
        echo "1. Connect your GitHub repository to Vercel"
        echo "2. Set build command: 'npm run build'"
        echo "3. Set output directory: 'dist'"
        echo "4. Add environment variables as needed"
        echo ""
        echo "🚂 Railway (Full-Stack):"
        echo "1. Connect GitHub repository to Railway"
        echo "2. Railway will auto-detect your configuration"
        echo "3. Set environment variables"
        echo ""
        echo "🌊 Heroku (Backend):"
        echo "1. Create new Heroku app"
        echo "2. Connect GitHub repository"
        echo "3. Enable automatic deploys"
        echo "4. Set environment variables"
        echo ""
        echo "📱 Netlify (Frontend):"
        echo "1. Connect GitHub repository to Netlify"
        echo "2. Build command: 'npm run build'"
        echo "3. Publish directory: 'dist'"
        echo ""
        echo "Environment variables to set:"
        echo "- CLIENT_URL (backend): Your frontend URL"
        echo "- VITE_API_URL (frontend): Your backend URL"
        echo "- VITE_SOCKET_URL (frontend): Your backend URL"
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
