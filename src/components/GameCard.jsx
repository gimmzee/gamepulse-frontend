import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatters";

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const discountRate =
    game.currentPrice && game.lowestPrice && game.currentPrice > game.lowestPrice
      ? Math.round(((game.currentPrice - game.lowestPrice) / game.currentPrice) * 100)
      : 0;

  const isAtLowest = game.currentPrice === game.lowestPrice;

  return (
    <div className="game-card group" onClick={() => navigate(`/game/${game.steamAppId}`)}>
      <div className="relative overflow-hidden aspect-[16/9] bg-gaming-darker">
        {game.thumbnailUrl ? (
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-full h-full flex items-center justify-center text-4xl text-gaming-border"
          style={{ display: game.thumbnailUrl ? "none" : "flex" }}
        >
          🎮
        </div>

        {isAtLowest && (
          <div className="absolute top-2 left-2">
            <span className="badge-lowest">역대 최저가</span>
          </div>
        )}
        {discountRate > 0 && !isAtLowest && (
          <div className="absolute top-2 left-2">
            <span className="badge-discount">+{discountRate}% 위</span>
          </div>
        )}
        {game.genre && (
          <div className="absolute top-2 right-2">
            <span className="bg-gaming-darker/80 text-gaming-muted text-xs px-2 py-0.5 rounded-full">
              {game.genre}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gaming-text text-sm leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">
          {game.title}
        </h3>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-gaming-muted text-xs mb-0.5">현재가</div>
            <div className="text-gaming-accent font-bold text-lg">
              {formatPrice(game.currentPrice)}
            </div>
          </div>
          {game.lowestPrice && (
            <div className="text-right">
              <div className="text-gaming-muted text-xs mb-0.5">역대 최저</div>
              <div className="text-gaming-green font-semibold text-sm">
                {formatPrice(game.lowestPrice)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
