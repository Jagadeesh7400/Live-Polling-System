// Simple in-memory storage for Vercel serverless functions
let storage = {
  currentPoll: null,
  pollAnswers: {},
  studentNames: [],
  pollHistory: []
};

module.exports = storage;
