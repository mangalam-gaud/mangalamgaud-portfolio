"use client";

import React, { PropsWithChildren } from "react";

/**
 * Error boundary: catches render/runtime errors in any child component and
 * shows a recoverable fallback instead of a white screen.
 *
 * A failed lazy chunk after a redeploy is handled earlier (see `lazyPage` in
 * App), so by the time this renders something really did break while drawing.
 */
export class ErrorBoundary extends React.Component<PropsWithChildren<{}>, { hasError: boolean }> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
          <span className="mono-label">Error / render</span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text">
            This page failed to load.
          </h1>
          <p className="mt-2 max-w-md text-sm text-text-muted">
            A file may have changed since this tab opened. Reloading fetches the current
            version.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-[4px] bg-accent px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent/90"
          >
            Reload portfolio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
