@echo off
REM Live Polling System Deployment Script for Windows
echo 🚀 Starting Live Polling System Deployment...

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the project root directory.
    exit /b 1
)

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

REM Check if npm is installed
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install dependencies
echo 📦 Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd server
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)
cd ..

REM Build frontend
echo 🏗️  Building frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    exit /b 1
)

echo ✅ Frontend build successful

REM Test backend
echo 🧪 Testing backend...
cd server
node -e "const express = require('express'); console.log('✅ Backend dependencies are working');"
if %errorlevel% neq 0 (
    echo ❌ Backend test failed
    exit /b 1
)
cd ..

echo ✅ Backend test successful

REM Deployment options
echo.
echo 🎯 Choose deployment option:
echo 1. Local development server
echo 2. Build for production
echo 3. Manual deployment instructions
echo 4. Exit

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo 🖥️  Starting local development server...
    echo Frontend will be available at: http://localhost:3000
    echo Backend will be available at: http://localhost:5000
    echo Press Ctrl+C to stop the servers
    npm run dev
) else if "%choice%"=="2" (
    echo 📦 Building for production...
    npm run build
    echo ✅ Production build completed. Files are in the 'dist' directory.
) else if "%choice%"=="3" (
    echo.
    echo 📋 Manual Deployment Instructions:
    echo.
    echo 🌐 Vercel (Frontend):
    echo 1. Connect your GitHub repository to Vercel
    echo 2. Set build command: 'npm run build'
    echo 3. Set output directory: 'dist'
    echo 4. Add environment variables as needed
    echo.
    echo 🚂 Railway (Full-Stack):
    echo 1. Connect GitHub repository to Railway
    echo 2. Railway will auto-detect your configuration
    echo 3. Set environment variables
    echo.
    echo 🌊 Heroku (Backend):
    echo 1. Create new Heroku app
    echo 2. Connect GitHub repository
    echo 3. Enable automatic deploys
    echo 4. Set environment variables
    echo.
    echo 📱 Netlify (Frontend):
    echo 1. Connect GitHub repository to Netlify
    echo 2. Build command: 'npm run build'
    echo 3. Publish directory: 'dist'
    echo.
    echo Environment variables to set:
    echo - CLIENT_URL (backend): Your frontend URL
    echo - VITE_API_URL (frontend): Your backend URL
    echo - VITE_SOCKET_URL (frontend): Your backend URL
) else if "%choice%"=="4" (
    echo 👋 Goodbye!
    exit /b 0
) else (
    echo ❌ Invalid choice
    exit /b 1
)

echo.
echo 🎉 Deployment process completed!
