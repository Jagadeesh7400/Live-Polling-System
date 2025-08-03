import { io } from "socket.io-client";

// Replace with your backend URL when ready
const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;