import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PriceChart from "../components/PriceChart";
import AlertForm from "../components/AlertForm";
import { getGame, getGamePrices, getPlatformPrices } from "../api/gameApi";
import { formatPrice, formatDate } from "../utils/formatters";

function formatKRW(amount) {
  return `₩${Number(amount).toLocaleString("ko-KR")}`;
}

function displayPrice(amount) {
  if (amount == null) return "-";
  if (amount === 0) return "무료";
  return formatKRW(amount);
}

function formatKRDate(isoString) {
  const d = new Date(isoString);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function PlatformPricesSection({ appId, onDataLoaded }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatformPrices(appId)
      .then((fetchedData) => {
        setData(fetchedData);
        onDataLoaded?.(fetchedData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [appId]);

  if (loading) {
    return (
      <div className="mt-6 bg-gaming-card border border-gaming-border rounded-xl p-5 flex items-center justify-center min-h-[120px]">
        <div className="h-8 w-8 border-4 border-gaming-border border-t-gaming-accent rounded-full animate-spin" />
      </div>
    );
  }
  if (!data) return null;

  const deals = data.prices?.[0]?.deals ?? [];
  const historyLowAmounts = data.prices?.[0]?.historyLow ?? {};
  const historyLowDetail = data.historyLow?.[0]?.low ?? null;

  const cheapestIdx =
    deals.length > 0
      ? deals.reduce(
          (minIdx, deal, i) =>
            (deal.price?.amount ?? Infinity) < (deals[minIdx].price?.amount ?? Infinity) ? i : minIdx,
          0
        )
      : -1;

  const hasHistoryLow =
    historyLowAmounts?.all?.amount != null ||
    historyLowAmounts?.y1?.amount != null ||
    historyLowAmounts?.m3?.amount != null;

  return (
    <>
      {/* 플랫폼별 현재 가격 */}
      <div className="mt-6 bg-gaming-card border border-gaming-border rounded-xl p-5">
        <h2 className="font-bold text-gaming-text mb-4 flex items-center gap-2">
          <span>🛒</span> 플랫폼별 현재 가격
        </h2>
        {deals.length === 0 ? (
          <p className="text-gaming-muted text-sm py-4 text-center">
            현재 판매 중인 플랫폼이 없습니다
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gaming-border text-gaming-muted">
                  <th className="text-left pb-3 pr-4 font-medium">플랫폼</th>
                  <th className="text-right pb-3 pr-4 font-medium">현재 가격</th>
                  <th className="text-right pb-3 pr-4 font-medium">할인율</th>
                  <th className="text-right pb-3 pr-4 font-medium">이 플랫폼 최저가</th>
                  <th className="text-right pb-3 font-medium">구매</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal, i) => {
                  const isCheapest = i === cheapestIdx;
                  return (
                    <tr
                      key={i}
                      className={`border-b border-gaming-border last:border-0 transition-colors ${
                        isCheapest ? "bg-gaming-green/10" : ""
                      }`}
                    >
                      <td
                        className={`py-3 pr-4 font-medium text-gaming-text ${
                          isCheapest
                            ? "border-l-2 border-gaming-green pl-2"
                            : "pl-0"
                        }`}
                      >
                        {deal.shop.name}
                      </td>
                      <td className="py-3 pr-4 text-right font-bold text-gaming-accent">
                        {displayPrice(deal.price?.amount)}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        {deal.cut > 0 ? (
                          <span className="inline-block bg-gaming-red text-white text-xs font-bold px-2 py-0.5 rounded">
                            -{deal.cut}%
                          </span>
                        ) : (
                          <span className="text-gaming-muted">-</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-right text-gaming-green">
                        {displayPrice(deal.storeLow?.amount)}
                      </td>
                      <td className="py-3 text-right">
                        <a
                          href={deal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-gaming-accent hover:bg-gaming-accent-hover text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:shadow-gaming-glow"
                        >
                          구매
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 역대 최저가 */}
      {hasHistoryLow && (
        <div className="mt-6 bg-gaming-card border border-gaming-border rounded-xl p-5">
          <h2 className="font-bold text-gaming-text mb-4 flex items-center gap-2">
            <span>📉</span> 역대 최저가
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gaming-darker border border-gaming-border rounded-xl p-4">
              <div className="text-xs text-gaming-muted mb-1">전체 최저가</div>
              <div className="text-xl font-bold text-gaming-green">
                {displayPrice(historyLowAmounts?.all?.amount)}
              </div>
              {historyLowDetail && (
                <div className="mt-2 space-y-0.5">
                  <div className="text-xs text-gaming-muted">{historyLowDetail?.shop?.name ?? "-"}</div>
                  <div className="text-xs text-gaming-muted">
                    {historyLowDetail?.timestamp ? formatKRDate(historyLowDetail.timestamp) : "-"}
                  </div>
                  {(historyLowDetail?.cut ?? 0) > 0 && (
                    <span className="inline-block mt-0.5 bg-gaming-red text-white text-xs font-bold px-2 py-0.5 rounded">
                      -{historyLowDetail.cut}%
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="bg-gaming-darker border border-gaming-border rounded-xl p-4">
              <div className="text-xs text-gaming-muted mb-1">1년 내 최저가</div>
              <div className="text-xl font-bold text-gaming-green">
                {displayPrice(historyLowAmounts?.y1?.amount)}
              </div>
            </div>
            <div className="bg-gaming-darker border border-gaming-border rounded-xl p-4">
              <div className="text-xs text-gaming-muted mb-1">3개월 내 최저가</div>
              <div className="text-xl font-bold text-gaming-green">
                {displayPrice(historyLowAmounts?.m3?.amount)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
  const [platformData, setPlatformData] = useState(null);

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

  const effectiveLowestPrice =
    platformData?.prices?.[0]?.historyLow?.all?.amount ?? game.lowestPrice;

  const isAtLowest =
    game.currentPrice != null &&
    effectiveLowestPrice != null &&
    game.currentPrice <= effectiveLowestPrice;

  const discountRate =
    game.currentPrice && effectiveLowestPrice && game.currentPrice > effectiveLowestPrice
      ? Math.round(((game.currentPrice - effectiveLowestPrice) / game.currentPrice) * 100)
      : 0;

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
          value={displayPrice(effectiveLowestPrice)}
          sub={!platformData && game.lowestPriceAt ? formatDate(game.lowestPriceAt) : undefined}
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

      <PlatformPricesSection appId={appId} onDataLoaded={setPlatformData} />
    </div>
  );
}
