import React, { useState } from 'react';
import PlayerCard from '../PlayerCard';
import PlayerModal from '../PlayerModal';
import { players } from '../../../data/players';

const RegPlayerTab = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  return (
    <div className="reg-players-container">
      <div className="reg-players-header">
        <h3 style={{ color: 'var(--text-white)', marginBottom: 10 }}>Registered Players</h3>
        <p style={{ color: 'var(--text-gray)', marginBottom: 20 }}>Total Players: {players.length}</p>
      </div>
      
      <div className="players-grid">
        {players.map((player, index) => (
          <PlayerCard 
            key={index} 
            player={player} 
            onClick={() => handlePlayerClick(player)}
          />
        ))}
      </div>

      <PlayerModal 
        player={selectedPlayer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default RegPlayerTab;