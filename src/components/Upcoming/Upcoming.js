import React from 'react';
import './Upcoming.css';
import adityaLogo from '../../assests/teams-logo/aditya.png';
import safuLogo from '../../assests/teams-logo/safu.png';
import jjLogo from '../../assests/teams-logo/j.j.png';
import padokdaLogo from '../../assests/teams-logo/padokda.png';
import eternatusLogo from '../../assests/teams-logo/eternatus.png';
import brandonLogo from '../../assests/teams-logo/brandon.png';

const Upcoming = () => {
  return (
    <section className="section upcoming" aria-labelledby="upcoming-label" id="tournament">
      <div className="container">
        <p className="section-subtitle" id="upcoming-label" data-reveal="bottom">Community & Excitement</p>
        <h2 className="h2 section-title" data-reveal="bottom">Championship<span className="span"> Contenders</span></h2>
        <p className="section-text" data-reveal="bottom">Team captains bid on the best SmashKarts players in an intense auction! Watch bidding wars unfold as captains build their dream teams.</p>

        <ol className="upcoming-list">
          <li className="upcoming-item">
            <div className="upcoming-card left has-before" data-reveal="left">
              <img src={adityaLogo} alt="PADOKDA" className="card-banner" width="86" height="81" loading="lazy" />
              <h3 className="h3 card-title">Turbo Terrors</h3>
              <div className="card-meta">Captain : PADOKDA</div>
            </div>
            <div className="upcoming-time" data-reveal="bottom">
              <time className="time" datetime="10:00">10:00</time>
              <time datetime="2022-05-25" className="date">25 May 2025</time>
              <div className="social-wrapper">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link"><ion-icon name="logo-youtube"></ion-icon></a>
                <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer" className="social-link"><ion-icon name="logo-twitch"></ion-icon></a>
              </div>
            </div>
            <div className="upcoming-card right has-before" data-reveal="right">
              <img src={safuLogo} alt="PADOKDA" className="card-banner" width="86" height="81" loading="lazy" />
              <h3 className="h3 card-title">Turbo Terrors</h3>
              <div className="card-meta">Captain :PADOKDA</div>
            </div>
          </li>

          <li className="upcoming-item">
            <div className="upcoming-card left has-before" data-reveal="left">
              <img src={jjLogo} alt="PADOKDA" className="card-banner" width="86" height="81" loading="lazy" />
              <h3 className="h3 card-title">Turbo Terrors</h3>
              <div className="card-meta">Captain : PADOKDA</div>
            </div>
            <div className="upcoming-time" data-reveal="bottom">
              <time className="time" datetime="10:00">10:00</time>
              <time datetime="2022-05-25" className="date">25 May 2025</time>
              <div className="social-wrapper">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link"><ion-icon name="logo-youtube"></ion-icon></a>
                <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer" className="social-link"><ion-icon name="logo-twitch"></ion-icon></a>
              </div>
            </div>
            <div className="upcoming-card right has-before" data-reveal="right">
              <img src={padokdaLogo} alt="PADOKDA" className="card-banner" width="86" height="81" loading="lazy" />
              <h3 className="h3 card-title">Turbo Terrors</h3>
              <div className="card-meta">Captain :PADOKDA</div>
            </div>
          </li>

          <li className="upcoming-item">
            <div className="upcoming-card left has-before" data-reveal="left">
              <img src={eternatusLogo} alt="PADOKDA" className="card-banner" width="86" height="81" loading="lazy" />
              <h3 className="h3 card-title">Turbo Terrors</h3>
              <div className="card-meta">Captain : PADOKDA</div>
            </div>
            <div className="upcoming-time" data-reveal="bottom">
              <time className="time" datetime="10:00">10:00</time>
              <time datetime="2022-05-25" className="date">25 May 2025</time>
              <div className="social-wrapper">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link"><ion-icon name="logo-youtube"></ion-icon></a>
                <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer" className="social-link"><ion-icon name="logo-twitch"></ion-icon></a>
              </div>
            </div>
            <div className="upcoming-card right has-before" data-reveal="right">
              <img src={brandonLogo} alt="PADOKDA" className="card-banner" width="86" height="81" loading="lazy" />
              <h3 className="h3 card-title">Turbo Terrors</h3>
              <div className="card-meta">Captain :PADOKDA</div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
};

export default Upcoming;