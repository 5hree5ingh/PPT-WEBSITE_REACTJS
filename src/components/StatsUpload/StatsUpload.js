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

            <div className="modal-actions">
              <button className="register-tournament-btn">
                REGISTER FOR TOURNAMENT
            </button>
              <button className="edit-info-btn">
                EDIT INFO
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
        </div>
      ) : null}
    </div>
  );
};

export default StatsUpload;
