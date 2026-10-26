"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThreeScene, getPointTexture } from "@/components/ThreeSceneProvider";
import { motion } from "framer-motion";
import { experience } from "@/data";

export default function Experience() {
  const { sceneRef, addTicker } = useThreeScene();
  const meshRef = useRef<THREE.Line>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const curve = new THREE.CatmullRomCurve3(
      experience.map((_, i) => new THREE.Vector3(
        Math.sin(i * 1.5) * 2,
        (i - experience.length / 2) * 1.2,
        Math.cos(i * 1.5) * 2
      ))
    );
    const points = curve.getPoints(100);
    const positions = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });

    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: "#c9f24d",
      transparent: true,
      opacity: 0.45,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    meshRef.current = line;

    const nodePos = new Float32Array(experience.length * 3);
    const nodeColors = new Float32Array(experience.length * 3);
    experience.forEach((_, i) => {
      const p = curve.getPoint(i / (experience.length - 1));
      nodePos[i * 3] = p.x;
      nodePos[i * 3 + 1] = p.y;
      nodePos[i * 3 + 2] = p.z;
      const c = new THREE.Color().setHSL(i / experience.length, 0.7, 0.6);
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));
    const nodeMat = new THREE.PointsMaterial({
      size: 0.26,
      map: getPointTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    pointsRef.current = nodes;
    scene.add(line);
    scene.add(nodes);

    return () => {
      scene.remove(line);
      scene.remove(nodes);
      lineGeo.dispose();
      lineMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
    };
  }, [sceneRef]);

  useEffect(() => {
    return addTicker(() => {
      const line = meshRef.current;
      const nodes = pointsRef.current;
      if (line) line.rotation.y += 0.0008;
      if (nodes) {
        nodes.rotation.y += 0.0008;
        nodes.rotation.x += 0.0004;
      }
    });
  }, [addTicker]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-10 pt-24 text-left sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow flex items-center gap-2"
        >
          <span className="h-px w-6 bg-accent" />
          Experience Tunnel
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 mb-4 text-5xl md:text-6xl font-semibold tracking-tighter text-text"
        >
          Experience &amp; Leadership
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-xl text-lg text-text-muted"
        >
          Fly through the timeline of my career — from tutoring to team leadership.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-8 [&>*]:max-w-3xl"
      >
        <div className="border-t border-border">
          {experience.map((exp) => (
            <article
              key={exp.role}
              className="grid gap-1 border-b border-border py-5 sm:grid-cols-[130px_1fr] sm:gap-6"
            >
              <span className="mono-label pt-1">{exp.period}</span>
              <div>
                <h2 className="text-base font-medium tracking-tight text-text">{exp.role}</h2>
                <p className="mono-label mt-1">{exp.org}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{exp.description}</p>
              </div>
            </article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
