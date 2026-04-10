import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import GameCard from "../components/GameCard";
import LoadingSpinner from "../components/LoadingSpinner";

const MOCK_POPULAR = [
  { steamAppId: "730", title: "Counter-Strike 2", currentPrice: 0, lowestPrice: 0, genre: "FPS", thumbnailUrl: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg" },
  { steamAppId: "570", title: "Dota 2", currentPrice: 0, lowestPrice: 0, genre: "MOBA", thumbnailUrl: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg" },
  { steamAppId: "1091500", title: "Cyberpunk 2077", currentPrice: 66500, lowestPrice: 19950, genre: "RPG", thumbnailUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg" },
  { steamAppId: "1172470", title: "Apex Legends", currentPrice: 0, lowestPrice: 0, genre: "Battle Royale", thumbnailUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg" },
  { steamAppId: "271590", title: "Grand Theft Auto V", currentPrice: 29900, lowestPrice: 4950, genre: "Action", thumbnailUrl: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg" },
  { steamAppId: "1245620", title: "Elden Ring", currentPrice: 60800, lowestPrice: 36500, genre: "RPG", thumbnailUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg" },
];

const MOCK_DEALS = [
  { steamAppId: "975370", title: "Dwarf Fortress", currentPrice: 3900, lowestPrice: 3900, genre: "Strategy", thumbnailUrl: "https://cdn.akamai.steamstatic.com/steam/apps/975370/header.jpg" },
  { steamAppId: "1145360", title: "Hades", currentPrice: 13500, lowestPrice: 8100, genre: "Roguelike", thumbnailUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg" },
  { steamAppId: "105600", title: "Terraria", currentPrice: 6900, lowestPrice: 1700, genre: "Adventure", thumbnailUrl: "https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg" },
  { steamAppId: "413150", title: "Stardew Valley", currentPrice: 13500, lowestPrice: 6750, genre: "Simulation", thumbnailUrl: "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg" },
];

export default function MainPage() {
  const navigate = useNavigate();
  const [popular] = useState(MOCK_POPULAR);
  const [deals] = useState(MOCK_DEALS);
  const [loading] = useState(false);

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
          {[
            { label: "추적 게임", value: "50,000+" },
            { label: "플랫폼", value: "3+" },
            { label: "오늘 할인", value: "1,240" },
            { label: "등록 알림", value: "8,900+" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xl font-bold text-gaming-accent">{s.value}</div>
              <div className="text-xs text-gaming-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Popular */}
        <section>
          <h2 className="section-title">
            <span>🔥</span> 인기 게임
          </h2>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {popular.map((g) => (
                <GameCard key={g.steamAppId} game={g} />
              ))}
            </div>
          )}
        </section>

        {/* Recent deals */}
        <section>
          <h2 className="section-title">
            <span>💸</span> 최근 할인
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {deals.map((g) => (
              <GameCard key={g.steamAppId} game={g} />
            ))}
          </div>
        </section>

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
