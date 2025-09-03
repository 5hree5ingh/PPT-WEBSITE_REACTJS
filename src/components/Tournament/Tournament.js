import React, { useState } from 'react';
import './Tournament.css';
import AuthModal from '../Auth/AuthModal';
import Header from '../Header/Header';
import TournamentTabs from './TournamentTabs';

const Tournament = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = () => {
    setIsAuthOpen(true);
    document.body.classList.add('modal-open');
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
    document.body.classList.remove('modal-open');
  };

  return (
    <>
      <Header />
      <main className="tournament-page-legacy">
        <TournamentTabs />
        <button className="captain-signin-btn" onClick={openAuth}>
          Sign in as Captain
        </button>
        <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
      </main>
    </>
  );
};

export default Tournament;
