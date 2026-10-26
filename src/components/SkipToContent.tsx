"use client";

/**
 * Skip-to-content link for keyboard users.
 * Hidden visually until focused (styling lives in index.css), then appears at
 * the top of the page.
 */
export function SkipToContent() {
  return (
    <a href="#main" className="skip-to-content">
      Skip to main content
    </a>
  );
}
