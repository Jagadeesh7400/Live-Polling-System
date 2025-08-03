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
    
    // Validate that all options have text
    if (options.some(opt => !opt || !opt.trim())) {
      return res.status(400).json({ error: 'All options must have text' });
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
        percent: 0 // Will be updated when poll ends
      }))
    });
    
    res.json(currentPoll);
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

// Remove student (kick out)
app.post('/api/remove-student', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Student name is required' });
  }
  
  // Remove from student names
  studentNames = studentNames.filter(student => student !== name);
  
  // Remove their poll answer if exists
  delete pollAnswers[name];
  
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
