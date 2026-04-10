import { useState, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import GameCard from "../components/GameCard";
import { searchGames, getRecommendations } from "../api/gameApi";
import { formatPrice } from "../utils/formatters";

function SelectedGame({ game, onRemove }) {
  return (
    <div className="flex items-center gap-3 bg-gaming-card border border-gaming-accent/40 rounded-lg px-3 py-2">
      <div className="w-10 h-7 rounded overflow-hidden bg-gaming-darker shrink-0">
        {game.thumbnailUrl ? (
          <img src={game.thumbnailUrl} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs">🎮</div>
        )}
      </div>
      <span className="text-sm text-gaming-text flex-1 truncate min-w-0">{game.title}</span>
      <button
        onClick={() => onRemove(game.steamAppId)}
        className="text-gaming-muted hover:text-gaming-red transition-colors shrink-0 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

function SearchDropdown({ results, onSelect, loading }) {
  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-gaming-card border border-gaming-border rounded-xl p-4 z-10 shadow-gaming-card">
        <LoadingSpinner size="sm" text="검색 중..." />
      </div>
    );
  }
  if (!results.length) return null;
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-gaming-card border border-gaming-border rounded-xl overflow-hidden z-10 shadow-gaming-card max-h-64 overflow-y-auto">
      {results.map((g) => (
        <button
          key={g.steamAppId}
          onClick={() => onSelect(g)}
          className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gaming-border/30 transition-colors text-left"
        >
          <div className="w-10 h-7 rounded overflow-hidden bg-gaming-darker shrink-0">
            {g.thumbnailUrl ? (
              <img src={g.thumbnailUrl} alt={g.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs">🎮</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gaming-text truncate">{g.title}</div>
            {g.genre && <div className="text-xs text-gaming-muted">{g.genre}</div>}
          </div>
          <div className="text-xs text-gaming-accent shrink-0">{formatPrice(g.currentPrice)}</div>
        </button>
      ))}
    </div>
  );
}

export default function RecommendPage() {
  const [selected, setSelected] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = useCallback(async (q) => {
    setSearchLoading(true);
    setShowDropdown(true);
    try {
      const data = await searchGames(q);
      setSearchResults(data.slice(0, 8));
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSelect = (game) => {
    if (!selected.find((g) => g.steamAppId === game.steamAppId)) {
      setSelected((prev) => [...prev, game]);
    }
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleRemove = (appId) => {
    setSelected((prev) => prev.filter((g) => g.steamAppId !== appId));
  };

  const handleRecommend = async () => {
    if (!selected.length) return;
    setRecLoading(true);
    setRecError(null);
    try {
      const data = await getRecommendations(selected.map((g) => g.steamAppId));
      setRecommendations(data);
    } catch (err) {
      setRecError(err.message);
    } finally {
      setRecLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gaming-text mb-2 flex items-center gap-2">
          <span>✨</span> 게임 추천
        </h1>
        <p className="text-gaming-muted">
          좋아하는 게임을 선택하면 취향에 맞는 게임을 추천해드립니다.
        </p>
      </div>

      {/* Step 1: 게임 선택 */}
      <div className="bg-gaming-card border border-gaming-border rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-gaming-text mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-gaming-accent rounded-full flex items-center justify-center text-xs font-bold">1</span>
          좋아하는 게임 검색
        </h2>

        <div className="relative mb-4" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setShowDropdown(false); }}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="게임 이름으로 검색..."
          />
          {showDropdown && (
            <SearchDropdown
              results={searchResults}
              onSelect={handleSelect}
              loading={searchLoading}
            />
          )}
        </div>

        {selected.length > 0 ? (
          <div>
            <div className="text-xs text-gaming-muted mb-2">선택된 게임 ({selected.length}개)</div>
            <div className="flex flex-wrap gap-2">
              {selected.map((g) => (
                <SelectedGame key={g.steamAppId} game={g} onRemove={handleRemove} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gaming-muted text-sm">아직 선택된 게임이 없습니다. 위에서 게임을 검색해서 추가하세요.</p>
        )}
      </div>

      {/* Step 2: 추천받기 */}
      <div className="bg-gaming-card border border-gaming-border rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-gaming-text mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-gaming-accent rounded-full flex items-center justify-center text-xs font-bold">2</span>
          추천받기
        </h2>
        <button
          onClick={handleRecommend}
          disabled={selected.length === 0 || recLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {recLoading ? "추천 중..." : `${selected.length}개 게임 기반으로 추천받기`}
        </button>
        {selected.length === 0 && (
          <p className="text-gaming-muted text-xs mt-2">게임을 1개 이상 선택해야 추천을 받을 수 있습니다.</p>
        )}
      </div>

      {/* Results */}
      {recLoading && <LoadingSpinner text="추천 게임을 분석하는 중..." />}
      {recError && <ErrorMessage message={`추천을 불러오지 못했습니다: ${recError}`} />}

      {!recLoading && recommendations.length > 0 && (
        <div className="animate-slide-up">
          <h2 className="section-title">
            <span>🎯</span> 추천 결과
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendations.map((g) => (
              <GameCard key={g.steamAppId} game={g} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
