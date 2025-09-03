import React, { useEffect, useRef, useState } from 'react';
import './TournamentTabs.css';
import DescriptionTab from './tabs/DescriptionTab';
import CategoryTab from './tabs/CategoryTab';
import TeamsTab from './tabs/TeamsTab';
import RegPlayerTab from './tabs/RegPlayerTab';
import PointsTableTab from './tabs/PointsTableTab';
import RedCapLeaderboardTab from './tabs/RedCapLeaderboardTab';

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'teams', label: 'Teams' },
  { key: 'reg', label: 'Reg Player' },
  { key: 'points', label: 'Points Table' },
  { key: 'redcap', label: 'Red Cap' },
];

const keyToIndex = (key) => TABS.findIndex((t) => t.key === key);

const TournamentTabs = () => {
  const [active, setActive] = useState('description');
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState('none');
  const headerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, top: 0, height: 0 });

  const renderActive = () => {
    switch (active) {
      case 'description':
        return <DescriptionTab />;
      case 'category':
        return <CategoryTab />;
      case 'teams':
        return <TeamsTab />;
      case 'reg':
        return <RegPlayerTab />;
      case 'points':
        return <PointsTableTab />;
      case 'redcap':
        return <RedCapLeaderboardTab />;
      default:
        return null;
    }
  };

  const updateIndicator = () => {
    const container = headerRef.current;
    if (!container) return;
    const btn = container.querySelector(`button[data-key="${active}"]`);
    if (!btn) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setIndicator({
      left: bRect.left - cRect.left,
      width: bRect.width,
      top: bRect.top - cRect.top,
      height: bRect.height,
    });
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleClick = (key) => {
    if (key === active) return;
    const prev = keyToIndex(active);
    const next = keyToIndex(key);
    setDirection(next > prev ? 'right' : 'left');
    setAnimKey((k) => k + 1);
    setActive(key);
  };

  const animClass = direction === 'right' ? 'slide-in-right' : direction === 'left' ? 'slide-in-left' : 'fade-slide-in';

  return (
    <section className="tournament-tabs">
      <div className="tabs-header" ref={headerRef}>
        <span
          className="tab-indicator"
          style={{ left: `${indicator.left}px`, width: `${indicator.width}px`, top: `${indicator.top}px`, height: `${indicator.height}px` }}
        />
        {TABS.map((tab) => (
          <button
            key={tab.key}
            data-key={tab.key}
            className={`tab-btn ${active === tab.key ? 'active' : ''}`}
            onClick={() => handleClick(tab.key)}
            aria-pressed={active === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div key={animKey} className={`tabs-content ${animClass}`}>
        {renderActive()}
      </div>
    </section>
  );
};

export default TournamentTabs;
