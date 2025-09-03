import React from 'react';
import './Portfolio.css';
import Header from '../Header/Header';
import profileImg from './profile.png';

const Portfolio = () => {
  return (
    <>
      <Header />
      <main className="portfolio-page">
        <section className="intro-card">
          <div className="intro-avatar">
            <img src={profileImg} alt="Shreyansh Singh" />
          </div>
          <div className="intro-text">
            <h1>Shreyansh Singh</h1>
            <p>B.Tech in Artificial Intelligence & Machine Learning</p>
            <div className="intro-tags">
              <span className="tag">Full‑Stack Developer</span>
              <span className="tag">Discord Bot Builder</span>
              <span className="tag">AI/ML Enthusiast</span>
            </div>
          </div>
        </section>

        <section className="section-card">
          <h2><ion-icon name="construct-outline"></ion-icon> Skills</h2>
          <ul className="skills-grid">
            <li><ion-icon name="logo-nodejs"></ion-icon> Node.js</li>
            <li><ion-icon name="logo-react"></ion-icon> React, Vite</li>
            <li><ion-icon name="code-slash-outline"></ion-icon> JavaScript</li>
            <li><ion-icon name="hardware-chip-outline"></ion-icon> Python, AI/ML basics</li>
            <li><ion-icon name="document-text-outline"></ion-icon> REST APIs, Webhooks</li>
            <li><ion-icon name="shield-checkmark-outline"></ion-icon> Auth, JWT</li>
            <li><ion-icon name="server-outline"></ion-icon> MySql</li>
            <li><ion-icon name="logo-github"></ion-icon> Git/GitHub, CI basics</li>
            <li><ion-icon name="sparkles-outline"></ion-icon> UI/UX, Theming</li>
          </ul>
        </section>

        <section className="section-card">
          <h2><ion-icon name="logo-discord"></ion-icon> Projects</h2>
          <div className="projects">
            <article className="project">
              <h3><ion-icon name="flash-outline"></ion-icon> VIDHAYAKJI • Discord Bot</h3>
              <ul className="bullets">
                <li>Auto‑verification, moderation, voice & roles — one bot</li>
                <li>Gemini‑powered chat with context awareness</li>
                <li>+code/+stop: auto DM game codes to VC joiners</li>
              </ul>
            </article>

            <article className="project">
              <h3><ion-icon name="bulb-outline"></ion-icon> SACHIV JI • Tournament Assistant</h3>
              <ul className="bullets">
                <li>RAG (Gemini + Pinecone) — smart, context‑aware answers</li>
                <li>Self‑learns from screenshots & messages</li>
                <li>Key‑rotator infra → near‑zero cost, always‑on</li>
              </ul>
            </article>

            <article className="project">
              <h3><ion-icon name="globe-outline"></ion-icon> PANCHAYAT POINT • Website</h3>
              <ul className="bullets">
                <li>Professional gaming UI with themed components</li>
                <li>Profile/stats cards, animated tabs, image tools</li>
                <li>Clean React architecture with routing & APIs</li>
              </ul>
            </article>
          </div>
        </section>
      </main>
    </>
  );
};

export default Portfolio;
