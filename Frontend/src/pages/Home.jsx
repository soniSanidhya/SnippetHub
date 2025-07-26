import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

export default function Home() {

  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="glass-card max-w-4xl mx-auto p-12 mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-lg">
              Share Code Snippets with the World
            </h1>
            <p className="text-xl text-gray-100 mb-8 drop-shadow-md">
              A platform for developers to share, discover, and collaborate on
              code snippets
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to={isAuthenticated ? "/explore" : "/auth"}
                className="glass-card bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-600/90 hover:to-purple-700/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg border-0"
              >
                Get Started
              </Link>
              <Link
                to="/explore"
                className="glass-card bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/30"
              >
                Explore Snippets
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-pink-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-12 drop-shadow-lg">
              Why Choose SnippetHub?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 hover:scale-105 transition-all duration-300 hover:shadow-xl group">
              <div className="text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-12 h-12 mx-auto drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl text-white font-semibold mb-4 drop-shadow-md">
                Code Syntax Highlighting
              </h3>
              <p className="text-gray-200 drop-shadow-sm">
                Share code snippets with beautiful syntax highlighting for over
                100 programming languages.
              </p>
            </div>

            <div className="glass-card p-8 hover:scale-105 transition-all duration-300 hover:shadow-xl group">
              <div className="text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-12 h-12 mx-auto drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-md">
                Collaborative Features
              </h3>
              <p className="text-gray-200 drop-shadow-sm">
                Comment, discuss, and collaborate with developers from around
                the world.
              </p>
            </div>

            <div className="glass-card p-8 hover:scale-105 transition-all duration-300 hover:shadow-xl group">
              <div className="text-pink-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-12 h-12 mx-auto drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-md">
                Version Control
              </h3>
              <p className="text-gray-200 drop-shadow-sm">
                Track changes and maintain different versions of your code
                snippets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
