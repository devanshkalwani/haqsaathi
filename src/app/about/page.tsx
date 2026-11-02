"use client";

import Link from "next/link";
import { ArrowRight, Compass, HandHeart, Info, Plus, TriangleAlert, type LucideIcon } from "lucide-react";
import { PageHero, btn, card } from "@/components/ui";
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

const BLOCK_ICONS: LucideIcon[] = [TriangleAlert, Compass, HandHeart, Info];

export default function AboutPage() {
  const { lang, t } = useLang();
  const c = CONTENT[lang];
  return (
    <div>
      <PageHero icon={Info} title={c.title} sub={t("tagline")} narrow />
      <div className="mx-auto max-w-4xl px-4">
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {c.blocks.map(([h, p], i) => {
            const Icon = BLOCK_ICONS[i];
            return (
              <section key={h} className={`${card} p-6`}>
                <h2 className="flex items-center gap-3 text-lg font-bold text-fg">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tint text-link">
                    <Icon className="h-5 w-5" />
                  </span>
                  {h}
                </h2>
                <p className="mt-3 leading-relaxed text-fg-2">{p}</p>
              </section>
            );
          })}
        </div>

        <h2 id="faq" className="mt-14 scroll-mt-24 text-2xl font-extrabold text-fg md:text-3xl">
          {c.faqTitle}
        </h2>
        <div className={`${card} mt-5 divide-y divide-line`}>
          {c.faq.map(([q, a]) => (
            <details key={q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-fg">
                {q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tint text-link transition group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-fg-2">{a}</p>
            </details>
          ))}
        </div>
        <Link href="/check" className={`${btn.accent} mt-10`}>
          {t("hero_cta")} <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
