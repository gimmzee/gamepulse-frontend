import { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "게임 제목으로 검색...", initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <div className="relative flex-1">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gaming-muted text-lg">
          🔍
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input-gaming pl-11 text-base py-3"
        />
      </div>
      <button type="submit" className="btn-primary whitespace-nowrap">
        검색
      </button>
    </form>
  );
}
