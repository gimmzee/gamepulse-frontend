import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gaming-darker/95 backdrop-blur-sm border-b border-gaming-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🎮</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-accent-gradient">
              GamePulse
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden sm:flex">
            <div className="relative w-full">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="게임 검색..."
                className="input-gaming pr-10 text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gaming-muted hover:text-gaming-accent transition-colors"
              >
                🔍
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Link
              to="/recommend"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gaming-muted hover:text-gaming-text hover:bg-gaming-card transition-all duration-200"
            >
              <span>✨</span>
              <span className="hidden sm:inline">추천</span>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="pb-3 sm:hidden">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="게임 검색..."
              className="input-gaming pr-10 text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gaming-muted hover:text-gaming-accent transition-colors"
            >
              🔍
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
}
