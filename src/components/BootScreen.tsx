"use client";

import { useEffect, useState } from "react";

const SHOW_MS = 650;
const FADE_MS = 260;

/**
 * First-paint boot line. Decorative and non-blocking: pointer-events-none,
 * aria-hidden, removed from the DOM after ~0.9s. Reduced-motion users get a
 * brief static frame instead of the sweeping bar.
 */
export function BootScreen() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const show = reduced ? 150 : SHOW_MS;
    const fadeOut = window.setTimeout(() => setPhase("out"), show);
    const done = window.setTimeout(() => setPhase("done"), show + (reduced ? 0 : FADE_MS));
    return () => {
      window.clearTimeout(fadeOut);
      window.clearTimeout(done);
    };
  }, [reduced]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      data-boot="true"
      className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-bg transition-opacity duration-300 ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-[240px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-dim">Mangalam Gaud</p>
        <p className="mt-1 font-mono text-sm text-text">booting portfolio</p>
        <div className="mt-4 h-0.5 w-full overflow-hidden bg-border">
          <div
            className={`h-full w-full origin-left bg-accent ${
              reduced ? "" : "animate-[boot-fill_650ms_ease-out_forwards]"
            }`}
          />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          security · full-stack · iot
        </p>
      </div>
    </div>
  );
}
