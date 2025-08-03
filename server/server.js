const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store poll data
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
