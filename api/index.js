const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ["https://*.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store poll data (in production, use a database)
let currentPoll = null;
let pollAnswers = {};
let studentNames = [];
let pollHistory = [];

// Socket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('student_join', (name) => {
    if (!studentNames.includes(name)) {
      studentNames.push(name);
    }
    socket.emit('student_names', studentNames);
  });

  socket.on('get_student_names', () => {
    socket.emit('student_names', studentNames);
  });

  socket.on('create_poll', (pollData) => {
    currentPoll = pollData;
    pollAnswers = {};
    io.emit('poll_created', pollData);
  });

  socket.on('submit_answer', (data) => {
    pollAnswers[data.name] = data.answer;
    io.emit('poll_update', pollAnswers);
  });

  socket.on('get_poll', () => {
    if (currentPoll) {
      socket.emit('poll_created', currentPoll);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API endpoints
app.get('/api/poll-history', (req, res) => {
  res.json(pollHistory);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
