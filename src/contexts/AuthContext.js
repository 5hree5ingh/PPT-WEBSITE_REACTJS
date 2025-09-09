import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

// Create authentication context for managing user state across the app
const AuthContext = createContext();

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component that wraps the entire app
export const AuthProvider = ({ children }) => {
  // Authentication state variables
  const [user, setUser] = useState(null);                    // Current user data
  const [loading, setLoading] = useState(true);              // Loading state for auth check
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Whether user is logged in

  // EFFECT: Check if user is logged in when app starts
  useEffect(() => {
    const checkAuth = async () => {
      const token = apiService.getAuthToken();
      if (token) {
        try {
          // Verify token is still valid by fetching user profile
          const response = await apiService.getProfile();
          setUser(response.user); // Extract user object from response
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Token is invalid, remove it
          apiService.removeAuthToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // EMAIL SIGNUP FLOW - STEP 1: Create new user account
  const signup = async (email, password, confirmPassword, discordUsername) => {
    try {
      // Call backend signup API
      const response = await apiService.signup(email, password, confirmPassword, discordUsername);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // EMAIL SIGNUP FLOW - STEP 2: Verify OTP sent to email
  const verifyOTP = async (email, otp) => {
    try {
      // Call backend OTP verification API
      const response = await apiService.verifyOTP(email, otp);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // EMAIL SIGNUP FLOW - STEP 3: Login after OTP verification
  const login = async (email, password) => {
    try {
      // Call backend login API
      const response = await apiService.login(email, password);
      // After successful login, fetch the full user profile with progress flags
      const profileResponse = await apiService.getProfile();
      setUser(profileResponse.user); // Extract user object from response
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };


  // GOOGLE SIGNUP FLOW - STEP 1: Handle Google OAuth login/signup
  const googleLogin = async (userData) => {
    try {
      console.log('AuthContext - googleLogin called with:', userData);
      // Call backend Google login API
      const response = await apiService.googleLogin(userData);
      console.log('AuthContext - API response:', response);
      // After successful Google login, fetch the full user profile with progress flags
      const profileResponse = await apiService.getProfile();
      setUser(profileResponse.user); // Extract user object from response
      setIsAuthenticated(true);
      console.log('AuthContext - User set, isAuthenticated set to true');
      return { success: true, data: response };
    } catch (error) {
      console.error('AuthContext - Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  // EMAIL SIGNUP FLOW - Helper: Resend OTP if user didn't receive it
  const resendOTP = async (email) => {
    try {
      const response = await apiService.resendOTP(email);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // LOGOUT: Clear user session
  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // STATS MANAGEMENT: Save user's SmashKarts stats
  const saveStats = async (stats) => {
    try {
      const response = await apiService.saveStats(stats);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // STATS MANAGEMENT: Get user's saved stats
  const getStats = async () => {
    try {
      const response = await apiService.getStats();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // STATS MANAGEMENT: Delete user's stats
  const deleteStats = async () => {
    try {
      const response = await apiService.deleteStats();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // TOURNAMENT MANAGEMENT: Register user for tournament
  const registerForTournament = async (tournamentName = 'PPL7') => {
    try {
      const response = await apiService.registerForTournament(tournamentName);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // TOURNAMENT MANAGEMENT: Unregister user from tournament
  const unregisterFromTournament = async (tournamentName = 'PPL7') => {
    try {
      const response = await apiService.unregisterFromTournament(tournamentName);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // TOURNAMENT MANAGEMENT: Check if user is registered for tournament
  const getTournamentStatus = async (tournamentName = 'PPL7') => {
    try {
      const response = await apiService.getTournamentStatus(tournamentName);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // REFRESH USER DATA: Fetch updated user data from backend
  const refreshUserData = async () => {
    try {
      const response = await apiService.getProfile();
      setUser(response.user);
      return { success: true, data: response.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Provide all authentication functions and state to child components
  const value = {
    // State
    user,                    // Current user data
    loading,                 // Loading state
    isAuthenticated,         // Authentication status
    
    // Email signup flow functions
    signup,                  // Create new account
    verifyOTP,               // Verify email OTP
    login,                   // Login after verification
    resendOTP,               // Resend OTP
    
    // Google signup flow functions
    googleLogin,             // Google OAuth login/signup
    
    // General functions
    logout,                  // Logout user
    
    // Stats management
    saveStats,               // Save SmashKarts stats
    getStats,                // Get user stats
    deleteStats,             // Delete user stats
    
    // Tournament management
    registerForTournament,   // Register for tournament
    unregisterFromTournament, // Unregister from tournament
    getTournamentStatus,     // Check registration status
    
    // Utility functions
    refreshUserData,         // Refresh user data from backend
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
