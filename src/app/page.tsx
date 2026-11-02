"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  FileCheck2,
  HelpCircle,
  IndianRupee,
  LayoutDashboard,
  Lock,
  LogIn,
  RotateCw,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  SquareArrowOutUpRight,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import OptionIcon from "@/components/Icon";
import IntroVideo from "@/components/IntroVideo";
import Reveal from "@/components/Reveal";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

/** Home page text, in both languages. Kept short on purpose: the video and cards do the explaining. */
const C = {
  en: {
    badge: "Independent · Free · Hindi & English",
    h1a: "Get the government benefits",
    h1b: "you deserve.",
    sub: "Answer 8 simple questions. See every scheme you qualify for, and exactly how to get it.",
    chips: ["Always free", "Never asks for OTP or Aadhaar", "Official links only"],
    doTitle: "What HaqSaathi does",
    doSub: "Tap a card to turn it",
    hoverHint: "Hover or tap",
    cards: [
      ["Find", "Every scheme for you", "Answer 8 easy questions about your family. We check them against each scheme's official rules."],
      ["Understand", "In simple words", "No legal language. Read or listen in Hindi or English: what you get, who can apply, and how."],
      ["Prepare", "The right documents", "An exact checklist of papers before you go, so your form is not rejected for a small mistake."],
      ["Apply", "On the official site", "Step-by-step help and the official government link. No agents. No fees."],
    ],
    flowTitle: "How it works",
    flowSub: "About 2 minutes, start to finish",
    flow: ["You answer", "HaqSaathi checks the rules", "You get your list"],
    madeFor: "Made for every Indian family",
    ctaTitle: "Find your benefits today",
    ctaSub: "2 minutes. Free. In your language.",
    faq: "Questions? Read the FAQ",
  },
  hi: {
    badge: "स्वतंत्र · मुफ्त · हिंदी और अंग्रेज़ी",
    h1a: "अपने हक़ की सरकारी योजनाएं",
    h1b: "आसानी से पाएं।",
    sub: "8 आसान सवालों के जवाब दें। देखें आप किन योजनाओं के पात्र हैं, और उन्हें कैसे पाएं।",
    chips: ["हमेशा मुफ्त", "OTP या आधार कभी नहीं मांगते", "सिर्फ आधिकारिक लिंक"],
    doTitle: "हक़साथी क्या करता है",
    doSub: "कार्ड पलटने के लिए टैप करें",
    hoverHint: "टैप करें",
    cards: [
      ["खोजें", "आपकी हर योजना", "अपने परिवार के बारे में 8 आसान सवालों के जवाब दें। हम उन्हें हर योजना के आधिकारिक नियमों से मिलाते हैं।"],
      ["समझें", "आसान भाषा में", "कोई कठिन कानूनी भाषा नहीं। हिंदी या अंग्रेज़ी में पढ़ें या सुनें: क्या मिलेगा, कौन आवेदन कर सकता है, कैसे।"],
      ["तैयारी", "सही दस्तावेज़", "जाने से पहले कागज़ों की पूरी सूची, ताकि छोटी सी गलती पर फॉर्म रद्द न हो।"],
      ["आवेदन", "आधिकारिक साइट पर", "कदम-दर-कदम मदद और आधिकारिक सरकारी लिंक। कोई एजेंट नहीं। कोई फीस नहीं।"],
    ],
    flowTitle: "यह कैसे काम करता है",
    flowSub: "शुरू से अंत तक लगभग 2 मिनट",
    flow: ["आप जवाब दें", "हक़साथी नियम जांचता है", "आपको सूची मिलती है"],
    madeFor: "हर भारतीय परिवार के लिए",
    ctaTitle: "आज ही अपने लाभ जानें",
    ctaSub: "2 मिनट। मुफ्त। आपकी भाषा में।",
    faq: "सवाल हैं? FAQ पढ़ें",
  },
};

const CARD_ICONS: LucideIcon[] = [SearchCheck, BookOpenText, FileCheck2, SquareArrowOutUpRight];
const FLOW_ICONS: LucideIcon[] = [UserRound, Sparkles, BadgeCheck];
const CHIP_ICONS: LucideIcon[] = [IndianRupee, Lock, ShieldCheck];

export default function HomePage() {
  const { t, tr, lang } = useLang();
  const { user } = useAuth();
  const c = C[lang];

  return (
    <div className="overflow-x-hidden">
      {/* ---------------- Hero: headline + intro video ---------------- */}
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="animate-aurora pointer-events-none absolute -left-40 -top-40 -z-10 h-[38rem] w-[38rem] rounded-full bg-brand-600/40 blur-[130px]" />
        <div className="animate-aurora pointer-events-none absolute -bottom-48 right-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-accent-400/15 blur-[120px] [animation-delay:-9s]" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-12 md:pb-28 md:pt-20 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-brand-100">
              <ShieldCheck className="h-4 w-4 text-accent-400" /> {c.badge}
            </p>
            <h1 className="animate-fade-up mt-6 text-4xl font-extrabold leading-[1.08] [animation-delay:100ms] sm:text-5xl lg:text-[3.5rem]">
              {c.h1a} <span className="bg-gradient-to-r from-accent-400 to-amber-200 bg-clip-text text-transparent">{c.h1b}</span>
            </h1>
            <p className="animate-fade-up mt-6 max-w-lg text-lg leading-relaxed text-brand-100/85 [animation-delay:200ms]">{c.sub}</p>
            <div className="animate-fade-up mt-8 flex flex-col gap-3 [animation-delay:300ms] sm:flex-row">
              <Link
                href="/check"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent-400 px-7 py-4 text-lg font-bold text-brand-950 shadow-lg shadow-accent-400/25 transition hover:-translate-y-0.5 hover:bg-accent-500"
              >
                <span className="animate-shine pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.45)_50%,transparent_65%)] bg-[length:200%_100%]" />
                <span className="relative">{t("hero_cta")}</span>
                <ArrowRight className="relative h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href={user ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                {user ? <LayoutDashboard className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                {user ? t("nav_dashboard") : t("login")}
              </Link>
            </div>
            <ul className="animate-fade-up mt-8 flex flex-wrap gap-2 [animation-delay:400ms]">
              {c.chips.map((chip, i) => {
                const Icon = CHIP_ICONS[i];
                return (
                  <li key={chip} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-sm text-brand-100/85 ring-1 ring-white/10">
                    <Icon className="h-3.5 w-3.5 text-accent-400" /> {chip}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="animate-fade-up [animation-delay:250ms]">
            <IntroVideo />
          </div>
        </div>
      </section>

      {/* ---------------- What we do: flip cards ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20 md:pt-28">
        <Reveal className="text-center">
          <h2 className="text-3xl font-extrabold text-brand-950 md:text-4xl">{c.doTitle}</h2>
          <p className="mt-2 inline-flex items-center gap-1.5 text-slate-500">
            <RotateCw className="h-4 w-4" /> {c.doSub}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.cards.map(([title, short, back], i) => (
            <Reveal key={title} delay={i * 110}>
              <FlipCard index={i} icon={CARD_ICONS[i]} title={title} short={short} back={back} hint={c.hoverHint} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- How it works: animated flow ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-24 md:pt-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-950 px-6 py-12 text-white md:px-12 md:py-16">
            <div className="bg-grid pointer-events-none absolute inset-0" />
            <div className="animate-aurora pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-brand-600/40 blur-[110px]" />
            <div className="relative text-center">
              <h2 className="text-3xl font-extrabold md:text-4xl">{c.flowTitle}</h2>
              <p className="mt-2 text-brand-100/75">{c.flowSub}</p>
            </div>

            <div className="relative mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-3 md:gap-4">
              {/* connecting line with travelling lights (desktop) */}
              <div className="absolute left-[16.6%] right-[16.6%] top-10 hidden h-px bg-gradient-to-r from-white/10 via-white/30 to-white/10 md:block">
                {[0, 1.5, 3].map((d) => (
                  <span
                    key={d}
                    className="animate-travel absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-accent-400 shadow-[0_0_14px_4px_rgba(242,181,68,0.7)]"
                    style={{ animationDelay: `${d}s` }}
                  />
                ))}
              </div>
              {c.flow.map((label, i) => {
                const Icon = FLOW_ICONS[i];
                return (
                  <div key={label} className="relative flex flex-col items-center text-center">
                    <span className="relative flex h-20 w-20 items-center justify-center">
                      <span className="animate-ping-slow absolute inset-0 rounded-full bg-accent-400/20" style={{ animationDelay: `${i * 0.8}s` }} />
                      <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-brand-900 text-accent-400 shadow-xl shadow-black/30">
                        <Icon className="h-8 w-8" strokeWidth={1.6} />
                      </span>
                    </span>
                    <span className="mt-2 text-xs font-bold text-accent-400">0{i + 1}</span>
                    <p className="mt-1 text-lg font-semibold">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- Made for: scrolling strip ---------------- */}
      <section className="pt-24 md:pt-32">
        <Reveal className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-extrabold text-brand-950">{c.madeFor}</h2>
        </Reveal>
        <div className="mask-fade-x mt-8 overflow-hidden">
          <div className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
            {[...SCHEME_CATEGORIES, ...SCHEME_CATEGORIES].map((cat, i) => (
              <Link
                key={`${cat.id}-${i}`}
                href={`/schemes?category=${cat.id}`}
                aria-hidden={i >= SCHEME_CATEGORIES.length}
                tabIndex={i >= SCHEME_CATEGORIES.length ? -1 : 0}
                className="group flex shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-white py-2.5 pl-2.5 pr-5 transition hover:border-brand-300 hover:shadow-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition group-hover:bg-brand-900 group-hover:text-accent-400">
                  <OptionIcon id={cat.id} className="h-4 w-4" />
                </span>
                <span className="font-semibold text-slate-800">{tr(cat.label)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Final call to action ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-24 md:pt-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-400 to-amber-300 p-8 text-center text-brand-950 md:p-14">
            <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
            <h2 className="relative text-3xl font-extrabold md:text-4xl">{c.ctaTitle}</h2>
            <p className="relative mt-3 text-brand-900/80">{c.ctaSub}</p>
            <Link
              href="/check"
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-950 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-900"
            >
              {t("hero_cta")} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </Reveal>
        <p className="mt-8 text-center">
          <Link href="/about#faq" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
            <HelpCircle className="h-4 w-4" /> {c.faq}
          </Link>
        </p>
      </section>
    </div>
  );
}

/** A card that turns over (hover on desktop, tap on phones) to show a one-line explanation. */
function FlipCard({ index, icon: Icon, title, short, back, hint }: { index: number; icon: LucideIcon; title: string; short: string; back: string; hint: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${title}: ${back}`}
      className={`flip block h-64 w-full text-left sm:h-72 ${flipped ? "is-flipped" : ""}`}
    >
      <div className="flip-inner">
        {/* front */}
        <div className="flip-face flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand-50" />
          <div className="relative flex items-start justify-between">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-900 text-accent-400 shadow-lg shadow-brand-900/20">
              <Icon className="h-7 w-7" strokeWidth={1.7} />
            </span>
            <span className="text-5xl font-extrabold text-brand-100">0{index + 1}</span>
          </div>
          <div className="relative">
            <h3 className="text-2xl font-extrabold text-brand-950">{title}</h3>
            <p className="mt-1 text-slate-500">{short}</p>
            <p className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-accent-700">
              <RotateCw className="h-3.5 w-3.5" /> {hint}
            </p>
          </div>
        </div>
        {/* back */}
        <div className="flip-face flip-back flex flex-col justify-between overflow-hidden rounded-2xl bg-brand-900 p-6 text-white shadow-xl shadow-brand-900/30">
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-accent-400/20 blur-2xl" />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400 text-brand-950">
            <Icon className="h-5 w-5" />
          </span>
          <p className="relative text-lg font-medium leading-relaxed">{back}</p>
          <span className="relative text-sm font-bold text-accent-400">
            0{index + 1} · {title}
          </span>
        </div>
      </div>
    </button>
  );
}
