"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useSystemReducedMotion } from "../../vendor/motion-kit/MotionPreferences";

const Scene = dynamic(() => import("./GraduationPhotoScene"), { ssr: false });

class MotionBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function PhotoStage({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useSystemReducedMotion();
  const [nearby, setNearby] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || reduced || !root.current || !("IntersectionObserver" in window)) return;
    const element = root.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearby(true);
        observer.disconnect();
      }
    }, { rootMargin: "1200px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, reduced]);

  const active = enabled && nearby && !reduced && !failed;
  return <div ref={root} className={`photo-stage${active && ready ? " photo-stage-live" : ""}`}>
    <div className="stage-sticky">
      <div className="photo-poster">{children}</div>
      {active && <div className="photo-canvas" aria-hidden="true">
        <MotionBoundary onFailure={() => setFailed(true)}>
          <Scene root={root} onReady={() => setReady(true)} onFailure={() => setFailed(true)} />
        </MotionBoundary>
      </div>}
    </div>
  </div>;
}
