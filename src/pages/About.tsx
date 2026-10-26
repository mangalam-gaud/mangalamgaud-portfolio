"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThreeScene, getPointTexture } from "@/components/ThreeSceneProvider";
import { motion } from "framer-motion";
import { profile, education, participation, certifications } from "@/data";

const FOCUS = [
  {
    key: "Security",
    body: "Wireless auditing with aircrack-ng and hashcat, plus web hardening — JWT, RBAC, CSRF and AES-256-GCM.",
  },
  {
    key: "Full-stack",
    body: "React, Express, PostgreSQL and Redis, from database schema to deployed interface.",
  },
  {
    key: "IoT",
    body: "ESP32, BLE and LoRa prototypes, including the Drishtipath railway guidance system.",
  },
];

/** One node per item this page lists: events in lime, credentials in mint. */
const NODE_TOTAL = participation.length + certifications.length;

export default function About() {
  const { sceneRef, addTicker } = useThreeScene();
  const orbitRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const group = new THREE.Group();
    orbitRef.current = group;
    scene?.add(group);

    const ring = new THREE.EllipseCurve(0, 0, 2.4, 2.4);
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ring.getPoints(96));
    const compact = window.innerWidth < 1024;
    const ringMat = new THREE.LineBasicMaterial({
      color: "#2a3040",
      transparent: true,
      opacity: compact ? 0.4 : 0.7,
    });
    group.add(new THREE.Line(ringGeo, ringMat));

    const positions = new Float32Array(NODE_TOTAL * 3);
    const colors = new Float32Array(NODE_TOTAL * 3);
    const eventColor = new THREE.Color("#c9f24d");
    const certColor = new THREE.Color("#7ee7c7");

    for (let i = 0; i < NODE_TOTAL; i++) {
      const angle = (i / NODE_TOTAL) * Math.PI * 2;
      const radius = 2.4 + (i % 3) * 0.09;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = ((i % 2) - 0.5) * 0.45;

      const color = i < participation.length ? eventColor : certColor;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const nodeMat = new THREE.PointsMaterial({
      // Faint dust on compact viewports: the orbit crosses the page copy there.
      size: compact ? 0.18 : 0.24,
      map: getPointTexture(),
      vertexColors: true,
      transparent: true,
      opacity: compact ? 0.45 : 0.95,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(nodeGeo, nodeMat));
    group.rotation.x = -Math.PI * 0.18;

    return () => {
      scene?.remove(group);
      ringGeo.dispose();
      ringMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
    };
  }, [sceneRef]);

  useEffect(() => {
    return addTicker(() => {
      if (orbitRef.current) orbitRef.current.rotation.y += 0.0012;
    });
  }, [addTicker]);

  const semesters = education[0].semesters ?? [];
  const latest = semesters.length ? semesters[semesters.length - 1] : null;

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-10 pt-24 text-left sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow flex items-center gap-2"
        >
          <span className="h-px w-6 bg-accent" />
          Professional Profile
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 mb-4 text-5xl md:text-6xl font-semibold tracking-tighter text-text"
        >
          About Me
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-xl text-lg text-text-muted"
        >
          A profile built from events, results and credentials — one node per event and
          certification below orbits behind it.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-8 [&>*]:max-w-3xl"
      >
        <div className="space-y-10">
          <div className="card p-8 text-left">
            <p className="mono-label">Profile</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text">{profile.name}</h2>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-accent">
              {profile.title}
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">{profile.bio}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[profile.location, ...(latest ? [`SGPA ${latest.sgpa.toFixed(2)}`] : []), "Open to work"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-[4px] border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>

          <section aria-labelledby="about-focus">
            <h2 id="about-focus" className="eyebrow">
              What I work on
            </h2>
            <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
              {FOCUS.map((f) => (
                <div key={f.key} className="bg-surface p-4">
                  <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">{f.key}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{f.body}</p>
                </div>
              ))}
            </div>
          </section>

          <dl className="hairline grid grid-cols-2 gap-x-8 gap-y-5 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Degree", "B.Sc. IT (TY)"],
              ["College", "K.E.S. Shroff, Mumbai"],
              ["Base", "Mumbai, India"],
              ["Status", "Open to work"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="mono-label">{k}</dt>
                <dd className="mt-1 text-sm text-text">{v}</dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="about-participation">
            <div className="flex items-baseline justify-between">
              <h2 id="about-participation" className="eyebrow">
                Hackathons & participation
              </h2>
              <span className="mono-label">{participation.length} events</span>
            </div>
            <div className="mt-2 border-t border-border">
              {participation.map((p) => (
                <article
                  key={p.event}
                  className="grid gap-1 border-b border-border py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6"
                >
                  <div>
                    <h3 className="text-sm font-medium tracking-tight text-text">{p.event}</h3>
                    {p.note && <p className="mono-label mt-1">{p.note}</p>}
                  </div>
                  <p className="text-sm text-text-muted sm:text-right">{p.outcome}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="about-certifications">
            <div className="flex items-baseline justify-between">
              <h2 id="about-certifications" className="eyebrow">
                Certifications
              </h2>
              <span className="mono-label">
                {certifications.filter((c) => c.status === "completed").length} completed ·{" "}
                {certifications.filter((c) => c.status === "pursuing").length} pursuing
              </span>
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {certifications.map((c) => (
                <li
                  key={c.name}
                  className="rounded-[4px] border border-border bg-surface px-3 py-2.5"
                >
                  <p className="text-sm text-text">{c.name}</p>
                  <p className="mono-label mt-1">
                    {c.issuer}
                    {c.status === "pursuing" && <span className="text-accent"> · pursuing</span>}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

