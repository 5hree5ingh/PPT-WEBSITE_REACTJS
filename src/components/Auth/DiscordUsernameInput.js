import React, { useState } from 'react';
import apiService from '../../services/api';

// GOOGLE SIGNUP FLOW - STEP 2: Discord Username Input Component
// This component handles Discord username input after Google OAuth login
const DiscordUsernameInput = ({ onComplete, onSkip, user }) => {
  // State variables for Discord username input
  const [discordUsername, setDiscordUsername] = useState(''); // User's Discord username
  const [loading, setLoading] = useState(false);              // Loading state for API call
  const [error, setError] = useState('');                     // Error messages

  // GOOGLE SIGNUP FLOW - STEP 2A: Submit Discord username to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate Discord username is not empty
    if (!discordUsername.trim()) {
      setError('Please enter your Discord username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting to update Discord username:', discordUsername.trim());
      console.log('Auth token:', apiService.getAuthToken());
      
      // Call backend to update Discord username
      const result = await apiService.updateDiscordUsername(discordUsername.trim());
      console.log('Discord username update result:', result);
      
      if (result.message) {
        // Success - call completion handler to proceed to next step
        onComplete(discordUsername.trim());
      } else {
        setError(result.error || 'Failed to update Discord username');
      }
    } catch (error) {
      console.error('Error updating Discord username:', error);
      setError(error.message || 'Failed to update Discord username');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-form">
      <div className="form-group">
        <div className="input-icon">
          <ion-icon name="logo-discord"></ion-icon>
        </div>
        <h3>Discord Username</h3>
        <p>Enter your Discord username to complete your profile</p>
      </div>

      {error && <div className="auth-message error">{error}</div>}

      <div className="form-group">
        <input
          type="text"
          value={discordUsername}
          onChange={(e) => setDiscordUsername(e.target.value)}
          placeholder="Enter your Discord username"
          className="auth-input"
          required
          disabled={loading}
        />
      </div>

      <button 
        type="button" 
        className="auth-submit-btn"
        onClick={handleSubmit}
        disabled={loading || !discordUsername.trim()}
      >
        {loading ? (
          <>
            <ion-icon name="hourglass-outline"></ion-icon>
            Updating...
          </>
        ) : (
          <>
            <ion-icon name="checkmark-outline"></ion-icon>
            CONTINUE
          </>
        )}
      </button>

    </div>
  );
};

export default DiscordUsernameInput;
