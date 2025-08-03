import React from "react";

export default function Spinner() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: "60px"
    }}>
      <div style={{
        width: "32px", height: "32px", border: "4px solid #3B82F6",
        borderTop: "4px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite"
      }} />
      <style>
        {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}