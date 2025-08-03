import React from "react";
import "./PollResults.css";

function PollResults({ polls }) {
  return (
    <div className="poll-history-container">
      <div className="poll-history-title">
         <strong>View Poll History</strong>
      </div>
      {polls.map((poll, idx) => (
        <div key={idx} className="poll-history-block">
          <div className="poll-history-question">Question {idx + 1}</div>
          <div className="poll-card">
            <div className="poll-card-header">{poll.question}</div>
            <div className="poll-card-options">
              {poll.options.map((opt, i) => (
                <div className="poll-card-option-row" key={i}>
                  <div className="poll-card-option-index">{i + 1}</div>
                  <div className="poll-card-option-bar-wrap">
                    <div
                      className="poll-card-option-bar"
                      style={{
                        width: `${opt.percent}%`,
                        background: "#7367F0"
                      }}
                    >
                      <span className="poll-card-option-text">{opt.text}</span>
                    </div>
                  </div>
                  <div className="poll-card-option-percent">{opt.percent}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PollResults;