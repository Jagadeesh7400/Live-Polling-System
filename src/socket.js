import { io } from "socket.io-client";

// Use environment variable or fallback based on environment
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (window.location.hostname === 'localhost' ? 
    "http://localhost:5000" : 
    `https://${window.location.hostname}/api`);

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;