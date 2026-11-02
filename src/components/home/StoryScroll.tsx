"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FileText, Mic } from "lucide-react";
import Logo from "@/components/Logo";

type Step = { title: string; body: string };

const SCREENS = {
  en: {
    q: "How old are you?",
    opts: ["Below 18", "18 – 40", "40 – 60", "Above 60"],
    voice: "Or just speak",
    res: "You qualify for 4 schemes",
    rows: [
      ["Health cover", "up to ₹5,00,000"],
      ["Farmer support", "₹6,000 / year"],
      ["Old-age pension", "every month"],
    ],
    docs: "Keep these ready",
    docRows: ["Aadhaar card", "Bank passbook", "Land record", "Income certificate"],
  },
  hi: {
    q: "आपकी उम्र क्या है?",
    opts: ["18 से कम", "18 – 40", "40 – 60", "60 से ज़्यादा"],
    voice: "या बोलकर बताएं",
    res: "आप 4 योजनाओं के पात्र हैं",
    rows: [
      ["स्वास्थ्य बीमा", "₹5,00,000 तक"],
      ["किसान सहायता", "₹6,000 / साल"],
      ["वृद्धावस्था पेंशन", "हर महीने"],
    ],
    docs: "ये तैयार रखें",
    docRows: ["आधार कार्ड", "बैंक पासबुक", "ज़मीन का रिकॉर्ड", "आय प्रमाण पत्र"],
  },
};

/**
 * "How it works" told by scrolling: on desktop a phone stays pinned on the left and its screen
 * changes as each step on the right scrolls into the middle of the window.
 * On phones each step simply shows its own small screen.
 */
export default function StoryScroll({ steps, lang }: { steps: Step[]; lang: "en" | "hi" }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      {/* pinned phone (desktop) */}
      <div className="hidden lg:block">
        <div className="sticky top-28 flex justify-center">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-16 rounded-full bg-brand-500/15 blur-3xl" />
            <Phone screen={active} lang={lang} />
          </div>
        </div>
      </div>

      {/* steps */}
      <div>
        {steps.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-i={i}
            className="flex min-h-0 flex-col justify-center py-6 lg:min-h-[62vh] lg:py-0"
          >
            <div className={`transition-all duration-500 ${active === i ? "lg:opacity-100" : "lg:opacity-30"}`}>
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-colors duration-500 ${
                  active === i ? "bg-accent-400 text-brand-950" : "bg-white text-slate-500 ring-1 ring-slate-200"
                }`}
              >
                0{i + 1}
              </span>
              <h3 className="mt-5 text-3xl font-extrabold text-brand-950 md:text-4xl">{s.title}</h3>
              <p className="mt-3 max-w-md text-lg leading-relaxed text-slate-600">{s.body}</p>
              {/* small screen for phones */}
              <div className="mt-8 flex justify-center lg:hidden">
                <Phone screen={i} lang={lang} small />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Phone({ screen, lang, small = false }: { screen: number; lang: "en" | "hi"; small?: boolean }) {
  const c = SCREENS[lang];
  return (
    <div className={`relative rounded-[2.6rem] border-[7px] border-brand-950 bg-brand-950 shadow-2xl shadow-brand-950/40 ${small ? "w-64" : "w-[19rem]"}`}>
      <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-brand-950" />
      <div className={`relative overflow-hidden rounded-[2.1rem] bg-paper ${small ? "h-[27rem]" : "h-[36rem]"}`}>
        <div className="flex items-center gap-2 bg-brand-900 px-5 pb-4 pt-9 text-white">
          <Logo size={26} />
          <span className="font-extrabold">
            Haq<span className="text-accent-400">Saathi</span>
          </span>
        </div>
        {/* the three screens cross-fade */}
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            className={`absolute inset-x-0 bottom-0 top-[4.6rem] p-4 transition-all duration-700 ${
              screen === k ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
            }`}
            aria-hidden={screen !== k}
          >
            {k === 0 && (
              <>
                <div className="h-1.5 rounded-full bg-brand-100">
                  <div className="h-1.5 w-1/4 rounded-full bg-brand-600" />
                </div>
                <p className="mt-4 text-lg font-extrabold text-brand-950">{c.q}</p>
                <div className="mt-3 space-y-2">
                  {c.opts.map((o, i) => (
                    <div
                      key={o}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold ${i === 2 ? "border-brand-600 bg-brand-50 text-brand-900" : "border-slate-200 bg-white text-slate-700"}`}
                    >
                      {o}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-900 py-3 text-sm font-semibold text-white">
                  <Mic className="h-4 w-4 text-accent-400" /> {c.voice}
                </div>
              </>
            )}
            {k === 1 && (
              <>
                <p className="text-lg font-extrabold text-brand-950">{c.res}</p>
                <div className="mt-3 space-y-2">
                  {c.rows.map(([n, a]) => (
                    <div key={n} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-brand-950">{n}</span>
                        <span className="block text-xs font-semibold text-brand-700">{a}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-accent-400 py-3 text-center text-sm font-bold text-brand-950">→</div>
              </>
            )}
            {k === 2 && (
              <>
                <p className="text-lg font-extrabold text-brand-950">{c.docs}</p>
                <div className="mt-3 space-y-2">
                  {c.docRows.map((d, i) => (
                    <div key={d} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-100">
                      <FileText className="h-5 w-5 text-brand-700" />
                      <span className="flex-1 text-sm font-semibold text-slate-800">{d}</span>
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-md ${i < 3 ? "bg-emerald-600 text-white" : "border-2 border-slate-300"}`}
                      >
                        {i < 3 && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-1.5 rounded-full bg-slate-200">
                  <div className="h-1.5 w-3/4 rounded-full bg-emerald-600" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
