import React from 'react';
import './PlayerCard.css';

const PlayerCard = ({ player, onClick }) => {
  // Calculate kills and deaths from kd ratio and games played
  const kd = parseFloat(player.kd) || 0;
  const games = parseInt(player.games_played) || 0;
  const kills = Math.round((kd * games) / (1 + kd));
  const deaths = games - kills;
  const skid = player.s_id || 'N/A';

  return (
    <div className="player-card" onClick={onClick}>
      {player.name.toLowerCase().includes('sinnocent') && (
        <>
          <div className="card-winner-badge card-badge-s5">
            <span className="card-badge-icon">🏆</span>
            <span className="card-badge-text">PPL S3 Winner</span>
          </div>
          <div className="card-winner-badge card-badge-s3">
            <span className="card-badge-icon">🏆</span>
            <span className="card-badge-text">PPL S2 Winner</span>
          </div>
        </>
      )}
      
      <div className="player-kart">
        <img 
          src={player.cart_image || '/default-kart.png'} 
          alt={`${player.name}'s kart`}
          onError={(e) => {
            e.target.src = '/default-kart.png';
          }}
        />
      </div>
      
      <div className="player-info">
        <h3 className="player-name">{player.name}</h3>
        <div className="player-stats">
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{player.level || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Kills</span>
            <span className="stat-value">{kills}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Deaths</span>
            <span className="stat-value">{deaths}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Games</span>
            <span className="stat-value">{games}</span>
          </div>
          <div className="stat">
            <span className="stat-label">K/D</span>
            <span className="stat-value">{kd.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Skid</span>
            <span className="stat-value">{skid}</span>
          </div>
        </div>
        
        {player.description && (
          <p className="player-description">{player.description}</p>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
