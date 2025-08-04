# 🚀 Live Polling System - Vercel + Railway Deployment Guide

## 📋 Prerequisites Checklist
- ✅ Code pushed to GitHub: `https://github.com/Jagadeesh7400/Live-Polling-System`
- ✅ Build tested locally (frontend builds successfully)
- ✅ Backend dependencies verified
- ✅ All deployment configurations created

---

## 🎯 STEP 1: Deploy Backend to Railway

### 1.1 Go to Railway
1. Visit [railway.app](https://railway.app)
2. Click "Login" and sign in with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `Jagadeesh7400/Live-Polling-System`

### 1.2 Configure Railway Deployment
1. Railway will auto-detect your project
2. Click on your project to configure
3. Go to "Settings" tab
4. Set "Root Directory" to: `/server` (for backend deployment)
5. Or create a new service specifically for the server

### 1.3 Set Environment Variables in Railway
Go to "Variables" tab and add:
```
NODE_ENV=production
PORT=${{ PORT }}
CLIENT_URL=https://your-app-name.vercel.app
```

### 1.4 Deploy Backend
1. Railway will automatically deploy your backend
2. Note your backend URL: `https://your-project-name.railway.app`
3. Test health endpoint: `https://your-project-name.railway.app/api/health`

---

## 🌐 STEP 2: Deploy Frontend to Vercel

### 2.1 Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click "Login" and sign in with your GitHub account
3. Click "New Project"
4. Import `Jagadeesh7400/Live-Polling-System`

### 2.2 Configure Vercel Deployment
1. **Framework Preset**: Vite
2. **Root Directory**: `./` (project root)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 2.3 Set Environment Variables in Vercel
Go to "Environment Variables" and add:
```
VITE_API_URL=https://your-project-name.railway.app
VITE_SOCKET_URL=https://your-project-name.railway.app
```

### 2.4 Deploy Frontend
1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Note your frontend URL: `https://your-app-name.vercel.app`

---

## 🔧 STEP 3: Update Environment Variables

### 3.1 Update Railway with Vercel URL
Go back to Railway → Variables and update:
```
CLIENT_URL=https://your-app-name.vercel.app
```

### 3.2 Redeploy if Needed
- Railway and Vercel will auto-redeploy when you update environment variables
- Or trigger manual redeploy if needed

---

## ✅ STEP 4: Verify Deployment

### 4.1 Test Backend
Visit: `https://your-project-name.railway.app/api/health`
Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-08-04T...",
  "message": "Live Polling API is running"
}
```

### 4.2 Test Frontend
Visit: `https://your-app-name.vercel.app`
- Should load the Live Polling System
- Test teacher and student interfaces
- Verify real-time communication works

### 4.3 Test Full System
1. Open teacher interface in one tab
2. Open student interface in another tab/browser
3. Create a poll as teacher
4. Answer as student
5. Verify real-time updates work
6. Test chat functionality

---

## 🎉 STEP 5: Enable Auto-Deployment

### 5.1 Vercel Auto-Deployment
- Already enabled! Every push to `main` branch auto-deploys frontend
- GitHub Actions workflow will also trigger Vercel deployment

### 5.2 Railway Auto-Deployment
- Already enabled! Every push to `main` branch auto-deploys backend
- Railway watches your GitHub repository

### 5.3 Test Auto-Deployment
Make a small change and push:
```bash
# Make a small change to test auto-deployment
git add .
git commit -m "Test auto-deployment"
git push origin main
```

Both platforms will automatically redeploy!

---

## 📱 Your Live URLs

After deployment, you'll have:

### 🌐 Frontend (Vercel)
- **URL**: `https://live-polling-system-jagadeesh7400.vercel.app`
- **Teacher**: `https://live-polling-system-jagadeesh7400.vercel.app/?role=teacher`
- **Student**: `https://live-polling-system-jagadeesh7400.vercel.app/?role=student`

### 🚂 Backend (Railway)
- **API**: `https://live-polling-system-production.railway.app`
- **Health**: `https://live-polling-system-production.railway.app/api/health`
- **Socket.io**: `wss://live-polling-system-production.railway.app`

---

## 🔧 Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure `CLIENT_URL` in Railway matches your Vercel URL exactly
2. **Socket.io Not Connecting**: Verify `VITE_SOCKET_URL` in Vercel points to Railway
3. **Build Failures**: Check build logs in respective platforms
4. **Environment Variables**: Ensure all variables are set correctly

### Quick Fixes:
- Redeploy if environment variables were updated
- Check logs in platform dashboards
- Verify URLs don't have trailing slashes
- Ensure HTTPS is used for production URLs

---

## 🎯 Next Steps After Deployment:
1. ✅ Share your live URLs with users
2. ✅ Monitor usage in platform dashboards
3. ✅ Set up custom domains (optional)
4. ✅ Configure analytics (optional)
5. ✅ Set up monitoring/alerts (optional)

**Your Live Polling System is now live and auto-deploying! 🚀**
