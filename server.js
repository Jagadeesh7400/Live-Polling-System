const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Serve static files from React
app.use(express.static(path.join(__dirname, "frontend/build")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

let pollHistory = [];
let currentPoll = null;
let answers = {};


app.get("/api/poll-history", (req, res) => {
  res.json(pollHistory);
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send current poll to new clients
  if (currentPoll) {
    socket.emit("poll_created", currentPoll);
    socket.emit("poll_update", answers);
  }

  // Teacher creates poll
  socket.on("create_poll", (data) => {
    currentPoll = {
      question: data.question,
      options: data.options,
      correct: data.correct,
      timer: data.timer
    };
    answers = {};
    io.emit("poll_created", currentPoll);
    io.emit("poll_update", answers);
  });

  // Student submits answer
  socket.on("submit_answer", ({ name, answer }) => {
    answers[name] = answer;
    io.emit("poll_update", answers);
  });

  // Student requests current poll
  socket.on("get_poll", () => {
    socket.emit("poll_created", currentPoll);
  });

  // End poll and calculate results
  socket.on("end_poll", () => {
    // Calculate percentages for poll history
    const total = Object.keys(answers).length || 1;
    const optionCounts = currentPoll.options.map(opt => (
      Object.values(answers).filter(a => a === opt).length
    ));
    const pollResult = {
      question: currentPoll.question,
      options: currentPoll.options.map((opt, i) => ({
        text: opt,
        percent: Math.round((optionCounts[i] / total) * 100)
      }))
    };
    pollHistory.push(pollResult);
    currentPoll = null;
    answers = {};
    io.emit("poll_ended");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Reacts Polling Backend is running!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});