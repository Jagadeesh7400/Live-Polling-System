import React, { useState } from "react";
import "./ChatPopup.css";

const mockChat = [
  { user: "User 1", text: "Hey There , how can I help?", color: "#222", align: "left" },
  { user: "User 2", text: "Nothing bro..just chill!!!", color: "#7367F0", align: "right" }
];

const mockParticipants = [
  "Rahul Arora", "Pushpender Rautela", "Rijul Zalpuri", "Nadeem N", "Ashwin Sharma"
];

export default function ChatPopup({ open, onClose }) {
  const [tab, setTab] = useState("chat");

  if (!open) return null;

  return (
    <div className="chat-popup-overlay" onClick={onClose}>
      <div className="chat-popup" onClick={e => e.stopPropagation()}>
        <div className="chat-popup-tabs">
          <div
            className={`chat-popup-tab${tab === "chat" ? " active" : ""}`}
            onClick={() => setTab("chat")}
          >Chat</div>
          <div
            className={`chat-popup-tab${tab === "participants" ? " active" : ""}`}
            onClick={() => setTab("participants")}
          >Participants</div>
        </div>
        <div className="chat-popup-content">
          {tab === "chat" ? (
            <div className="chat-popup-chat">
              {mockChat.map((msg, i) => (
                <div key={i} className={`chat-popup-msg ${msg.align}`}>
                  <span className="chat-popup-user">{msg.user}</span>
                  <div
                    className="chat-popup-bubble"
                    style={{
                      background: msg.align === "left" ? "#222" : "#7367F0",
                      color: "#fff"
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="chat-popup-participants">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockParticipants.map((name, i) => (
                    <tr key={i}>
                      <td>{name}</td>
                      <td>
                        <a href="#" style={{ color: "#7367F0" }}>Kick out</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}