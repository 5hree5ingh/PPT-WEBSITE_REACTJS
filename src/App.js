import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  );
}

export default App;