import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Upcoming from './components/Upcoming/Upcoming';
import News from './components/News/News';
import Footer from './components/Footer/Footer';
import Cursor from './components/Cursor/Cursor';
import BackToTop from './components/BackToTop/BackToTop';
import TestExtraction from './components/TestExtraction/TestExtraction';
import Tournament from './components/Tournament/Tournament';
import Portfolio from './components/Portfolio/Portfolio';
import './App.css';

function HomePage() {
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
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestExtraction />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/contact" element={<Portfolio />} />
        </Routes>
        <Cursor />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;