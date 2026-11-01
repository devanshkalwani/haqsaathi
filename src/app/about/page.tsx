"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

const CONTENT = {
  en: {
    title: "About HaqSaathi",
    blocks: [
      ["The problem", "India has thousands of government schemes. The money is already set aside, but many eligible families never receive it. They don't know about the schemes, the rules are hard to read, small document mistakes cause rejection, and middlemen charge money."],
      ["What we do", "HaqSaathi helps you find the schemes you qualify for, explains them in simple words, tells you exactly which documents you need, and guides you step by step to the official website or office."],
      ["Our promise", "Free for citizens, always. Every scheme links to its official source with the date we last checked it. We never ask for OTPs, bank PINs or money."],
      ["Important", "HaqSaathi is an independent project. It is not a government website. The final decision on any application is made by the government department."],
    ],
  },
  hi: {
    title: "हक़साथी के बारे में",
    blocks: [
      ["समस्या", "भारत में हज़ारों सरकारी योजनाएं हैं। पैसा पहले से तय है, लेकिन कई पात्र परिवारों तक नहीं पहुंचता। उन्हें योजनाओं का पता नहीं होता, नियम कठिन होते हैं, दस्तावेज़ की छोटी गलती से आवेदन रद्द हो जाता है, और बिचौलिए पैसे लेते हैं।"],
      ["हम क्या करते हैं", "हक़साथी आपको आपकी योजनाएं खोजने, उन्हें आसान भाषा में समझने, ज़रूरी दस्तावेज़ जानने और आधिकारिक वेबसाइट या कार्यालय तक कदम-दर-कदम पहुंचने में मदद करता है।"],
      ["हमारा वादा", "नागरिकों के लिए हमेशा मुफ्त। हर योजना का आधिकारिक स्रोत और आखिरी जांच की तारीख दी गई है। हम कभी OTP, बैंक PIN या पैसे नहीं मांगते।"],
      ["ज़रूरी सूचना", "हक़साथी एक स्वतंत्र प्रोजेक्ट है। यह सरकारी वेबसाइट नहीं है। किसी भी आवेदन पर अंतिम फैसला सरकारी विभाग करता है।"],
    ],
  },
};

export default function AboutPage() {
  const { lang, t } = useLang();
  const c = CONTENT[lang];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">{c.title}</h1>
      <div className="mt-6 space-y-4">
        {c.blocks.map(([h, p]) => (
          <section key={h} className="rounded-3xl border border-black/5 bg-white p-6">
            <h2 className="text-lg font-bold text-brand-800">{h}</h2>
            <p className="mt-2 text-gray-700">{p}</p>
          </section>
        ))}
      </div>
      <Link href="/check" className="mt-8 inline-block rounded-2xl bg-brand-700 px-6 py-3 font-bold text-white">
        {t("hero_cta")} →
      </Link>
    </div>
  );
}
