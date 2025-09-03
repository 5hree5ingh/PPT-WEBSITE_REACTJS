import React from 'react';

const CategoryTab = () => {
  return (
    <div>
      <h3 style={{ color: 'var(--text-white)', marginBottom: 10 }}>Categories</h3>
      <ul style={{ paddingLeft: 18 }}>
        <li>Solo</li>
        <li>Duo</li>
        <li>Squad</li>
      </ul>
    </div>
  );
};

export default CategoryTab;
