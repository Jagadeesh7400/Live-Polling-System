import React, { useState, useEffect } from "react";
import PollResults from "./PollResults";
import ChatPopup from "./ChatPopup";
import "./TeacherDashboard.css";

const TIMER_OPTIONS = [30, 45, 60, 90, 120];

function TeacherDashboard({ socket }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", correct: false },
    { text: "", correct: false }
  ]);
  const [timer, setTimer] = useState(60);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pollCreated, setPollCreated] = useState(false);
  const [answers, setAnswers] = useState({});
  const [pollHistory, setPollHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    socket.on("poll_update", (data) => {
      setAnswers(data);
    });
    return () => {
      socket.off("poll_update");
    };
  }, [socket]);

  useEffect(() => {
    fetch("/api/poll-history")
      .then(res => res.json())
      .then(data => setPollHistory(data));
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && options.every(opt => opt.text.trim())) {
      setPollCreated(true);
      socket.emit("create_poll", {
        question,
        options: options.map(opt => opt.text),
        correct: options.map(opt => opt.correct),
        timer
      });
    }
  };

  const handleNewPoll = () => {
    setQuestion("");
    setOptions([
      { text: "", correct: false },
      { text: "", correct: false }
    ]);
    setPollCreated(false);
    setAnswers({});
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
            <button type="submit" className="ask-question-btn">
              Ask Question
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
                const total = Object.keys(answers).length || 1;
                const count = Object.values(answers).filter(a => a === opt.text).length;
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
          {Object.keys(answers).length > 0 && (
            <button
              className="view-history-btn"
              onClick={() => setShowHistory(true)}
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

