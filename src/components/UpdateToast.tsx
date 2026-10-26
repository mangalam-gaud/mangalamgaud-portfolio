"use client";

import { useEffect, useState } from "react";

/**
 * PWA update notification: when a new service worker version is installed
 * while an old one is controlling the page, offer a reload. Without this,
 * returning visitors would keep running the previous deploy indefinitely.
 */
export function UpdateToast() {
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let cancelled = false;

    navigator.serviceWorker.getRegistration?.().then((reg) => {
      if (cancelled || !reg) return;
      const announce = () => {
        if (reg.waiting && navigator.serviceWorker.controller) setUpdateReady(true);
      };
      announce();
      reg.addEventListener("updatefound", () => {
        const sw = reg.installing;
        sw?.addEventListener("statechange", () => {
          if (sw.state === "installed" && navigator.serviceWorker.controller) {
            setUpdateReady(true);
          }
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!updateReady) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[95] flex items-center gap-3 px-4 py-3 rounded-xl border border-accent/50 bg-surface/95 backdrop-blur shadow-[0_0_32px_rgba(34,211,238,0.25)]"
    >
      <span className="text-sm text-text">A new version is available.</span>
      <button
        onClick={() => window.location.reload()}
        className="bg-accent text-bg px-3 py-1.5 rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all"
      >
        Reload
      </button>
    </div>
  );
}
