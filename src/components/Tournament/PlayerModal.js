import React from 'react';
import './PlayerModal.css';

const PlayerModal = ({ player, isOpen, onClose }) => {
  if (!isOpen || !player) return null;

  // Calculate kills and deaths from kd ratio and games played
  const kd = parseFloat(player.kd) || 0;
  const games = parseInt(player.games_played) || 0;
  const kills = Math.round((kd * games) / (1 + kd));
  const deaths = games - kills;
  const skid = player.s_id || 'N/A';

  return (
    <div className="player-modal-overlay" onClick={onClose}>
      <div className="player-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        
        {player.name.toLowerCase().includes('sinnocent') && (
          <>
            <div className="winner-badge badge-s5">
              <span className="badge-icon">🏆</span>
              <span className="badge-text">PPL S3 Winner</span>
            </div>
            <div className="winner-badge badge-s3">
              <span className="badge-icon">🏆</span>
              <span className="badge-text">PPL S2 Winner</span>
            </div>
          </>
        )}
        
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-kart">
              <img 
                src={player.cart_image || '/default-kart.png'} 
                alt={`${player.name}'s kart`}
                onError={(e) => {
                  e.target.src = '/default-kart.png';
                }}
              />
            </div>
            <h2 className="modal-name">{player.name}</h2>
          </div>

          <div className="modal-stats">
            <div className="modal-stat-row">
              <div className="modal-stat">
                <span className="modal-stat-label">Skid</span>
                <span className="modal-stat-value">{skid}</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-label">K/D Ratio</span>
                <span className="modal-stat-value">{kd.toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-stat-row">
              <div className="modal-stat">
                <span className="modal-stat-label">Games Played</span>
                <span className="modal-stat-value">{games}</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-label">Level</span>
                <span className="modal-stat-value">{player.level || 0}</span>
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

          {player.description && (
            <div className="modal-description">
              <h3>Description</h3>
              <p>{player.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
