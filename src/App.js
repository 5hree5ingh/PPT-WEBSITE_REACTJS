import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Upcoming from './components/Upcoming/Upcoming';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <article>
          <Hero />
          <Upcoming />
        </article>
      </main>
    </div>
  );
}

export default App;