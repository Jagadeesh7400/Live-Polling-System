import React, { useState, useEffect } from "react";
import ChatPopup from "./ChatPopup";
import ApiService from "../services/api";
import "./StudentDashboard.css";


function StudentDashboard() {
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for existing poll and get student names
    checkForPoll();
    getStudentNames();
    
    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      if (submitted && !answered) {
        checkForPoll();
      }
      if (answered) {
        fetchResults();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [submitted, answered]);

  // Timer effect for poll countdown
  useEffect(() => {
    if (poll && !answered && timeLeft > 0) {
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
  }, [poll, answered, timeLeft]);

  const checkForPoll = async () => {
    try {
      const currentPoll = await ApiService.getCurrentPoll();
      if (currentPoll && currentPoll !== poll) {
        setPoll(currentPoll);
        setAnswered(false);
        setAnswer("");
        setResults({});
        setTimeLeft(currentPoll.timer || 60);
      }
    } catch (error) {
      console.error('Error checking for poll:', error);
    }
  };

  const getStudentNames = async () => {
    try {
      const names = await ApiService.getStudents();
      setExistingNames(names);
    } catch (error) {
      console.error('Error getting student names:', error);
    }
  };

  const fetchResults = async () => {
    try {
      const data = await ApiService.getPollResults();
      setResults(data.answers || {});
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  useEffect(() => {
    if (submitted) {
      checkForPoll();
    }
  }, [submitted]);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!/^[A-Za-z]+$/.test(name)) {
      setError("Name must contain only alphabets (A-Z, a-z) and no spaces.");
      return;
    }
    
    if (existingNames.includes(name)) {
      setError("This name is already taken. Please choose a unique name.");
      return;
    }
    
    setIsLoading(true);
    try {
      await ApiService.joinAsStudent(name);
      setError("");
      setSubmitted(true);
      getStudentNames(); // Refresh the names list
    } catch (error) {
      setError(error.message || "Failed to join. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (answer && !answered) {
      setIsLoading(true);
      try {
        await ApiService.submitAnswer(name, answer);
        setAnswered(true);
        fetchResults();
      } catch (error) {
        console.error('Error submitting answer:', error);
        alert('Failed to submit answer. Please try again.');
      } finally {
        setIsLoading(false);
      }
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