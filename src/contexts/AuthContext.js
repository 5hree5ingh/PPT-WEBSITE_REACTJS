import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = apiService.getAuthToken();
      if (token) {
        try {
          const response = await apiService.getProfile();
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          apiService.removeAuthToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (email, password, confirmPassword, discordUsername) => {
    try {
      const response = await apiService.signup(email, password, confirmPassword, discordUsername);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await apiService.verifyOTP(email, otp);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };


  const googleLogin = async (userData) => {
    try {
      console.log('AuthContext - googleLogin called with:', userData);
      const response = await apiService.googleLogin(userData);
      console.log('AuthContext - API response:', response);
      setUser(response.user);
      setIsAuthenticated(true);
      console.log('AuthContext - User set, isAuthenticated set to true');
      return { success: true, data: response };
    } catch (error) {
      console.error('AuthContext - Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await apiService.resendOTP(email);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const saveStats = async (stats) => {
    try {
      const response = await apiService.saveStats(stats);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getStats = async () => {
    try {
      const response = await apiService.getStats();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteStats = async () => {
    try {
      const response = await apiService.deleteStats();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const registerForTournament = async (tournamentName = 'PPL7') => {
    try {
      const response = await apiService.registerForTournament(tournamentName);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const unregisterFromTournament = async (tournamentName = 'PPL7') => {
    try {
      const response = await apiService.unregisterFromTournament(tournamentName);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getTournamentStatus = async (tournamentName = 'PPL7') => {
    try {
      const response = await apiService.getTournamentStatus(tournamentName);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    verifyOTP,
    login,
    googleLogin,
    resendOTP,
    logout,
    saveStats,
    getStats,
    deleteStats,
    registerForTournament,
    unregisterFromTournament,
    getTournamentStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
