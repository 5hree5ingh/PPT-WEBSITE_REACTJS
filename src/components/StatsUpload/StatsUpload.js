import React, { useState } from 'react';
import { extractAllData } from '../StatsAPI/apiLogic';
import './StatsUpload.css';

const StatsUpload = ({ onClose, onProfileDisplayed }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedStats, setExtractedStats] = useState(null);

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
      // Extract base64 from data URL
      const base64Data = uploadedImage.split(',')[1];
      
      // Use the imported API function
      const enhancedStats = await extractAllData(base64Data);
      
      // Set the extracted stats
      setExtractedStats(enhancedStats);
      
      // Call the callback if provided
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

  // If stats are extracted, show the profile card in the same modal
  if (extractedStats) {
    return (
      <div className="stats-upload-section">
        <div className="profile-card">
          {/* Game Title */}
          <div className="game-title">
            <h1>SMASHKARTS</h1>
          </div>

          {/* Character and Kart Section */}
          <div className="character-section">
            {extractedStats.cart_image && (
              <div className="cart-image-container">
                <img
                  src={extractedStats.cart_image}
                  alt="Player's SmashKarts vehicle"
                  className="cart-image"
                />
              </div>
            )}
          </div>

          {/* Player Name Section */}
          <div className="player-name-section">
            <h2 className="player-name">{extractedStats.discord_username}</h2>
            <div className="divider-line"></div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stats-container">
              <div className="stats-left">
                <div className="stat-item">
                  <span className="stat-label">KILLS</span>
                  <span className="stat-value kills">{extractedStats.kills}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">KD</span>
                  <span className="stat-value kd-ratio">{calculateKD()}</span>
                  <span className="stat-subtitle">KD: ATTACKER</span>
                </div>
              </div>
              
              <div className="vertical-divider"></div>
              
              <div className="stats-right">
                <div className="stat-item">
                  <span className="stat-label">LEVEL</span>
                  <span className="stat-value level">{extractedStats.level}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">GAMES</span>
                  <span className="stat-value">{extractedStats.total_games}</span>
                  <span className="stat-subtitle">ATTACKER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Divider */}
          <div className="bottom-divider"></div>

          {/* Profile Actions */}
          <div className="profile-actions">
            <button className="register-btn">
              REGISTER FOR TOURNEY
            </button>
            <button
              onClick={() => {
                setExtractedStats(null);
                setUploadedImage(null);
              }}
              className="back-btn"
            >
              Upload Another Image
            </button>
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
        </div>
      ) : (
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
        </div>
      )}
    </div>
  );
};

export default StatsUpload;

