"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThreeScene, getPointTexture } from "@/components/ThreeSceneProvider";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Mail, Phone, MapPin } from "lucide-react";
import { profile } from "@/data";
import { ResumeDownload } from "@/components/ResumeDownload";

/** lucide dropped brand icons; GitHub mark kept inline. */
const GithubMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
  </svg>
);

const LinkedInMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

const InstagramMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13-.67-.66-1.34-1.08-2.13-1.38-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0z" />
    <path d="M12 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    <circle cx="18.41" cy="5.59" r="1.44" />
  </svg>
);

const XMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const CONTACTS = [
  { label: "Email", value: "manglamgaud@gmail.com", url: "mailto:manglamgaud@gmail.com", color: "#c9f24d", Icon: Mail },
  { label: "Phone", value: "+91 8591681592", url: "tel:+918591681592", color: "#7ee7c7", Icon: Phone },
  // LinkedIn slug stays in the href only — the card shows the name.
  { label: "LinkedIn", value: "Mangalam Gaud", url: profile.linkedin, color: "#c9f24d", Icon: LinkedInMark },
  { label: "X", value: "@mangalam_gaud", url: profile.x, color: "#7ee7c7", Icon: XMark },
  { label: "Instagram", value: "instagram.com/mangalam_gaud", url: profile.instagram, color: "#7ee7c7", Icon: InstagramMark },
  { label: "Location", value: "Kandivali East, Mumbai", url: "https://maps.google.com/?q=Kandivali+East,+Mumbai,+Maharashtra", color: "#c9f24d", Icon: MapPin },
  { label: "GitHub", value: "github.com/mangalam-gaud", url: "https://github.com/mangalam-gaud", color: "#7ee7c7", Icon: GithubMark },
];

export default function Contact() {
  const { sceneRef, addTicker } = useThreeScene();
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

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
      mesh.rotation.y += 0.001;
      mesh.rotation.x += 0.0005;
      mesh.rotation.y += mouseRef.current.x * 0.2;
      mesh.rotation.x += mouseRef.current.y * 0.2;
    });
  }, [addTicker]);

  useEffect(() => {
    const positions = new Float32Array(CONTACTS.length * 3);
    const colors = new Float32Array(CONTACTS.length * 3);
    const c1 = new THREE.Color("#c9f24d");
    const c2 = new THREE.Color("#7ee7c7");

    CONTACTS.forEach((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / CONTACTS.length);
      const theta = Math.sqrt(CONTACTS.length * Math.PI) * phi;
      const r = 2.4;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const t = i / CONTACTS.length;
      const c = new THREE.Color().lerpColors(c1, c2, t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.38,
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
  }, [sceneRef]);

  const sendEmail = () => {
    const subject = encodeURIComponent("Opportunity / Collaboration — Mangalam Gaud");
    const body = encodeURIComponent(
      `Hi Mangalam,\n\nI came across your portfolio and would like to connect regarding an opportunity or collaboration.\n\nBest regards,\n[Your Name]\n[Your Company / Institution]\n\n---\nSent from your portfolio contact button\n${profile.github}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-10 pt-24 text-left sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow flex items-center gap-2"
        >
          <span className="h-px w-6 bg-accent" />
          Contact Constellation
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 mb-4 text-5xl md:text-6xl font-semibold tracking-tighter text-text"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-xl text-lg text-text-muted"
        >
          I read every message personally. Orbit the orbs to find me.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-[20] mx-auto w-full max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-8 [&>*]:max-w-3xl"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <Button
            variant="accent"
            onClick={sendEmail}
            className="w-full sm:w-auto"
          >
            Send Email
          </Button>
          <ResumeDownload />
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {CONTACTS.map((c) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card p-5 text-left transition-colors hover:border-border-strong ${
                c.label === "Email" ? "md:col-span-2" : ""
              }`}
            >
              <div className="mb-2 flex items-center gap-2.5">
                <span aria-hidden="true"><c.Icon className="h-4 w-4 text-accent" /></span>
                <span className="mono-label">{c.label}</span>
              </div>
              <Link
                url={c.url}
                external={["GitHub", "LinkedIn", "Instagram", "X"].includes(c.label)}
                className="text-sm text-text hover:text-accent"
              >
                {c.value}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
