import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            SnippetHub
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="hover:text-blue-400 transition-colors">
              Explore
            </Link>
            <Link to="/create" className="hover:text-blue-400 transition-colors">
              Create
            </Link>
            <Link to="/login" className="hover:text-blue-400 transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <Link
              to="/explore"
              className="block py-2 hover:text-blue-400 transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/create"
              className="block py-2 hover:text-blue-400 transition-colors"
            >
              Create
            </Link>
            <Link
              to="/login"
              className="block py-2 hover:text-blue-400 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block py-2 hover:text-blue-400 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}