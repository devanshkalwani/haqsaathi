"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  FileCheck2,
  IndianRupee,
  LayoutDashboard,
  ListChecks,
  Lock,
  LogIn,
  PlayCircle,
  Plus,
  Quote,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  SquareArrowOutUpRight,
  X,
  type LucideIcon,
} from "lucide-react";
import OptionIcon from "@/components/Icon";
import IntroVideo from "@/components/IntroVideo";
import SchemeCard from "@/components/SchemeCard";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/data-context";
import { useLang, type UIKey } from "@/lib/i18n";

const STEPS: { icon: LucideIcon; t: UIKey; d: UIKey }[] = [
  { icon: SearchCheck, t: "step1_t", d: "step1_d" },
  { icon: ListChecks, t: "step2_t", d: "step2_d" },
  { icon: FileCheck2, t: "step3_t", d: "step3_d" },
  { icon: SquareArrowOutUpRight, t: "step4_t", d: "step4_d" },
];

const POPULAR = ["ayushman-bharat", "pm-kisan", "e-shram", "pmay-gramin", "post-matric-sc", "atal-pension"];

/** Text used only on the home page, in both languages. */
const C = {
  en: {
    badge: "Independent · Free · Hindi & English",
    h1a: "Find the government benefits",
    h1b: "you deserve.",
    watch: "12-second intro",
    kpiQ: "simple questions",
    kpiT: "minutes to see results",
    kpiS: "schemes explained",
    kpiC: "cost, always",
    whatEyebrow: "About HaqSaathi",
    helpsTitle: "Made for every Indian family",
    helpsSub: "Farmers, workers, students, women, elders and small business owners. Pick what fits you.",
    trustSub: "Built for safety from day one.",
    title1: "Your rights.",
    title2: "Your benefits.",
    title3: "Made simple.",
    sub: "Crores of Indians never get the government help they deserve, because the rules are confusing and the forms are hard. HaqSaathi finds every scheme you qualify for and shows you exactly how to get it.",
    whatTitle: "What is HaqSaathi?",
    whatBody:
      "HaqSaathi is a free helper, like a friend who knows every government scheme. You answer a few simple questions, and we show you the pensions, scholarships, health cover, housing help and loans you can get, in simple words.",
    lifeTitle: "How it changes your life",
    before: "Without HaqSaathi",
    after: "With HaqSaathi",
    beforeList: [
      "You don't know which schemes are for you",
      "Rules written in difficult language",
      "Pay agents ₹200–₹2,000 per form",
      "Many office visits, a day's wage lost each time",
      "Form rejected for a small mistake",
    ],
    afterList: [
      "See all your schemes in 2 minutes",
      "Everything explained in simple Hindi or English",
      "Free, always. No middlemen",
      "Exact document list before you go",
      "Step-by-step guide and the official link",
    ],
    storyQuote:
      "My husband works on construction sites and my daughter is in Class 10. I didn't know we could get a scholarship, a worker card and free hospital treatment.",
    storyName: "Sunita, domestic worker",
    storyNote: "Illustrative example",
    howTitle: "Four simple steps",
    faqTitle: "Common questions",
    faq: [
      ["Is this a government website?", "No. HaqSaathi is an independent project that explains government schemes simply. We always link to the official government website, where you apply."],
      ["Is it free?", "Yes. HaqSaathi is free for citizens, always. Never pay anyone who says they are from HaqSaathi."],
      ["Do I need to log in?", "No. You can use everything as a guest. Logging in saves your schemes so you can see them on any phone."],
      ["Do you ask for Aadhaar number or OTP?", "Never. We don't need your Aadhaar number, bank details, OTP or passwords."],
      ["Is the information correct?", "Every scheme shows its official source and the date we last checked it. If something looks wrong, tap 'Report a mistake'."],
    ],
    ctaTitle: "Find your benefits today",
    ctaSub: "2 minutes. Free. In your language.",
  },
  hi: {
    badge: "स्वतंत्र · मुफ्त · हिंदी और अंग्रेज़ी",
    h1a: "अपने हक़ की सरकारी योजनाएं",
    h1b: "आसानी से पाएं।",
    watch: "12 सेकंड का परिचय",
    kpiQ: "आसान सवाल",
    kpiT: "मिनट में नतीजे",
    kpiS: "योजनाएं आसान भाषा में",
    kpiC: "खर्च, हमेशा",
    whatEyebrow: "हक़साथी के बारे में",
    helpsTitle: "हर भारतीय परिवार के लिए",
    helpsSub: "किसान, मज़दूर, छात्र, महिलाएं, बुज़ुर्ग और छोटे व्यापारी। जो आप पर लागू हो, चुनें।",
    trustSub: "पहले दिन से सुरक्षा का ध्यान।",
    title1: "आपका हक़।",
    title2: "आपके लाभ।",
    title3: "अब आसान।",
    sub: "करोड़ों भारतीयों को वो सरकारी मदद नहीं मिलती जिसके वो हक़दार हैं, क्योंकि नियम उलझे हुए और फॉर्म कठिन हैं। हक़साथी आपकी हर योजना ढूंढता है और बताता है कि उसे कैसे पाएं।",
    whatTitle: "हक़साथी क्या है?",
    whatBody:
      "हक़साथी एक मुफ्त मददगार है, जैसे एक दोस्त जो हर सरकारी योजना जानता हो। आप कुछ आसान सवालों के जवाब दें, और हम आपको आसान भाषा में बताएंगे कि आपको कौन-सी पेंशन, छात्रवृत्ति, स्वास्थ्य बीमा, आवास मदद और लोन मिल सकते हैं।",
    lifeTitle: "आपकी ज़िंदगी कैसे बदलेगी",
    before: "हक़साथी के बिना",
    after: "हक़साथी के साथ",
    beforeList: [
      "पता नहीं कौन-सी योजना आपके लिए है",
      "नियम कठिन भाषा में लिखे हैं",
      "हर फॉर्म के लिए एजेंट को ₹200–₹2,000",
      "कई बार दफ्तर के चक्कर, हर बार दिन की मज़दूरी गई",
      "छोटी सी गलती पर फॉर्म रद्द",
    ],
    afterList: [
      "2 मिनट में अपनी सारी योजनाएं देखें",
      "सब कुछ आसान हिंदी या अंग्रेज़ी में",
      "हमेशा मुफ्त। कोई बिचौलिया नहीं",
      "जाने से पहले दस्तावेज़ों की पूरी सूची",
      "कदम-दर-कदम गाइड और आधिकारिक लिंक",
    ],
    storyQuote:
      "मेरे पति निर्माण स्थल पर काम करते हैं और बेटी 10वीं में है। मुझे नहीं पता था कि हमें छात्रवृत्ति, श्रमिक कार्ड और मुफ्त इलाज मिल सकता है।",
    storyName: "सुनीता, घरेलू कामगार",
    storyNote: "उदाहरण के लिए",
    howTitle: "चार आसान कदम",
    faqTitle: "आम सवाल",
    faq: [
      ["क्या यह सरकारी वेबसाइट है?", "नहीं। हक़साथी एक स्वतंत्र प्रोजेक्ट है जो सरकारी योजनाओं को आसान भाषा में समझाता है। आवेदन के लिए हम हमेशा आधिकारिक सरकारी वेबसाइट का लिंक देते हैं।"],
      ["क्या यह मुफ्त है?", "हां। हक़साथी नागरिकों के लिए हमेशा मुफ्त है। जो खुद को हक़साथी का बताकर पैसे मांगे, उसे कभी पैसे न दें।"],
      ["क्या लॉग इन ज़रूरी है?", "नहीं। आप मेहमान के रूप में सब कुछ इस्तेमाल कर सकते हैं। लॉग इन करने से आपकी योजनाएं किसी भी फोन पर दिखेंगी।"],
      ["क्या आप आधार नंबर या OTP मांगते हैं?", "कभी नहीं। हमें आपका आधार नंबर, बैंक जानकारी, OTP या पासवर्ड नहीं चाहिए।"],
      ["क्या जानकारी सही है?", "हर योजना का आधिकारिक स्रोत और आखिरी जांच की तारीख दी गई है। कुछ गलत लगे तो 'गलती बताएं' पर टैप करें।"],
    ],
    ctaTitle: "आज ही अपने लाभ जानें",
    ctaSub: "2 मिनट। मुफ्त। आपकी भाषा में।",
  },
};

export default function HomePage() {
  const { t, tr, lang } = useLang();
  const { user } = useAuth();
  const { schemes } = useData();
  const c = C[lang];
  const popular = POPULAR.map((id) => schemes.find((s) => s.id === id)).filter((s) => s !== undefined);

  return (
    <div className="overflow-x-hidden">
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand-700/40 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-accent-400/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-28 pt-12 md:pt-20 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-brand-100">
              <ShieldCheck className="h-4 w-4 text-accent-400" /> {c.badge}
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
              {c.h1a} <span className="text-accent-400">{c.h1b}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100/85">{c.sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/check"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent-400 px-7 py-4 text-lg font-bold text-brand-950 shadow-lg shadow-accent-400/20 transition hover:bg-accent-500"
              >
                {t("hero_cta")}
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={user ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                {user ? <LayoutDashboard className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                {user ? t("nav_dashboard") : t("login")}
              </Link>
            </div>
            <ul className="mt-8 grid gap-2.5 text-sm text-brand-100/80 sm:grid-cols-3">
              {(["trust_2", "trust_1", "stat_free"] as const).map((k, i) => {
                const Icon = [Lock, BadgeCheck, IndianRupee][i];
                return (
                  <li key={k} className="flex items-start gap-2">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                    {t(k)}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="animate-fade-up [animation-delay:150ms]">
            <IntroVideo />
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-brand-100/70">
              <PlayCircle className="h-4 w-4" /> {c.watch}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Key numbers (overlapping the hero) ---------------- */}
      <section className="relative z-10 mx-auto -mt-14 max-w-6xl px-4">
        <div className="grid grid-cols-2 divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-brand-900/5 md:grid-cols-4 md:divide-x">
          <Kpi big="8" small={c.kpiQ} />
          <Kpi big="2" small={c.kpiT} />
          <Kpi big={`${schemes.length}+`} small={c.kpiS} />
          <Kpi big="₹0" small={c.kpiC} />
        </div>
      </section>

      {/* ---------------- What is HaqSaathi ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <Eyebrow>{c.whatEyebrow}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold text-brand-950 md:text-4xl">{c.whatTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{c.whatBody}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <div key={s.t} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <s.icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="text-sm font-bold text-slate-300">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-brand-950">{t(s.t)}</h3>
                <p className="mt-1 text-slate-600">{t(s.d)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Before / After ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <h2 className="text-center text-3xl font-extrabold text-brand-950 md:text-4xl">{c.lifeTitle}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">{c.before}</p>
            <ul className="mt-5 space-y-4">
              {c.beforeList.map((x) => (
                <li key={x} className="flex gap-3 text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-brand-900 p-6 text-white md:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-400/15 blur-3xl" />
            <p className="relative text-sm font-bold uppercase tracking-wider text-accent-400">{c.after}</p>
            <ul className="relative mt-5 space-y-4">
              {c.afterList.map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-400 text-brand-950">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <figure className="mx-auto mt-6 flex max-w-3xl gap-4 rounded-2xl border border-slate-200 bg-white p-6">
          <Quote className="h-8 w-8 shrink-0 text-accent-400" />
          <div>
            <blockquote className="text-lg leading-relaxed text-slate-700">{c.storyQuote}</blockquote>
            <figcaption className="mt-3 text-sm">
              <span className="font-bold text-brand-900">{c.storyName}</span>
              <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">{c.storyNote}</span>
            </figcaption>
          </div>
        </figure>
      </section>

      {/* ---------------- Who it helps ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>{t("browse_title")}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold text-brand-950">{c.helpsTitle}</h2>
            <p className="mt-2 text-slate-600">{c.helpsSub}</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SCHEME_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/schemes?category=${cat.id}`}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-900 group-hover:text-accent-400">
                <OptionIcon id={cat.id} />
              </span>
              <span className="text-sm font-semibold leading-tight text-slate-800">{tr(cat.label)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- Popular schemes ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold text-brand-950">{t("popular_title")}</h2>
          <Link href="/schemes" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
            {t("see_all")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      </section>

      {/* ---------------- Trust ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <div className="grid gap-8 rounded-2xl bg-brand-50 p-6 md:grid-cols-[1fr_2fr] md:p-10">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-900 text-accent-400">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-brand-950">{t("trust_title")}</h2>
            <p className="mt-2 text-slate-600">{c.trustSub}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {(["trust_1", "trust_2", "trust_3"] as const).map((k, i) => {
              const Icon = [BadgeCheck, Lock, Smartphone][i];
              return (
                <li key={k} className="rounded-xl bg-white p-5">
                  <Icon className="h-6 w-6 text-brand-700" strokeWidth={1.8} />
                  <p className="mt-3 font-semibold text-slate-800">{t(k)}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="mx-auto max-w-3xl px-4 pt-24">
        <h2 className="text-center text-3xl font-extrabold text-brand-950">{c.faqTitle}</h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {c.faq.map(([q, a]) => (
            <details key={q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-slate-900">
                {q}
                <Plus className="h-5 w-5 shrink-0 text-brand-700 transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 leading-relaxed text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------------- Final call to action ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-24">
        <div className="relative overflow-hidden rounded-2xl bg-brand-950 p-8 text-center text-white md:p-14">
          <div className="bg-grid pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-[40rem] -translate-x-1/2 rounded-full bg-brand-700/50 blur-[90px]" />
          <h2 className="relative text-3xl font-extrabold md:text-4xl">{c.ctaTitle}</h2>
          <p className="relative mt-3 text-brand-100/80">{c.ctaSub}</p>
          <Link
            href="/check"
            className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-accent-400 px-8 py-4 text-lg font-bold text-brand-950 transition hover:bg-accent-500"
          >
            {t("hero_cta")} <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Kpi({ big, small }: { big: string; small: string }) {
  return (
    <div className="p-5 text-center md:p-6">
      <p className="text-3xl font-extrabold text-brand-900 md:text-4xl">{big}</p>
      <p className="mt-1 text-sm text-slate-500">{small}</p>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-bold uppercase tracking-wider text-accent-700">{children}</p>;
}
