import { ThemeProvider } from "next-themes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CreateSnippet from "./pages/CreateSnippet";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Auth from "./pages/Auth";
import AuthGuard from "./components/AuthGuard";
import SnippetDetail from "./components/SnippetDetail";
import { useEffect, useState } from "react";
import Sitemap from "./pages/Sitemap";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Router>
        <div className="relative min-h-screen">
          {/* Glassmorphism Animated Background */}
          <div className="glassmorphism-bg"></div>
          
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/snippets/:id" element={<SnippetDetail />} />
                  <Route path="/snippet/details" element={<SnippetDetail />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/create"
                    element={
                      <AuthGuard>
                        <CreateSnippet />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/collections"
                    element={
                      <AuthGuard>
                        <Collections />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/collections/:id"
                    element={
                      <AuthGuard>
                        <CollectionDetail />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <AuthGuard>
                        <Dashboard />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <AuthGuard>
                        <Profile />
                      </AuthGuard>
                    }
                  />
                  <Route path="/user/:username" element={<UserProfile />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: "glass-morphism dark:glass-morphism-dark",
            style: {
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "var(--toast-color)",
            },
          }}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
