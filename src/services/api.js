// API service for polling system
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  API_BASE: API_BASE
});

class ApiService {
  async get(endpoint) {
    try {
      console.log(`Making GET request to: ${API_BASE}/api${endpoint}`);
      const response = await fetch(`${API_BASE}/api${endpoint}`);
      
      if (!response.ok) {
        // Check if response is HTML (error page)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          const htmlText = await response.text();
          console.error('Received HTML instead of JSON:', htmlText.substring(0, 200));
          throw new Error(`API Error: ${response.status} - Server returned HTML instead of JSON`);
        }
        
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('API GET Success:', result);
      return result;
    } catch (error) {
      console.error('API GET Failed:', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      console.log(`Making POST request to ${API_BASE}/api${endpoint}`, data);
      
      const response = await fetch(`${API_BASE}/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        // Check if response is HTML (error page)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          const htmlText = await response.text();
          console.error('Received HTML instead of JSON:', htmlText.substring(0, 200));
          throw new Error(`API Error: ${response.status} - Server returned HTML instead of JSON`);
        }
        
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `API Error: ${response.statusText}`;
        } catch (e) {
          errorMessage = `API Error: ${response.statusText}`;
        }
        console.error('API Error Response:', response.status, errorMessage);
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('API POST Success:', result);
      return result;
    } catch (error) {
      console.error('API POST Failed:', error);
      throw error;
    }
  }

  // Poll management
  async getCurrentPoll() {
    const result = await this.get('/poll');
    return result || null;
  }

  async createPoll(pollData) {
    return this.post('/poll', pollData);
  }

  async getPollResults() {
    return this.get('/results');
  }

  // Student management
  async joinAsStudent(name) {
    return this.post('/join', { name });
  }

  async getStudents() {
    return this.get('/students');
  }

  async submitAnswer(name, answer) {
    return this.post('/answer', { name, answer });
  }

  async removeStudent(name) {
    return this.post('/remove-student', { name });
  }

  // Chat functionality
  async getChatHistory() {
    return this.get('/chat-history');
  }

  async sendChatMessage(messageData) {
    return this.post('/chat-message', messageData);
  }

  // Utility
  async healthCheck() {
    return this.get('/health');
  }

  async clearData() {
    return this.post('/clear', {});
  }

  async getPollHistory() {
    return this.get('/poll-history');
  }
}

export default new ApiService();
