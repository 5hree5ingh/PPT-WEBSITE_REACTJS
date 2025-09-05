import React from 'react';
import './Badge.css';

const Badge = ({ badge, size = 'normal' }) => {
  const sizeClass = size === 'small' ? 'badge-small' : 'badge-normal';
  const badgeClass = size === 'small' ? `card-badge-${badge.id}` : `badge-${badge.id}`;
  
  return (
    <div className={`badge ${sizeClass} ${badgeClass}`}>
      <span className="badge-icon">{badge.icon}</span>
      <span className="badge-text">{badge.name}</span>
    </div>
  );
};

export default Badge;
