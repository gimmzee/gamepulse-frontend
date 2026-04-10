import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import GameDetailPage from "./pages/GameDetailPage";
import RecommendPage from "./pages/RecommendPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gaming-dark">
        <Navbar />
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
