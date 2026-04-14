import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import GameCard from "../components/GameCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getPopularGames, getOnSaleGames, getStats } from "../api/gameApi";

function displayPrice(amount) {
  if (amount == null) return "-";
  if (amount === 0) return "무료";
  return `₩${Number(amount).toLocaleString("ko-KR")}`;
}

function SaleCard({ game }) {
  return (
    <div className="bg-gaming-card border border-gaming-border rounded-xl overflow-hidden flex flex-col hover:border-gaming-accent transition-colors duration-200">
      <div className="relative aspect-[16/9] bg-gaming-darker overflow-hidden">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-full h-full flex items-center justify-center text-4xl text-gaming-border"
          style={{ display: game.thumbnail ? "none" : "flex" }}
        >
          🎮
        </div>
        {game.cut > 0 && (
          <div className="absolute top-2 left-2">
            <span className="inline-block bg-gaming-red text-white text-xs font-bold px-2 py-0.5 rounded">
              -{game.cut}%
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gaming-text text-sm leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">
          {game.title}
        </h3>

        <div className="mt-auto space-y-1">
          {game.regularPrice > 0 && game.regularPrice !== game.currentPrice && (
            <div className="text-gaming-muted text-xs line-through">
              {displayPrice(game.regularPrice)}
            </div>
          )}
          <div className="flex items-end justify-between gap-2">
            <div className="text-gaming-green font-bold text-lg">
              {displayPrice(game.currentPrice)}
            </div>
            {game.shopName && (
              <div className="text-gaming-muted text-xs">{game.shopName}</div>
            )}
          </div>
          {game.historyLow != null && (
            <div className="text-gaming-muted text-xs">
              역대 최저 {displayPrice(game.historyLow)}
            </div>
          )}
        </div>

        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center bg-gaming-accent hover:bg-gaming-accent-hover text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-gaming-glow"
          onClick={(e) => e.stopPropagation()}
        >
          구매하기
        </a>
      </div>
    </div>
  );
}

export default function MainPage() {
  const navigate = useNavigate();

  const [popular, setPopular] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);

  const [onSale, setOnSale] = useState([]);
  const [onSaleLoading, setOnSaleLoading] = useState(true);

  const FALLBACK_STATS = [
    { label: "추적 게임", value: "50,000+", key: "trackedGames", suffix: "+" },
    { label: "플랫폼", value: "3+", key: "platforms", suffix: "" },
    { label: "오늘 할인", value: "1,240", key: "todayDeals", suffix: "" },
    { label: "등록 알림", value: "8,900+", key: "alerts", suffix: "+" },
  ];
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setStatsLoading(false));

    getPopularGames()
      .then((data) => setPopular(Array.isArray(data) ? data.slice(0, 20) : []))
      .catch(() => {})
      .finally(() => setPopularLoading(false));

    getOnSaleGames()
      .then((data) => setOnSale(Array.isArray(data) ? data.slice(0, 12) : []))
      .catch(() => {})
      .finally(() => setOnSaleLoading(false));
  }, []);

  const recommended = popular.filter((g) => g.currentPrice > 0).slice(0, 8);

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gaming-gradient opacity-80" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 40%)`,
          }}
        />
        <div className="relative max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gaming-card border border-gaming-border rounded-full px-4 py-1.5 text-sm text-gaming-muted mb-6">
            <span className="inline-block w-2 h-2 bg-gaming-green rounded-full animate-pulse" />
            실시간 게임 가격 추적
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-accent-gradient leading-tight">
            GamePulse
          </h1>
          <p className="text-gaming-muted text-lg sm:text-xl mb-10">
            Steam, Epic, GOG 최저가를 한눈에. 역대 최저가 알림까지.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {["Counter-Strike 2", "Cyberpunk 2077", "Elden Ring", "Stardew Valley"].map((t) => (
              <button
                key={t}
                onClick={() => handleSearch(t)}
                className="text-xs text-gaming-muted hover:text-gaming-accent bg-gaming-card border border-gaming-border rounded-full px-3 py-1 transition-colors duration-200"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-gaming-border bg-gaming-card/50">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {FALLBACK_STATS.map((s) => {
            let displayValue;
            if (statsLoading) {
              displayValue = "...";
            } else if (stats?.[s.key] != null) {
              const num = stats[s.key];
              displayValue =
                (num >= 1000 ? num.toLocaleString("ko-KR") : String(num)) +
                s.suffix;
            } else {
              displayValue = s.value;
            }
            return (
              <div key={s.label}>
                <div className="text-xl font-bold text-gaming-accent">{displayValue}</div>
                <div className="text-xs text-gaming-muted">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* 섹션 1 — 인기 게임 */}
        {(popularLoading || popular.length > 0) && (
          <section>
            <h2 className="section-title">
              <span>🔥</span> 지금 인기 게임
            </h2>
            {popularLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {popular.map((g) => (
                  <GameCard key={g.steamAppId} game={g} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* 섹션 2 — 추천 게임 */}
        {!popularLoading && recommended.length > 0 && (
          <section>
            <h2 className="section-title">
              <span>⭐</span> 추천 게임
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommended.map((g) => (
                <GameCard key={g.steamAppId} game={g} />
              ))}
            </div>
          </section>
        )}

        {/* 섹션 3 — 지금 세일 중 */}
        {(onSaleLoading || onSale.length > 0) && (
          <section>
            <h2 className="section-title">
              <span>💸</span> 지금 세일 중
            </h2>
            {onSaleLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {onSale.map((g, i) => (
                  <SaleCard key={`${g.title}-${i}`} game={g} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* CTA */}
        <section className="rounded-2xl bg-card-gradient border border-gaming-border p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">취향 기반 게임 추천</h2>
          <p className="text-gaming-muted mb-5">
            좋아하는 게임을 선택하면 AI가 비슷한 게임을 추천해드립니다.
          </p>
          <button onClick={() => navigate("/recommend")} className="btn-primary">
            추천받기 →
          </button>
        </section>
      </div>
    </div>
  );
}
