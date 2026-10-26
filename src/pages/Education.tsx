"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThreeScene, getPointTexture } from "@/components/ThreeSceneProvider";
import { motion } from "framer-motion";
import { education } from "@/data";

export default function Education() {
  const { sceneRef, addTicker } = useThreeScene();
  const orbitRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const group = new THREE.Group();
    orbitRef.current = group;
    scene?.add(group);

    education.forEach((_, i) => {
      const radius = 2 + i * 0.9;
      const curve = new THREE.EllipseCurve(radius, radius);
      const points = curve.getPoints(64);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: "#c9f24d",
        transparent: true,
        opacity: 0.35,
      });
      const ring = new THREE.Line(geo, mat);
      // Tilted, not flat: a horizontal ring is edge-on to the camera and invisible.
      ring.rotation.x = -Math.PI * 0.32;
      ring.rotation.z = i * 0.4;
      group.add(ring);

      const dotGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(radius, 0, 0)]);
      const dotMat = new THREE.PointsMaterial({
        size: 0.28,
        color: "#7ee7c7",
        map: getPointTexture(),
        transparent: true,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const dot = new THREE.Points(dotGeo, dotMat);
      ring.add(dot);
    });

    return () => {
      scene?.remove(group);
    };
  }, [sceneRef]);

  useEffect(() => {
    return addTicker(() => {
      const group = orbitRef.current;
      if (group) group.rotation.y += 0.002;
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
          Academic Orbit
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 mb-4 text-5xl md:text-6xl font-semibold tracking-tighter text-text"
        >
          Education
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-xl text-lg text-text-muted"
        >
          Each orbit is a degree — from SSC to B.Sc. IT at K.E.S. Shroff College.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-8 [&>*]:max-w-3xl"
      >
        <div className="border-t border-border">
          {education.map((edu) => {
            const semesters = edu.semesters ?? [];
            const average = semesters.length
              ? semesters.reduce((sum, s) => sum + s.sgpa, 0) / semesters.length
              : 0;
            return (
              <article
                key={edu.degree}
                className="grid gap-1 border-b border-border py-5 sm:grid-cols-[130px_1fr] sm:gap-6"
              >
                <span className="mono-label pt-1">{edu.period}</span>
                <div>
                  <h2 className="text-base font-medium tracking-tight text-text">{edu.degree}</h2>
                  <p className="mono-label mt-1">{edu.org}</p>
                  {semesters.length > 0 ? (
                    <div className="mt-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="mono-label">Semester results (SGPA)</span>
                        <span className="font-mono text-xs tabular-nums text-text-muted">
                          Avg {average.toFixed(2)} / 10
                        </span>
                      </div>
                      <dl className="mt-3 space-y-2">
                        {semesters.map((s) => (
                          <div
                            key={s.label}
                            className="grid grid-cols-[84px_1fr_46px] items-center gap-3"
                          >
                            <dt className="mono-label">{s.label}</dt>
                            <div
                              className="h-1.5 overflow-hidden rounded-full bg-surface-2"
                              aria-hidden="true"
                            >
                              <div
                                className="h-full rounded-full bg-accent"
                                style={{ width: `${(s.sgpa / 10) * 100}%` }}
                              />
                            </div>
                            <dd className="text-right font-mono text-xs tabular-nums text-text">
                              {s.sgpa.toFixed(2)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      {edu.note && <p className="mt-3 text-xs text-text-dim">{edu.note}</p>}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">{edu.details}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
