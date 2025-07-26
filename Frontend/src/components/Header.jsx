import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import useAuthStore from '../store/authStore';
import Logo from '../assets/logo.svg';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  
  

  return (
    <header className="glass-nav dark:glass-nav-dark backdrop-blur-md border-0 border-b border-white/20 dark:border-white/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center hover:scale-105 transition-transform duration-200">
            <img 
              src={Logo} 
              alt="SnippetHub" 
              className="h-8 w-auto dark:invert drop-shadow-lg"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium hover:scale-105">
              Explore
            </Link>
            <Link to="/collections" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium hover:scale-105">
              Collections
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/create" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium hover:scale-105">
                  Create
                </Link>
                <Link to="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium hover:scale-105">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:scale-105 transition-transform duration-200">
                    {
                      user?.avatar ?
                      <img
                        src={user?.avatar}
                        alt={user?.fullName || user?.username}
                        className="w-8 h-8 rounded-full ring-2 ring-white/30 shadow-lg"/>
                      :
                      <div className="w-8 h-8 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center ring-2 ring-white/30 shadow-lg backdrop-blur-sm">
                      <span className="text-sm font-medium">
                        {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                      </span>
                    </div>}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-xl py-1 hidden group-hover:block transform opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="glass-card bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-lg transition-all duration-200 border-0"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle />
          </div>

          <button
            className="md:hidden text-gray-800 dark:text-gray-200 hover:scale-105 transition-transform duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 drop-shadow-lg"
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

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 glass-card mt-2 rounded-lg">
            <Link
              to="/explore"
              className="block text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/collections"
              className="block text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="block text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
            <div className="px-4 py-2">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}