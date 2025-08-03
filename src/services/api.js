// API service for polling system
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : '';

class ApiService {
  async get(endpoint) {
    const response = await fetch(`${API_BASE}/api${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
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
      console.log('API Success Response:', result);
      return result;
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  // Poll management
  async getCurrentPoll() {
    return this.get('/poll');
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
