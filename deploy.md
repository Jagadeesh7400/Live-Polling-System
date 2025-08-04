# Live Polling System - Deployment Guide

## Overview
This Live Polling System includes:
- Frontend: React application with real-time polling interface
- Backend: Express.js server with Socket.io for real-time communication
- Features: Teacher/Student roles, live polling, chat functionality

## Features Implemented ✅
- **Teacher Features:**
  - Create new polls with multiple choice questions
  - View live polling results in real-time
  - Remove students from the session
  - Access chat functionality
  - View poll history

- **Student Features:**
  - Enter unique name to join session
  - Submit answers to active polls
  - View live results after submission
  - 60-second timer for answering
  - Chat with teacher and other students

- **Technical Features:**
  - Real-time updates using Socket.io
  - Responsive design
  - Cross-platform compatibility
  - RESTful API endpoints
  - In-memory data storage

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main branch

### Option 2: Netlify
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Option 3: Railway (For Full-Stack Deployment)
1. Connect GitHub repository
2. Railway will auto-detect and deploy both frontend and backend
3. Environment variables will be managed automatically

### Option 4: Render
1. Create web service for frontend
2. Create web service for backend (server folder)
3. Set environment variables for cross-communication

## Environment Variables
```
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=5000
```

## Local Development
```bash
# Install dependencies
npm install
cd server && npm install

# Start development server
npm run dev
```

## Production Build
```bash
# Build frontend
npm run build

# Start backend
cd server && npm start
```

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/poll` - Get current poll
- `POST /api/poll` - Create new poll
- `POST /api/answer` - Submit answer
- `GET /api/results` - Get poll results
- `POST /api/join` - Join as student
- `GET /api/students` - Get student list
- `POST /api/remove-student` - Remove student
- `GET /api/poll-history` - Get poll history

## Socket.io Events
- `student_join` - Student joins session
- `create_poll` - Teacher creates poll
- `submit_answer` - Student submits answer
- `poll_update` - Live poll updates
- `send_message` - Chat messages
- `remove_student` - Remove student

## Auto-Deployment Setup
1. Push code to GitHub repository
2. Connect to deployment platform
3. Configure build settings
4. Set environment variables
5. Enable auto-deployment on push to main branch
