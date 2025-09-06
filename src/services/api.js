const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(email, password, confirmPassword, discordUsername) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, confirmPassword, discordUsername }),
    });
  }

  async verifyOTP(email, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setAuthToken(response.token);
    }

    return response;
  }


  async resendOTP(email) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async logout() {
    this.removeAuthToken();
  }

  // Stats endpoints
  async saveStats(stats) {
    return this.request('/stats/save', {
      method: 'POST',
      body: JSON.stringify(stats),
    });
  }

  async getStats() {
    return this.request('/stats/get');
  }

  async deleteStats() {
    return this.request('/stats/delete', {
      method: 'DELETE',
    });
  }

  // Tournament endpoints
  async registerForTournament(tournamentName = 'PPL7') {
    return this.request('/tournament/register', {
      method: 'POST',
      body: JSON.stringify({ tournamentName }),
    });
  }

  async unregisterFromTournament(tournamentName = 'PPL7') {
    return this.request('/tournament/unregister', {
      method: 'POST',
      body: JSON.stringify({ tournamentName }),
    });
  }

  async getTournamentStatus(tournamentName = 'PPL7') {
    return this.request(`/tournament/status?tournamentName=${tournamentName}`);
  }

  async getTournamentRegistrations() {
    return this.request('/tournament/registrations');
  }

  async googleLogin(userData) {
    console.log('API Service - googleLogin called with:', userData);
    const response = await this.request('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    console.log('API Service - googleLogin response:', response);

    if (response.token) {
      console.log('API Service - Setting auth token');
      this.setAuthToken(response.token);
    }

    return response;
  }

  async updateDiscordUsername(discordUsername) {
    return this.request('/auth/update-discord-username', {
      method: 'POST',
      body: JSON.stringify({ discordUsername }),
    });
  }
}

const apiService = new ApiService();
export default apiService;
