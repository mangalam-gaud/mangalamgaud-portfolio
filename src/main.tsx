import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import App from "./App";
import "./index.css";

if ("serviceWorker" in navigator) {
  if (import.meta.env.DEV) {
    // A worker cached by an older build can serve modules and pages that no
    // longer exist, which shows up as "Home loads, every other route is blank".
    // Dev never needs one: unregister, drop its caches, and reload once clean.
    navigator.serviceWorker.getRegistrations().then(async (regs) => {
      if (!regs.length && !navigator.serviceWorker.controller) return;
      const controlled = Boolean(navigator.serviceWorker.controller);
      await Promise.all(regs.map((reg) => reg.unregister()));
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
      // Nothing re-registers in dev, so this reload cannot loop.
      if (controlled) window.location.reload();
    });
  } else {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("SW registration failed:", err);
      });
    });
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
