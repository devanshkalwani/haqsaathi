"use client";

import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

/**
 * 12-second 3D intro with its own flute soundtrack, shown in the home page hero.
 * Rendered from code in scripts/intro-video into small MP4 files in /public/intro, one per language.
 *
 * Plays once with sound and stops on the last frame (logo + tagline); "Watch again" replays it.
 * No timeline or timestamps, only a sound button on the side.
 * The parent renders it with key={lang}, so switching language starts the other video fresh.
 * Browsers block sound until the visitor has interacted with the site, so if that happens the video
 * plays silently and the first "Sound on" tap starts it again from the beginning with sound.
 */
export default function IntroVideo() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [blocked, setBlocked] = useState(false); // sound was blocked by the browser

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.play()
      .then(() => {
        setMuted(false);
        setBlocked(false);
      })
      .catch(() => {
        // Autoplay with sound not allowed yet: play silently instead.
        v.muted = true;
        setMuted(true);
        setBlocked(true);
        v.play().catch(() => setEnded(true));
      });
  }, []);

  const replay = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    v.play();
  };

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    // First tap after the browser blocked sound: start again so the whole intro is heard.
    if (!v.muted && blocked) {
      setBlocked(false);
      replay();
    }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-indigo-500/15 blur-3xl" />
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-brand-950 shadow-2xl shadow-black/50 ring-1 ring-white/5">
        <video
          ref={ref}
          className="block aspect-video w-full"
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          poster={`/intro/poster-${lang}.jpg`}
          onEnded={() => setEnded(true)}
          onContextMenu={(e) => e.preventDefault()}
          aria-label={t("video_label")}
        >
          <source src={`/intro/intro-${lang}.mp4`} type="video/mp4" />
        </video>

        {/* Replay, shown over the last frame once the intro has finished */}
        <div
          className={`absolute inset-x-0 bottom-0 flex justify-center pb-5 transition-opacity duration-500 ${ended ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <button
            onClick={replay}
            tabIndex={ended ? 0 : -1}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand-950 shadow-xl shadow-black/30 transition hover:scale-105"
          >
            <RotateCcw className="h-4 w-4" /> {t("video_replay")}
          </button>
        </div>

        {/* Sound on / off, on the side */}
        <button
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? t("sound_on") : t("sound_off")}
          className={`absolute right-3 top-3 flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold backdrop-blur transition ${
            muted ? "bg-accent-400 text-brand-950 hover:bg-accent-500" : "bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          <span className={muted ? "" : "sr-only sm:not-sr-only"}>{muted ? t("sound_on") : t("sound_off")}</span>
        </button>
      </div>
    </div>
  );
}
