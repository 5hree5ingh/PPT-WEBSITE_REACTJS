import React, { useState, useEffect, useRef } from 'react';
import PlayerCard from '../PlayerCard';
import PlayerModal from '../PlayerModal';
import { players } from '../../../data/players';

const RegPlayerTab = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const gridRef = useRef(null);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const cards = gridRef.current?.querySelectorAll('.player-card');
    cards?.forEach((card, index) => {
      card.dataset.index = index;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="reg-players-container">
      <div className="reg-players-header">
        <h3 style={{ color: 'var(--text-white)', marginBottom: 10 }}>Registered Players</h3>
        <p style={{ color: 'var(--text-gray)', marginBottom: 20 }}>Total Players: {players.length}</p>
      </div>
      
      <div className="players-grid" ref={gridRef}>
        {players.map((player, index) => (
          <PlayerCard 
            key={index} 
            player={player} 
            onClick={() => handlePlayerClick(player)}
            style={{
              animationDelay: `${index * 0.03}s`,
              animation: visibleCards.has(index) ? 'cardSlideIn 0.5s ease-out forwards' : 'none',
              opacity: visibleCards.has(index) ? 1 : 0,
              transform: visibleCards.has(index) ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)'
            }}
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