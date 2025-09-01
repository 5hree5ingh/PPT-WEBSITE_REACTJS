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
      const base64Data = uploadedImage.split(',')[1];
      const enhancedStats = await extractAllData(base64Data);
      setExtractedStats(enhancedStats);
      
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
              <div className="stat-item" data-index="1">
                <span className="stat-label">KILLS</span>
                <span className="stat-value kills">{extractedStats.kills}</span>
              </div>
              <div className="stat-item" data-index="2">
                <span className="stat-label">DEATHS</span>
                <span className="stat-value">{extractedStats.deaths}</span>
              </div>
              <div className="stat-item" data-index="3">
                <span className="stat-label">KD RATIO</span>
                <span className="stat-value kd-ratio">{calculateKD()}</span>
                <span className="stat-subtitle">ATTACKER</span>
              </div>
              <div className="stat-item" data-index="4">
                <span className="stat-label">LEVEL</span>
                <span className="stat-value level">{extractedStats.level}</span>
              </div>
              <div className="stat-item" data-index="5">
                <span className="stat-label">GAMES</span>
                <span className="stat-value games">{extractedStats.total_games}</span>
              </div>
              <div className="stat-item" data-index="6">
                <span className="stat-label">SK ID</span>
                <span className="stat-value">{extractedStats.sk_id}</span>
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
