const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// In-memory storage (in production, use a database)
let currentPoll = null;
let pollAnswers = {};
let studentNames = [];
let pollHistory = [];

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
  const { question, options, correct, timer } = req.body;
  
  currentPoll = {
    id: Date.now(),
    question,
    options,
    correct,
    timer: timer || 60,
    createdAt: new Date().toISOString()
  };
  
  // Reset answers for new poll
  pollAnswers = {};
  
  res.json(currentPoll);
});

// Submit an answer
app.post('/api/answer', (req, res) => {
  const { name, answer } = req.body;
  
  if (!name || !answer) {
    return res.status(400).json({ error: 'Name and answer are required' });
  }
  
  pollAnswers[name] = answer;
  
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
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (studentNames.includes(name)) {
    return res.status(409).json({ error: 'Name already taken' });
  }
  
  studentNames.push(name);
  res.json({ success: true, studentNames });
});

// Get student names
app.get('/api/students', (req, res) => {
  res.json(studentNames);
});

// Get poll history
app.get('/api/poll-history', (req, res) => {
  res.json(pollHistory);
});

// Clear poll data (for testing)
app.post('/api/clear', (req, res) => {
  currentPoll = null;
  pollAnswers = {};
  studentNames = [];
  res.json({ success: true, message: 'Data cleared' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;
