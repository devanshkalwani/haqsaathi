"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { storage } from "@/lib/storage";

const CONTENT = {
  en: {
    title: "Privacy",
    points: [
      "Your quiz answers, saved schemes and checklist are stored only in this browser on your device.",
      "We do not ask for or store your Aadhaar number, bank details, OTPs or passwords.",
      "Questions you send to Saathi are used only to answer you.",
      "You can delete everything saved on this device at any time with the button below.",
      "We follow India's Digital Personal Data Protection (DPDP) Act, 2023.",
    ],
    clear: "Delete my data from this device",
    cleared: "Done. Your data has been deleted.",
  },
  hi: {
    title: "गोपनीयता",
    points: [
      "आपके क्विज़ के जवाब, सेव योजनाएं और सूची सिर्फ आपके डिवाइस के इसी ब्राउज़र में रहती हैं।",
      "हम आपका आधार नंबर, बैंक जानकारी, OTP या पासवर्ड न मांगते हैं, न रखते हैं।",
      "साथी को भेजे गए सवाल सिर्फ आपको जवाब देने के लिए उपयोग होते हैं।",
      "नीचे दिए बटन से आप कभी भी इस डिवाइस का सारा डेटा मिटा सकते हैं।",
      "हम भारत के डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम, 2023 का पालन करते हैं।",
    ],
    clear: "इस डिवाइस से मेरा डेटा मिटाएं",
    cleared: "हो गया। आपका डेटा मिटा दिया गया है।",
  },
};

export default function PrivacyPage() {
  const { lang } = useLang();
  const [done, setDone] = useState(false);
  const c = CONTENT[lang];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">🔒 {c.title}</h1>
      <ul className="mt-6 space-y-3">
        {c.points.map((p) => (
          <li key={p} className="flex gap-3 rounded-2xl border border-black/5 bg-white p-4">
            <span className="text-brand-600">✔</span>
            {p}
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          storage.clearAll();
          window.dispatchEvent(new Event("hs-saved-change"));
          setDone(true);
        }}
        className="mt-8 rounded-2xl border-2 border-rose-200 px-6 py-3 font-semibold text-rose-700 hover:bg-rose-50"
      >
        {done ? `✓ ${c.cleared}` : `🗑️ ${c.clear}`}
      </button>
    </div>
  );
}
