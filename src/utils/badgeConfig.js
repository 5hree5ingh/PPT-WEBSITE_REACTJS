// Badge Configuration System
// Add players here to give them badges

export const BADGE_TYPES = {
  PPL_S3_WINNER: {
    id: 'ppl_s3_winner',
    name: 'PPL S3 Winner',
    icon: '🏆',
    color: {
      background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      border: '#8b5cf6',
      shadow: 'rgba(139, 92, 246, 0.3)'
    }
  },
  PPL_S5_WINNER: {
    id: 'ppl_s5_winner',
    name: 'PPL S5 Winner',
    icon: '🏆',
    color: {
      background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
      border: '#ffd700',
      shadow: 'rgba(255, 215, 0, 0.3)'
    }
  },
  // Add more badge types here
  // PPL_S4_WINNER: {
  //   id: 'ppl_s4_winner',
  //   name: 'PPL S4 Winner',
  //   icon: '🥇',
  //   color: {
  //     background: 'linear-gradient(135deg, #10b981, #34d399)',
  //     border: '#10b981',
  //     shadow: 'rgba(16, 185, 129, 0.3)'
  //   }
  // }
};

// Player Badge Assignments
// Add players here with their badges
export const PLAYER_BADGES = {
  // Example: Player with multiple badges
  'sinnocent ❄️': [BADGE_TYPES.PPL_S3_WINNER, BADGE_TYPES.PPL_S5_WINNER],
  
  // Add more players here:
  // 'player_name': [BADGE_TYPES.PPL_S3_WINNER],
  // 'another_player': [BADGE_TYPES.PPL_S5_WINNER],
  // 'third_player': [BADGE_TYPES.PPL_S3_WINNER, BADGE_TYPES.PPL_S5_WINNER],
};

// Utility Functions
export const getPlayerBadges = (player) => {
  if (!player || !player.name) return [];
  
  const playerKey = player.name.toLowerCase().trim();
  
  // First try exact match
  if (PLAYER_BADGES[playerKey]) {
    return PLAYER_BADGES[playerKey];
  }
  
  // Then try partial match (for names with emojis or extra spaces)
  for (const [key, badges] of Object.entries(PLAYER_BADGES)) {
    if (playerKey.includes(key) || key.includes(playerKey)) {
      return badges;
    }
  }
  
  return [];
};

export const hasBadges = (player) => {
  return getPlayerBadges(player).length > 0;
};

export const addPlayerBadge = (playerName, badgeType) => {
  const key = playerName.toLowerCase().trim();
  if (!PLAYER_BADGES[key]) {
    PLAYER_BADGES[key] = [];
  }
  if (!PLAYER_BADGES[key].includes(badgeType)) {
    PLAYER_BADGES[key].push(badgeType);
  }
};

export const removePlayerBadge = (playerName, badgeType) => {
  const key = playerName.toLowerCase().trim();
  if (PLAYER_BADGES[key]) {
    PLAYER_BADGES[key] = PLAYER_BADGES[key].filter(badge => badge.id !== badgeType.id);
  }
};

// Helper function to get badge by ID
export const getBadgeById = (badgeId) => {
  return Object.values(BADGE_TYPES).find(badge => badge.id === badgeId);
};
