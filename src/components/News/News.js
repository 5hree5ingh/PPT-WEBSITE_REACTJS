import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './News.css';
import news1 from '../../assests/images/snews-1.png';
import news2 from '../../assests/images/snews2.png';
import news3 from '../../assests/images/snews-3.png';

const News = () => {
  useScrollReveal();

  return (
    <section className="section news" aria-label="our latest news" id="news">
      <div className="container">
        <p className="section-subtitle" data-reveal="bottom">Who is the real champion?</p>
        <h2 className="h2 section-title" data-reveal="bottom">Pro <span className="span">Gamers</span></h2>
        <p className="section-text" data-reveal="bottom">Team captains bid on the best SmashKarts players in an intense auction! Watch bidding wars unfold as captains build their dream teams.</p>
        
        <ul className="news-list">
          {/* STEP 1 WHOLE CARD */}
          <li data-reveal="bottom">
            <div className="news-card">
              <figure className="card-banner img-holder" style={{ "--width": "600", "--height": "400" }}>
                                 <img src={news1} width="600" height="400" loading="lazy" alt="SmashKarts" className="img-cover" />
              </figure>
              <div className="card-content">
                <a href="#news" className="card-tag">Smashkarts</a>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>
                    <time className="card-meta-text" datetime="2022-05-25">25 May 2025</time>
                  </li>
                  <li className="card-meta-item">
                    <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
                    <p className="card-meta-text">Kabir Singh</p>
                  </li>
                </ul>
                <h3 className="h3">
                  <a href="#news" className="card-title">Innovative business model</a>
                </h3>
                <p className="card-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <a href="#news" className="link has-before">Read More</a>
              </div>
            </div>
          </li>

          {/* STEP 2 WHOLE CARD */}
          <li data-reveal="bottom">
            <div className="news-card">
              <figure className="card-banner img-holder" style={{ "--width": "600", "--height": "400" }}>
                                 <img src={news2} width="600" height="400" loading="lazy" alt="SmashKarts" className="img-cover" />
              </figure>
              <div className="card-content">
                <a href="#news" className="card-tag">Smashkarts</a>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>
                    <time className="card-meta-text" datetime="2022-05-25">25 May 2025</time>
                  </li>
                  <li className="card-meta-item">
                    <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
                    <p className="card-meta-text">Kabir Singh</p>
                  </li>
                </ul>
                <h3 className="h3">
                  <a href="#news" className="card-title">Innovative business model</a>
                </h3>
                <p className="card-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <a href="#news" className="link has-before">Read More</a>
              </div>
            </div>
          </li>

          {/* STEP 3 WHOLE CARD */}
          <li data-reveal="bottom">
            <div className="news-card">
              <figure className="card-banner img-holder" style={{ "--width": "600", "--height": "400" }}>
                                 <img src={news3} width="600" height="400" loading="lazy" alt="SmashKarts" className="img-cover" />
              </figure>
              <div className="card-content">
                <a href="#news" className="card-tag">Smashkarts</a>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>
                    <time className="card-meta-text" datetime="2022-05-25">25 May 2025</time>
                  </li>
                  <li className="card-meta-item">
                    <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
                    <p className="card-meta-text">Kabir Singh KUMAR</p>
                  </li>
                </ul>
                <h3 className="h3">
                  <a href="#news" className="card-title">Innovative business model</a>
                </h3>
                <p className="card-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <a href="#news" className="link has-before">Read More</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default News;