import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AutocompleteInput from "./AutocompleteInput";

export default function Navbar({ theme, onToggleTheme }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setQuery("");
    }
  };

  // 로딩 중이 아닐 때 오른쪽에 표시할 검색 제출 버튼
  const searchButton = (
    <button
      type="submit"
      className="hover:text-gaming-accent transition-colors"
      aria-label="검색"
    >
      🔍
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-gaming-darker/95 backdrop-blur-sm border-b border-gaming-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🎮</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-accent-gradient">
              GamePulse
            </span>
          </Link>

          {/* 데스크탑 검색창 */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden sm:block">
            <AutocompleteInput
              value={query}
              onChange={setQuery}
              onNavigate={() => setQuery("")}
              placeholder="게임 검색..."
              className="w-full"
              inputClassName="input-gaming pr-10 text-sm"
              appendButton={searchButton}
            />
          </form>

          {/* 우측 버튼 영역 */}
          <div className="flex items-center gap-1">
            {/* 다크/라이트 토글 */}
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-lg text-gaming-muted hover:text-gaming-text hover:bg-gaming-card transition-all duration-200"
              title={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {/* 추천 */}
            <Link
              to="/recommend"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gaming-muted hover:text-gaming-text hover:bg-gaming-card transition-all duration-200"
            >
              <span>✨</span>
              <span className="hidden sm:inline">추천</span>
            </Link>
          </div>
        </div>

        {/* 모바일 검색창 */}
        <form onSubmit={handleSearch} className="pb-3 sm:hidden">
          <AutocompleteInput
            value={query}
            onChange={setQuery}
            onNavigate={() => setQuery("")}
            placeholder="게임 검색..."
            className="w-full"
            inputClassName="input-gaming pr-10 text-sm"
            appendButton={searchButton}
          />
        </form>
      </div>
    </nav>
  );
}
