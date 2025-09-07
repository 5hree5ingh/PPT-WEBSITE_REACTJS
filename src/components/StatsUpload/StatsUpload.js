import React, { useState, useEffect } from 'react';
import { extractAllData } from '../StatsAPI/apiLogic';
import { useAuth } from '../../contexts/AuthContext';
import RegisterButton from '../RegisterButton';
import './StatsUpload.css';

const StatsUpload = ({ onClose, onProfileDisplayed }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedStats, setExtractedStats] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const [showTournamentPopup, setShowTournamentPopup] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [shouldAutoRegister, setShouldAutoRegister] = useState(false);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);

  const { isAuthenticated, saveStats, registerForTournament, unregisterFromTournament, getTournamentStatus, user } = useAuth();

  // Countdown effect
  useEffect(() => {
    let interval;
    if (showTournamentPopup && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      window.location.href = '/tournament';
    }
    return () => clearInterval(interval);
  }, [showTournamentPopup, countdown]);

  // Auto-register effect when user becomes authenticated
  useEffect(() => {
    console.log('Auto-register effect triggered, isAuthenticated:', isAuthenticated, 'shouldAutoRegister:', shouldAutoRegister);
    if (isAuthenticated && shouldAutoRegister) {
      console.log('Auto-registering for tournament');
      setShouldAutoRegister(false);
      // Check if user has stats first, if not, they need to upload stats
      if (user && user.stats_data) {
        handleTournamentRegistration();
      } else {
        // User needs to upload stats first
        console.log('User needs to upload stats first');
      }
    }
  }, [isAuthenticated, shouldAutoRegister, user]);

  // Check user state when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, checking progress flags:', {
        verified_email: user.verified_email,
        sk_stats_uploaded: user.sk_stats_uploaded,
        tournament_registered: user.tournament_registered
      });
      
      checkTournamentStatus();
      
      // Check if user has already uploaded stats using the database flag
      if (user.sk_stats_uploaded) {
        console.log('User has uploaded stats, loading them');
        // Load stats from user_stats table via API
        loadUserStats();
      }
    }
  }, [isAuthenticated, user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateKD = () => {
    if (!extractedStats) return "0.00";
    if (extractedStats.kd_ratio) {
      return extractedStats.kd_ratio;
    }
    const kills = parseInt(extractedStats.kills) || 0;
    const deaths = parseInt(extractedStats.deaths) || 0;
    if (deaths === 0) return kills.toFixed(2);
    return (kills / deaths).toFixed(2);
  };

  const handleUploadStats = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    
    try {
      const base64Data = uploadedImage.split(',')[1];
      const enhancedStats = await extractAllData(base64Data);
      setExtractedStats(enhancedStats);
      
      // Auto-save stats if user is authenticated
      if (isAuthenticated) {
        await handleSaveStats(enhancedStats);
      }
      
      if (onProfileDisplayed) {
        onProfileDisplayed(enhancedStats);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again with a clearer screenshot.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveStats = async (stats) => {
    if (!isAuthenticated) {
      setError('Please login to save your stats');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const statsData = {
        sk_id: stats.sk_id,
        level: parseInt(stats.level) || 0,
        kills: parseInt(stats.kills) || 0,
        deaths: parseInt(stats.deaths) || 0,
        games_played: parseInt(stats.total_games) || 0,
        kd: parseFloat(calculateKD()) || 0,
        cart_image: stats.cart_image,
        description: stats.description || '',
        category: Math.floor(Math.random() * 4) + 1,
        preferred_role: 'Player'
      };

      const result = await saveStats(statsData);
      
      if (result.success) {
        // Check tournament registration status (no popup for stats saved)
        await checkTournamentStatus();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to save stats');
    } finally {
      setIsSaving(false);
    }
  };

  const checkTournamentStatus = async () => {
    try {
      const result = await getTournamentStatus('PPL7');
      if (result.success) {
        setIsRegistered(result.data.registered);
        if (result.data.registered) {
          setShowAlreadyRegistered(true);
        }
      }
    } catch (error) {
      console.error('Error checking tournament status:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/stats/get', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats) {
          setExtractedStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleTournamentRegistration = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Register button clicked, isAuthenticated:', isAuthenticated, 'isRegistered:', isRegistered);
    
    if (!isAuthenticated) {
      console.log('User not authenticated, dispatching auth event');
      // Dispatch custom event to open auth modal in register mode
      const event = new CustomEvent('openAuthModal', { 
        detail: { mode: 'register' } 
      });
      window.dispatchEvent(event);
      return;
    }

    // Check if user is already registered
    if (isRegistered) {
      console.log('User is already registered for tournament');
      setError('You are already registered for the tournament!');
      return;
    }

    // Check if user has stats uploaded
    if (!extractedStats && (!user || !user.stats_data)) {
      console.log('User needs to upload stats first');
      setError('Please upload your SK stats first before registering for the tournament!');
      return;
    }

    try {
      const result = await registerForTournament('PPL7');
      
      if (result.success) {
        setIsRegistered(true);
        // Show tournament registration popup and start countdown
        setCountdown(6);
        setShowTournamentPopup(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to register for tournament');
    }
  };

  const handleEditInfo = () => {
    setExtractedStats(null);
    setUploadedImage(null);
    setError('');
  };

  // Listen for auth completion events
  useEffect(() => {
    const handleAuthComplete = (event) => {
      console.log('Auth completed, setting shouldAutoRegister to true');
      setShouldAutoRegister(true);
    };

    window.addEventListener('authComplete', handleAuthComplete);
    return () => window.removeEventListener('authComplete', handleAuthComplete);
  }, []);

  // If user is already registered, show the message
  if (showAlreadyRegistered && isRegistered) {
    return (
      <div className="stats-upload-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="stats-upload-modal" onClick={(e) => e.stopPropagation()}>
          <div className="already-registered-message">
            <div className="message-icon">
              <ion-icon name="checkmark-circle"></ion-icon>
            </div>
            <h2>You are already registered!</h2>
            <p>You have successfully registered for the tournament.</p>
            <div className="message-actions">
              <button 
                className="auth-submit-btn"
                onClick={() => window.location.href = '/tournament'}
              >
                Go to Tournament Page
              </button>
              <button 
                className="edit-info-btn"
                onClick={() => {
                  setShowAlreadyRegistered(false);
                  setExtractedStats(null);
                }}
              >
                Upload New Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If stats are extracted, show the profile card in the same modal
  if (extractedStats) {
    const kd = parseFloat(calculateKD()) || 0;
    const games = parseInt(extractedStats.total_games) || 0;
    const kills = parseInt(extractedStats.kills) || 0;
    const deaths = parseInt(extractedStats.deaths) || 0;
    const skid = extractedStats.sk_id || 'N/A';
    
    // Generate random category (1-4)
    const category = Math.floor(Math.random() * 4) + 1;

    return (
      <div className="stats-upload-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="stats-upload-modal" onClick={(e) => e.stopPropagation()}>
          {showTournamentPopup && (
            <div className="tournament-registration-popup">
              <div className="popup-content">
                <div className="popup-icon">
                  <ion-icon name="trophy"></ion-icon>
                </div>
                <h2>🎉 Registration Successful!</h2>
                <div className="popup-countdown">
                  <div className="countdown-circle">
                    <span className="countdown-number">{countdown}</span>
                  </div>
                </div>
              </div>
          </div>
          )}
          <button 
            className="modal-close-btn" 
            onClick={() => {
              setExtractedStats(null);
              setUploadedImage(null);
            }}
          >
            ×
          </button>
          
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-kart">
                <img 
                  src={extractedStats.cart_image || '/default-kart.png'} 
                  alt={`${extractedStats.discord_username}'s kart`}
                  onError={(e) => {
                    e.target.src = '/default-kart.png';
                  }}
                />
              </div>
              <h2 className="modal-name">{extractedStats.discord_username}</h2>
          </div>

            <div className="modal-stats">
              <div className="modal-stat-row">
                <div className="modal-stat">
                  <span className="modal-stat-label">K/D Ratio</span>
                  <span className="modal-stat-value">{kd.toFixed(2)}</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-label">Games Played</span>
                  <span className="modal-stat-value">{games}</span>
                </div>
          </div>

              <div className="modal-stat-row">
                <div className="modal-stat">
                  <span className="modal-stat-label">Level</span>
                  <span className="modal-stat-value">{extractedStats.level || 0}</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-label">Category</span>
                  <span className="modal-stat-value">{category}</span>
                </div>
              </div>
              
              <div className="modal-stat-row">
                <div className="modal-stat">
                  <span className="modal-stat-label">Kills</span>
                  <span className="modal-stat-value">{kills}</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-label">Deaths</span>
                  <span className="modal-stat-value">{deaths}</span>
                </div>
              </div>
            </div>

            <div className="modal-skid">
              <h3>Skid</h3>
              <p>{skid}</p>
          </div>

            {error && <div className="stats-message error">{error}</div>}

            <div className="modal-actions">
              <RegisterButton 
                onClick={handleTournamentRegistration}
                disabled={isSaving}
                loading={isSaving}
                isRegistered={isRegistered}
              />
            <button
                className="edit-info-btn"
                onClick={handleEditInfo}
              >
                REUPLOAD SK STATS
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-upload-section">
      {!uploadedImage ? (
        <div className="file-upload-area">
          <div className="file-upload-content">
            <ion-icon name="cloud-upload-outline" className="upload-icon"></ion-icon>
            <p className="upload-text">Upload SmashKarts Stats Screenshot</p>
            <p className="upload-hint">Click to browse or drag and drop</p>
            <input
              type="file"
              id="stats-screenshot"
              accept="image/*"
              required
              className="file-input"
              onChange={handleImageUpload}
            />
            <label htmlFor="stats-screenshot" className="file-label">
              Choose File
            </label>
          </div>
          
          {/* Register button for non-authenticated users */}
          {!isAuthenticated && (
            <div className="register-section">
              <div className="register-divider">
                <span>or</span>
              </div>
              <RegisterButton 
                onClick={handleTournamentRegistration}
                disabled={!isAuthenticated}
              />
            </div>
          )}
        </div>
      ) : !extractedStats ? (
        <div className="image-preview-section">
          <div className="image-preview">
            <img src={uploadedImage} alt="Uploaded Stats" className="uploaded-image" />
            <button 
              onClick={() => setUploadedImage(null)}
              className="remove-image-btn"
              title="Remove image"
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          
          <button 
            onClick={handleUploadStats}
            disabled={isProcessing}
            className="auth-submit-btn"
          >
            {isProcessing ? (
              <>
                <ion-icon name="hourglass-outline"></ion-icon>
                Processing...
              </>
            ) : (
              <>
                <ion-icon name="analytics-outline"></ion-icon>
                UPLOAD STATS
              </>
            )}
          </button>
          
          {/* Register button for non-authenticated users */}
          {!isAuthenticated && (
            <div className="register-section">
              <div className="register-divider">
                <span>or</span>
              </div>
              <RegisterButton 
                onClick={handleTournamentRegistration}
                disabled={!isAuthenticated}
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default StatsUpload;
