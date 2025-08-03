import { io } from "socket.io-client";

// Use environment variable or fallback based on environment
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (window.location.hostname === 'localhost' ? 
    "http://localhost:5000" : 
    `https://${window.location.hostname}`);

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.connected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        this.connected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Event listener management
  on(event, callback) {
    if (!this.socket) this.connect();
    
    // Remove existing listener if it exists
    if (this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
    }
    
    this.listeners.set(event, callback);
    this.socket.on(event, callback);
  }

  off(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  emit(event, data) {
    if (!this.socket) this.connect();
    this.socket.emit(event, data);
  }

  // Convenience methods for common events
  joinAsStudent(name) {
    this.emit('student_join', name);
  }

  createPoll(pollData) {
    this.emit('create_poll', pollData);
  }

  submitAnswer(data) {
    this.emit('submit_answer', data);
  }

  removeStudent(studentName) {
    this.emit('remove_student', studentName);
  }

  sendMessage(messageData) {
    this.emit('send_message', messageData);
  }

  getChatHistory() {
    this.emit('get_chat_history');
  }

  getStudentNames() {
    this.emit('get_student_names');
  }

  getCurrentPoll() {
    this.emit('get_poll');
  }

  isConnected() {
    return this.connected;
  }
}

const socketService = new SocketService();
export default socketService;