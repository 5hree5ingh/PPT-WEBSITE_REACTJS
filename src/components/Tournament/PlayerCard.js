import React from 'react';
import './PlayerCard.css';
import Badge from './Badge';
import { getPlayerBadges } from '../../utils/badgeConfig';

const PlayerCard = ({ player, onClick }) => {
  // Calculate kills and deaths from kd ratio and games played
  const kd = parseFloat(player.kd) || 0;
  const games = parseInt(player.games_played) || 0;
  const kills = Math.round((kd * games) / (1 + kd));
  const deaths = games - kills;
  const skid = player.s_id || 'N/A';
  const playerBadges = getPlayerBadges(player);

  return (
    <div className="player-card" onClick={onClick}>
      {playerBadges.map((badge, index) => (
        <div 
          key={badge.id}
          className="card-badge-container"
          style={{ right: `${8 + (index * 93)}px` }}
        >
          <Badge badge={badge} size="small" />
        </div>
      ))}
      
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
