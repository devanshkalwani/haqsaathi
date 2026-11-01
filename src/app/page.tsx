"use client";

import Link from "next/link";
import HeroScene from "@/components/HeroScene";
import SchemeCard from "@/components/SchemeCard";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/data-context";
import { useLang, type UIKey } from "@/lib/i18n";

const STEPS: { icon: string; t: UIKey; d: UIKey }[] = [
  { icon: "🔎", t: "step1_t", d: "step1_d" },
  { icon: "📖", t: "step2_t", d: "step2_d" },
  { icon: "📄", t: "step3_t", d: "step3_d" },
  { icon: "✅", t: "step4_t", d: "step4_d" },
];

const POPULAR = ["ayushman-bharat", "pm-kisan", "e-shram", "pmay-gramin", "post-matric-sc", "atal-pension"];

/** Text used only on the home page, in both languages. */
const C = {
  en: {
    badge: "Free · Hindi & English · No middlemen",
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
    storyName: "Sunita, domestic worker (example)",
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
    badge: "मुफ्त · हिंदी और अंग्रेज़ी · कोई बिचौलिया नहीं",
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
    storyName: "सुनीता, घरेलू कामगार (उदाहरण)",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="animate-float-slow pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-accent-400/20 blur-3xl" />
        <div className="animate-float-delay pointer-events-none absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-brand-500/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pb-16 pt-12 md:grid-cols-2 md:pb-24 md:pt-20">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400" /> {c.badge}
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] sm:text-5xl md:text-6xl">
              {c.title1}
              <br />
              {c.title2}
              <br />
              <span className="bg-gradient-to-r from-accent-400 to-amber-200 bg-clip-text text-transparent">{c.title3}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">{c.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/check"
                className="rounded-2xl bg-accent-400 px-7 py-4 text-lg font-bold text-brand-900 shadow-lg shadow-accent-400/30 transition hover:-translate-y-0.5 hover:bg-accent-500"
              >
                {t("hero_cta")} →
              </Link>
              <Link
                href={user ? "/dashboard" : "/login"}
                className="rounded-2xl border border-white/30 bg-white/5 px-6 py-4 font-semibold backdrop-blur transition hover:bg-white/15"
              >
                {user ? `📊 ${t("nav_dashboard")}` : `🔐 ${t("login")}`}
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/60">⏱️ {t("hero_cta_time")}</p>
          </div>

          <HeroScene />
        </div>

        {/* Wave into the page */}
        <svg className="absolute bottom-0 left-0 w-full text-paper" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* ---------------- What is HaqSaathi ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="grid items-center gap-8 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:grid-cols-[1fr_1.4fr] md:p-10">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-700 text-3xl shadow-lg shadow-brand-700/30">🤝</span>
            <h2 className="text-2xl font-extrabold md:text-3xl">{c.whatTitle}</h2>
          </div>
          <p className="text-lg leading-relaxed text-gray-700">{c.whatBody}</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat big={`${schemes.length}+`} small={t("stat_schemes")} />
          <Stat big="₹0" small={t("stat_free")} />
          <Stat big="अ / A" small={t("stat_lang")} />
        </div>
      </section>

      {/* ---------------- Before / After ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="text-center text-3xl font-extrabold">{c.lifeTitle}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] border border-rose-100 bg-rose-50/60 p-6 md:p-8">
            <p className="text-lg font-bold text-rose-800">😟 {c.before}</p>
            <ul className="mt-4 space-y-3">
              {c.beforeList.map((x) => (
                <li key={x} className="flex gap-3 text-gray-700">
                  <span className="mt-0.5 text-rose-500">✕</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-600 p-6 text-white shadow-xl shadow-brand-700/20 md:p-8">
            <div className="animate-float-slow absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-400/25 blur-2xl" />
            <p className="relative text-lg font-bold">😊 {c.after}</p>
            <ul className="relative mt-4 space-y-3">
              {c.afterList.map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="mt-0.5 text-accent-400">✔</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <figure className="mx-auto mt-6 max-w-3xl rounded-[2rem] bg-amber-50 p-6 text-center">
          <blockquote className="text-lg italic text-amber-950">“{c.storyQuote}”</blockquote>
          <figcaption className="mt-3 text-sm font-semibold text-amber-800">— {c.storyName}</figcaption>
        </figure>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="text-center text-3xl font-extrabold">{c.howTitle}</h2>
        <div className="relative mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-8 hidden h-0.5 bg-gradient-to-r from-brand-200 via-brand-500 to-accent-400 md:block" />
          {STEPS.map((s, i) => (
            <div key={s.t} className="relative flex flex-col items-center text-center">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-black/5 bg-white text-3xl shadow-md">
                {s.icon}
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-4 text-lg font-bold">{t(s.t)}</h3>
              <p className="mt-1 text-sm text-gray-600">{t(s.d)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="text-2xl font-extrabold">{t("browse_title")}</h2>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-9">
          {SCHEME_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/schemes?category=${cat.id}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-white p-4 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl transition group-hover:scale-110 ${cat.color}`}>{cat.icon}</span>
              <span className="text-xs font-semibold leading-tight">{tr(cat.label)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- Popular schemes ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold">{t("popular_title")}</h2>
          <Link href="/schemes" className="text-sm font-semibold text-brand-700 hover:underline">
            {t("see_all")} →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      </section>

      {/* ---------------- Trust ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="rounded-[2rem] bg-brand-50 p-6 md:p-10">
          <h2 className="text-2xl font-extrabold text-brand-900">{t("trust_title")}</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {(["trust_1", "trust_2", "trust_3"] as const).map((k, i) => (
              <li key={k} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <span className="text-2xl">{["🔗", "🔒", "📱"][i]}</span>
                <span className="font-medium">{t(k)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="mx-auto max-w-3xl px-4 pt-20">
        <h2 className="text-center text-3xl font-extrabold">{c.faqTitle}</h2>
        <div className="mt-8 space-y-3">
          {c.faq.map(([q, a]) => (
            <details key={q} className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {q}
                <span className="text-brand-700 transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-gray-700">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------------- Final call to action ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-800 to-brand-600 p-8 text-center text-white md:p-14">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="animate-float pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-accent-400/30 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold md:text-4xl">{c.ctaTitle}</h2>
          <p className="relative mt-2 text-white/80">{c.ctaSub}</p>
          <Link
            href="/check"
            className="relative mt-6 inline-block rounded-2xl bg-accent-400 px-8 py-4 text-lg font-bold text-brand-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-accent-500"
          >
            {t("hero_cta")} →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4">
      <span className="text-2xl font-extrabold text-brand-700">{big}</span>
      <span className="text-sm text-gray-600">{small}</span>
    </div>
  );
}
