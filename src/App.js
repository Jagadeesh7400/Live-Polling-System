import React, { useState, useEffect } from "react";
import socket from "./socket";
import "./App.css";
import "./components/TeacherDashboard.css";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";

function App() {
  const [persona, setPersona] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app-container">
      {!persona ? (
        <div className="welcome-box">
          <div className="intervue-badge">
            <span role="img" aria-label="star" style={{ marginRight: 6 }}>★</span>
            Intervue Poll
          </div>
          <div className="welcome-title">
            Welcome to the <strong>Live Polling System</strong>
          </div>
          <div className="welcome-desc">
            Please select the role that best describes you to begin using the live polling system
          </div>
          <div className="role-cards">
            <div
              className={`role-card${selected === "student" ? " selected" : ""}`}
              onClick={() => setSelected("student")}
            >
              <div className="role-card-title">I’m a Student</div>
              <div className="role-card-desc">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry
              </div>
            </div>
            <div
              className={`role-card${selected === "teacher" ? " selected" : ""}`}
              onClick={() => setSelected("teacher")}
            >
              <div className="role-card-title">I’m a Teacher</div>
              <div className="role-card-desc">
                Submit answers and view live poll results in real-time
              </div>
            </div>
          </div>
          <button
            className="continue-btn"
            disabled={!selected}
            onClick={() => setPersona(selected)}
          >
            Continue
          </button>
        </div>
      ) : persona === "teacher" ? (
        <TeacherDashboard socket={socket} />
      ) : (
        <StudentDashboard socket={socket} />
      )}
    </div>
  );
}

export default App;