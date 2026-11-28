"use client";

import { useEffect, useRef, useState } from "react";
import { IconNote } from "./Icons";

const TRACK = "/audio/graduation-background-music.mp3";
const STORAGE_KEY = "vu-graduation-music";
const TARGET_VOLUME = 0.32;
const FADE_MS = 900;

function fade(
  audio: HTMLAudioElement,
  frame: { current: number | null },
  target: number,
  done?: () => void,
  isActive?: () => boolean,
) {
  if (frame.current !== null) cancelAnimationFrame(frame.current);
  const from = audio.volume;
  const started = performance.now();
  const step = (now: number) => {
    if (isActive && !isActive()) {
      frame.current = null;
      return;
    }
    const progress = Math.min(1, (now - started) / FADE_MS);
    const eased = progress * progress * (3 - 2 * progress);
    audio.volume = Math.min(1, Math.max(0, from + (target - from) * eased));
    if (progress < 1) {
      frame.current = requestAnimationFrame(step);
    } else {
      frame.current = null;
      done?.();
    }
  };
  frame.current = requestAnimationFrame(step);
}

function MusicIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return <span className="music-bars"><i /><i /><i /></span>;
  }
  return <IconNote size={22} />;
}

/**
 * Optional background music. It never autoplays: the first sound always follows
 * a click or key press, and a saved preference is only resumed on the next gesture.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const aliveRef = useRef(true);
  const enabledRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    aliveRef.current = true;
    audio.volume = TARGET_VOLUME;

    let restore = false;
    try {
      restore = window.localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      restore = false;
    }
    let syncTimer: number | undefined;
    if (restore) {
      enabledRef.current = true;
      // Reflect the saved preference after hydration without blocking the first paint.
      syncTimer = window.setTimeout(() => {
        if (enabledRef.current) setEnabled(true);
      }, 0);
    }

    const playSoftly = async () => {
      if (!enabledRef.current || !audio.paused) return false;
      try {
        audio.volume = 0;
        await audio.play();
        if (!enabledRef.current) { audio.pause(); audio.volume = TARGET_VOLUME; return false; }
        fade(audio, frameRef, TARGET_VOLUME, undefined, () => aliveRef.current);
        return true;
      } catch {
        audio.volume = TARGET_VOLUME;
        enabledRef.current = false;
        setEnabled(false);
        return false;
      }
    };

    // Browsers block audio before a gesture, so a stored preference waits for one.
    const onFirstGesture = () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      void playSoftly().then((started) => { if (started) setEnabled(true); });
    };
    if (restore) {
      window.addEventListener("pointerdown", onFirstGesture, { passive: true });
      window.addEventListener("keydown", onFirstGesture);
    }

    let resumeWhenVisible = false;
    const onVisibility = () => {
      if (document.hidden) {
        resumeWhenVisible = !audio.paused;
        if (resumeWhenVisible) audio.pause();
      } else if (resumeWhenVisible) {
        resumeWhenVisible = false;
        void playSoftly();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      document.removeEventListener("visibilitychange", onVisibility);
      if (syncTimer !== undefined) window.clearTimeout(syncTimer);
      aliveRef.current = false;
      audio.pause();
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabledRef.current) {
      enabledRef.current = false;
      setEnabled(false);
      try {
        window.localStorage.setItem(STORAGE_KEY, "off");
      } catch {
        // Storage can be unavailable in private browsing; the toggle still works.
      }
      fade(audio, frameRef, 0, () => audio.pause(), () => aliveRef.current);
      setNotice("Đã tắt nhạc nền.");
      return;
    }

    enabledRef.current = true;
    setEnabled(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "on");
    } catch {
      // Ignore storage failures.
    }
    try {
      audio.volume = 0;
      await audio.play();
      if (!enabledRef.current) { audio.pause(); audio.volume = TARGET_VOLUME; return; }
      fade(audio, frameRef, TARGET_VOLUME, undefined, () => aliveRef.current);
      setNotice("Đang phát nhạc nền. Bạn có thể tắt bất cứ lúc nào.");
    } catch {
      if (!enabledRef.current) return;
      enabledRef.current = false;
      setEnabled(false);
      audio.volume = TARGET_VOLUME;
      setNotice("Trình duyệt chưa cho phát nhạc. Bạn thử bấm lại nhé.");
    }
  };

  return <>
    <button
      type="button"
      className="dock-button music-toggle"
      aria-pressed={enabled}
      aria-label={enabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
      title={enabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
      onClick={toggle}
    >
      <MusicIcon playing={playing} />
      <span className="dock-label">{enabled ? "Tắt nhạc nền" : "Bật nhạc nền"}</span>
    </button>
    <span className="sr-only" role="status" aria-live="polite">{notice}</span>
    <audio
      ref={audioRef}
      className="music-audio"
      src={TRACK}
      loop
      preload="none"
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onError={() => {
        enabledRef.current = false;
        setEnabled(false);
        setPlaying(false);
        setNotice("Không tải được tệp nhạc nền.");
      }}
    />
  </>;
}
