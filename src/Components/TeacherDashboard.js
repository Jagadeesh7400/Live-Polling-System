import React, { useState, useEffect } from "react";
import PollResults from "./PollResults";
import ChatPopup from "./ChatPopup";
import ApiService from "../services/api";
import "./TeacherDashboard.css";

const TIMER_OPTIONS = [30, 45, 60, 90, 120];

function TeacherDashboard() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", correct: false },
    { text: "", correct: false }
  ]);
  const [timer, setTimer] = useState(60);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pollCreated, setPollCreated] = useState(false);
  const [results, setResults] = useState({});
  const [pollHistory, setPollHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for existing poll on component mount
    checkForExistingPoll();
    
    // Poll for results every 2 seconds when poll is active
    let interval;
    if (pollCreated) {
      interval = setInterval(fetchResults, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pollCreated]);

  const checkForExistingPoll = async () => {
    try {
      const poll = await ApiService.getCurrentPoll();
      if (poll) {
        setQuestion(poll.question);
        setOptions(poll.options.map((opt, idx) => ({
          text: opt,
          correct: poll.correct[idx]
        })));
        setTimer(poll.timer);
        setPollCreated(true);
        fetchResults();
      }
    } catch (error) {
      console.error('Error checking for existing poll:', error);
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

  const fetchPollHistory = async () => {
    try {
      const history = await ApiService.getPollHistory();
      setPollHistory(history);
    } catch (error) {
      console.error('Error fetching poll history:', error);
    }
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx].text = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx].correct = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: "", correct: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!question.trim()) {
      alert('Please enter a question.');
      return;
    }
    
    if (options.length < 2) {
      alert('Please provide at least 2 options.');
      return;
    }
    
    if (!options.every(opt => opt.text.trim())) {
      alert('Please fill in all option texts.');
      return;
    }
    
    setIsLoading(true);
    try {
      const pollData = {
        question: question.trim(),
        options: options.map(opt => opt.text.trim()),
        correct: options.map(opt => opt.correct),
        timer
      };
      
      console.log('Creating poll with data:', pollData);
      await ApiService.createPoll(pollData);
      setPollCreated(true);
      fetchResults();
    } catch (error) {
      console.error('Error creating poll:', error);
      alert(`Failed to create poll: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPoll = async () => {
    setQuestion("");
    setOptions([
      { text: "", correct: false },
      { text: "", correct: false }
    ]);
    setPollCreated(false);
    setResults({});
    
    // Clear existing poll data
    try {
      await ApiService.clearData();
    } catch (error) {
      console.error('Error clearing poll data:', error);
    }
  };

  return (
    <div className="teacher-container">
      <div className="intervue-badge">
        <span role="img" aria-label="star" style={{ marginRight: 6 }}>★</span>
        Intervue Poll
      </div>
      {!pollCreated && (
        <>
          <div className="teacher-title">
            Let’s <strong>Get Started</strong>
          </div>
          <div className="teacher-desc">
            you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
          </div>
        </>
      )}
      {!pollCreated ? (
        <form className="teacher-form" onSubmit={handleSubmit}>
          <div className="teacher-label-row">
            <label className="teacher-label">Enter your question</label>
            <div className="teacher-timer-dropdown">
              <button
                type="button"
                className="timer-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {timer} seconds <span style={{ marginLeft: 6 }}>▼</span>
              </button>
              {showDropdown && (
                <div className="timer-dropdown-list">
                  {TIMER_OPTIONS.map(opt => (
                    <div
                      key={opt}
                      className={`timer-dropdown-item${timer === opt ? " selected" : ""}`}
                      onClick={() => { setTimer(opt); setShowDropdown(false); }}
                    >
                      {opt} seconds
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <textarea
            className="teacher-question-input"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            maxLength={100}
            rows={3}
            placeholder="Type your question here..."
          />
          <div className="teacher-char-count">{question.length}/100</div>

          <div className="teacher-options-row">
            <div className="teacher-label" style={{ flex: 1 }}>Edit Options</div>
            <div className="teacher-label" style={{ width: 180, textAlign: "center" }}>Is it Correct?</div>
          </div>
          {options.map((opt, idx) => (
            <div className="teacher-option-item" key={idx}>
              <div className="teacher-option-index">{idx + 1}</div>
              <input
                className="teacher-option-input"
                type="text"
                value={opt.text}
                onChange={e => handleOptionChange(idx, e.target.value)}
                placeholder="Option text"
              />
              <div className="teacher-option-correct">
                <label className={`radio-label${opt.correct ? " selected" : ""}`}>
                  <input
                    type="radio"
                    name={`correct-${idx}`}
                    checked={opt.correct}
                    onChange={() => handleCorrectChange(idx, true)}
                  />
                  Yes
                </label>
                <label className={`radio-label${!opt.correct ? " selected" : ""}`}>
                  <input
                    type="radio"
                    name={`correct-${idx}`}
                    checked={!opt.correct}
                    onChange={() => handleCorrectChange(idx, false)}
                  />
                  No
                </label>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="add-option-btn"
            onClick={addOption}
          >
            + Add More option
          </button>
          <div className="teacher-bottom-bar">
            <button type="submit" className="ask-question-btn" disabled={isLoading}>
              {isLoading ? "Creating Poll..." : "Ask Question"}
            </button>
          </div>
        </form>
      ) : (
        <div className="poll-results-section">
          <div className="poll-history-question">Question</div>
          <div className="poll-card">
            <div className="poll-card-header">{question}</div>
            <div className="poll-card-options">
              {options.map((opt, i) => {
                const total = Object.keys(results).length || 1;
                const count = Object.values(results).filter(a => a === opt.text).length;
                const percent = Math.round((count / total) * 100);
                return (
                  <div className="poll-card-option-row" key={i}>
                    <div className="poll-card-option-index">{i + 1}</div>
                    <div className="poll-card-option-bar-wrap">
                      <div
                        className="poll-card-option-bar"
                        style={{ width: `${percent}%` }}
                      >
                        <span className="poll-card-option-text">{opt.text}</span>
                      </div>
                    </div>
                    <div className="poll-card-option-percent">{percent}%</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="poll-results-actions">
            <button
              className="ask-question-btn"
              onClick={handleNewPoll}
            >
              + Ask a new question
            </button>
          </div>
          <button
            className="chat-popup-btn"
            onClick={() => setShowChat(true)}
          >
            💬
          </button>
          <ChatPopup open={showChat} onClose={() => setShowChat(false)} />
          {Object.keys(results).length > 0 && (
            <button
              className="view-history-btn"
              onClick={() => {
                setShowHistory(true);
                fetchPollHistory();
              }}
            >
              👁️ View Poll History
            </button>
          )}
          {showHistory && (
            <div className="poll-history-modal">
              <button
                className="close-history-btn"
                onClick={() => setShowHistory(false)}
              >
                ✖ Close
              </button>
              <PollResults polls={pollHistory} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;

