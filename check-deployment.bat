@echo off
echo 🔍 Live Polling System - Deployment Status Check
echo.

echo ✅ Local Build Test:
cd "c:\Work area\project\Live-Polling-System"
npm run build
if %errorlevel% neq 0 (
    echo ❌ Local build failed
    pause
    exit /b 1
)
echo ✅ Local build successful!
echo.

echo 🚂 Railway Backend Check:
echo Please check your Railway dashboard and verify:
echo 1. Your project is deployed successfully
echo 2. Copy your Railway URL from the dashboard
echo 3. Test: https://[your-railway-url]/api/health
echo.

echo 🌐 Vercel Frontend Check:
echo Follow these steps:
echo 1. Go to https://vercel.com/dashboard
echo 2. Find your project or create new one
echo 3. Use these settings:
echo    - Framework: Vite
echo    - Build Command: npm run build
echo    - Output Directory: dist
echo 4. Add environment variables:
echo    - VITE_API_URL=https://[your-railway-url]
echo    - VITE_SOCKET_URL=https://[your-railway-url]
echo.

echo 📋 Next Steps:
echo 1. Verify Railway URL is working
echo 2. Update environment variables in Vercel
echo 3. Redeploy Vercel project
echo 4. Test both frontend and backend
echo.

echo 🎯 Expected URLs:
echo Frontend: https://[project-name].vercel.app
echo Backend:  https://[project-name].railway.app
echo Health:   https://[project-name].railway.app/api/health
echo.

pause
