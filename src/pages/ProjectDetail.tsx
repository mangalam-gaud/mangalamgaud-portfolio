"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThreeScene, getPointTexture } from "@/components/ThreeSceneProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "@/data";
import { profile } from "@/data";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sceneRef, addTicker } = useThreeScene();
  const project = projects.find((p) => p.id === id);

  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const stackPoints = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const c1 = new THREE.Color("#c9f24d");
    const c2 = new THREE.Color("#7ee7c7");
    const r = 2.3;

    const stack = project?.stack ?? [];
    stack.forEach((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / stack.length);
      const theta = Math.sqrt(stack.length * Math.PI) * phi;
      positions.push(r * Math.sin(phi) * Math.cos(theta));
      positions.push(r * Math.sin(phi) * Math.sin(theta));
      positions.push(r * Math.cos(phi));
      const t = i / stack.length;
      const c = new THREE.Color().lerpColors(c1, c2, t);
      colors.push(c.r, c.g, c.b);
    });
    return { positions, colors };
  }, [project?.stack]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 };
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    return addTicker(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      const mouse = mouseRef.current;
      mesh.rotation.y += 0.0012;
      mesh.rotation.x += 0.0006;
      mesh.rotation.y += mouse.x * 0.3;
      mesh.rotation.x += mouse.y * 0.3;
    });
  }, [addTicker]);

  useEffect(() => {
    if (!project) return;
    const scene = sceneRef.current;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(stackPoints.positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(stackPoints.colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.24,
      map: getPointTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Points(geometry, material);
    meshRef.current = mesh;
    scene?.add(mesh);

    return () => {
      scene?.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [stackPoints, project, sceneRef]);

  const sendEmail = () => {
    const subject = encodeURIComponent("Opportunity / Collaboration — Mangalam Gaud");
    const body = encodeURIComponent(
      `Hi Mangalam,\n\nI came across your portfolio and would like to connect regarding an opportunity or collaboration.\n\nBest regards,\n[Your Name]\n[Your Company / Institution]\n\n---\nSent from your portfolio contact button\n${profile.github}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-text-muted">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <button
          onClick={() => navigate("/projects")}
          className="mt-4 text-accent hover:underline"
        >
          Back to gallery
        </button>
      </div>
    );
  }

  const demo = "demo" in project ? project.demo : undefined;
  const video = "video" in project ? project.video : undefined;

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* A back button, not a navigation landmark — the site nav is the only nav. */}
      <div className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pt-20 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/projects")}
          className="inline-flex items-center gap-2 rounded-[4px] border border-border bg-surface/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted backdrop-blur transition-colors hover:border-accent/60 hover:text-accent"
        >
          <span aria-hidden="true">&larr;</span> Back to Gallery
        </button>
      </div>

      <div className="relative z-[10] mx-auto w-full max-w-[1400px] px-4 pb-10 pt-8 text-left sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow flex items-center gap-2"
        >
          <span className="h-px w-6 bg-accent" />
          Tech Stack Visualization
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 mb-3 text-5xl md:text-7xl font-semibold tracking-tighter text-text"
        >
          {project.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-xl text-lg text-text-muted"
        >
          {project.subtitle}
        </motion.p>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-8 [&>*]:max-w-3xl"
        >
          <img
            src={project.image}
            alt={`${project.title} — ${project.subtitle}`}
            width={1200}
            height={675}
            className="mb-6 w-full rounded-lg border border-border object-cover"
          />
          <div className="card p-8">
            <div className="flex flex-wrap gap-3 mb-6">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-[4px] border border-accent/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mb-6 border-l-2 border-accent pl-3">
              <div className="mono-label mb-1">At a glance</div>
              <p className="font-mono text-xs text-text-muted">{project.facts}</p>
            </div>
            <h2 className="mono-label mb-2">Description</h2>
            <p className="text-text-muted leading-relaxed mb-6">{project.description}</p>
            <h3 className="mono-label mb-2">Highlights</h3>
            <ul className="space-y-2 text-text-muted leading-relaxed mb-8">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {(demo || project.link || video) && (
                <>
                  {demo && (
                    <a
                      href={demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent hover:underline"
                    >
                      Live site &rarr;
                    </a>
                  )}
                  {video && (
                    <a
                      href={video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-2 hover:underline"
                    >
                      Watch video &rarr;
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted hover:text-accent hover:underline"
                    >
                      View on GitHub &rarr;
                    </a>
                  )}
                </>
              )}
            </div>
            <button
              onClick={sendEmail}
              className="mt-6 inline-flex items-center gap-2 rounded-[4px] bg-accent px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent/90"
            >
              Contact Me
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
