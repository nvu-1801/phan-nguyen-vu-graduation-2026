"use client";

import { useEffect, useRef, useState } from "react";
import { IconNote } from "./Icons";

const TRACK = "/audio/graduation-background-music.mp3";
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
 * Background music. Every fresh visit attempts to autoplay. Browsers that block
 * audible autoplay before a gesture start it on the first pointer, touch, key or
 * click anywhere on the page. The toggle only affects the current visit.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const aliveRef = useRef(true);
  const enabledRef = useRef(false);
  const userPausedRef = useRef(false);
  const startRef = useRef<() => Promise<boolean>>(async () => false);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    aliveRef.current = true;
    audio.volume = TARGET_VOLUME;

    const setMusicEnabled = (value: boolean) => {
      enabledRef.current = value;
      setEnabled(value);
    };

    const start = async () => {
      if (!audio.paused) return true;
      try {
        audio.volume = 0;
        await audio.play();
        fade(audio, frameRef, TARGET_VOLUME, undefined, () => aliveRef.current);
        return true;
      } catch {
        audio.volume = TARGET_VOLUME;
        return false;
      }
    };
    startRef.current = start;

    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("touchend", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("click", onGesture);
    };

    const onGesture = async (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".music-toggle")) return;
      if (userPausedRef.current) {
        removeGestureListeners();
        return;
      }
      if (!(await start())) {
        setNotice("Trình duyệt chưa cho phát nhạc. Chạm hoặc bấm nút nhạc để thử lại.");
        return;
      }
      removeGestureListeners();
      setMusicEnabled(true);
      setNotice("Đang phát nhạc nền. Bạn có thể tắt bất cứ lúc nào.");
    };

    // Registered before the autoplay attempt so an early scroll/touch is not missed.
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("touchstart", onGesture, { passive: true });
    window.addEventListener("touchend", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);
    window.addEventListener("click", onGesture);

    void start().then((started) => {
      if (!aliveRef.current || userPausedRef.current) return;
      if (started) {
        removeGestureListeners();
        setMusicEnabled(true);
        setNotice("Đang phát nhạc nền. Bạn có thể tắt bất cứ lúc nào.");
        return;
      }
      setNotice("Chạm vào trang để bật nhạc nền.");
    });

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
      removeGestureListeners();
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
      userPausedRef.current = true;
      enabledRef.current = false;
      setEnabled(false);
      fade(audio, frameRef, 0, () => audio.pause(), () => aliveRef.current);
      setNotice("Đã tắt nhạc nền.");
      return;
    }

    userPausedRef.current = false;
    const started = await startRef.current();
    if (!started) {
      setNotice("Trình duyệt chưa cho phát nhạc. Bạn thử bấm lại nhé.");
      return;
    }
    enabledRef.current = true;
    setEnabled(true);
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
