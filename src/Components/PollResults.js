import React from "react";
import "./PollResults.css";

function PollResults({ polls }) {
  console.log('PollResults received polls:', polls);
  
  if (!polls || polls.length === 0) {
    return (
      <div className="poll-history-container">
        <div className="poll-history-title">
           <strong>View Poll History</strong>
        </div>
        <div className="no-polls-message">
          No polls available in history yet.
        </div>
      </div>
    );
  }
  
  return (
    <div className="poll-history-container">
      <div className="poll-history-title">
         <strong>View Poll History</strong>
      </div>
      {polls.map((poll, idx) => (
        <div key={idx} className="poll-history-block">
          <div className="poll-history-question">Question {idx + 1}</div>
          <div className="poll-card">
            <div className="poll-card-header">{poll.question || 'No question available'}</div>
            <div className="poll-card-options">
              {poll.options && poll.options.length > 0 ? (
                poll.options.map((opt, i) => (
                  <div className="poll-card-option-row" key={i}>
                    <div className="poll-card-option-index">{i + 1}</div>
                    <div className="poll-card-option-bar-wrap">
                      <div
                        className="poll-card-option-bar"
                        style={{
                          width: `${opt.percent || 0}%`,
                          background: "#7367F0"
                        }}
                      >
                        <span className="poll-card-option-text">{opt.text || opt}</span>
                      </div>
                    </div>
                    <div className="poll-card-option-percent">{opt.percent || 0}%</div>
                  </div>
                ))
              ) : (
                <div className="no-options-message">No options available</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PollResults;