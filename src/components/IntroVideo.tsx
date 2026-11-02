"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

/**
 * 12-second 3D intro with its own soundtrack (tanpura drone + santoor), shown in the home page hero.
 * Rendered from code in scripts/intro-video into small MP4 files (under 1 MB) in /public/intro, one per language.
 * Starts muted (browsers only autoplay silent video); "Sound on" restarts it with sound.
 */
export default function IntroVideo() {
  const { lang } = useLang();
  const hi = lang === "hi";
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
    setPaused(v.paused);
  };

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) {
      v.currentTime = 0; // play the whole intro with sound
      v.play();
      setPaused(false);
    }
    setMuted(v.muted);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-indigo-500/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-brand-950 shadow-2xl shadow-black/50 ring-1 ring-white/5">
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
          aria-label={hi ? "हक़साथी का 12 सेकंड का परिचय वीडियो" : "12-second introduction to HaqSaathi"}
        >
          <source src={`/intro/intro-${lang}.mp4`} type="video/mp4" />
        </video>
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={toggleSound}
            className="flex h-10 items-center gap-2 rounded-full bg-black/45 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/65"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {muted ? (hi ? "आवाज़ चालू करें" : "Sound on") : hi ? "आवाज़ बंद" : "Sound off"}
          </button>
          <button
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
            aria-label={paused ? (hi ? "चलाएं" : "Play") : hi ? "रोकें" : "Pause"}
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
