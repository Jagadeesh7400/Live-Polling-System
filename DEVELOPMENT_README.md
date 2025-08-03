# Live Polling System

A real-time polling system built with React and Express.js with Socket.io for live updates.

## Features

### Teacher Dashboard
- Create polls with multiple options
- Set configurable timer (30-120 seconds)
- View live poll results as students answer
- Monitor student participation
- Remove students from session
- View poll history
- Real-time chat with students

### Student Dashboard
- Join with unique name validation
- Submit answers within time limit
- View live poll results after submission
- Real-time chat with teacher
- Automatic kick-out detection

### Real-time Features
- Live poll creation and broadcasting
- Real-time answer submission and result updates
- Live chat between teachers and students
- Student management with real-time notifications
- Automatic timer countdown

## Technology Stack

- **Frontend**: React (with Vite)
- **Backend**: Express.js
- **Real-time**: Socket.io
- **Styling**: CSS3 (following Figma design)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Run Both Server and Client Together
```bash
npm run dev
```
This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

#### Option 2: Run Separately

**Start the Backend Server:**
```bash
npm run server
```

**Start the Frontend (in another terminal):**
```bash
npm start
```

### Usage

1. Open `http://localhost:3000` in your browser
2. Choose your role:
   - **Teacher**: Create and manage polls
   - **Student**: Join and participate in polls

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/poll` - Get current poll
- `POST /api/poll` - Create new poll
- `POST /api/answer` - Submit answer
- `GET /api/results` - Get poll results
- `POST /api/join` - Join as student
- `GET /api/students` - Get student list
- `POST /api/remove-student` - Remove student
- `GET /api/poll-history` - Get poll history
- `POST /api/clear` - Clear poll data

### Socket.io Events

#### Client to Server
- `student_join` - Student joins session
- `create_poll` - Teacher creates poll
- `submit_answer` - Student submits answer
- `remove_student` - Teacher removes student
- `send_message` - Send chat message

#### Server to Client
- `poll_created` - New poll broadcast
- `poll_update` - Answer updates
- `student_names` - Updated student list
- `student_removed` - Student removal notification
- `new_message` - New chat message

## Design

The UI follows the provided Figma design with:
- Clean, modern interface
- Responsive design
- Real-time visual feedback
- Intuitive user experience

## Project Structure

```
├── src/
│   ├── Components/
│   │   ├── TeacherDashboard.js/css
│   │   ├── StudentDashboard.js/css
│   │   ├── ChatPopup.js/css
│   │   └── PollResults.js/css
│   ├── services/
│   │   └── api.js
│   ├── socket.js
│   └── App.js
├── api/
│   └── index.js
├── server/
│   ├── server.js
│   └── package.json
├── dev-server.js
└── package.json
```

## Development Notes

- The system uses in-memory storage for development
- For production, implement proper database storage
- Socket.io provides real-time functionality
- API and Socket.io work together for redundancy

## Features Status

✅ **Must-Have Requirements**
- [x] Functional system with all core features
- [x] Teacher can create polls
- [x] Students can answer polls
- [x] Both can view results
- [x] Follows Figma design

✅ **Good to Have**
- [x] Configurable poll time limit
- [x] Option to remove students
- [x] Well-designed user interface

✅ **Bonus Features**
- [x] Chat popup for teacher-student interaction
- [x] Real-time updates with Socket.io
- [x] Student management features
