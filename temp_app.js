import React, { useState, useEffect } from "react";
import "./App.css";
import "./Components/TeacherDashboard.css";
import TeacherDashboard from "./Components/TeacherDashboard";
import StudentDashboard from "./Components/StudentDashboard";

function App() {
  const [persona, setPersona] = useState(null);
  const [selected, setSelected] = useState(null);
  const [teacherLoggedIn, setTeacherLoggedIn] = useState(false);

  useEffect(() => {
    const isTeacherActive = localStorage.getItem("teacherActive");
    if (isTeacherActive === "true") {
      setTeacherLoggedIn(true);
    }
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
              <div className="role-card-title">I am a Student</div>
              <div className="role-card-desc">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry
              </div>
            </div>
            <div
              className={`role-card${selected === "teacher" ? " selected" : ""}${teacherLoggedIn ? " disabled" : ""}`}
              onClick={() => !teacherLoggedIn && setSelected("teacher")}
              style={{ 
                cursor: teacherLoggedIn ? "not-allowed" : "pointer",
                opacity: teacherLoggedIn ? 0.5 : 1 
              }}
            >
              <div className="role-card-title">
                I am a Teacher {teacherLoggedIn && "(Currently Active)"}
              </div>
              <div className="role-card-desc">
                {teacherLoggedIn ? 
                  "A teacher is already logged in. Only one teacher session is allowed." :
                  "Submit answers and view live poll results in real-time"
                }
              </div>
            </div>
          </div>
          <button
            className="continue-btn"
            disabled={!selected || (selected === "teacher" && teacherLoggedIn)}
            onClick={() => {
              setPersona(selected);
              if (selected === "teacher") {
                setTeacherLoggedIn(true);
                localStorage.setItem("teacherActive", "true");
              }
            }}
          >
            Continue
          </button>
        </div>
      ) : persona === "teacher" ? (
        <TeacherDashboard />
      ) : (
        <StudentDashboard />
      )}
    </div>
  );
}

export default App;
