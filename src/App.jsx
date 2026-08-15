import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-[#020617] text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
      </div>
    </FavoritesProvider>
  );
}