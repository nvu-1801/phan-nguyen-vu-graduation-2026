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
 * Background music. It tries to autoplay on load; browsers that block audio
 * before a gesture fall back to starting on the first pointer/key press. A
 * saved "off" preference is respected and no autoplay is attempted.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const aliveRef = useRef(true);
  const enabledRef = useRef(false);
  const startRef = useRef<() => Promise<boolean>>(async () => false);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    aliveRef.current = true;
    audio.volume = TARGET_VOLUME;

    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    const wantsMusic = stored !== "off";
    enabledRef.current = wantsMusic;

    let removeGesture: (() => void) | null = null;

    const start = async () => {
      if (!enabledRef.current) return false;
      if (!audio.paused) return true;
      try {
        audio.volume = 0;
        await audio.play();
        if (!enabledRef.current) { audio.pause(); audio.volume = TARGET_VOLUME; return false; }
        fade(audio, frameRef, TARGET_VOLUME, undefined, () => aliveRef.current);
        return true;
      } catch {
        audio.volume = TARGET_VOLUME;
        return false;
      }
    };
    startRef.current = start;

    const playFromGesture = async () => {
      enabledRef.current = true;
      setEnabled(true);
      const started = await start();
      if (!started) {
        enabledRef.current = false;
        setEnabled(false);
        setNotice("Trình duyệt chưa cho phát nhạc. Bạn thử bấm nút nhạc nhé.");
        return;
      }
      setNotice("Đang phát nhạc nền. Bạn có thể tắt bất cứ lúc nào.");
    };

    const waitForGesture = () => {
      if (removeGesture) return;
      const onGesture = (event: Event) => {
        const target = event.target;
        if (target instanceof Element && target.closest(".music-toggle")) return;
        removeGesture?.();
        removeGesture = null;
        void playFromGesture();
      };
      window.addEventListener("pointerdown", onGesture, { passive: true });
      window.addEventListener("keydown", onGesture);
      removeGesture = () => {
        window.removeEventListener("pointerdown", onGesture);
        window.removeEventListener("keydown", onGesture);
      };
    };

    if (wantsMusic) {
      void start().then((started) => {
        if (!aliveRef.current) return;
        if (started) {
          setEnabled(true);
          setNotice("Đang phát nhạc nền. Bạn có thể tắt bất cứ lúc nào.");
          return;
        }
        // Autoplay blocked: reflect the real state and start on the first gesture.
        enabledRef.current = false;
        setEnabled(false);
        setNotice("Chạm vào trang để bật nhạc nền.");
        waitForGesture();
      });
    }

    let resumeWhenVisible = false;
    const onVisibility = () => {
      if (document.hidden) {
        resumeWhenVisible = !audio.paused;
        if (resumeWhenVisible) audio.pause();
      } else if (resumeWhenVisible && enabledRef.current) {
        resumeWhenVisible = false;
        void start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      removeGesture?.();
      document.removeEventListener("visibilitychange", onVisibility);
      aliveRef.current = false;
      startRef.current = async () => false;
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
      setNotice("Đã tắt nhạc nền. Lần sau trang sẽ không tự phát.");
      return;
    }

    enabledRef.current = true;
    setEnabled(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "on");
    } catch {
      // Ignore storage failures.
    }
    const started = await startRef.current();
    if (!started) {
      enabledRef.current = false;
      setEnabled(false);
      setNotice("Trình duyệt chưa cho phát nhạc. Bạn thử bấm lại nhé.");
      return;
    }
    setNotice("Đang phát nhạc nền. Bạn có thể tắt bất cứ lúc nào.");
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
      preload="auto"
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
