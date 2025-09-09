import React, { useState, useEffect } from 'react';
import './AuthModal.css';
import StatsUpload from '../StatsUpload/StatsUpload';
import EmailVerification from './EmailVerification';
import DiscordUsernameInput from './DiscordUsernameInput';
import SimpleGoogleAuth from './SimpleGoogleAuth';
import { useAuth } from '../../contexts/AuthContext';

// Main authentication modal component that handles all signup/login flows
const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  // State variables to control which screen is shown in the modal
  const [isSignUp, setIsSignUp] = useState(false);                    // Controls signup vs login form display
  const [isFormTransitioning, setIsFormTransitioning] = useState(false); // Handles smooth transitions between forms
  const [showStatsUpload, setShowStatsUpload] = useState(false);      // Shows SmashKarts stats upload screen
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);  // Shows player profile after stats upload
  const [showEmailVerification, setShowEmailVerification] = useState(false); // Shows OTP verification screen
  const [showDiscordUsernameInput, setShowDiscordUsernameInput] = useState(false); // Shows Discord username input for Google users
  const [isVerifying, setIsVerifying] = useState(false);              // Loading state during email verification

  // Form data state for storing user input
  const [formData, setFormData] = useState({
    email: '',              // User's email address
    password: '',           // User's password
    confirmPassword: '',    // Password confirmation
    discordUsername: ''     // User's Discord username
  });
  
  // UI state variables
  const [loading, setLoading] = useState(false);    // Loading state for API calls
  const [message, setMessage] = useState('');       // Success messages
  const [error, setError] = useState('');           // Error messages

  // Get authentication functions and state from AuthContext
  const { signup, login, googleLogin, isAuthenticated, user, getTournamentStatus, refreshUserData } = useAuth();

  // EFFECT 1: Handle initial mode when modal opens
  // This determines what screen to show when the modal first opens
  useEffect(() => {
    console.log('=== AUTH MODAL INITIAL MODE EFFECT ===');
    console.log('initialMode:', initialMode);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    
    if (initialMode === 'statsUpload') {
      // Direct stats upload mode - show stats upload screen immediately
      console.log('Showing stats upload directly');
      setShowStatsUpload(true);
    } else if (initialMode === 'signup') {
      // Regular signup mode - check if user is already authenticated
      if (isAuthenticated && user) {
        console.log('User already authenticated for signup, checking verification status:', {
          email_verified: user.email_verified,
          discord_verified: user.discord_verified,
          sk_stats_verified: user.sk_stats_verified,
          tournament_registered: user.tournament_registered
        });

        // If user is already authenticated, show appropriate screen based on verification status
        if (user.tournament_registered) {
          // User is already registered - show completion message
          console.log('User already registered, showing message');
          setMessage('You are already registered for the tournament!');
        } else if (!user.email_verified) {
          // Email not verified - show signup form
          console.log('Email not verified, showing signup form');
          setIsSignUp(true);
        } else if (!user.discord_verified) {
          // Discord not verified - show Discord input
          console.log('Discord not verified, showing Discord input');
          setShowDiscordUsernameInput(true);
        } else if (!user.sk_stats_verified) {
          // SK stats not verified - show stats upload
          console.log('SK stats not verified, showing stats upload');
          setShowStatsUpload(true);
        } else {
          // All verified but not registered - show stats upload for registration
          console.log('All verified but not registered, showing stats upload for registration');
          setShowStatsUpload(true);
        }
      } else {
        // User not authenticated, show signup form
        console.log('User not authenticated, showing signup form');
        setIsSignUp(true);
      }
    } else if (initialMode === 'register') {
      // Tournament registration mode - check user verification status
      if (isAuthenticated && user) {
        console.log('User verification status for register:', {
          email_verified: user.email_verified,
          discord_verified: user.discord_verified,
          sk_stats_verified: user.sk_stats_verified,
          tournament_registered: user.tournament_registered
        });

        // Check verification status and show appropriate screen
        if (user.tournament_registered) {
          // User is already registered - show completion message
          console.log('User already registered, showing message');
          setMessage('You are already registered for the tournament!');
          // Don't show any form, just the message
        } else if (!user.email_verified) {
          // Email not verified - show signup form
          console.log('Email not verified, showing signup form');
          setIsSignUp(true);
        } else if (!user.discord_verified) {
          // Discord not verified - show Discord input
          console.log('Discord not verified, showing Discord input');
          setShowDiscordUsernameInput(true);
        } else if (!user.sk_stats_verified) {
          // SK stats not verified - show stats upload
          console.log('SK stats not verified, showing stats upload');
          setShowStatsUpload(true);
        } else {
          // All verified but not registered - show stats upload for registration
          console.log('All verified but not registered, showing stats upload for registration');
          setShowStatsUpload(true);
        }
      } else {
        // User not signed up, show signup form first
        console.log('User not authenticated for register, showing signup form');
        setIsSignUp(true);
      }
    }
    console.log('=== END AUTH MODAL INITIAL MODE EFFECT ===');
  }, [initialMode, isAuthenticated, user]);

  // EFFECT 2: Handle authentication state changes during modal session
  // This handles when user becomes authenticated during the modal session
  useEffect(() => {
    console.log('Auth state changed - isAuthenticated:', isAuthenticated, 'user:', user, 'showDiscordUsernameInput:', showDiscordUsernameInput, 'showStatsUpload:', showStatsUpload, 'initialMode:', initialMode);
    
    // Only handle authentication changes during modal session (not initial load)
    if (isAuthenticated && user && (initialMode === 'register' || initialMode === 'signup') && !showDiscordUsernameInput && !showStatsUpload) {
      console.log('User became authenticated during modal session, checking verification status');
      
      // For both register and signup modes, check verification status
      if (initialMode === 'register' || initialMode === 'signup') {
        if (!user.email_verified) {
          console.log('Email not verified, showing signup form');
          setIsSignUp(true);
        } else if (!user.discord_verified) {
          console.log('Discord not verified, showing Discord input');
          setShowDiscordUsernameInput(true);
        } else if (!user.sk_stats_verified) {
          console.log('SK stats not verified, showing stats upload');
          setShowStatsUpload(true);
        } else {
          console.log('All verified, showing stats upload for registration');
          setShowStatsUpload(true);
        }
      }
      
      setIsSignUp(false);
      setShowEmailVerification(false);
    }
  }, [isAuthenticated, user, showDiscordUsernameInput, showStatsUpload, initialMode]);

  // GOOGLE OAUTH HANDLERS
  // This handles the complete Google signup/login flow
  const handleGoogleSuccess = async (tokenResponse) => {
    console.log('Google OAuth token received:', tokenResponse);
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      // STEP 1: Get user info from Google using the access token
      const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`);
      const userData = await userResponse.json();
      
      console.log('Google user data:', userData);
      
      // STEP 2: Create user object for our backend
      const googleUserData = {
        email: userData.email,      // User's Gmail address
        name: userData.name,        // User's full name from Google
        picture: userData.picture,  // User's profile picture URL
        googleId: userData.id       // Google's unique user ID
      };
      
      // STEP 3: Save user to our database and get JWT token
      console.log('Calling googleLogin with data:', googleUserData);
      const result = await googleLogin(googleUserData);
      console.log('Google login result:', result);
      
      if (result.success) {
        setMessage('Google login successful!');
        console.log('Google login successful, showing Discord username input...');
        
        // STEP 4: Show Discord username input (required for Google users)
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

  // Handle Google OAuth errors
  const handleGoogleError = (error) => {
    console.error('Google OAuth error:', error);
    setError('Google authentication failed');
  };

  // FORM NAVIGATION HANDLERS
  // Handle switching from signup to signin form
  const handleSignInClick = () => {
    if (isSignUp) {
      setIsFormTransitioning(true);
      setTimeout(() => {
        setIsSignUp(false);           // Switch to signin form
        setIsFormTransitioning(false);
      }, 200);
    }
  };

  // Handle switching from signin to signup form
  const handleSignUpClick = () => {
    if (!isSignUp) {
      setIsFormTransitioning(true);
      setTimeout(() => {
        setIsSignUp(true);            // Switch to signup form
        setIsFormTransitioning(false);
      }, 200);
    }
  };

  // Handle form input changes
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

  // EMAIL SIGNUP FLOW - STEP 1: Form submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // STEP 1: Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // STEP 2: Call signup API to create user account
    const result = await signup(formData.email, formData.password, formData.confirmPassword, formData.discordUsername);
    
    if (result.success) {
      setMessage('Account created! Please check your email for OTP verification.');
      // STEP 3: Show email verification screen (OTP input)
      setShowEmailVerification(true);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // EMAIL LOGIN FLOW - Currently just shows OTP verification
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Instead of logging in directly, show OTP verification screen
    // This is because we require email verification for all users
    setShowEmailVerification(true);
    setLoading(false);
  };

  // Handle completion of stats upload
  const handleStatsUploadComplete = async (stats) => {
    console.log('Stats upload completed:', stats);
    
    // Refresh user data to get updated verification status
    try {
      const result = await refreshUserData();
      if (result.success) {
        console.log('Refreshed user data after stats upload:', result.data);
        const updatedUser = result.data;
        
        // Check if user needs tournament registration
        if (updatedUser && updatedUser.tournament_registered === false) {
          console.log('User needs tournament registration, showing registration screen');
          // Keep showing stats upload for registration
        } else {
          console.log('User already registered or all verification complete');
        }
      }
    } catch (error) {
      console.error('Error refreshing user data after stats upload:', error);
    }
    
    setShowPlayerProfile(true);
  };

  // Reset all form state when modal closes
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

  // Handle modal close
  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  // EMAIL SIGNUP FLOW - STEP 2: After OTP verification
  const handleEmailVerificationComplete = async () => {
    setIsVerifying(true);
    
    // Auto-login the user after email verification
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // PROBLEM: This shows stats upload for BOTH register AND signup modes
        // It should only show for register mode (tournament registration)
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

  // Handle going back to signup form from email verification
  const handleBackToSignUp = () => {
    setShowEmailVerification(false);
  };

  // GOOGLE SIGNUP FLOW - STEP 2: After Discord username input
  const handleDiscordUsernameComplete = async (discordUsername) => {
    console.log('Discord username completed:', discordUsername);
    console.log('Current auth state - isAuthenticated:', isAuthenticated, 'user:', user, 'initialMode:', initialMode);
    
    // Refresh user data from backend to get updated verification status
    try {
      const result = await refreshUserData();
      if (result.success) {
        console.log('Refreshed user data:', result.data);
        const updatedUser = result.data;
        
        // After Discord username completion, check what's next in the verification flow
        if (updatedUser && updatedUser.sk_stats_verified === false) {
          // User needs to upload SK stats next
          console.log('User needs SK stats upload, showing stats upload screen');
          setShowStatsUpload(true);
        } else if (updatedUser && updatedUser.sk_stats_verified === true && updatedUser.tournament_registered === false) {
          // User has stats but needs to register for tournament
          console.log('User has stats but needs tournament registration, showing stats upload for registration');
          setShowStatsUpload(true);
        } else {
          // All verification complete, show stats upload anyway
          console.log('All verification complete, showing stats upload');
          setShowStatsUpload(true);
        }
      } else {
        console.error('Failed to refresh user data:', result.error);
        // Fallback to showing stats upload
        setShowStatsUpload(true);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Fallback to showing stats upload
      setShowStatsUpload(true);
    }
    
    setShowDiscordUsernameInput(false);
  };



  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className={`auth-modal ${showPlayerProfile ? 'profile-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="auth-modal-close" onClick={handleCloseModal}>
          <ion-icon name="close-outline"></ion-icon>
        </button>
        
        {/* Sign In / Sign Up tabs - only show when not in stats upload, profile mode, or Discord input */}
        {!showStatsUpload && !showPlayerProfile && !showDiscordUsernameInput && (
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

        {/* Success and error messages - only show when not in stats upload or Discord input mode */}
        {message && !showStatsUpload && !showDiscordUsernameInput && <div className="auth-message success">{message}</div>}
        {error && !showStatsUpload && !showDiscordUsernameInput && <div className="auth-message error">{error}</div>}

        {/* Main form container with conditional rendering based on current state */}
        <div className={`auth-form-container ${isFormTransitioning ? 'transitioning' : ''}`}>
          {showEmailVerification ? (
            /* EMAIL SIGNUP FLOW - STEP 2: OTP Verification Screen */
            <EmailVerification 
              email={formData.email}
              onVerificationComplete={handleEmailVerificationComplete}
              onBack={handleBackToSignUp}
              isVerifying={isVerifying}
            />
          ) : showDiscordUsernameInput ? (
            /* GOOGLE SIGNUP FLOW - STEP 2: Discord Username Input Screen */
            <DiscordUsernameInput 
              onComplete={handleDiscordUsernameComplete}
              user={{ id: 1, email: formData.email }} // You'll need to get the actual user data
            />
          ) : !isSignUp ? (
            /* SIGN IN FORM */
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
            /* STATS UPLOAD SCREEN - Shows after successful authentication */
            <StatsUpload onClose={handleCloseModal} onProfileDisplayed={handleStatsUploadComplete} />
          ) : (
            /* EMAIL SIGNUP FLOW - STEP 1: Signup Form */
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

/*
=== SIGNUP FLOW SUMMARY ===

1. EMAIL SIGNUP FLOW:
   - User fills signup form → handleSignUpSubmit()
   - Creates account in database → sends OTP email
   - Shows OTP verification screen → handleEmailVerificationComplete()
   - Auto-login after OTP verification → shows stats upload (PROBLEM!)

2. GOOGLE SIGNUP FLOW:
   - User clicks Google button → handleGoogleSuccess()
   - Gets Google user data → creates/updates user in database
   - Shows Discord username input → handleDiscordUsernameComplete()
   - Shows stats upload (PROBLEM!)

3. REGISTER BUTTON FLOW:
   - Same as above but for tournament registration
   - Should show stats upload (CORRECT!)

=== THE MAIN PROBLEM ===
The useEffect (lines 57-72) and completion handlers (lines 230-267) show stats upload 
for BOTH 'register' AND 'signup' modes, but it should only show for 'register' mode.

Regular signup should close the modal after authentication, not show stats upload!
*/
