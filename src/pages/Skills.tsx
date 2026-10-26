"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useThreeScene, getPointTexture } from "@/components/ThreeSceneProvider";
import { motion } from "framer-motion";
import { skills } from "@/data";

const SKILL_RADIUS = 2.2;

interface SkillNode {
  label: string;
  category: string;
  categoryIndex: number;
  index: number;
}

export default function Skills() {
  const { sceneRef, addTicker } = useThreeScene();
  const mouseRef = useRef({ x: 0, y: 0 });
  const meshRef = useRef<THREE.Points>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const allNodes = useMemo(() => {
    const list: SkillNode[] = [];
    skills.forEach((cat, ci) => {
      cat.items.forEach((item, ii) => {
        list.push({ label: item, category: cat.category, categoryIndex: ci, index: ii });
      });
    });
    return list;
  }, []);

  useEffect(() => {
    return addTicker(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      const mouse = mouseRef.current;

      mesh.rotation.y += 0.001;
      mesh.rotation.x += 0.0005;
      // Slow size pulse so the cloud reads as alive, not a static point field.
      (mesh.material as THREE.PointsMaterial).size =
        0.19 + Math.sin(mesh.rotation.y * 6) * 0.03;

      const positions = mesh.geometry.attributes.position.array as Float32Array;
      const mouseWorld = new THREE.Vector3(mouse.x * 5, -mouse.y * 5, 0);

    for (let i = 0; i < allNodes.length; i++) {
      const px = positions[i * 3];
      const py = positions[i * 3 + 1];
      const pz = positions[i * 3 + 2];

      const dx = mouseWorld.x - px;
      const dy = mouseWorld.y - py;
      const dz = mouseWorld.z - pz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 4) {
        const force = (4 - dist) / 4;
        positions[i * 3] -= dx * force * 0.1;
        positions[i * 3 + 1] -= dy * force * 0.1;
        positions[i * 3 + 2] -= dz * force * 0.1;
      }

      const cat = skills[allNodes[i].categoryIndex];
      const angle = (allNodes[i].index / cat.items.length) * Math.PI * 2;
      const catOffset = allNodes[i].categoryIndex * 2.2;
      const targetX = SKILL_RADIUS * Math.cos(angle) * Math.cos(catOffset * 0.5);
      const targetY = SKILL_RADIUS * Math.sin(angle) * Math.cos(catOffset * 0.5);
      const targetZ = SKILL_RADIUS * Math.sin(catOffset * 0.5);

      positions[i * 3] += (targetX - positions[i * 3]) * 0.03;
      positions[i * 3 + 1] += (targetY - positions[i * 3 + 1]) * 0.03;
      positions[i * 3 + 2] += (targetZ - positions[i * 3 + 2]) * 0.03;
    }

      mesh.geometry.attributes.position.needsUpdate = true;
    });
  }, [addTicker, allNodes]);

  // Register mouse position without any React re-render
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 };
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const positions = new Float32Array(allNodes.length * 3);
    const colors = new Float32Array(allNodes.length * 3);
    const sizes = new Float32Array(allNodes.length);

    const catColors: Record<string, THREE.Color> = {
      Programming: new THREE.Color("#c9f24d"),
      Security: new THREE.Color("#f472b6"),
      "Linux & Networking": new THREE.Color("#7ee7c7"),
      "Web & Backend": new THREE.Color("#34d399"),
      Databases: new THREE.Color("#fb923c"),
      "Cloud & Tools": new THREE.Color("#60a5fa"),
    };

    allNodes.forEach((node, i) => {
      const cat = skills[node.categoryIndex];
      const angle = (node.index / cat.items.length) * Math.PI * 2;
      const catOffset = node.categoryIndex * 2.2;
      positions[i * 3] = SKILL_RADIUS * Math.cos(angle) * Math.cos(catOffset * 0.5);
      positions[i * 3 + 1] = SKILL_RADIUS * Math.sin(angle) * Math.cos(catOffset * 0.5);
      positions[i * 3 + 2] = SKILL_RADIUS * Math.sin(catOffset * 0.5);

      const c = catColors[node.category] ?? new THREE.Color("#8fa3b8");
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.05 + Math.random() * 0.03;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.2,
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
    const scene = sceneRef.current;
    scene?.add(mesh);

    return () => {
      scene?.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [allNodes, sceneRef]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-10 pt-24 text-left sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow flex items-center gap-2"
        >
          <span className="h-px w-6 bg-accent" />
          Drag & Throw Constellation
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 mb-4 text-5xl md:text-6xl font-semibold tracking-tighter text-text"
        >
          Skills
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-xl text-lg text-text-muted"
        >
          Each skill is a node orbiting its category. Move your mouse to repel them — they snap back to orbit.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-8 [&>*]:max-w-3xl"
      >
        <h2 className="mono-label">Filter by category</h2>
        <div className="mt-3 flex flex-wrap justify-start gap-2">
          {skills.map((cat) => {
            const active = selected === cat.category;
            return (
              <button
                key={cat.category}
                type="button"
                onClick={() => setSelected(active ? null : cat.category)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-[4px] border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-accent bg-surface-2 text-text"
                    : "border-border bg-surface text-text-muted hover:border-border-strong hover:text-text"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${active ? "bg-accent" : "bg-text-dim"}`}
                  aria-hidden="true"
                />
                {cat.category} ({cat.items.length})
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-text-dim">
          Click a category to filter the list. Click it again to show every skill.
        </p>

        <div className="mt-8 space-y-6">
          {(selected ? skills.filter((cat) => cat.category === selected) : skills).map(
            (cat, index) => (
              <section key={cat.category} aria-labelledby={`skill-cat-${index}`}>
                <h2 id={`skill-cat-${index}`} className="mono-label flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  {cat.category}
                  <span className="text-text-dim">/ {cat.items.length}</span>
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-[4px] border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-text"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}
