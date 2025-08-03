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
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Live Polling API is running' 
  });
});

// Get current poll
app.get('/poll', (req, res) => {
  res.json(currentPoll);
});

// Create a new poll
app.post('/poll', (req, res) => {
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

    // Save previous poll to history with final results
    if (currentPoll && Object.keys(pollAnswers).length > 0) {
      const totalAnswers = Object.keys(pollAnswers).length;
      const pollWithResults = {
        ...currentPoll,
        options: currentPoll.options.map((opt, idx) => {
          const count = Object.values(pollAnswers).filter(answer => answer === opt).length;
          const percent = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;
          return {
            text: opt,
            percent: percent,
            count: count,
            isCorrect: currentPoll.correct[idx]
          };
        }),
        totalAnswers: totalAnswers,
        answeredBy: Object.keys(pollAnswers),
        completedAt: new Date().toISOString()
      };
      
      // Add to history (or update if already exists)
      const existingIndex = pollHistory.findIndex(p => p.id === currentPoll.id);
      if (existingIndex >= 0) {
        pollHistory[existingIndex] = pollWithResults;
      } else {
        pollHistory.push(pollWithResults);
      }
      
      console.log('Previous poll saved to history with results:', pollWithResults);
    }
    
    // Create new poll
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

    // Emit to all connected clients via Socket.io
    if (req.io) {
      req.io.emit('poll_created', currentPoll);
      console.log('Poll broadcast via Socket.io');
    }
    
    res.json(currentPoll);
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Internal server error while creating poll' });
  }
});

// Submit an answer
app.post('/answer', (req, res) => {
  const { name, answer } = req.body;
  
  if (!name || !answer) {
    return res.status(400).json({ error: 'Name and answer are required' });
  }
  
  if (!currentPoll) {
    return res.status(400).json({ error: 'No active poll to answer' });
  }
  
  pollAnswers[name] = answer;

  // Emit update via Socket.io
  if (req.io) {
    req.io.emit('poll_update', pollAnswers);
  }
  
  res.json({ 
    success: true, 
    totalAnswers: Object.keys(pollAnswers).length 
  });
});

// Get poll results
app.get('/results', (req, res) => {
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
app.post('/join', (req, res) => {
  try {
    console.log('Join request received:', req.body);
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (studentNames.includes(name)) {
      return res.status(409).json({ error: 'Name already taken' });
    }
    
    studentNames.push(name);
    
    // Emit update via Socket.io
    if (req.io) {
      req.io.emit('student_names', studentNames);
      req.io.emit('student_joined', { name, total: studentNames.length });
    }
    
    console.log('Student joined successfully:', name, 'Total students:', studentNames.length);
    res.json({ success: true, studentNames });
  } catch (error) {
    console.error('Error in join endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student names
app.get('/students', (req, res) => {
  res.json(studentNames);
});

// Remove student (kick out)
app.post('/remove-student', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Student name is required' });
  }
  
  // Remove from student names
  studentNames = studentNames.filter(student => student !== name);
  
  // Remove their poll answer if exists
  delete pollAnswers[name];

  // Emit updates via Socket.io
  if (req.io) {
    req.io.emit('student_names', studentNames);
    req.io.emit('student_removed', name);
    req.io.emit('poll_update', pollAnswers);
  }
  
  res.json({ 
    success: true, 
    message: `Student ${name} has been removed`,
    remainingStudents: studentNames
  });
});

// Get poll history
app.get('/poll-history', (req, res) => {
  const historyToReturn = [...pollHistory];
  
  // If there's a current active poll with answers, include it in the history
  if (currentPoll && Object.keys(pollAnswers).length > 0) {
    const totalAnswers = Object.keys(pollAnswers).length;
    const currentPollWithResults = {
      ...currentPoll,
      options: currentPoll.options.map((opt, idx) => {
        const count = Object.values(pollAnswers).filter(answer => answer === opt).length;
        const percent = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;
        return {
          text: opt,
          percent: percent,
          count: count,
          isCorrect: currentPoll.correct[idx]
        };
      }),
      totalAnswers: totalAnswers,
      answeredBy: Object.keys(pollAnswers),
      isActive: true // Mark as currently active poll
    };
    
    // Check if this poll is already in history and update it, otherwise add it
    const existingIndex = historyToReturn.findIndex(p => p.id === currentPoll.id);
    if (existingIndex >= 0) {
      historyToReturn[existingIndex] = currentPollWithResults;
    } else {
      historyToReturn.push(currentPollWithResults);
    }
  }
  
  res.json(historyToReturn);
});

// Chat functionality
app.get('/chat-history', (req, res) => {
  // This will be handled by Socket.io in most cases
  res.json([]);
});

app.post('/chat-message', (req, res) => {
  const { user, text, isTeacher } = req.body;
  
  if (!user || !text) {
    return res.status(400).json({ error: 'User and message text are required' });
  }

  const message = {
    id: Date.now(),
    user,
    text: text.trim(),
    timestamp: new Date().toISOString(),
    isTeacher: isTeacher || false
  };

  // Emit via Socket.io if available
  if (req.io) {
    req.io.emit('new_message', message);
  }

  res.json({ success: true, message });
});

// Clear poll data (for testing)
app.post('/clear', (req, res) => {
  currentPoll = null;
  pollAnswers = {};
  studentNames = [];
  res.json({ success: true, message: 'Data cleared' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Handle 404
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;
