import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";
import { ProfileMenu } from "../profile/ProfileMenu";

export function TopHeader({ onLogoutClick }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(params.get("q") || "");
  }, [params]);

  const submitSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/inbox?q=${encodeURIComponent(trimmed)}` : "/inbox");
  };

  return (
    <header className="hidden md:flex h-16 items-center gap-4 border-b border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface px-5 sticky top-0 z-30">
      <form onSubmit={submitSearch} className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-dark-muted"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search emails"
            className="w-full h-10 rounded-full bg-surface-bg dark:bg-dark-surface2 border border-transparent focus:border-brand-blue focus:bg-surface dark:focus:bg-dark-bg pl-10 pr-9 text-sm text-ink dark:text-dark-text placeholder:text-ink-muted dark:placeholder:text-dark-muted outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                navigate("/inbox");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-dark-muted hover:text-ink dark:hover:text-dark-text"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </form>

      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />
        <ProfileMenu onLogoutClick={onLogoutClick} />
      </div>
    </header>
  );
}