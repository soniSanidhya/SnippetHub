export default function Footer() {
  return (
    <footer className="glass-card mt-12 mx-4 mb-4 rounded-lg text-white shadow-2xl">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">SnippetHub</h3>
            <p className="text-gray-200 drop-shadow-sm">
              Share and discover code snippets with developers around the world.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white drop-shadow-md">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/docs" className="text-gray-200 hover:text-blue-300 transition-all duration-200 hover:scale-105 inline-block drop-shadow-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/api" className="text-gray-200 hover:text-blue-300 transition-all duration-200 hover:scale-105 inline-block drop-shadow-sm">
                  API
                </a>
              </li>
              <li>
                <a href="/support" className="text-gray-200 hover:text-blue-300 transition-all duration-200 hover:scale-105 inline-block drop-shadow-sm">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white drop-shadow-md">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-200 hover:text-purple-300 transition-all duration-200 hover:scale-105 inline-block drop-shadow-sm">
                  About
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-200 hover:text-purple-300 transition-all duration-200 hover:scale-105 inline-block drop-shadow-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-200 hover:text-purple-300 transition-all duration-200 hover:scale-105 inline-block drop-shadow-sm">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white drop-shadow-md">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-gray-200 hover:text-pink-300 transition-all duration-200 hover:scale-105 inline-block drop-shadow-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-200 hover:text-pink-300 transition-all duration-200 hover:scale-105 inline-block drop-shadow-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-200">
          <p className="drop-shadow-sm">&copy; {new Date().getFullYear()} SnippetHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}