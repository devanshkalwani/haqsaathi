"use client";

import { useRef } from "react";
import { useLang } from "@/lib/i18n";

/**
 * The 3D-looking picture on the home page: a phone showing results,
 * with benefit cards floating around it. Pure CSS (no 3D library),
 * so it stays light on cheap phones. Tilts gently with the mouse on desktop.
 */
export default function HeroScene() {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const hi = lang === "hi";

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "rotateY(-12deg) rotateX(6deg)";
  };

  return (
    <div className="perspective relative mx-auto h-[440px] w-full max-w-md select-none" onMouseMove={onMove} onMouseLeave={onLeave} aria-hidden>
      {/* Orbit rings */}
      <div className="animate-spin-slow absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20" />
      <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div
        ref={ref}
        className="preserve-3d absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: "rotateY(-12deg) rotateX(6deg)" }}
      >
        {/* Phone */}
        <div
          className="absolute left-1/2 top-1/2 w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-[2.2rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl shadow-black/40"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="overflow-hidden rounded-[1.7rem] bg-paper">
            <div className="flex items-center justify-between bg-brand-700 px-4 py-3 text-[10px] font-bold text-white">
              <span>HaqSaathi</span>
              <span>9:41</span>
            </div>
            <div className="space-y-2 p-3">
              <p className="text-[11px] font-bold text-ink">{hi ? "आपके लिए 5 योजनाएं 🎉" : "5 schemes for you 🎉"}</p>
              {[
                ["🏥", hi ? "आयुष्मान भारत" : "Ayushman Bharat", "₹5,00,000"],
                ["🌾", hi ? "पीएम-किसान" : "PM-KISAN", "₹6,000"],
                ["🏠", hi ? "पीएम आवास" : "PM Awas", "₹1,20,000"],
                ["🧓", hi ? "अटल पेंशन" : "Atal Pension", "₹5,000/mo"],
              ].map(([icon, name, amt]) => (
                <div key={name} className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-sm">{icon}</span>
                  <span className="flex-1 text-[10px] font-semibold text-ink">{name}</span>
                  <span className="text-[9px] font-bold text-brand-700">{amt}</span>
                </div>
              ))}
              <div className="animate-shine rounded-xl bg-[linear-gradient(110deg,#fbbf24,45%,#fde68a,55%,#fbbf24)] bg-[length:200%_100%] py-2 text-center text-[10px] font-bold text-brand-900">
                {hi ? "आवेदन कैसे करें →" : "How to apply →"}
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <Float className="left-0 top-6" depth={90} rotate="-6deg" anim="animate-float">
          <span className="text-xl">💰</span>
          <span>
            <b className="block text-sm">₹6,000 / {hi ? "साल" : "year"}</b>
            <span className="text-[11px] text-gray-500">{hi ? "किसान सम्मान निधि" : "PM-KISAN"}</span>
          </span>
        </Float>
        <Float className="right-0 top-20" depth={120} rotate="5deg" anim="animate-float-delay">
          <span className="text-xl">✅</span>
          <span>
            <b className="block text-sm">{hi ? "आप पात्र हैं" : "You qualify"}</b>
            <span className="text-[11px] text-gray-500">{hi ? "2 मिनट में पता करें" : "Found in 2 minutes"}</span>
          </span>
        </Float>
        <Float className="bottom-16 left-2" depth={110} rotate="4deg" anim="animate-float-slow">
          <span className="text-xl">📄</span>
          <span>
            <b className="block text-sm">{hi ? "दस्तावेज़ 4/5" : "Documents 4/5"}</b>
            <span className="mt-1 block h-1.5 w-20 rounded-full bg-gray-200">
              <span className="block h-1.5 w-4/5 rounded-full bg-brand-600" />
            </span>
          </span>
        </Float>
        <Float className="bottom-4 right-4" depth={80} rotate="-4deg" anim="animate-float">
          <span className="text-xl">🎙️</span>
          <b className="text-sm">{hi ? "बोलकर पूछें" : "Ask by voice"}</b>
        </Float>

        {/* Glowing dots */}
        <span className="animate-float absolute left-[18%] top-[48%] h-3 w-3 rounded-full bg-accent-400 shadow-[0_0_20px_6px_rgba(251,191,36,0.6)]" />
        <span className="animate-float-delay absolute right-[14%] top-[58%] h-2 w-2 rounded-full bg-brand-200 shadow-[0_0_16px_6px_rgba(153,246,228,0.6)]" />
      </div>
    </div>
  );
}

function Float({
  children,
  className,
  depth,
  rotate,
  anim,
}: {
  children: React.ReactNode;
  className: string;
  depth: number;
  rotate: string;
  anim: string;
}) {
  return (
    <div className={`absolute ${className}`} style={{ transform: `translateZ(${depth}px)` }}>
      <div
        className={`${anim} flex items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3 py-2.5 text-ink shadow-xl shadow-black/20 backdrop-blur`}
        style={{ "--r": rotate } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
