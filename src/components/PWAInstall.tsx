"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * PWA install prompt. Shows a slim dock when the browser supports installing
 * the portfolio as a standalone app. Sits at the bottom edge so it never
 * covers the page content or the projects sheet.
 */
export function PWAInstall() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredEvent) return;
    deferredEvent.prompt();
    await deferredEvent.userChoice;
    setDeferredEvent(null);
  };

  if (isInstalled || !deferredEvent) return null;

  return (
    <div
      role="region"
      aria-label="Install app"
      className="fixed inset-x-0 bottom-0 z-[50] border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <span className="mono-label hidden sm:inline">PWA</span>
        <p className="min-w-0 flex-1 truncate text-xs text-text-muted">
          Install this portfolio — runs standalone, works offline.
        </p>
        <button
          onClick={installApp}
          className="shrink-0 rounded-[4px] bg-accent px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent/90"
        >
          Install
        </button>
        <button
          onClick={() => setDeferredEvent(null)}
          aria-label="Dismiss install prompt"
          className="shrink-0 rounded-[4px] border border-border px-2 py-1 font-mono text-[11px] text-text-dim transition-colors hover:border-border-strong hover:text-text"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
}
