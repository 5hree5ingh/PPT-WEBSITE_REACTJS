import React, { useState, useEffect } from 'react';
import './AuthModal.css';
import StatsUpload from '../StatsUpload/StatsUpload';
import EmailVerification from './EmailVerification';
import DiscordUsernameInput from './DiscordUsernameInput';
import SimpleGoogleAuth from './SimpleGoogleAuth';
import { useAuth } from '../../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFormTransitioning, setIsFormTransitioning] = useState(false);
  const [showStatsUpload, setShowStatsUpload] = useState(false);
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showDiscordUsernameInput, setShowDiscordUsernameInput] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Handle initial mode
  useEffect(() => {
    if (initialMode === 'statsUpload') {
      setShowStatsUpload(true);
    } else if (initialMode === 'signup') {
      setIsSignUp(true);
    }
  }, [initialMode]);


  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    discordUsername: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { signup, login, googleLogin } = useAuth();

  // Google OAuth handlers
  const handleGoogleSuccess = async (tokenResponse) => {
    console.log('Google OAuth token received:', tokenResponse);
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      // Get user info using the access token
      const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`);
      const userData = await userResponse.json();
      
      console.log('Google user data:', userData);
      
      // Create user object for backend
      const googleUserData = {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        googleId: userData.id
      };
      
      // Save user to database and get JWT token
      console.log('Calling googleLogin with data:', googleUserData);
      const result = await googleLogin(googleUserData);
      console.log('Google login result:', result);
      
      if (result.success) {
        setMessage('Google login successful!');
        console.log('Google login successful, showing Discord username input...');
        
        // Show Discord username input after Google login
        setShowDiscordUsernameInput(true);
        setMessage('');
      } else {
        console.error('Google login failed:', result.error);
        setError(result.error || 'Google login failed');
      }
      
    } catch (error) {
      console.error('Error getting user info:', error);
      setError('Failed to get user information from Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google OAuth error:', error);
    setError('Google authentication failed');
  };

  const handleSignInClick = () => {
    if (isSignUp) {
      setIsFormTransitioning(true);
      setTimeout(() => {
        setIsSignUp(false);
        setIsFormTransitioning(false);
      }, 200);
    }
  };

  const handleSignUpClick = () => {
    if (!isSignUp) {
      setIsFormTransitioning(true);
      setTimeout(() => {
        setIsSignUp(true);
        setIsFormTransitioning(false);
      }, 200);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (message || error) {
      setMessage('');
      setError('');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await signup(formData.email, formData.password, formData.confirmPassword, formData.discordUsername);
    
    if (result.success) {
      setMessage('Account created! Please check your email for OTP verification.');
      setShowEmailVerification(true);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Instead of logging in directly, show OTP verification screen
    setShowEmailVerification(true);
    setLoading(false);
  };

  const handleStatsUploadComplete = (stats) => {
    setShowPlayerProfile(true);
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '', discordUsername: '' });
    setError('');
    setMessage('');
    setShowEmailVerification(false);
    setShowDiscordUsernameInput(false);
    setShowStatsUpload(false);
    setShowPlayerProfile(false);
    setIsSignUp(false);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleEmailVerificationComplete = async () => {
    setIsVerifying(true);
    
    // Auto-login the user after email verification
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Show stats upload immediately after successful login
        setShowStatsUpload(true);
        setShowEmailVerification(false);
        setIsVerifying(false);
      } else {
        setError('Email verified but login failed. Please login manually.');
        setIsVerifying(false);
      }
    } catch (error) {
      setError('Email verified but login failed. Please login manually.');
      setIsVerifying(false);
    }
  };

  const handleBackToSignUp = () => {
    setShowEmailVerification(false);
  };

  const handleDiscordUsernameComplete = (discordUsername) => {
    console.log('Discord username completed:', discordUsername);
    // Show stats upload after Discord username is entered
    setShowStatsUpload(true);
    setShowDiscordUsernameInput(false);
  };



  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className={`auth-modal ${showPlayerProfile ? 'profile-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleCloseModal}>
          <ion-icon name="close-outline"></ion-icon>
        </button>
        
        {!showStatsUpload && !showPlayerProfile && (
        <div className="auth-tabs" data-active={isSignUp ? 'signup' : 'signin'}>
          <button 
            className={`auth-tab ${!isSignUp ? 'active' : ''}`}
            onClick={handleSignInClick}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${isSignUp ? 'active' : ''}`}
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </div>
        )}

        {message && !showStatsUpload && <div className="auth-message success">{message}</div>}
        {error && !showStatsUpload && <div className="auth-message error">{error}</div>}

        <div className={`auth-form-container ${isFormTransitioning ? 'transitioning' : ''}`}>
          {showEmailVerification ? (
            <EmailVerification 
              email={formData.email}
              onVerificationComplete={handleEmailVerificationComplete}
              onBack={handleBackToSignUp}
              isVerifying={isVerifying}
            />
          ) : showDiscordUsernameInput ? (
            <DiscordUsernameInput 
              onComplete={handleDiscordUsernameComplete}
              user={{ id: 1, email: formData.email }} // You'll need to get the actual user data
            />
          ) : !isSignUp ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  className="auth-input" 
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                  className="auth-input" 
                />
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              
              <div className="auth-divider">
                <span>or</span>
              </div>
              
              <div className="social-auth-buttons">
                <SimpleGoogleAuth 
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
                <button type="button" className="social-auth-btn discord-btn" title="Sign in with Discord">
                  <ion-icon name="logo-discord"></ion-icon>
                </button>
              </div>
              
              {/* Invisible spacers to match Sign Up form height */}
              <div style={{ height: '60px', opacity: 0, pointerEvents: 'none' }}></div>
              <div style={{ height: '60px', opacity: 0, pointerEvents: 'none' }}></div>
            </form>
          ) : showStatsUpload ? (
            <StatsUpload onClose={handleCloseModal} onProfileDisplayed={handleStatsUploadComplete} />
          ) : (
            <form className="auth-form" onSubmit={handleSignUpSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="discordUsername"
                  placeholder="Discord Username" 
                  value={formData.discordUsername}
                  onChange={handleInputChange}
                  required 
                  className="auth-input" 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  className="auth-input" 
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                  className="auth-input" 
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required 
                  className="auth-input" 
                />
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
              
              <div className="auth-divider">
                <span>or</span>
              </div>
              
              <div className="social-auth-buttons">
                <SimpleGoogleAuth 
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
                <button type="button" className="social-auth-btn discord-btn" title="Sign up with Discord">
                  <ion-icon name="logo-discord"></ion-icon>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
