"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useSyncExternalStore, type RefObject } from "react";
import { Group, PerspectiveCamera, SRGBColorSpace, TextureLoader } from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resolveCameraPosition, sampleCamera } from "../../vendor/motion-kit/camera";
import type { CameraKeyframe, SampledCamera } from "../../vendor/motion-kit/types";

const graduation: readonly CameraKeyframe[] = [
  { at: 0, fill: .85, fov: 36, azimuth: -6, elevation: 4, target: [0, 0, 0] },
  { at: .5, fill: .88, fov: 36, azimuth: 5, elevation: 1, target: [.08, 0, 0] },
  { at: 1, fill: .84, fov: 36, azimuth: 0, elevation: 0, target: [0, 0, 0] },
];
const texturePaths = ["/images/vu-9516-960.webp", "/images/vu-9505-960.webp"];

function Postcards({ root, onReady, onFailure }: Props) {
  const groups = useRef<(Group | null)[]>([]);
  const progress = useRef(0);
  const sampled = useMemo<SampledCamera>(() => ({ fov: 36, azimuth: 0, elevation: 0, fill: 1, target: [0, 0, 0] }), []);
  const position = useMemo(() => ({ x: 0, y: 0, z: 0, distance: 0 }), []);
  const textures = useLoader(TextureLoader, texturePaths);
  const { invalidate, gl } = useThree();
  const props = useRef({ onReady, onFailure });
  useEffect(() => { props.current = { onReady, onFailure }; }, [onReady, onFailure]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 30%",
      end: "bottom 55%",
      onUpdate: self => {
        progress.current = self.progress;
        if (!document.hidden) invalidate();
      },
    });
    const handleContextLoss = (e: Event) => { e.preventDefault(); props.current.onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", handleContextLoss);
    const visibility = () => { if (!document.hidden) invalidate(); };
    document.addEventListener("visibilitychange", visibility);
    props.current.onReady();
    // Refresh after CSS switches the static poster to the sticky stage.
    const animation = requestAnimationFrame(() => { trigger.refresh(); invalidate(); });
    return () => {
      cancelAnimationFrame(animation);
      trigger.kill();
      gl.domElement.removeEventListener("webglcontextlost", handleContextLoss);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [root, invalidate, gl]);

  useFrame(({ camera, size }) => {
    if (!(camera instanceof PerspectiveCamera) || !size.width || !size.height) return;
    const p = progress.current;
    sampleCamera(graduation, p, sampled);
    resolveCameraPosition(sampled, size.width / size.height, 5.7, position);
    camera.fov = sampled.fov;
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(...sampled.target);
    camera.updateProjectionMatrix();
    groups.current.forEach((group, index) => {
      if (!group) return;
      const direction = index === 0 ? -1 : 1;
      group.position.set(direction * (.57 + p * .78), direction * (.24 - p * .18), index === 0 ? .35 * (1 - p) : -.12);
      group.rotation.set(0, direction * .115 * (1 - p), direction * (.12 - p * .085));
    });
  });

  return textures.map((texture, index) => {
    const ratio = texture.image.width / texture.image.height;
    const width = Math.min(2.35, 2.95 * ratio);
    const height = Math.min(2.95, 2.35 / ratio);
    return <group key={index} ref={group => { groups.current[index] = group; }}>
      <mesh>
        <planeGeometry args={[width + .24, height + .36]} />
        <meshBasicMaterial color="#f8fcff" />
      </mesh>
      <mesh position={[0, .05, .01]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} map-colorSpace={SRGBColorSpace} toneMapped={false} />
      </mesh>
    </group>;
  });
}

type Props = { root: RefObject<HTMLDivElement | null>; onReady: () => void; onFailure: () => void };

const compactQuery = "(max-width: 800px)";
function observeViewport(listener: () => void) {
  const query = window.matchMedia(compactQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

export default function GraduationPhotoScene(props: Props) {
  const compact = useSyncExternalStore(observeViewport, () => window.matchMedia(compactQuery).matches, () => false);
  return <Canvas frameloop="demand" dpr={[1, compact ? 1.5 : 2]} camera={{ position: [0, 0, 9], fov: 36 }} gl={{ powerPreference: "low-power", antialias: true }}>
    <Suspense fallback={null}><Postcards {...props} /></Suspense>
  </Canvas>;
}
