import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Upcoming from './components/Upcoming/Upcoming';
import News from './components/News/News';
import Footer from './components/Footer/Footer';
import Cursor from './components/Cursor/Cursor';
import BackToTop from './components/BackToTop/BackToTop';
import Tournament from './components/Tournament/Tournament';
import Portfolio from './components/Portfolio/Portfolio';
import PPT from './pages/PPT';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function HomePage() {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we should show stats upload after Google login
    const urlParams = new URLSearchParams(location.search);
    console.log('App.js - URL params:', location.search);
    console.log('App.js - showStatsUpload param:', urlParams.get('showStatsUpload'));
    
    if (urlParams.get('showStatsUpload') === 'true') {
      console.log('App.js - Triggering openStatsUpload event');
      // Trigger stats upload modal
      const event = new CustomEvent('openStatsUpload');
      window.dispatchEvent(event);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  return (
    <>
      <Header />
      <main>
        <article>
          <Hero />
          <Upcoming />
          <News />
        </article>
      </main>
      <Footer />
      <BackToTop />
      
    </>
  );
}

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "890991300292-gc4vhn7io9986dlongvnd3qs7gs14hct.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tournament" element={<Tournament />} />
              <Route path="/contact" element={<Portfolio />} />
              <Route path="/ppt" element={<PPT />} />
            </Routes>
            <Cursor />
            <BackToTop />
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;