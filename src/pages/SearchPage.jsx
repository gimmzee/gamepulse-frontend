import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { searchGames } from "../api/gameApi";
import { formatPrice } from "../utils/formatters";

function SearchResultRow({ game }) {
  const navigate = useNavigate();
  const discountRate =
    game.currentPrice && game.lowestPrice && game.currentPrice > game.lowestPrice
      ? Math.round(((game.currentPrice - game.lowestPrice) / game.currentPrice) * 100)
      : 0;
  const isAtLowest = game.currentPrice === game.lowestPrice;

  return (
    <div
      onClick={() => navigate(`/game/${game.steamAppId}`)}
      className="flex gap-4 bg-card-gradient border border-gaming-border rounded-xl p-4 hover:border-gaming-accent hover:shadow-gaming-hover transition-all duration-300 cursor-pointer group"
    >
      <div className="w-24 h-16 sm:w-32 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-gaming-darker">
        {game.thumbnailUrl ? (
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-gaming-border">🎮</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-semibold text-gaming-text text-sm sm:text-base leading-tight flex-1 truncate">
            {game.title}
          </h3>
          {isAtLowest && <span className="badge-lowest shrink-0">역대 최저</span>}
          {discountRate > 0 && !isAtLowest && (
            <span className="badge-discount shrink-0">+{discountRate}%</span>
          )}
        </div>
        {game.genre && (
          <span className="text-xs text-gaming-muted bg-gaming-border/50 rounded px-2 py-0.5">
            {game.genre}
          </span>
        )}

        <div className="flex items-center gap-4 mt-2">
          <div>
            <div className="text-xs text-gaming-muted">현재가</div>
            <div className="text-gaming-accent font-bold">{formatPrice(game.currentPrice)}</div>
          </div>
          {game.lowestPrice && (
            <div>
              <div className="text-xs text-gaming-muted">역대 최저</div>
              <div className="text-gaming-green font-semibold text-sm">{formatPrice(game.lowestPrice)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center text-gaming-muted group-hover:text-gaming-accent transition-colors">
        →
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    searchGames(query)
      .then((data) => { setResults(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [query]);

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} initialValue={query} />
      </div>

      {query && (
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-gaming-muted text-sm">
            <span className="text-gaming-text font-semibold">"{query}"</span> 검색 결과
          </h2>
          {!loading && (
            <span className="text-xs text-gaming-muted bg-gaming-card border border-gaming-border rounded-full px-2 py-0.5">
              {results.length}개
            </span>
          )}
        </div>
      )}

      {loading && <LoadingSpinner text="게임을 검색하는 중..." />}
      {error && <ErrorMessage message={`검색 중 오류가 발생했습니다: ${error}`} onRetry={() => handleSearch(query)} />}

      {!loading && !error && results.length === 0 && query && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gaming-muted text-lg mb-2">검색 결과가 없습니다.</p>
          <p className="text-gaming-muted text-sm">다른 키워드로 검색해보세요.</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          {results.map((game) => (
            <SearchResultRow key={game.steamAppId} game={game} />
          ))}
        </div>
      )}

      {!query && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎮</div>
          <p className="text-gaming-muted">검색어를 입력하세요.</p>
        </div>
      )}
    </div>
  );
}
