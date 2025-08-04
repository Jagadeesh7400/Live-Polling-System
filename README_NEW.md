# 🎯 Live Polling System

A real-time interactive polling application that enables teachers to create polls and students to participate in live classroom engagement. Built with React, Express.js, and Socket.io for seamless real-time communication.

## 🌟 Features

### 👨‍🏫 Teacher Dashboard
- **Create Polls**: Design multiple-choice questions with up to 4 options
- **Real-time Results**: View live polling results as students respond
- **Student Management**: See connected students and manage participation
- **Poll History**: Access previous polls and their results
- **Chat Integration**: Communicate with students in real-time
- **Timer Control**: Set 60-second response windows for polls

### 👨‍🎓 Student Dashboard  
- **Join Sessions**: Enter with name to participate in live polls
- **Answer Questions**: Submit responses to active polls
- **Real-time Updates**: See poll questions immediately when published
- **Chat Participation**: Interact with teacher and peers
- **Response Tracking**: Visual feedback on submitted answers

### 🔄 Real-time Features
- **Live Polling**: Instant poll distribution and result updates
- **Socket.io Integration**: Real-time bidirectional communication
- **Auto-refresh**: Dynamic updates without page reloads
- **Connection Management**: Robust handling of user connections

## 🚀 Live Demo

- **Frontend**: [https://live-polling-system-mauve.vercel.app](https://live-polling-system-mauve.vercel.app)
- **Backend API**: [https://live-polling-system-14wa.onrender.com](https://live-polling-system-14wa.onrender.com)

### Quick Access URLs:
- **Teacher Interface**: [/?role=teacher](https://live-polling-system-mauve.vercel.app/?role=teacher)
- **Student Interface**: [/?role=student](https://live-polling-system-mauve.vercel.app/?role=student)

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **Vite** - Fast build tool and development server
- **Socket.io Client 4.8.1** - Real-time client communication
- **CSS3** - Responsive styling and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.21.2** - Web application framework
- **Socket.io 4.8.1** - Real-time bidirectional event-based communication
- **CORS** - Cross-origin resource sharing

### Deployment
- **Frontend**: Vercel (Static hosting)
- **Backend**: Render (Node.js hosting)

## 📁 Project Structure

```
Live-Polling-System/
├── src/                          # React frontend source
│   ├── Components/              
│   │   ├── TeacherDashboard.js  # Teacher interface
│   │   ├── StudentDashboard.js  # Student interface
│   │   ├── PollResults.js       # Results visualization
│   │   ├── PollTemplates.js     # Poll creation templates
│   │   └── ChatPopup.js         # Chat functionality
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── socket.js                # Socket.io client setup
│   ├── App.js                   # Main application component
│   └── index.js                 # Application entry point
├── server/                      # Express.js backend
│   ├── server.js                # Main server file
│   └── package.json             # Backend dependencies
├── public/                      # Static assets
├── dist/                        # Production build output
├── .env.example                 # Environment variables template
├── vercel.json                  # Vercel deployment config
├── vite.config.js               # Vite configuration
└── package.json                 # Frontend dependencies
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### 1. Clone Repository
```bash
git clone https://github.com/Jagadeesh7400/Live-Polling-System.git
cd Live-Polling-System
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Start Development Servers
```bash
# Terminal 1: Start backend server
cd server
npm start

# Terminal 2: Start frontend development server
npm start
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Teacher Dashboard**: http://localhost:3000/?role=teacher
- **Student Dashboard**: http://localhost:3000/?role=student

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables:
   - `VITE_API_URL`: Your backend URL
   - `VITE_SOCKET_URL`: Your backend URL
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set root directory to `/server`
3. Add environment variable:
   - `CLIENT_URL`: Your frontend URL
4. Deploy with Node.js runtime

## 📚 API Documentation

### Endpoints

#### Polls
- `GET /api/poll` - Get current active poll
- `POST /api/poll` - Create new poll
- `POST /api/answer` - Submit poll answer
- `GET /api/results` - Get poll results
- `GET /api/poll-history` - Get previous polls

#### Students
- `POST /api/join` - Join polling session
- `GET /api/students` - Get connected students
- `POST /api/remove-student` - Remove student

#### System
- `GET /api/health` - Health check
- `POST /api/clear` - Clear all data

### Socket Events

#### Teacher Events
- `poll-created` - New poll published
- `poll-results-updated` - Results changed
- `student-joined` - New student connected
- `student-left` - Student disconnected

#### Student Events
- `new-poll` - Receive new poll
- `poll-results` - Receive updated results
- `poll-ended` - Poll completed

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```bash
VITE_API_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com
```

#### Backend
```bash
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**Jagadeesh7400**
- GitHub: [@Jagadeesh7400](https://github.com/Jagadeesh7400)
- Project: [Live-Polling-System](https://github.com/Jagadeesh7400/Live-Polling-System)

## 🙏 Acknowledgments

- React team for the amazing library
- Socket.io team for real-time communication
- Vercel for seamless frontend deployment
- Render for reliable backend hosting

---

**Happy Polling! 🎉**
