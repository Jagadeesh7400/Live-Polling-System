import React, { useState, useEffect } from "react";
import ChatPopup from "./ChatPopup";
import "./StudentDashboard.css";


function StudentDashboard({ socket }) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState("");
  const [existingNames, setExistingNames] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [kicked, setKicked] = useState(false);

  useEffect(() => {
    socket.on("poll_created", (data) => {
      setPoll(data);
      setAnswered(false);
      setAnswer("");
      setResults({});
      setTimeLeft(data.timer || 60); // use poll's timer
    });
    socket.on("poll_update", (data) => {
      setResults(data);
    });
    // Fetch existing student names from server or socket
    socket.on("student_names", (names) => {
      setExistingNames(names);
    });
    socket.on("kicked", () => {
      setKicked(true);
    });
    socket.emit("get_student_names");
    return () => {
      socket.off("poll_created");
      socket.off("poll_update");
      socket.off("student_names");
      socket.off("kicked");
    };
  }, [socket]);

  useEffect(() => {
    if (poll && !answered) {
      setTimeLeft(poll.timer || 60); // <-- use poll's timer value
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setAnswered(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [poll, answered]);

  useEffect(() => {
    if (submitted) {
      socket.emit("get_poll");
    }
  }, [submitted, socket]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    // Only alphabets, no spaces, no numbers
    if (!/^[A-Za-z]+$/.test(name)) {
      setError("Name must contain only alphabets (A-Z, a-z) and no spaces.");
      return;
    }
    // Uniqueness check
    if (existingNames.includes(name)) {
      setError("This name is already taken. Please choose a unique name.");
      return;
    }
    setError("");
    setSubmitted(true);
    socket.emit("student_join", name);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (answer) {
      setAnswered(true);
      socket.emit("submit_answer", { name, answer });
    }
  };

  function getOptionCounts(options, answers) {
    const counts = {};
    options.forEach(opt => { counts[opt] = 0; });
    Object.values(answers).forEach(ans => {
      if (counts.hasOwnProperty(ans)) counts[ans]++;
    });
    return counts;
  }

  if (kicked) {
    return (
      <div className="student-container">
        <div className="intervue-badge">
          <span role="img" aria-label="star" style={{ marginRight: 6 }}>★</span>
          Intervue Poll
        </div>
        <div className="student-kicked-title">
          You’ve been Kicked out !
        </div>
        <div className="student-kicked-desc">
          Looks like the teacher had removed you from the poll system. Please<br />
          Try again sometime.
        </div>
      </div>
    );
  }

  return (
    <div className="student-container">
      <div className="intervue-badge">
        <span role="img" aria-label="star" style={{ marginRight: 6 }}>★</span>
        Intervue Poll
      </div>
      {!submitted ? (
        <form className="student-form" onSubmit={handleNameSubmit}>
          <div className="student-title">
            Let’s <strong>Get Started</strong>
          </div>
          <div className="student-desc">
            If you’re a student, you’ll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
          </div>
          <label className="student-label" htmlFor="student-name-input">
            Enter your Name
          </label>
          <input
            id="student-name-input"
            className="student-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          {error && <div style={{ color: "#e74c3c", marginBottom: "1rem" }}>{error}</div>}
          <button type="submit" className="student-continue-btn">
            Continue
          </button>
        </form>
      ) : !answered ? (
        poll ? (
          <form className="student-poll-form" onSubmit={handleAnswerSubmit}>
            <div className="student-poll-header">
              <span className="student-poll-qno">Question 1</span>
              <span className="student-poll-timer">
                <span role="img" aria-label="timer" style={{ marginRight: 4 }}>⏱️</span>
                <span style={{ color: "#e74c3c", fontWeight: 600 }}>
                  {`00:${timeLeft.toString().padStart(2, "0")}`}
                </span>
              </span>
            </div>
            <div className="student-poll-card">
              <div className="student-poll-card-header">{poll.question}</div>
              <div className="student-poll-options">
                {poll.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`student-poll-option${answer === opt ? " selected" : ""}`}
                  >
                    <span className="student-poll-option-index">{idx + 1}</span>
                    <input
                      type="radio"
                      name="poll"
                      value={opt}
                      checked={answer === opt}
                      onChange={() => setAnswer(opt)}
                      required
                      disabled={timeLeft === 0}
                      style={{ display: "none" }}
                    />
                    <span className="student-poll-option-text">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="student-poll-actions">
              <button
                type="submit"
                className="student-submit-btn"
                disabled={timeLeft === 0}
              >
                Submit
              </button>
            </div>
          </form>
        ) : (
          <div className="student-waiting">
            <div className="intervue-badge">
              <span role="img" aria-label="star" style={{ marginRight: 6 }}>★</span>
              Intervue Poll
            </div>
            <div className="student-loader">
              <div className="student-spinner"></div>
            </div>
            <div className="student-waiting-text">
              Wait for the teacher to ask questions..
            </div>
            {/* Optionally, add your chat button here if needed */}
          </div>
        )
      ) : (
        <div className="student-results">
          {(answered || timeLeft === 0) && poll && (
            <div className="student-poll-results-section">
              <div className="student-poll-header">
                <span className="student-poll-qno">Question 1</span>
                <span className="student-poll-timer">
                  <span role="img" aria-label="timer" style={{ marginRight: 4 }}>⏱️</span>
                  <span style={{ color: "#e74c3c", fontWeight: 600 }}>
                    {`00:${timeLeft.toString().padStart(2, "0")}`}
                  </span>
                </span>
              </div>
              <div className="student-poll-card">
                <div className="student-poll-card-header">{poll.question}</div>
                <div className="student-poll-options">
                  {poll.options.map((opt, i) => {
                    const total = Object.keys(results).length || 1;
                    const count = Object.values(results).filter(a => a === opt).length;
                    const percent = Math.round((count / total) * 100);
                    return (
                      <div className="student-poll-result-row" key={i}>
                        <div className="student-poll-option-index">{i + 1}</div>
                        <div className="student-poll-result-bar-wrap">
                          <div
                            className="student-poll-result-bar"
                            style={{
                              width: `${percent}%`,
                              background: "#7367F0"
                            }}
                          >
                            <span className="student-poll-option-text">{opt}</span>
                          </div>
                        </div>
                        <div className="student-poll-result-percent">{percent}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="student-poll-wait-msg">
                Wait for the teacher to ask a new question.
              </div>
              <button
                className="chat-popup-btn"
                onClick={() => setShowChat(true)}
              >
                💬
              </button>
              <ChatPopup open={showChat} onClose={() => setShowChat(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;