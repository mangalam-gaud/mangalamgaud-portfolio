"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThreeScene, getPointTexture } from "@/components/ThreeSceneProvider";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projects } from "@/data";

export default function Projects() {
  const { sceneRef, addTicker } = useThreeScene();
  // Ref, not state: mousemove updates never re-render React — read in the GL loop only
  const mouseRef = useRef({ x: 0, y: 0 });
  const meshRef = useRef<THREE.Points>(null);

  const projectPoints = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const c1 = new THREE.Color("#c9f24d");
    const c2 = new THREE.Color("#7ee7c7");
    const r = 2.4;

    projects.forEach((p, i) => {
      const phi = Math.acos(-1 + (2 * i) / projects.length);
      const theta = Math.sqrt(projects.length * Math.PI) * phi;
      positions.push(r * Math.sin(phi) * Math.cos(theta));
      positions.push(r * Math.sin(phi) * Math.sin(theta));
      positions.push(r * Math.cos(phi));
      // Lime for featured, mint for the rest — the key below the canvas says so.
      const c = p.featured ? c1 : c2;
      colors.push(c.r, c.g, c.b);
    });
    return { positions, colors };
  }, []);

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
      mesh.rotation.y += 0.001;
      mesh.rotation.x = mouse.y * 0.3;
      mesh.rotation.y += mouse.x * 0.3;
    });
  }, [addTicker]);

  useEffect(() => {
    const scene = sceneRef.current;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(projectPoints.positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(projectPoints.colors, 3));
    const material = new THREE.PointsMaterial({
      // Sized so a star reads as a marker, not dust: this is the exhibit.
      size: 0.42,
      map: getPointTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Points(geometry, material);
    // Constellation shell: makes the twelve project stars read as one 3D object.
    const wireGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.4, 0));
    const wireMat = new THREE.LineBasicMaterial({
      color: "#c9f24d",
      transparent: true,
      opacity: 0.26,
    });
    mesh.add(new THREE.LineSegments(wireGeo, wireMat));
    meshRef.current = mesh;
    scene?.add(mesh);

    return () => {
      scene?.remove(mesh);
      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
    };
  }, [projectPoints, sceneRef]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-10 pt-24 text-left sm:px-6 md:pr-[22rem] lg:px-8 lg:pr-[23rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow flex items-center gap-2"
        >
          <span className="h-px w-6 bg-accent" />
          3D Project Gallery
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 mb-4 text-5xl md:text-6xl font-semibold tracking-tighter text-text"
        >
          Selected Projects
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-xl text-lg text-text-muted"
        >
          Each star is a project — open any case study from the index.
        </motion.p>
      </div>

      {/* Constellation key, matching the rail labels. Hidden on mobile: the rail
          sits at the bottom there. */}
      <div className="relative z-[20] mx-auto mt-auto hidden w-full max-w-[1400px] px-4 pb-10 sm:px-6 md:block md:pr-[22rem] lg:px-8 lg:pr-[23rem]">
        <dl className="hairline grid grid-cols-3 gap-x-8 pt-5">
          <div>
            <dt className="mono-label">Nodes</dt>
            <dd className="mt-1 text-sm text-text">{projects.length} · one per project</dd>
          </div>
          <div>
            <dt className="mono-label">Live demos</dt>
            <dd className="mt-1 text-sm text-text">
              {projects.filter((p) => "demo" in p && p.demo).length} hosted
            </dd>
          </div>
          <div>
            <dt className="mono-label">Key</dt>
            <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Featured
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-2" aria-hidden="true" />
                Project
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Mobile: full-width scrollable sheet at the bottom. md+: right rail.
          Header sits outside the scroller so no row can peek above it. */}
      <div className="absolute bottom-4 left-4 right-4 z-[20] flex max-h-[48vh] flex-col overflow-hidden rounded-lg border border-border bg-surface/95 backdrop-blur md:bottom-auto md:left-auto md:right-8 md:top-24 md:max-h-[calc(100vh-8rem)] md:w-80">
        <div className="mono-label px-3 pb-2 pt-3">Index / {projects.length} entries</div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {projects.map((p) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group relative mb-px block w-full rounded-[4px] border border-transparent px-3 py-3 text-left transition-colors hover:border-border hover:bg-surface-2"
            >
              <div className="flex items-start gap-3">
                <img
                  src={p.image.replace(/\.jpg$/, "-thumb.jpg")}
                  alt=""
                  width={89}
                  height={50}
                  loading="lazy"
                  className="mt-0.5 h-[50px] w-[89px] shrink-0 rounded-[3px] border border-border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em]">
                    <span className="text-accent">{p.featured ? "Featured" : "Project"}</span>
                    {"demo" in p && p.demo && (
                      <span className="text-accent-2" aria-hidden="true">
                        ● Live
                      </span>
                    )}
                  </div>
                  {/* Overlay link keeps the accessible name to the project title. */}
                  <h2 className="line-clamp-2 text-sm font-medium leading-snug tracking-tight text-text group-hover:text-accent">
                    <Link
                      to={`/projects/${p.id}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                    {p.subtitle}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
