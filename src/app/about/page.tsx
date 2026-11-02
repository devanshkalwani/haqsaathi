"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useLang } from "@/lib/i18n";

const CONTENT = {
  en: {
    title: "About HaqSaathi",
    faqTitle: "Common questions",
    faq: [
      ["Is this a government website?", "No. HaqSaathi is an independent project that explains government schemes simply. We always link to the official government website, where you apply."],
      ["Is it free?", "Yes. HaqSaathi is free for citizens, always. Never pay anyone who says they are from HaqSaathi."],
      ["Do I need to log in?", "No. You can use everything as a guest. Logging in saves your schemes so you can see them on any phone."],
      ["Do you ask for Aadhaar number or OTP?", "Never. We don't need your Aadhaar number, bank details, OTP or passwords."],
      ["Is the information correct?", "Every scheme shows its official source and the date we last checked it. If something looks wrong, tap 'Report a mistake'."],
    ],
    blocks: [
      ["The problem", "India has thousands of government schemes. The money is already set aside, but many eligible families never receive it. They don't know about the schemes, the rules are hard to read, small document mistakes cause rejection, and middlemen charge money."],
      ["What we do", "HaqSaathi helps you find the schemes you qualify for, explains them in simple words, tells you exactly which documents you need, and guides you step by step to the official website or office."],
      ["Our promise", "Free for citizens, always. Every scheme links to its official source with the date we last checked it. We never ask for OTPs, bank PINs or money."],
      ["Important", "HaqSaathi is an independent project. It is not a government website. The final decision on any application is made by the government department."],
    ],
  },
  hi: {
    title: "हक़साथी के बारे में",
    faqTitle: "आम सवाल",
    faq: [
      ["क्या यह सरकारी वेबसाइट है?", "नहीं। हक़साथी एक स्वतंत्र प्रोजेक्ट है जो सरकारी योजनाओं को आसान भाषा में समझाता है। आवेदन के लिए हम हमेशा आधिकारिक सरकारी वेबसाइट का लिंक देते हैं।"],
      ["क्या यह मुफ्त है?", "हां। हक़साथी नागरिकों के लिए हमेशा मुफ्त है। जो खुद को हक़साथी का बताकर पैसे मांगे, उसे कभी पैसे न दें।"],
      ["क्या लॉग इन ज़रूरी है?", "नहीं। आप मेहमान के रूप में सब कुछ इस्तेमाल कर सकते हैं। लॉग इन करने से आपकी योजनाएं किसी भी फोन पर दिखेंगी।"],
      ["क्या आप आधार नंबर या OTP मांगते हैं?", "कभी नहीं। हमें आपका आधार नंबर, बैंक जानकारी, OTP या पासवर्ड नहीं चाहिए।"],
      ["क्या जानकारी सही है?", "हर योजना का आधिकारिक स्रोत और आखिरी जांच की तारीख दी गई है। कुछ गलत लगे तो 'गलती बताएं' पर टैप करें।"],
    ],
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
      <h1 className="text-3xl font-extrabold text-brand-950">{c.title}</h1>
      <div className="mt-6 space-y-4">
        {c.blocks.map(([h, p]) => (
          <section key={h} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-brand-900">{h}</h2>
            <p className="mt-2 leading-relaxed text-slate-600">{p}</p>
          </section>
        ))}
      </div>
      <h2 id="faq" className="mt-12 scroll-mt-24 text-2xl font-extrabold text-brand-950">{c.faqTitle}</h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
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
      <Link href="/check" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent-400 px-6 py-3.5 font-bold text-brand-950 hover:bg-accent-500">
        {t("hero_cta")} <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
