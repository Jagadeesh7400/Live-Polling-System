// Development server that combines API and Socket.io
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
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
let chatMessages = [];

// Socket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Send existing data to new connections
  socket.emit('student_names', studentNames);
  socket.emit('chat_history', chatMessages);
  if (currentPoll) {
    socket.emit('poll_created', currentPoll);
    socket.emit('poll_update', pollAnswers);
  }

  socket.on('student_join', (name) => {
    if (!studentNames.includes(name)) {
      studentNames.push(name);
      io.emit('student_names', studentNames);
      io.emit('student_joined', { name, total: studentNames.length });
      console.log(`Student ${name} joined. Total: ${studentNames.length}`);
    }
  });

  socket.on('create_poll', (pollData) => {
    currentPoll = pollData;
    pollAnswers = {};
    
    // Add to poll history
    const historyPoll = {
      ...pollData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      options: pollData.options.map(opt => ({
        text: opt,
        percent: 0
      }))
    };
    pollHistory.push(historyPoll);
    
    io.emit('poll_created', pollData);
    console.log('Poll created and broadcast:', pollData.question);
  });

  socket.on('submit_answer', (data) => {
    if (currentPoll && !pollAnswers[data.name]) {
      pollAnswers[data.name] = data.answer;
      io.emit('poll_update', pollAnswers);
      io.emit('answer_submitted', { name: data.name, total: Object.keys(pollAnswers).length });
      console.log(`Answer submitted by ${data.name}: ${data.answer}`);
    }
  });

  socket.on('remove_student', (studentName) => {
    studentNames = studentNames.filter(name => name !== studentName);
    delete pollAnswers[studentName];
    io.emit('student_names', studentNames);
    io.emit('student_removed', studentName);
    io.emit('poll_update', pollAnswers);
    console.log(`Student ${studentName} removed`);
  });

  socket.on('send_message', (messageData) => {
    const message = {
      id: Date.now(),
      user: messageData.user,
      text: messageData.text,
      timestamp: new Date().toISOString(),
      isTeacher: messageData.isTeacher || false
    };
    chatMessages.push(message);
    io.emit('new_message', message);
    console.log('Chat message:', message.user, ':', message.text);
  });

  socket.on('get_chat_history', () => {
    socket.emit('chat_history', chatMessages);
  });

  socket.on('get_student_names', () => {
    socket.emit('student_names', studentNames);
  });

  socket.on('get_poll', () => {
    if (currentPoll) {
      socket.emit('poll_created', currentPoll);
      socket.emit('poll_update', pollAnswers);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Live Polling API is running' 
  });
});

// Get current poll
app.get('/api/poll', (req, res) => {
  res.json(currentPoll);
});

// Create a new poll
app.post('/api/poll', (req, res) => {
  try {
    const { question, options, correct, timer } = req.body;
    
    // Validate required fields
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'At least 2 options are required' });
    }
    
    if (!correct || !Array.isArray(correct) || correct.length !== options.length) {
      return res.status(400).json({ error: 'Correct answers array must match options length' });
    }
    
    currentPoll = {
      id: Date.now(),
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      correct,
      timer: timer || 60,
      createdAt: new Date().toISOString()
    };
    
    // Reset answers for new poll
    pollAnswers = {};
    
    // Add to poll history
    pollHistory.push({
      ...currentPoll,
      options: currentPoll.options.map((opt, idx) => ({
        text: opt,
        percent: 0
      }))
    });

    // Emit to all connected clients
    io.emit('poll_created', currentPoll);
    
    res.json(currentPoll);
    console.log('Poll created via API:', currentPoll.question);
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Internal server error while creating poll' });
  }
});

// Submit an answer
app.post('/api/answer', (req, res) => {
  const { name, answer } = req.body;
  
  if (!name || !answer) {
    return res.status(400).json({ error: 'Name and answer are required' });
  }
  
  if (!currentPoll) {
    return res.status(400).json({ error: 'No active poll to answer' });
  }
  
  pollAnswers[name] = answer;
  io.emit('poll_update', pollAnswers);
  
  res.json({ 
    success: true, 
    totalAnswers: Object.keys(pollAnswers).length 
  });
});

// Get poll results
app.get('/api/results', (req, res) => {
  const results = {};
  
  if (currentPoll) {
    currentPoll.options.forEach(option => {
      results[option] = Object.values(pollAnswers).filter(answer => answer === option).length;
    });
  }
  
  res.json({
    poll: currentPoll,
    answers: pollAnswers,
    results,
    totalAnswers: Object.keys(pollAnswers).length
  });
});

// Join as student
app.post('/api/join', (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (studentNames.includes(name)) {
      return res.status(409).json({ error: 'Name already taken' });
    }
    
    studentNames.push(name);
    io.emit('student_names', studentNames);
    io.emit('student_joined', { name, total: studentNames.length });
    
    res.json({ success: true, studentNames });
    console.log('Student joined via API:', name);
  } catch (error) {
    console.error('Error in join endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student names
app.get('/api/students', (req, res) => {
  res.json(studentNames);
});

// Remove student (kick out)
app.post('/api/remove-student', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Student name is required' });
  }
  
  studentNames = studentNames.filter(student => student !== name);
  delete pollAnswers[name];
  
  io.emit('student_names', studentNames);
  io.emit('student_removed', name);
  io.emit('poll_update', pollAnswers);
  
  res.json({ 
    success: true, 
    message: `Student ${name} has been removed`,
    remainingStudents: studentNames
  });
});

// Get poll history
app.get('/api/poll-history', (req, res) => {
  res.json(pollHistory);
});

// Clear poll data
app.post('/api/clear', (req, res) => {
  currentPoll = null;
  pollAnswers = {};
  studentNames = [];
  res.json({ success: true, message: 'Data cleared' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Live Polling Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`🔌 Socket.io server ready for real-time connections`);
});
