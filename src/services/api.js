// API base URL - defaults to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API service class for handling all backend communication
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // TOKEN MANAGEMENT: Get JWT token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // TOKEN MANAGEMENT: Store JWT token in localStorage
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // TOKEN MANAGEMENT: Remove JWT token from localStorage
  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  // CORE HTTP REQUEST METHOD: Handles all API calls with authentication
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }), // Add JWT token if available
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

  // ===== EMAIL SIGNUP FLOW API ENDPOINTS =====
  
  // EMAIL SIGNUP FLOW - STEP 1: Create new user account
  async signup(email, password, confirmPassword, discordUsername) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, confirmPassword, discordUsername }),
    });
  }

  // EMAIL SIGNUP FLOW - STEP 2: Verify OTP sent to email
  async verifyOTP(email, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  // EMAIL SIGNUP FLOW - STEP 3: Login after OTP verification
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store JWT token for future requests
    if (response.token) {
      this.setAuthToken(response.token);
    }

    return response;
  }


  // EMAIL SIGNUP FLOW - Helper: Resend OTP if user didn't receive it
  async resendOTP(email) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Get current user profile data
  async getProfile() {
    return this.request('/auth/profile');
  }

  // Logout user by removing token
  async logout() {
    this.removeAuthToken();
  }

  // ===== GOOGLE SIGNUP FLOW API ENDPOINTS =====
  
  // GOOGLE SIGNUP FLOW - STEP 1: Handle Google OAuth login/signup
  async googleLogin(userData) {
    console.log('API Service - googleLogin called with:', userData);
    const response = await this.request('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    console.log('API Service - googleLogin response:', response);

    // Store JWT token for future requests
    if (response.token) {
      console.log('API Service - Setting auth token');
      this.setAuthToken(response.token);
    }

    return response;
  }

  // GOOGLE SIGNUP FLOW - STEP 2: Update Discord username after Google login
  async updateDiscordUsername(discordUsername) {
    return this.request('/auth/update-discord-username', {
      method: 'POST',
      body: JSON.stringify({ discordUsername }),
    });
  }

  // ===== STATS MANAGEMENT API ENDPOINTS =====
  
  // Save user's SmashKarts stats
  async saveStats(stats) {
    return this.request('/stats/save', {
      method: 'POST',
      body: JSON.stringify(stats),
    });
  }

  // Get user's saved stats
  async getStats() {
    return this.request('/stats/get');
  }

  // Delete user's stats
  async deleteStats() {
    return this.request('/stats/delete', {
      method: 'DELETE',
    });
  }

  // ===== TOURNAMENT MANAGEMENT API ENDPOINTS =====
  
  // Register user for tournament
  async registerForTournament(tournamentName = 'PPL7') {
    return this.request('/tournament/register', {
      method: 'POST',
      body: JSON.stringify({ tournamentName }),
    });
  }

  // Unregister user from tournament
  async unregisterFromTournament(tournamentName = 'PPL7') {
    return this.request('/tournament/unregister', {
      method: 'POST',
      body: JSON.stringify({ tournamentName }),
    });
  }

  // Check if user is registered for tournament
  async getTournamentStatus(tournamentName = 'PPL7') {
    return this.request(`/tournament/status?tournamentName=${tournamentName}`);
  }

  // Get all tournament registrations
  async getTournamentRegistrations() {
    return this.request('/tournament/registrations');
  }
}

const apiService = new ApiService();
export default apiService;
