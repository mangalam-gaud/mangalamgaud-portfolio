"use client";

import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as THREE from "three";
import { useThreeScene, getPointTexture } from "@/components/ThreeSceneProvider";
import { Button } from "@/components/ui/Button";
import { homeProjects, projects } from "@/data";
import { motion } from "framer-motion";

/**
 * Home background: three coloured bands on one slow sphere — Security,
 * Full-stack, IoT, in the same order as the hero eyebrow and legend.
 * Deliberately one Points object with no custom shader and no per-frame
 * geometry writes; the old 2500-point shader sphere plus a raycast on every
 * mousemove was the heaviest thing on the site.
 */
const POINT_COUNT = 900;
const BANDS = [
  { color: "#c9f24d", label: "Security" },
  { color: "#7ee7c7", label: "Full-stack" },
  { color: "#f472b6", label: "IoT" },
];

export default function Home() {
  const { sceneRef, addTicker } = useThreeScene();
  const navigate = useNavigate();
  const meshRef = useRef<THREE.Points>(null);
  const tiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      tiltRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    let elapsed = 0;
    return addTicker((delta) => {
      const mesh = meshRef.current;
      if (!mesh) return;
      elapsed += delta;
      mesh.rotation.y += 0.0011;
      // Eased cursor tilt + a slow breath, so the sphere follows rather than snaps.
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, -tiltRef.current.y * 0.18, 0.03);
      mesh.scale.setScalar(1 + Math.sin(elapsed * 0.6) * 0.012);
    });
  }, [addTicker]);

  useEffect(() => {
    const positions = new Float32Array(POINT_COUNT * 3);
    const colors = new Float32Array(POINT_COUNT * 3);
    const palette = BANDS.map((band) => new THREE.Color(band.color));

    for (let i = 0; i < POINT_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / POINT_COUNT);
      const theta = Math.sqrt(POINT_COUNT * Math.PI) * phi;
      const r = 2.4;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const band = palette[Math.min(BANDS.length - 1, Math.floor((i / POINT_COUNT) * BANDS.length))];
      colors[i * 3] = band.r;
      colors[i * 3 + 1] = band.g;
      colors[i * 3 + 2] = band.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      // Compact viewports put the sphere behind body copy, so keep it as faint dust.
      size: window.innerWidth < 1024 ? 0.05 : 0.055,
      map: getPointTexture(),
      vertexColors: true,
      transparent: true,
      opacity: window.innerWidth < 1024 ? 0.48 : 0.92,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Points(geometry, material);
    meshRef.current = mesh;
    const scene = sceneRef.current;
    scene?.add(mesh);

    return () => {
      scene?.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [sceneRef]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-10 pt-24 text-left sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow flex items-center gap-2"
          >
            <span className="h-px w-6 bg-accent" />
            01 / Security · Full-stack · IoT
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Open to work · Mumbai
          </motion.span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-[clamp(3.25rem,9vw,7.5rem)] font-semibold leading-[0.92] tracking-tighter text-text"
        >
          Mangalam
          <br />
          Gaud<span className="text-accent">.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-text-muted md:text-lg"
        >
          I build full-stack systems, audit wireless networks on Linux, and prototype
          assistive IoT hardware — from college platforms to encrypted air-gapped transfer.
        </motion.p>
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted"
        >
          {BANDS.map((band) => (
            <li key={band.label} className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: band.color }}
                aria-hidden="true"
              />
              {band.label}
            </li>
          ))}
        </motion.ul>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate("/projects")}>
            View projects <span aria-hidden="true">&rarr;</span>
          </Button>
          <Button variant="outline" onClick={() => navigate("/contact")}>
            Get in touch
          </Button>
        </div>
      </div>

      {/* Proof above the fold line: a recruiter's 45-second skim should reach a
          real case study without opening the gallery first. */}
      <section
        aria-labelledby="selected-work"
        className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-8"
      >
        <div className="mb-4 flex items-baseline justify-between gap-4 border-t border-border pt-5">
          <h2 id="selected-work" className="mono-label">
            Selected work
          </h2>
          <button
            onClick={() => navigate("/projects")}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted transition-colors hover:text-accent"
          >
            All {projects.length} projects <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {homeProjects.map((p) => (
              <li key={p.id} className="group relative">
                <img
                  src={p.image.replace(/\.jpg$/, "-thumb.jpg")}
                  alt=""
                  width={480}
                  height={270}
                  loading="lazy"
                  className="aspect-video w-full rounded-lg border border-border object-cover transition-colors group-hover:border-accent/60"
                />
                <div className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em]">
                  <span className="text-accent">{p.featured ? "Featured" : "Project"}</span>
                  {"demo" in p && p.demo && (
                    <span className="text-accent-2" aria-hidden="true">
                      ● Live
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-sm font-medium leading-snug text-text group-hover:text-accent">
                  {/* Overlay link: the whole card is clickable, but the accessible
                      name stays the project title instead of the entire card text. */}
                  <Link
                    to={`/projects/${p.id}`}
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-1 font-mono text-[10px] text-text-dim">{p.facts}</p>
              </li>
            ))}
        </ul>
      </section>

      {/* Fact strip, not decoration: role, base, focus, availability. */}
      <div className="relative z-[20] mx-auto mt-auto w-full max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-8">
        <dl className="hairline grid grid-cols-2 gap-x-8 gap-y-5 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Role", "Software developer"],
            ["Base", "Mumbai, India"],
            ["Focus", "Security · Full-stack · IoT"],
            ["Status", "Open to work"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="mono-label">{k}</dt>
              <dd className="mt-1 text-sm text-text">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
