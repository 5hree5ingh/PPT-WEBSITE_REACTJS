import React, { useState, useEffect } from 'react';
import './PPT.css';

const PPT = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    // Slide 1: Title
    {
      id: 1,
      title: "PPT SmashKarts Tournament Platform",
      subtitle: "Integrated Discord Bot Solution",
      content: (
        <div className="slide-content title-slide">
          <div className="logo-section">
            <img src="/favicon.png" alt="PPT Logo" className="title-logo" />
            <h1>PPT SmashKarts Tournament Platform</h1>
            <h2>Integrated Discord Bot Solution</h2>
          </div>
          <div className="feature-highlights">
            <div className="highlight">✅ Google OAuth Integration</div>
            <div className="highlight">✅ Discord Bot Automation</div>
            <div className="highlight">✅ Progress Tracking System</div>
            <div className="highlight">✅ Tournament Management</div>
          </div>
        </div>
      )
    },

    // Slide 2: Project Overview
    {
      id: 2,
      title: "Project Overview",
      content: (
        <div className="slide-content">
          <div className="architecture-diagram">
            <div className="system-component frontend">
              <div className="component-icon">⚛️</div>
              <h3>Frontend</h3>
              <p>React.js</p>
              <ul>
                <li>Dark Theme UI</li>
                <li>Modal System</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            <div className="system-component backend">
              <div className="component-icon">🖥️</div>
              <h3>Backend</h3>
              <p>Node.js + Express</p>
              <ul>
                <li>RESTful API</li>
                <li>JWT Authentication</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div className="system-component database">
              <div className="component-icon">🗄️</div>
              <h3>Database</h3>
              <p>PostgreSQL</p>
              <ul>
                <li>User Management</li>
                <li>Stats Storage</li>
                <li>Tournament Data</li>
              </ul>
            </div>
            <div className="system-component discord">
              <div className="component-icon">🤖</div>
              <h3>Discord Bot</h3>
              <p>Vidhayak Ji</p>
              <ul>
                <li>User Verification</li>
                <li>Tournament Updates</li>
                <li>Match Management</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: Registration Flow
    {
      id: 3,
      title: "4-Case Registration Flow",
      content: (
        <div className="slide-content">
          <div className="flow-diagram">
            <div className="flow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Google Signup</h4>
                <p>OAuth Authentication</p>
                <div className="status-badge verified">Email Verified</div>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Discord Username</h4>
                <p>Account Linking</p>
                <div className="status-badge verified">Discord Verified</div>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>SK Stats Upload</h4>
                <p>Game Statistics</p>
                <div className="status-badge verified">Stats Verified</div>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Tournament Registration</h4>
                <p>Final Step</p>
                <div className="status-badge verified">Registered</div>
              </div>
            </div>
          </div>
          <div className="cases-section">
            <h3>4 User Scenarios:</h3>
            <div className="cases-grid">
              <div className="case-item">
                <strong>Case 1:</strong> Google verified, resume from Discord
              </div>
              <div className="case-item">
                <strong>Case 2:</strong> Email + Discord done, resume from SK stats
              </div>
              <div className="case-item">
                <strong>Case 3:</strong> Everything done, resume from registration
              </div>
              <div className="case-item">
                <strong>Case 4:</strong> Fully registered, show dashboard
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Database Schema
    {
      id: 4,
      title: "Database Schema",
      content: (
        <div className="slide-content">
          <div className="schema-diagram">
            <div className="table users-table">
              <h4>Users Table</h4>
              <div className="table-fields">
                <div className="field primary">id (Primary Key)</div>
                <div className="field">email</div>
                <div className="field">discord_username</div>
                <div className="field boolean">email_verified</div>
                <div className="field boolean">discord_verified</div>
                <div className="field boolean">sk_stats_verified</div>
                <div className="field boolean">tournament_registered</div>
                <div className="field">google_name</div>
                <div className="field">google_id</div>
              </div>
            </div>
            <div className="table user-stats-table">
              <h4>User Stats Table</h4>
              <div className="table-fields">
                <div className="field primary">id (Primary Key)</div>
                <div className="field foreign">user_id (Foreign Key)</div>
                <div className="field">player_name</div>
                <div className="field">total_games</div>
                <div className="field">wins</div>
                <div className="field">losses</div>
                <div className="field">win_rate</div>
                <div className="field">kills</div>
                <div className="field">deaths</div>
                <div className="field">kd_ratio</div>
                <div className="field">level</div>
                <div className="field">rank</div>
              </div>
            </div>
            <div className="table tournament-matches-table">
              <h4>Tournament Matches Table</h4>
              <div className="table-fields">
                <div className="field primary">id (Primary Key)</div>
                <div className="field">round_number</div>
                <div className="field foreign">player1_id</div>
                <div className="field foreign">player2_id</div>
                <div className="field foreign">winner_id</div>
                <div className="field">match_data (JSON)</div>
                <div className="field">status</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: API Endpoints
    {
      id: 5,
      title: "API Architecture",
      content: (
        <div className="slide-content">
          <div className="api-sections">
            <div className="api-section auth">
              <h3>🔐 Authentication</h3>
              <div className="endpoint">
                <span className="method post">POST</span>
                <span className="url">/api/auth/google-login</span>
                <span className="description">Google OAuth login</span>
              </div>
              <div className="endpoint">
                <span className="method post">POST</span>
                <span className="url">/api/auth/update-discord-username</span>
                <span className="description">Link Discord account</span>
              </div>
              <div className="endpoint">
                <span className="method get">GET</span>
                <span className="url">/api/auth/profile</span>
                <span className="description">Get user progress</span>
              </div>
            </div>
            <div className="api-section stats">
              <h3>📊 Stats Management</h3>
              <div className="endpoint">
                <span className="method post">POST</span>
                <span className="url">/api/stats/save</span>
                <span className="description">Save SmashKarts stats</span>
              </div>
              <div className="endpoint">
                <span className="method get">GET</span>
                <span className="url">/api/stats/get</span>
                <span className="description">Get user stats</span>
              </div>
            </div>
            <div className="api-section tournament">
              <h3>🏆 Tournament</h3>
              <div className="endpoint">
                <span className="method post">POST</span>
                <span className="url">/api/tournament/register</span>
                <span className="description">Register for tournament</span>
              </div>
              <div className="endpoint">
                <span className="method get">GET</span>
                <span className="url">/api/tournament/status</span>
                <span className="description">Get registration status</span>
              </div>
              <div className="endpoint">
                <span className="method get">GET</span>
                <span className="url">/api/tournament/participants</span>
                <span className="description">Get all participants</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: Discord Bot Integration
    {
      id: 6,
      title: "Discord Bot Integration",
      content: (
        <div className="slide-content">
          <div className="bot-features">
            <div className="bot-section">
              <h3>🤖 Vidhayak Ji Bot Features</h3>
              <div className="feature-grid">
                <div className="feature-item">
                  <div className="feature-icon">👤</div>
                  <h4>User Verification</h4>
                  <p>Link Discord accounts to tournament profiles</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📢</div>
                  <h4>Tournament Updates</h4>
                  <p>Real-time notifications and announcements</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🏆</div>
                  <h4>Match Management</h4>
                  <p>Automated bracket generation and updates</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚙️</div>
                  <h4>Admin Commands</h4>
                  <p>User moderation and tournament control</p>
                </div>
              </div>
            </div>
            <div className="bot-commands">
              <h3>💬 Bot Commands</h3>
              <div className="commands-list">
                <div className="command">
                  <code>!register &lt;email&gt;</code>
                  <span>Link Discord to tournament account</span>
                </div>
                <div className="command">
                  <code>!profile</code>
                  <span>View tournament profile</span>
                </div>
                <div className="command">
                  <code>!matches</code>
                  <span>View upcoming matches</span>
                </div>
                <div className="command">
                  <code>!bracket</code>
                  <span>View tournament bracket</span>
                </div>
                <div className="command">
                  <code>!admin &lt;command&gt;</code>
                  <span>Admin-only commands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: UI/UX Design
    {
      id: 7,
      title: "UI/UX Design",
      content: (
        <div className="slide-content">
          <div className="design-showcase">
            <div className="design-section">
              <h3>🎨 Design System</h3>
              <div className="color-palette">
                <div className="color-item">
                  <div className="color-swatch primary"></div>
                  <span>Primary: #4A90E2</span>
                </div>
                <div className="color-item">
                  <div className="color-swatch secondary"></div>
                  <span>Secondary: #7B68EE</span>
                </div>
                <div className="color-item">
                  <div className="color-swatch accent"></div>
                  <span>Accent: #00CED1</span>
                </div>
                <div className="color-item">
                  <div className="color-swatch background"></div>
                  <span>Background: #1A1A1A</span>
                </div>
              </div>
            </div>
            <div className="design-section">
              <h3>📱 Key Components</h3>
              <div className="components-grid">
                <div className="component-item">
                  <div className="component-preview modal"></div>
                  <h4>Modal System</h4>
                  <p>Multi-step registration flow</p>
                </div>
                <div className="component-item">
                  <div className="component-preview form"></div>
                  <h4>Form Validation</h4>
                  <p>Real-time error handling</p>
                </div>
                <div className="component-item">
                  <div className="component-preview progress"></div>
                  <h4>Progress Tracking</h4>
                  <p>Visual flow indicators</p>
                </div>
                <div className="component-item">
                  <div className="component-preview responsive"></div>
                  <h4>Responsive Design</h4>
                  <p>Mobile + desktop optimized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: Security Features
    {
      id: 8,
      title: "Security & Performance",
      content: (
        <div className="slide-content">
          <div className="security-performance">
            <div className="security-section">
              <h3>🔒 Security Features</h3>
              <div className="security-grid">
                <div className="security-item">
                  <div className="security-icon">🔑</div>
                  <h4>JWT Authentication</h4>
                  <p>Secure token-based session management</p>
                </div>
                <div className="security-item">
                  <div className="security-icon">🛡️</div>
                  <h4>Input Validation</h4>
                  <p>All user inputs sanitized and validated</p>
                </div>
                <div className="security-item">
                  <div className="security-icon">🚦</div>
                  <h4>Rate Limiting</h4>
                  <p>API abuse prevention and throttling</p>
                </div>
                <div className="security-item">
                  <div className="security-icon">🌐</div>
                  <h4>CORS Protection</h4>
                  <p>Cross-origin request security</p>
                </div>
              </div>
            </div>
            <div className="performance-section">
              <h3>⚡ Performance Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-value">&lt;3s</div>
                  <div className="metric-label">Page Load Time</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">&lt;500ms</div>
                  <div className="metric-label">API Response</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">99.9%</div>
                  <div className="metric-label">Uptime</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">&lt;1%</div>
                  <div className="metric-label">Error Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 9: Success Metrics
    {
      id: 9,
      title: "Success Metrics & Goals",
      content: (
        <div className="slide-content">
          <div className="metrics-overview">
            <div className="goals-section">
              <h3>🎯 Target Goals</h3>
              <div className="goals-grid">
                <div className="goal-item">
                  <div className="goal-number">100+</div>
                  <div className="goal-label">Registered Users</div>
                </div>
                <div className="goal-item">
                  <div className="goal-number">80%+</div>
                  <div className="goal-label">Flow Completion Rate</div>
                </div>
                <div className="goal-item">
                  <div className="goal-number">90%+</div>
                  <div className="goal-label">Discord Integration Rate</div>
                </div>
                <div className="goal-item">
                  <div className="goal-number">32</div>
                  <div className="goal-label">Tournament Participants</div>
                </div>
              </div>
            </div>
            <div className="competitive-section">
              <h3>🏆 Competitive Advantage</h3>
              <div className="advantage-points">
                <div className="advantage-item">
                  <div className="advantage-icon">🤖</div>
                  <h4>Unique Discord Integration</h4>
                  <p>Seamless tournament management and community engagement</p>
                </div>
                <div className="advantage-item">
                  <div className="advantage-icon">🔄</div>
                  <h4>Smart Resume System</h4>
                  <p>4-case flow that remembers user progress</p>
                </div>
                <div className="advantage-item">
                  <div className="advantage-icon">📊</div>
                  <h4>Real-time Analytics</h4>
                  <p>Live tournament statistics and player tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 10: Future Roadmap
    {
      id: 10,
      title: "Future Roadmap",
      content: (
        <div className="slide-content">
          <div className="roadmap-timeline">
            <div className="timeline-item phase1">
              <div className="phase-number">Phase 1</div>
              <div className="phase-content">
                <h3>Core Platform</h3>
                <ul>
                  <li>✅ User Registration System</li>
                  <li>✅ Discord Bot Integration</li>
                  <li>✅ Tournament Management</li>
                  <li>✅ Progress Tracking</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item phase2">
              <div className="phase-number">Phase 2</div>
              <div className="phase-content">
                <h3>Advanced Features</h3>
                <ul>
                  <li>📱 Mobile App (React Native)</li>
                  <li>📺 Live Streaming Integration</li>
                  <li>📈 Advanced Analytics Dashboard</li>
                  <li>👥 Social Features & Player Profiles</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item phase3">
              <div className="phase-number">Phase 3</div>
              <div className="phase-content">
                <h3>Enterprise Features</h3>
                <ul>
                  <li>🏆 Multiple Tournament Support</li>
                  <li>👥 Team-based Competitions</li>
                  <li>💰 Prize System & Payments</li>
                  <li>🤝 Sponsor Integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSlideDoubleClick = () => {
    setIsFullscreen(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (event.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else if (event.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          window.location.href = '/';
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length, isFullscreen]);

  return (
    <div className={`ppt-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {!isFullscreen && (
        <div className="ppt-header">
          <div className="ppt-logo-section">
            <img src="/favicon.png" alt="PPT Logo" className="ppt-logo" />
            <h1>PPT SmashKarts Tournament Platform</h1>
          </div>
          <div className="slide-counter">
            Slide {currentSlide + 1} of {slides.length}
          </div>
        </div>
      )}

      <div className="ppt-slideshow">
        <div className="slide-container">
          <div 
            className="slide" 
            onDoubleClick={handleSlideDoubleClick}
            title="Double-click to enter fullscreen mode"
          >
            <h2 className="slide-title">{slides[currentSlide].title}</h2>
            <div className="slide-content">
              {slides[currentSlide].content}
            </div>
          </div>
        </div>

        {!isFullscreen && (
          <div className="slide-navigation">
            <button 
              className="nav-btn prev-btn" 
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              ← Previous
            </button>
            
            <div className="slide-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
            
            <button 
              className="nav-btn next-btn" 
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              Next →
            </button>
          </div>
        )}

        {isFullscreen && (
          <div className="fullscreen-controls">
            <div className="fullscreen-slide-counter">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PPT;
