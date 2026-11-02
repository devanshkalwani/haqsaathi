"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  FileCheck2,
  HelpCircle,
  IndianRupee,
  LayoutDashboard,
  Lock,
  LogIn,
  SearchCheck,
  ShieldCheck,
  SquareArrowOutUpRight,
  type LucideIcon,
} from "lucide-react";
import IntroVideo from "@/components/IntroVideo";
import Reveal from "@/components/Reveal";
import CategoryRail from "@/components/home/CategoryRail";
import CountUp from "@/components/home/CountUp";
import ExpandPanels from "@/components/home/ExpandPanels";
import StoryScroll from "@/components/home/StoryScroll";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/data-context";
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
    doSub: "Four simple things, done for you.",
    stats: ["simple questions", "minutes to your list", "schemes explained", "cost to you, always"],
    storyEyebrow: "How it works",
    storyTitle: "From questions to benefits, in three steps",
    story: [
      ["Answer 8 easy questions", "Tap or speak in Hindi or English. Age, work, family, income. Nothing secret, no Aadhaar number."],
      ["See what you qualify for", "HaqSaathi checks your answers against each scheme's official rules and shows how much you can get."],
      ["Get ready and apply", "An exact list of documents, simple steps, and the official link. No agents. No fees."],
    ],
    railTitle: "Made for every Indian family",
    railSub: "Pick what fits you and see the schemes",
    railCount: ["scheme", "schemes"] as [string, string],
    cards: [
      ["Find", "Every scheme for you", "Answer 8 easy questions about your family. We check them against each scheme's official rules."],
      ["Understand", "In simple words", "No legal language. Read or listen in Hindi or English: what you get, who can apply, and how."],
      ["Prepare", "The right documents", "An exact checklist of papers before you go, so your form is not rejected for a small mistake."],
      ["Apply", "On the official site", "Step-by-step help and the official government link. No agents. No fees."],
    ],
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
    doSub: "चार आसान काम, आपके लिए।",
    stats: ["आसान सवाल", "मिनट में आपकी सूची", "योजनाएं आसान भाषा में", "आपका खर्च, हमेशा"],
    storyEyebrow: "यह कैसे काम करता है",
    storyTitle: "सवालों से लाभ तक, तीन कदम में",
    story: [
      ["8 आसान सवालों के जवाब दें", "हिंदी या अंग्रेज़ी में टैप करें या बोलें। उम्र, काम, परिवार, आय। कोई गुप्त जानकारी नहीं, आधार नंबर नहीं।"],
      ["देखें आप किसके पात्र हैं", "हक़साथी आपके जवाबों को हर योजना के आधिकारिक नियमों से मिलाता है और बताता है कि कितना मिल सकता है।"],
      ["तैयारी करें और आवेदन करें", "दस्तावेज़ों की पूरी सूची, आसान कदम और आधिकारिक लिंक। कोई एजेंट नहीं। कोई फीस नहीं।"],
    ],
    railTitle: "हर भारतीय परिवार के लिए",
    railSub: "जो आप पर लागू हो, चुनें और योजनाएं देखें",
    railCount: ["योजना", "योजनाएं"] as [string, string],
    cards: [
      ["खोजें", "आपकी हर योजना", "अपने परिवार के बारे में 8 आसान सवालों के जवाब दें। हम उन्हें हर योजना के आधिकारिक नियमों से मिलाते हैं।"],
      ["समझें", "आसान भाषा में", "कोई कठिन कानूनी भाषा नहीं। हिंदी या अंग्रेज़ी में पढ़ें या सुनें: क्या मिलेगा, कौन आवेदन कर सकता है, कैसे।"],
      ["तैयारी", "सही दस्तावेज़", "जाने से पहले कागज़ों की पूरी सूची, ताकि छोटी सी गलती पर फॉर्म रद्द न हो।"],
      ["आवेदन", "आधिकारिक साइट पर", "कदम-दर-कदम मदद और आधिकारिक सरकारी लिंक। कोई एजेंट नहीं। कोई फीस नहीं।"],
    ],
    ctaTitle: "आज ही अपने लाभ जानें",
    ctaSub: "2 मिनट। मुफ्त। आपकी भाषा में।",
    faq: "सवाल हैं? FAQ पढ़ें",
  },
};

const CARD_ICONS: LucideIcon[] = [SearchCheck, BookOpenText, FileCheck2, SquareArrowOutUpRight];
const CHIP_ICONS: LucideIcon[] = [IndianRupee, Lock, ShieldCheck];

export default function HomePage() {
  const { t, lang } = useLang();
  const { schemes } = useData();
  const { user } = useAuth();
  const c = C[lang];

  return (
    <div className="overflow-x-clip">
      {/* ---------------- Hero: headline + intro video ---------------- */}
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="animate-aurora pointer-events-none absolute -left-40 -top-40 -z-10 h-[38rem] w-[38rem] rounded-full bg-brand-600/40 blur-[130px]" />
        <div className="animate-aurora pointer-events-none absolute -bottom-48 right-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-indigo-500/25 blur-[120px] [animation-delay:-9s]" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-32 pt-12 md:pb-40 md:pt-20 lg:grid-cols-[1fr_1.15fr]">
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

      {/* ---------------- Key numbers, overlapping the hero ---------------- */}
      <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-4">
        <Reveal>
          <div className="grid grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-2xl shadow-brand-950/10 ring-1 ring-slate-200 md:grid-cols-4">
            {[
              { n: 8, pre: "", suf: "" },
              { n: 2, pre: "", suf: "" },
              { n: schemes.length, pre: "", suf: "+" },
              { n: 0, pre: "₹", suf: "" },
            ].map((x, i) => (
              <div key={i} className={`group relative p-6 text-center transition-colors duration-300 hover:bg-brand-50/60 md:p-8 ${i % 2 === 0 ? "border-r border-slate-100" : ""} ${i < 2 ? "border-b border-slate-100 md:border-b-0" : ""} ${i === 1 ? "md:border-r" : ""}`}>
                <p className="text-4xl font-extrabold text-brand-950 md:text-5xl">
                  <CountUp to={x.n} prefix={x.pre} suffix={x.suf} />
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">{c.stats[i]}</p>
                <span className="absolute inset-x-8 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-accent-400 transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------------- What we do: hover-expanding panels ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-24 md:pt-32">
        <Reveal className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <h2 className="text-3xl font-extrabold text-brand-950 md:text-5xl">{c.doTitle}</h2>
          <p className="text-lg text-slate-500">{c.doSub}</p>
        </Reveal>
        <Reveal delay={100}>
          <ExpandPanels panels={c.cards.map(([title, short, body], i) => ({ icon: CARD_ICONS[i], title, short, body }))} />
        </Reveal>
      </section>

      {/* ---------------- How it works: pinned phone + scrolling steps ---------------- */}
      <section className="relative mt-24 bg-gradient-to-b from-brand-50/70 via-brand-50/40 to-transparent py-20 md:mt-32 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent-700">{c.storyEyebrow}</p>
            <h2 className="mt-3 text-3xl font-extrabold text-brand-950 md:text-5xl">{c.storyTitle}</h2>
          </Reveal>
          <div className="mt-10 lg:mt-4">
            <StoryScroll lang={lang} steps={c.story.map(([title, body]) => ({ title, body }))} />
          </div>
        </div>
      </section>

      {/* ---------------- Categories: swipeable rail ---------------- */}
      <section className="pt-20 md:pt-28">
        <Reveal>
          <CategoryRail title={c.railTitle} sub={c.railSub} countLabel={c.railCount} />
        </Reveal>
      </section>

      {/* ---------------- Final call to action ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20 md:pt-28">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-brand-950 px-6 py-14 text-center text-white md:px-14 md:py-20">
            <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
            <div className="animate-aurora pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-brand-600/50 blur-[100px]" />
            <div className="animate-aurora pointer-events-none absolute -bottom-24 -right-10 -z-10 h-72 w-72 rounded-full bg-sky-500/20 blur-[100px] [animation-delay:-8s]" />
            <h2 className="text-3xl font-extrabold md:text-5xl">{c.ctaTitle}</h2>
            <p className="mt-3 text-lg text-brand-100/80">{c.ctaSub}</p>
            <Link
              href="/check"
              className="group relative mt-9 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-accent-400 px-8 py-4 text-lg font-bold text-brand-950 shadow-lg shadow-accent-400/25 transition hover:-translate-y-0.5 hover:bg-accent-500"
            >
              <span className="animate-shine pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.45)_50%,transparent_65%)] bg-[length:200%_100%]" />
              <span className="relative">{t("hero_cta")}</span>
              <ArrowRight className="relative h-5 w-5 transition group-hover:translate-x-1" />
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
