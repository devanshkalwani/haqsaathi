"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { storage } from "./storage";
import type { L, Lang } from "./types";

/**
 * Simple language system.
 * - `tr(text)` picks the right language from an { en, hi } object.
 * - `t("key")` reads fixed interface text from the UI dictionary below.
 */

const UI = {
  // Header and navigation
  nav_home: { en: "Home", hi: "होम" },
  nav_check: { en: "Check Benefits", hi: "लाभ जांचें" },
  nav_schemes: { en: "All Schemes", hi: "सभी योजनाएं" },
  nav_ask: { en: "Ask Saathi", hi: "साथी से पूछें" },
  nav_checklist: { en: "My List", hi: "मेरी सूची" },
  theme_dark: { en: "Switch to dark mode", hi: "डार्क मोड चालू करें" },
  theme_light: { en: "Switch to light mode", hi: "लाइट मोड चालू करें" },
  video_replay: { en: "Watch again", hi: "फिर से देखें" },
  sound_on: { en: "Sound on", hi: "आवाज़ चालू" },
  sound_off: { en: "Sound off", hi: "आवाज़ बंद" },
  video_label: { en: "12-second introduction to HaqSaathi", hi: "हक़साथी का 12 सेकंड का परिचय वीडियो" },
  schemes_sub: {
    en: "Every scheme with what you get, who can apply, documents and steps. All in one place.",
    hi: "हर योजना: क्या मिलेगा, कौन आवेदन कर सकता है, दस्तावेज़ और तरीका। सब एक जगह।",
  },
  tagline: { en: "Your companion for every benefit you deserve", hi: "आपके हक़ के हर लाभ का साथी" },

  // Home
  hero_title: { en: "Find the government benefits you are eligible for", hi: "जानिए कौन-सी सरकारी योजनाओं के आप हक़दार हैं" },
  hero_sub: {
    en: "Answer a few simple questions. We'll show your schemes, the documents you need, and exactly how to apply. Complete information, in simple words.",
    hi: "कुछ आसान सवालों के जवाब दें। हम आपकी योजनाएं, ज़रूरी दस्तावेज़ और आवेदन का तरीका बताएंगे। पूरी जानकारी, आसान भाषा में।",
  },
  hero_cta: { en: "Check my benefits", hi: "मेरे लाभ जांचें" },
  hero_cta_time: { en: "Takes 2 minutes", hi: "सिर्फ 2 मिनट" },
  hero_ask: { en: "Ask a question", hi: "सवाल पूछें" },
  how_title: { en: "How HaqSaathi helps", hi: "हक़साथी कैसे मदद करता है" },
  step1_t: { en: "Find", hi: "खोजें" },
  step1_d: { en: "See every scheme that fits you", hi: "आपके लिए सही हर योजना देखें" },
  step2_t: { en: "Understand", hi: "समझें" },
  step2_d: { en: "Simple words, no confusing rules", hi: "आसान भाषा, कोई उलझन नहीं" },
  step3_t: { en: "Prepare", hi: "तैयारी करें" },
  step3_d: { en: "Exact list of documents to keep ready", hi: "ज़रूरी दस्तावेज़ों की पूरी सूची" },
  step4_t: { en: "Apply", hi: "आवेदन करें" },
  step4_d: { en: "Step-by-step guide and the official link", hi: "कदम-दर-कदम गाइड और आधिकारिक लिंक" },
  browse_title: { en: "Browse by category", hi: "श्रेणी के अनुसार देखें" },
  popular_title: { en: "Popular schemes", hi: "लोकप्रिय योजनाएं" },
  see_all: { en: "See all schemes", hi: "सभी योजनाएं देखें" },
  stat_schemes: { en: "schemes explained simply", hi: "योजनाएं आसान भाषा में" },
  stat_free: { en: "Always free for citizens", hi: "नागरिकों के लिए हमेशा मुफ्त" },
  stat_lang: { en: "Hindi + English (more coming)", hi: "हिंदी + अंग्रेज़ी (और भाषाएं जल्द)" },
  trust_title: { en: "Why you can trust us", hi: "हम पर भरोसा क्यों करें" },
  trust_1: { en: "Every scheme links to its official government source", hi: "हर योजना का आधिकारिक सरकारी स्रोत दिया गया है" },
  trust_2: { en: "We never ask for OTP, bank PIN or money", hi: "हम कभी OTP, बैंक PIN या पैसे नहीं मांगते" },
  trust_3: { en: "Your answers stay on your phone", hi: "आपके जवाब आपके फोन में ही रहते हैं" },

  // Quiz
  quiz_title: { en: "Check your benefits", hi: "अपने लाभ जांचें" },
  quiz_step: { en: "Question", hi: "सवाल" },
  quiz_of: { en: "of", hi: "में से" },
  q_age: { en: "How old are you?", hi: "आपकी उम्र कितनी है?" },
  q_age_hint: { en: "Enter age in years", hi: "उम्र सालों में लिखें" },
  q_gender: { en: "You are", hi: "आप हैं" },
  q_area: { en: "Where do you live?", hi: "आप कहां रहते हैं?" },
  q_state: { en: "Which state do you live in?", hi: "आप किस राज्य में रहते हैं?" },
  q_state_pick: { en: "Choose your state", hi: "अपना राज्य चुनें" },
  q_occupation: { en: "What work do you do?", hi: "आप क्या काम करते हैं?" },
  q_income: { en: "Your family's total yearly income", hi: "परिवार की कुल सालाना आय" },
  q_income_hint: { en: "A rough guess is fine", hi: "अंदाज़ा भी चलेगा" },
  q_category: { en: "Your social category", hi: "आपकी सामाजिक श्रेणी" },
  q_flags: { en: "Tick everything that is true for you", hi: "जो भी आप पर लागू हो, उन पर टिक करें" },
  q_flags_hint: { en: "Skip any that don't apply", hi: "जो लागू न हो, उसे छोड़ दें" },
  back: { en: "Back", hi: "पीछे" },
  next: { en: "Next", hi: "आगे" },
  see_results: { en: "See my schemes", hi: "मेरी योजनाएं देखें" },
  privacy_note: { en: "Your answers are saved only on this device.", hi: "आपके जवाब सिर्फ इसी डिवाइस में सेव होते हैं।" },

  // Results
  results_title: { en: "Schemes you may be eligible for", hi: "योजनाएं जिनके आप पात्र हो सकते हैं" },
  results_found: { en: "We found", hi: "हमें मिलीं" },
  results_schemes: { en: "schemes for you", hi: "योजनाएं आपके लिए" },
  results_none: {
    en: "We couldn't find a match from our current list. We're adding more schemes every week. Try asking Saathi.",
    hi: "हमारी मौजूदा सूची में कोई मेल नहीं मिला। हम हर हफ्ते नई योजनाएं जोड़ रहे हैं। साथी से पूछकर देखें।",
  },
  results_note: {
    en: "This is a guide based on your answers. The final decision is made by the government department.",
    hi: "यह आपके जवाबों पर आधारित एक गाइड है। अंतिम फैसला सरकारी विभाग करता है।",
  },
  results_no_profile: { en: "You haven't answered the questions yet.", hi: "आपने अभी सवालों के जवाब नहीं दिए हैं।" },
  edit_answers: { en: "Change answers", hi: "जवाब बदलें" },

  // Scheme card / detail
  likely_eligible: { en: "Likely eligible", hi: "संभवतः पात्र" },
  view_details: { en: "View details", hi: "विवरण देखें" },
  save: { en: "Save", hi: "सेव करें" },
  saved: { en: "Saved", hi: "सेव हुआ" },
  what_is_it: { en: "What is it?", hi: "यह क्या है?" },
  what_you_get: { en: "What you get", hi: "आपको क्या मिलेगा" },
  who_can_apply: { en: "Who can apply", hi: "कौन आवेदन कर सकता है" },
  documents_needed: { en: "Documents needed", hi: "ज़रूरी दस्तावेज़" },
  how_to_apply: { en: "How to apply", hi: "आवेदन कैसे करें" },
  apply_official: { en: "Go to official website", hi: "आधिकारिक वेबसाइट पर जाएं" },
  helpline: { en: "Helpline", hi: "हेल्पलाइन" },
  source: { en: "Official source", hi: "आधिकारिक स्रोत" },
  last_verified: { en: "Last checked", hi: "आखिरी जांच" },
  report_error: { en: "Report a mistake", hi: "गलती बताएं" },
  report_what: { en: "What is wrong? (e.g. amount changed, link broken)", hi: "क्या गलत है? (जैसे राशि बदल गई, लिंक नहीं चलता)" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  report_thanks: { en: "Thank you! We will check and fix it.", hi: "धन्यवाद! हम जांच कर सुधारेंगे।" },
  listen: { en: "Listen", hi: "सुनें" },
  stop: { en: "Stop", hi: "रोकें" },
  ask_about: { en: "Ask Saathi about this", hi: "इसके बारे में साथी से पूछें" },
  how_to_get: { en: "How to get it", hi: "कैसे बनवाएं" },
  not_found: { en: "Scheme not found", hi: "योजना नहीं मिली" },
  central: { en: "Central scheme", hi: "केंद्रीय योजना" },

  // Schemes list
  search_ph: { en: "Search: farmer, pension, scholarship…", hi: "खोजें: किसान, पेंशन, छात्रवृत्ति…" },
  all: { en: "All", hi: "सभी" },
  no_results: { en: "No schemes found. Try another word.", hi: "कोई योजना नहीं मिली। दूसरा शब्द आज़माएं।" },
  showing: { en: "Showing", hi: "दिखा रहे हैं" },

  // Chat
  ask_title: { en: "Ask Saathi", hi: "साथी से पूछें" },
  ask_sub: { en: "Ask anything about government schemes. Type or speak.", hi: "सरकारी योजनाओं के बारे में कुछ भी पूछें। लिखें या बोलें।" },
  ask_ph: { en: "Type your question…", hi: "अपना सवाल लिखें…" },
  ask_send: { en: "Send", hi: "भेजें" },
  ask_hello: {
    en: "Namaste! I'm Saathi. Tell me about yourself or ask about any scheme, and I'll explain it simply.",
    hi: "नमस्ते! मैं साथी हूं। अपने बारे में बताइए या किसी भी योजना के बारे में पूछिए, मैं आसान भाषा में समझाऊंगा।",
  },
  ask_try: { en: "Try asking", hi: "ऐसे पूछें" },
  ask_thinking: { en: "Saathi is thinking…", hi: "साथी सोच रहा है…" },
  ask_error: { en: "Sorry, something went wrong. Please try again.", hi: "माफ़ कीजिए, कुछ गड़बड़ हुई। फिर से कोशिश करें।" },
  ask_warning: {
    en: "Saathi answers only from verified scheme data. Never share OTP, bank PIN or passwords.",
    hi: "साथी सिर्फ सत्यापित योजना जानकारी से जवाब देता है। कभी OTP, बैंक PIN या पासवर्ड न बताएं।",
  },
  mic_listening: { en: "Listening… speak now", hi: "सुन रहा हूं… अब बोलें" },
  mic_unsupported: { en: "Voice input is not supported in this browser. Try Chrome.", hi: "इस ब्राउज़र में आवाज़ से लिखना नहीं चलता। Chrome आज़माएं।" },

  // Checklist
  list_title: { en: "My List", hi: "मेरी सूची" },
  list_sub: { en: "Your saved schemes and all the documents you need for them.", hi: "आपकी सेव की गई योजनाएं और उनके लिए ज़रूरी सभी दस्तावेज़।" },
  list_empty: { en: "You haven't saved any schemes yet.", hi: "आपने अभी कोई योजना सेव नहीं की है।" },
  list_saved: { en: "Saved schemes", hi: "सेव की गई योजनाएं" },
  list_docs: { en: "Documents to keep ready", hi: "तैयार रखने वाले दस्तावेज़" },
  list_ready: { en: "ready", hi: "तैयार" },
  list_needed_for: { en: "Needed for", hi: "इनके लिए ज़रूरी" },
  remove: { en: "Remove", hi: "हटाएं" },
  print: { en: "Print list", hi: "सूची प्रिंट करें" },

  // Footer
  disclaimer: {
    en: "HaqSaathi is an independent project. It is not a government website and is not linked to any government body. Always confirm details on the official website.",
    hi: "हक़साथी एक स्वतंत्र प्रोजेक्ट है। यह सरकारी वेबसाइट नहीं है और किसी सरकारी संस्था से जुड़ा नहीं है। हमेशा आधिकारिक वेबसाइट पर जानकारी की पुष्टि करें।",
  },
  about: { en: "About", hi: "हमारे बारे में" },
  privacy: { en: "Privacy", hi: "गोपनीयता" },
  sample_data: {
    en: "Development version: scheme data is a sample and must be verified before launch.",
    hi: "डेवलपमेंट संस्करण: योजना जानकारी नमूना है, लॉन्च से पहले जांचनी होगी।",
  },

  // Account
  nav_dashboard: { en: "My Dashboard", hi: "मेरा डैशबोर्ड" },
  login: { en: "Log in", hi: "लॉग इन" },
  logout: { en: "Log out", hi: "लॉग आउट" },
  guest: { en: "Guest", hi: "मेहमान" },

  // Login page
  login_title: { en: "Welcome to HaqSaathi", hi: "हक़साथी में आपका स्वागत है" },
  login_sub: {
    en: "Log in to save your benefits and see them on any phone. No password needed.",
    hi: "अपने लाभ सेव करने और किसी भी फोन पर देखने के लिए लॉग इन करें। पासवर्ड की ज़रूरत नहीं।",
  },
  email_label: { en: "Your email", hi: "आपका ईमेल" },
  send_code: { en: "Send me a code", hi: "मुझे कोड भेजें" },
  sending: { en: "Sending…", hi: "भेज रहे हैं…" },
  code_sent: { en: "We sent a 6-digit code to", hi: "हमने 6 अंकों का कोड भेजा है" },
  code_label: { en: "Enter the 6-digit code", hi: "6 अंकों का कोड डालें" },
  code_hint: { en: "Check your inbox and spam folder. You can also tap the link in the email.", hi: "इनबॉक्स और स्पैम फ़ोल्डर देखें। ईमेल के लिंक पर भी टैप कर सकते हैं।" },
  verify: { en: "Log in", hi: "लॉग इन करें" },
  checking: { en: "Checking…", hi: "जांच रहे हैं…" },
  change_email: { en: "Use a different email", hi: "दूसरा ईमेल डालें" },
  continue_guest: { en: "Continue without login", hi: "बिना लॉग इन के आगे बढ़ें" },
  guest_note: {
    en: "Everything works without logging in. Your answers stay on this phone.",
    hi: "लॉग इन के बिना भी सब कुछ चलता है। आपके जवाब इसी फोन में रहते हैं।",
  },
  name_title: { en: "What should we call you?", hi: "हम आपको किस नाम से बुलाएं?" },
  name_ph: { en: "Your name", hi: "आपका नाम" },
  continue: { en: "Continue", hi: "आगे बढ़ें" },
  login_unavailable: {
    en: "Login is coming soon. For now you can use everything as a guest.",
    hi: "लॉग इन जल्द आ रहा है। अभी आप मेहमान के रूप में सब कुछ इस्तेमाल कर सकते हैं।",
  },
  login_perks_1: { en: "Your schemes saved on any phone", hi: "आपकी योजनाएं हर फोन पर सेव" },
  login_perks_2: { en: "Track your documents and applications", hi: "दस्तावेज़ और आवेदन ट्रैक करें" },
  login_perks_3: { en: "Get alerts for new schemes (coming soon)", hi: "नई योजनाओं की सूचना (जल्द)" },

  // Dashboard
  dash_hello: { en: "Namaste", hi: "नमस्ते" },
  dash_sub: { en: "Here is everything HaqSaathi found for you.", hi: "हक़साथी ने आपके लिए यह सब ढूंढा है।" },
  dash_eligible: { en: "Schemes for you", hi: "आपके लिए योजनाएं" },
  dash_docs: { en: "Documents ready", hi: "तैयार दस्तावेज़" },
  dash_saved: { en: "Saved schemes", hi: "सेव योजनाएं" },
  dash_next: { en: "Your next steps", hi: "आपके अगले कदम" },
  dash_step_profile: { en: "Answer 8 simple questions", hi: "8 आसान सवालों के जवाब दें" },
  dash_step_save: { en: "Save the schemes you want", hi: "जो योजनाएं चाहिए, उन्हें सेव करें" },
  dash_step_docs: { en: "Get your documents ready", hi: "अपने दस्तावेज़ तैयार करें" },
  dash_step_apply: { en: "Apply on the official website", hi: "आधिकारिक वेबसाइट पर आवेदन करें" },
  dash_top: { en: "Your top benefits", hi: "आपके सबसे बड़े लाभ" },
  dash_profile: { en: "Your details", hi: "आपकी जानकारी" },
  dash_guest_banner: {
    en: "You are using HaqSaathi as a guest. Log in to keep your data safe and use it on any phone.",
    hi: "आप मेहमान के रूप में हक़साथी इस्तेमाल कर रहे हैं। अपना डेटा सुरक्षित रखने और किसी भी फोन पर इस्तेमाल करने के लिए लॉग इन करें।",
  },
  dash_start_title: { en: "Let's find your benefits", hi: "आइए आपके लाभ ढूंढें" },
  dash_start_sub: { en: "Answer 8 simple questions. It takes 2 minutes.", hi: "8 आसान सवालों के जवाब दें। सिर्फ 2 मिनट लगेंगे।" },
  dash_ask: { en: "Have a question about a scheme? Ask Saathi.", hi: "किसी योजना के बारे में सवाल? साथी से पूछें।" },
  view_all: { en: "View all", hi: "सभी देखें" },
  edit: { en: "Edit", hi: "बदलें" },
  done: { en: "Done", hi: "पूरा" },
  years: { en: "years", hi: "वर्ष" },
} satisfies Record<string, L>;

export type UIKey = keyof typeof UI;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: UIKey) => string; tr: (x: L) => string };

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Load the saved language after the page loads (localStorage is browser-only).
  useEffect(() => {
    const saved = storage.getLang();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved !== "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    storage.setLang(l);
  };

  const value: Ctx = {
    lang,
    setLang,
    t: (k) => UI[k][lang],
    tr: (x) => x[lang],
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
