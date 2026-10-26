"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const ITEMS = [
  { path: "/", label: "Home", hint: "Index" },
  { path: "/about", label: "About", hint: "Profile" },
  { path: "/skills", label: "Skills", hint: "Stack" },
  { path: "/projects", label: "Projects", hint: "Case studies" },
  { path: "/experience", label: "Experience", hint: "Timeline" },
  { path: "/education", label: "Education", hint: "Academic" },
  { path: "/contact", label: "Contact", hint: "Email · Resume" },
];

/** ⌘K / Ctrl+K route switcher. Keyboard-first, so the nav can stay quiet. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].path);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-bg/80 px-4 pt-[16vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border-strong bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-text-dim" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a page…"
            aria-label="Search pages"
            className="h-12 w-full bg-transparent font-mono text-sm text-text placeholder:text-text-dim focus:outline-none"
          />
          <kbd className="mono-label">ESC</kbd>
        </div>
        <ul role="listbox" aria-label="Pages">
          {results.map((r, i) => (
            <li key={r.path}>
              <button
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r.path)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                  i === active ? "bg-accent/10 text-accent" : "text-text-muted"
                }`}
              >
                <span>{r.label}</span>
                <span className="mono-label">{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-4 py-6 text-center font-mono text-xs text-text-dim">No matches</li>
          )}
        </ul>
        <div className="flex items-center gap-4 border-t border-border px-4 py-2">
          <span className="mono-label">↑↓ navigate</span>
          <span className="mono-label">↵ open</span>
        </div>
      </div>
    </div>
  );
}
