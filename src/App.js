import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import GameDetailPage from "./pages/GameDetailPage";
import RecommendPage from "./pages/RecommendPage";

function getTimeBasedTheme() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("gp-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return getTimeBasedTheme();
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", theme === "light");
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("gp-theme", next); } catch {}
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gaming-dark">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/game/:appId" element={<GameDetailPage />} />
            <Route path="/recommend" element={<RecommendPage />} />
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <div className="text-6xl mb-4">404</div>
                  <h2 className="text-2xl font-bold text-gaming-text mb-2">페이지를 찾을 수 없습니다</h2>
                  <p className="text-gaming-muted mb-6">요청하신 페이지가 존재하지 않습니다.</p>
                  <a href="/" className="btn-primary">홈으로 돌아가기</a>
                </div>
              }
            />
          </Routes>
        </main>
        <footer className="border-t border-gaming-border mt-16 py-8 text-center text-gaming-muted text-sm">
          <p>© 2026 GamePulse — 모든 플랫폼 최저가 한눈에</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
