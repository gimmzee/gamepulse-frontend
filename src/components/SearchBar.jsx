import { useState } from "react";
import AutocompleteInput from "./AutocompleteInput";

export default function SearchBar({ onSearch, placeholder = "게임 제목으로 검색...", initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const prependIcon = (
    <span className="text-gaming-muted text-lg">🔍</span>
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <AutocompleteInput
        value={query}
        onChange={setQuery}
        onNavigate={() => setQuery("")}
        placeholder={placeholder}
        className="flex-1"
        inputClassName="input-gaming pl-11 text-base py-3"
        prependIcon={prependIcon}
      />
      <button type="submit" className="btn-primary whitespace-nowrap">
        검색
      </button>
    </form>
  );
}
