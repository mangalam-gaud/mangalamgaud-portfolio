"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { PWAInstall } from "@/components/PWAInstall";
import { SkipToContent } from "@/components/SkipToContent";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UpdateToast } from "@/components/UpdateToast";
import { CommandPalette } from "@/components/CommandPalette";
import { BootScreen } from "@/components/BootScreen";

/**
 * A deploy replaces hashed chunk names. A tab opened before the deploy 404s on
 * the next page it loads, which reads as "only Home works". Reload once into the
 * current build instead of dead-ending on an error card.
 */
function lazyPage<P>(load: () => Promise<{ default: React.ComponentType<P> }>) {
  let reloaded = false;
  return React.lazy(() =>
    load()
      .then((mod) => {
        try {
          sessionStorage.removeItem("chunk-reload");
        } catch {
          // Storage blocked: nothing to clear.
        }
        return mod;
      })
      .catch((error) => {
        if (!reloaded) {
          reloaded = true;
          try {
            if (!sessionStorage.getItem("chunk-reload")) {
              sessionStorage.setItem("chunk-reload", "1");
              window.location.reload();
            }
          } catch {
            // Storage blocked: the once-per-tab guard cannot be recorded, so
            // reloading here would loop forever. Fall through to the error card.
          }
        }
        throw error;
      })
  );
}

// Lazily loaded: keeps three.js + drei out of the entry chunk entirely.
const ThreeSceneProvider = lazyPage<React.PropsWithChildren<{}>>(() =>
  import("@/components/ThreeSceneProvider").then((m) => ({ default: m.ThreeSceneProvider }))
);

const routes = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/skills", label: "Skills" },
  { path: "/projects", label: "Projects" },
  { path: "/projects/:id", label: "Project" },
  { path: "/experience", label: "Experience" },
  { path: "/education", label: "Education" },
  { path: "/contact", label: "Contact" },
] as const;

const Home = lazyPage(() => import("@/pages/Home"));
const About = lazyPage(() => import("@/pages/About"));
const Skills = lazyPage(() => import("@/pages/Skills"));
const Projects = lazyPage(() => import("@/pages/Projects"));
const ProjectDetail = lazyPage(() => import("@/pages/ProjectDetail"));
const Experience = lazyPage(() => import("@/pages/Experience"));
const Education = lazyPage(() => import("@/pages/Education"));
const Contact = lazyPage(() => import("@/pages/Contact"));

const pageMap: Record<string, React.ComponentType> = {
  "/": Home,
  "/about": About,
  "/skills": Skills,
  "/projects": Projects,
  "/projects/:id": ProjectDetail,
  "/experience": Experience,
  "/education": Education,
  "/contact": Contact,
};

// RouterApp lives inside Router context, so useLocation/useNavigate work here
function RouterApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Param routes (/projects/:id) are pages, not nav destinations. Contact is
  // the CTA on the right — listing it twice was the old nav's worst habit.
  const navPages = routes.filter((r) => !r.path.includes(":") && r.path !== "/contact");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent/30 selection:text-bg overflow-x-hidden">
      <SEOHead pathname={location.pathname} />
      <PWAInstall />
      <UpdateToast />

      {/* Header wraps the skip link and the nav: page content must sit inside a
          landmark, and the skip link must come before the nav in tab order. */}
      <header>
        <SkipToContent />
        <nav
          aria-label="Primary"
          className="fixed top-0 left-0 right-0 z-[90] border-b border-border bg-bg/85 backdrop-blur-md"
        >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-6">
            <NavLink to="/" className="group flex items-center gap-3">
              <img src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7" />
              <span className="hidden sm:block leading-none">
                <span className="block text-[13px] font-medium tracking-tight text-text">
                  Mangalam Gaud
                </span>
                <span className="mono-label whitespace-nowrap">Security · Full-stack · IoT</span>
              </span>
            </NavLink>

            <div className="hidden xl:flex items-center">
              {navPages.map((r, i) => (
                <NavLink
                  key={r.path}
                  to={r.path}
                  end={r.path === "/"}
                  className={({ isActive }) =>
                    `group relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                      isActive ? "text-accent" : "text-text-muted hover:text-text"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span aria-hidden="true" className="mr-1.5 text-[9px] text-text-dim group-hover:text-accent/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {r.label}
                      <span
                        className={`absolute inset-x-2 -bottom-[7px] h-px transition-opacity ${
                          isActive ? "bg-accent opacity-100" : "opacity-0"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaletteOpen(true)}
                className="hidden sm:flex items-center gap-2 rounded-[4px] border border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim transition-colors hover:border-border-strong hover:text-text"
              >
                <Search className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">Open command palette</span>
                <span aria-hidden="true">⌘K</span>
              </button>
              <NavLink
                to="/contact"
                className="rounded-[4px] bg-accent px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent/90"
              >
                Contact
              </NavLink>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                className="xl:hidden rounded-[4px] border border-border p-2 text-text transition-colors hover:border-accent/60"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  {menuOpen ? (
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  ) : (
                    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Solid full-height sheet — a translucent panel let the hero show through */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="xl:hidden fixed inset-x-0 top-14 bottom-0 z-[85] overflow-y-auto border-t border-border bg-bg"
        >
          <div className="flex flex-col px-4 py-4">
            {navPages.map((r, i) => (
              <NavLink
                key={r.path}
                to={r.path}
                end={r.path === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-border/70 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] ${
                    isActive ? "text-accent" : "text-text-muted"
                  }`
                }
              >
                <span>{r.label}</span>
                <span aria-hidden="true" className="text-[10px] text-text-dim">{String(i + 1).padStart(2, "0")}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
      </header>

      <main id="main" tabIndex={-1} className="flex-grow relative z-0 outline-none">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-dim animate-pulse">
              Building world…
            </span>
          </div>
        }>
          <ThreeSceneProvider>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-text-dim font-mono text-xs uppercase tracking-[0.18em] animate-pulse">Building world…</div>}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen"
              >
                <ErrorBoundary>
                  <Routes location={location}>
                    {routes.map((r) => (
                      <Route
                        key={r.path}
                        path={r.path}
                        element={React.createElement(pageMap[r.path])}
                      />
                    ))}
                    <Route
                      path="*"
                      element={
                        <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-4 sm:px-6 lg:px-8">
                          <span className="mono-label">Error / 404</span>
                          <h1 className="mt-3 text-5xl font-semibold tracking-tighter text-text md:text-7xl">
                            Route not found.
                          </h1>
                          <p className="mt-4 max-w-md text-text-muted">
                            This path doesn't exist in the portfolio. The index is one keystroke
                            away.
                          </p>
                          <div className="mt-8">
                            <button
                              onClick={() => navigate("/")}
                              className="rounded-[4px] bg-accent px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent/90"
                            >
                              Back to Home
                            </button>
                          </div>
                        </div>
                      }
                    />
                  </Routes>
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </ThreeSceneProvider>
        </Suspense>
      </main>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <BootScreen />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <RouterApp />
    </Router>
  );
}
