import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PriceChart from "../components/PriceChart";
import AlertForm from "../components/AlertForm";
import { getGame, getGamePrices } from "../api/gameApi";
import { formatPrice, formatDate } from "../utils/formatters";

function StatCard({ label, value, sub, color = "text-gaming-text" }) {
  return (
    <div className="bg-gaming-card border border-gaming-border rounded-xl p-4">
      <div className="text-xs text-gaming-muted mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gaming-muted mt-0.5">{sub}</div>}
    </div>
  );
}

export default function GameDetailPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getGame(appId), getGamePrices(appId)])
      .then(([gameData, priceData]) => {
        setGame(gameData);
        setPrices(priceData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [appId]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><LoadingSpinner text="게임 정보를 불러오는 중..." /></div>;
  if (error) return <div className="max-w-5xl mx-auto px-4 py-8"><ErrorMessage message={`게임 정보를 불러올 수 없습니다: ${error}`} onRetry={() => window.location.reload()} /></div>;
  if (!game) return null;

  const discountRate =
    game.currentPrice && game.lowestPrice && game.currentPrice > game.lowestPrice
      ? Math.round(((game.currentPrice - game.lowestPrice) / game.currentPrice) * 100)
      : 0;
  const isAtLowest = game.currentPrice === game.lowestPrice;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gaming-muted hover:text-gaming-text text-sm mb-6 transition-colors"
      >
        ← 뒤로
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="w-full sm:w-64 aspect-video sm:aspect-auto sm:h-40 rounded-xl overflow-hidden bg-gaming-darker shrink-0">
          {game.thumbnailUrl ? (
            <img src={game.thumbnailUrl} alt={game.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gaming-border">🎮</div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-start gap-2 mb-2">
            {game.genre && (
              <span className="text-xs bg-gaming-card border border-gaming-border rounded-full px-3 py-0.5 text-gaming-muted">
                {game.genre}
              </span>
            )}
            {isAtLowest && <span className="badge-lowest">역대 최저가</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gaming-text mb-3 leading-tight">
            {game.title}
          </h1>
          {game.description && (
            <p className="text-gaming-muted text-sm leading-relaxed line-clamp-3">
              {game.description}
            </p>
          )}
        </div>
      </div>

      {/* Price stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="현재 가격"
          value={formatPrice(game.currentPrice)}
          color="text-gaming-accent"
        />
        <StatCard
          label="역대 최저가"
          value={formatPrice(game.lowestPrice)}
          sub={game.lowestPriceAt ? formatDate(game.lowestPriceAt) : undefined}
          color="text-gaming-green"
        />
        <StatCard
          label="최저가 대비"
          value={isAtLowest ? "최저가 달성!" : discountRate > 0 ? `+${discountRate}% 높음` : "동일"}
          color={isAtLowest ? "text-gaming-green" : discountRate > 0 ? "text-gaming-yellow" : "text-gaming-text"}
        />
        <StatCard
          label="앱 ID"
          value={`#${game.steamAppId}`}
          color="text-gaming-muted"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-gaming-card border border-gaming-border rounded-xl p-5">
          <h2 className="font-bold text-gaming-text mb-4 flex items-center gap-2">
            <span>📈</span> 가격 이력
          </h2>
          <PriceChart prices={prices} />
        </div>

        {/* Alert form */}
        <div>
          <AlertForm appId={appId} currentPrice={game.currentPrice} />
        </div>
      </div>
    </div>
  );
}
