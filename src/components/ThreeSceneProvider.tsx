"use client";

import {
  Component,
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

type Ticker = (delta: number) => void;

interface ThreeSceneContextValue {
  sceneRef: React.MutableRefObject<THREE.Group | null>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  setPointer: (x: number, y: number) => void;
  isMobile: boolean;
  prefersReduced: boolean;
  /** Register a per-frame callback driven by the Canvas render loop. Returns unregister. */
  addTicker: (fn: Ticker) => () => void;
}

const ThreeSceneContext = createContext<ThreeSceneContextValue | null>(null);

export function isMobileEnv() {
  return window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
}

export function prefersReducedEnv() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True when the browser can actually create a WebGL context. */
export function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    // Release the probe: browsers cap how many live contexts a page may hold.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * A failed WebGL context used to unmount the whole app (blank page, no nav).
 * The scene is decoration: if it breaks, drop it and keep the pages.
 */
class SceneBoundary extends Component<PropsWithChildren<{}>, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

let pointTexture: THREE.Texture | null = null;

/**
 * Soft circular sprite for all page Points layers — a bare PointsMaterial
 * draws hard squares, which read as rendering glitches against the dark theme.
 */
export function getPointTexture() {
  if (pointTexture) return pointTexture;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  // A browser can return a null context (canvas disabled, memory pressure);
  // a blank texture keeps the scene code path safe.
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  pointTexture = new THREE.CanvasTexture(canvas);
  return pointTexture;
}

/** Page scroll position as 0..1. Extracted so the clamp is testable. */
export function scrollProgress(scrollY: number, scrollHeight: number, innerHeight: number) {
  const max = scrollHeight - innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / max));
}

/** Lives inside the Canvas: captures the camera and drives registered page tickers. */
function SceneRig({
  cameraRef,
  sceneRef,
  tickers,
}: {
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  sceneRef: React.MutableRefObject<THREE.Group | null>;
  tickers: React.MutableRefObject<Set<Ticker>>;
}) {
  const { camera } = useThree();
  // Captured once at mount — honoring it for the whole session is enough
  const reduced = useRef(prefersReducedEnv()).current;
  // Read on scroll, never per frame: scrollHeight is a layout read, and doing
  // it 60×/s is exactly how a smooth scene starts to stutter.
  const progress = useRef(0);

  useEffect(() => {
    const read = () =>
      (progress.current = scrollProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight
      ));
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  useEffect(() => {
    cameraRef.current = camera as THREE.PerspectiveCamera;
  }, [camera, cameraRef]);
  useFrame((_, delta) => {
    if (reduced) return; // accessibility: no continuous motion for reduced-motion users

    const group = sceneRef.current;
    if (group) {
      // Scroll re-frames the scene: the shell turns and recedes as you read.
      // The group moves, not the camera, so OrbitControls' state stays intact.
      const t = progress.current;
      const ease = 1 - Math.pow(0.002, delta);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, t * 0.8, ease);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, t * 0.12, ease);
      group.position.z = THREE.MathUtils.lerp(group.position.z, -t * 1.1, ease);
      group.position.y = THREE.MathUtils.lerp(group.position.y, t * 0.35, ease);
    }

    tickers.current.forEach((fn) => fn(delta));
  });
  return null;
}

export function ThreeSceneProvider({ children }: PropsWithChildren<{}>) {
  // Reduced motion: no WebGL canvas at all; pages then render their DOM only.
  const [reduced] = useState(() => (typeof window === "undefined" ? false : prefersReducedEnv()));
  // No WebGL (disabled GPU, blocked driver, locked-down browser): skip the
  // canvas instead of letting the renderer throw and blank the page.
  const [webgl] = useState(() => (typeof window === "undefined" ? false : hasWebGL()));
  const sceneRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  // Pages animate via addTicker instead of useFrame — they render OUTSIDE the Canvas
  const tickersRef = useRef<Set<Ticker>>(new Set());
  const raycaster = useRef(new THREE.Raycaster()).current;
  const pointer = useRef(new THREE.Vector2(-100, -100)).current;

  const addTicker = useRef((fn: Ticker) => {
    tickersRef.current.add(fn);
    return () => {
      tickersRef.current.delete(fn);
    };
  }).current;

  const ctx: ThreeSceneContextValue = {
    sceneRef,
    cameraRef,
    raycaster,
    pointer,
    setPointer: (x: number, y: number) => {
      pointer.set(x, y);
    },
    isMobile: isMobileEnv(),
    prefersReduced: prefersReducedEnv(),
    addTicker,
  };

  return (
    <ThreeSceneContext.Provider value={ctx}>
      {!reduced && webgl && (
        <SceneBoundary>
          <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: -1 }}>
            <Canvas
              camera={{ position: [0, 0, 6], fov: 45 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: true }}
              shadows
              style={{ width: "100%", height: "100%" }}
            >
              <SceneRig cameraRef={cameraRef} sceneRef={sceneRef} tickers={tickersRef} />
              <ambientLight intensity={0.3} color="#ffffff" />
              <pointLight position={[5, 5, 5]} intensity={1} color="#c9f24d" />
              <pointLight position={[-5, -5, 5]} intensity={0.6} color="#7ee7c7" />
              <spotLight position={[0, 10, 10]} intensity={0.8} angle={0.6} penumbra={0.7} color="#ffffff" />
              <ContactShadows opacity={0.2} scale={10} blur={2} far={15} />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={2}
                maxDistance={25}
                autoRotateSpeed={0.5}
                enabled={!isMobileEnv() && !prefersReducedEnv()}
              />
              {/* All page 3D objects are added imperatively into this group via sceneRef */}
              <group ref={sceneRef} />
            </Canvas>
          </div>
        </SceneBoundary>
      )}
      {/* Page DOM renders here, OUTSIDE the WebGL canvas */}
      {children}
    </ThreeSceneContext.Provider>
  );
}

export function useThreeScene() {
  const ctx = useContext(ThreeSceneContext);
  if (!ctx) throw new Error("useThreeScene must be used inside ThreeSceneProvider");
  return ctx;
}
