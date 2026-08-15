import { Link, NavLink } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="CineStream Home">
          <Film className="w-6 h-6 text-red-600" />
          <span className="text-xl font-bold text-white tracking-wide">
            CineStream
          </span>
        </Link>

        <nav className="flex items-center bg-gray-900 border border-gray-800 rounded-full p-1 gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            Explore
          </NavLink>
          
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'bg-gray-800 text-red-500' : 'text-gray-400 hover:text-red-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Heart className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">Favorites</span>
              </>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}