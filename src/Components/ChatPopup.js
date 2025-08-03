import React, { useState, useEffect } from "react";
import socketService from "../socket";
import "./ChatPopup.css";

export default function ChatPopup({ 
  open, 
  onClose, 
  studentNames = [], 
  onRemoveStudent, 
  isTeacher = false,
  studentName = "" 
}) {
  const [tab, setTab] = useState("chat");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    if (open) {
      // Set up chat listeners when popup opens
      socketService.on('new_message', (newMessage) => {
        setChatMessages(prev => [...prev, newMessage]);
      });

      socketService.on('chat_history', (history) => {
        setChatMessages(history);
      });

      // Get chat history
      socketService.getChatHistory();

      return () => {
        socketService.off('new_message');
        socketService.off('chat_history');
      };
    }
  }, [open]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        user: isTeacher ? "Teacher" : studentName,
        text: message.trim(),
        isTeacher
      };
      
      socketService.sendMessage(messageData);
      setMessage("");
    }
  };

  const handleRemoveClick = (studentName) => {
    if (onRemoveStudent) {
      onRemoveStudent(studentName);
    }
  };

  if (!open) return null;

  return (
    <div className="chat-popup-overlay" onClick={onClose}>
      <div className="chat-popup" onClick={e => e.stopPropagation()}>
        <div className="chat-popup-tabs">
          <div
            className={`chat-popup-tab${tab === "chat" ? " active" : ""}`}
            onClick={() => setTab("chat")}
          >
            Chat
          </div>
          {isTeacher && (
            <div
              className={`chat-popup-tab${tab === "participants" ? " active" : ""}`}
              onClick={() => setTab("participants")}
            >
              Participants ({studentNames.length})
            </div>
          )}
        </div>
        <div className="chat-popup-content">
          {tab === "chat" ? (
            <div className="chat-popup-chat">
              <div className="chat-messages">
                {chatMessages.length === 0 ? (
                  <div className="no-messages">No messages yet. Start the conversation!</div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-popup-msg ${msg.isTeacher ? 'teacher' : 'student'}`}>
                      <span className="chat-popup-user">{msg.user}</span>
                      <div
                        className="chat-popup-bubble"
                        style={{
                          background: msg.isTeacher ? "#7367F0" : "#222",
                          color: "#fff"
                        }}
                      >
                        {msg.text}
                      </div>
                      <span className="chat-popup-time">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  className="chat-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  maxLength={200}
                />
                <button type="submit" className="chat-send-btn" disabled={!message.trim()}>
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="chat-popup-participants">
              {studentNames.length === 0 ? (
                <div className="no-participants">No students have joined yet.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentNames.map((name, i) => (
                      <tr key={i}>
                        <td>{name}</td>
                        <td>
                          <button 
                            className="kick-btn"
                            onClick={() => handleRemoveClick(name)}
                          >
                            Kick out
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
