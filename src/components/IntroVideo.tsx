"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

/**
 * 12-second 3D intro shown in the home page hero.
 * Rendered from code (Three.js) into small MP4 files (about 0.7 MB) in /public/intro, one per language.
 * Muted + playsInline so phones allow autoplay; a pause button respects people who don't want motion.
 */
export default function IntroVideo() {
  const { lang } = useLang();
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div className="relative">
      {/* soft glow behind the frame */}
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-accent-400/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-brand-950 shadow-2xl shadow-black/40 ring-1 ring-white/5">
        <video
          key={lang}
          ref={ref}
          className="block aspect-video w-full"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={`/intro/poster-${lang}.jpg`}
          aria-label={lang === "hi" ? "हक़साथी का 12 सेकंड का परिचय वीडियो" : "12-second introduction to HaqSaathi"}
        >
          <source src={`/intro/intro-${lang}.mp4`} type="video/mp4" />
        </video>
        <button
          onClick={toggle}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          aria-label={paused ? (lang === "hi" ? "चलाएं" : "Play") : lang === "hi" ? "रोकें" : "Pause"}
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
