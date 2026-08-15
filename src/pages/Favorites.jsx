import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <main className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-5">
          <div className="p-3 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Favorites</h1>
            <p className="text-xs sm:text-sm text-gray-400">Your personalized watchlist synchronized locally.</p>
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-24 bg-gray-900/40 border border-gray-800 rounded-xl p-8 max-w-xl mx-auto">
            <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300">Your watchlist is empty</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-6">Heart items while exploring to save them here.</p>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
            >
              Explore Movies
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}