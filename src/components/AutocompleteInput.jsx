import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchGames } from "../api/gameApi";
import { formatPrice } from "../utils/formatters";

/**
 * 검색 자동완성 입력 컴포넌트
 *
 * Props:
 *   value          – 제어 입력값
 *   onChange(v)    – 키 입력마다 호출
 *   onNavigate()   – 게임 상세로 이동하기 직전 호출 (ex. 쿼리 초기화)
 *   placeholder    – 입력창 placeholder
 *   className      – 외부 wrapper div 클래스
 *   inputClassName – input 엘리먼트 클래스
 *   prependIcon    – input 왼쪽에 렌더링할 노드 (ex. 🔍 아이콘)
 *   appendButton   – input 오른쪽에 렌더링할 노드, 로딩 중에는 스피너로 교체됨
 */
export default function AutocompleteInput({
  value,
  onChange,
  onNavigate,
  placeholder = "게임 검색...",
  className = "",
  inputClassName = "input-gaming text-sm",
  prependIcon,
  appendButton,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // 2글자 이상 → 300ms 디바운스 후 API 호출
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setActiveIdx(-1);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchGames(value);
        setSuggestions(data.slice(0, 5));
        setShowDropdown(true);
        setActiveIdx(-1);
      } catch {
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [value]);

  // 외부 클릭 → 드롭다운 닫힘
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToGame = useCallback(
    (game) => {
      setShowDropdown(false);
      setSuggestions([]);
      setActiveIdx(-1);
      onNavigate?.();
      navigate(`/game/${game.steamAppId}`);
    },
    [navigate, onNavigate]
  );

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      goToGame(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIdx(-1);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 왼쪽 아이콘 (선택) */}
      {prependIcon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          {prependIcon}
        </span>
      )}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
        placeholder={placeholder}
        className={inputClassName}
        autoComplete="off"
        spellCheck="false"
      />

      {/* 오른쪽: 로딩 중이면 스피너, 아니면 appendButton */}
      {(loading || appendButton) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gaming-muted">
          {loading ? (
            <div className="h-4 w-4 border-2 border-gaming-border border-t-gaming-accent rounded-full animate-spin" />
          ) : (
            appendButton
          )}
        </div>
      )}

      {/* 드롭다운 */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-gaming-card border border-gaming-border rounded-xl shadow-gaming-hover overflow-hidden z-50">
          {suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gaming-muted text-center">
              검색 결과가 없습니다
            </div>
          ) : (
            <ul>
              {suggestions.map((game, i) => (
                <li key={game.steamAppId}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToGame(game)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      i === activeIdx
                        ? "bg-gaming-accent/15"
                        : "hover:bg-gaming-border/40"
                    } ${i < suggestions.length - 1 ? "border-b border-gaming-border/50" : ""}`}
                  >
                    {/* 썸네일 32×32 */}
                    <div className="w-8 h-8 shrink-0 rounded overflow-hidden bg-gaming-darker">
                      {game.thumbnailUrl ? (
                        <img
                          src={game.thumbnailUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gaming-border">
                          🎮
                        </div>
                      )}
                    </div>

                    {/* 게임명 + 현재 가격 */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gaming-text truncate">
                        {game.title}
                      </div>
                      <div className="text-xs text-gaming-accent">
                        {formatPrice(game.currentPrice)}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
