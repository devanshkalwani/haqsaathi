import type { Area, Category, Flag, Gender, IncomeBracket, L, Occupation, SchemeCategory } from "@/lib/types";

/** Labels for every choice in the quiz and filters. */

export const GENDERS: { id: Gender; label: L; icon: string }[] = [
  { id: "female", label: { en: "Female", hi: "महिला" }, icon: "👩" },
  { id: "male", label: { en: "Male", hi: "पुरुष" }, icon: "👨" },
  { id: "other", label: { en: "Other", hi: "अन्य" }, icon: "🧑" },
];

export const AREAS: { id: Area; label: L; icon: string }[] = [
  { id: "rural", label: { en: "Village", hi: "गांव" }, icon: "🌾" },
  { id: "urban", label: { en: "Town / City", hi: "कस्बा / शहर" }, icon: "🏙️" },
];

export const OCCUPATIONS: { id: Occupation; label: L; icon: string }[] = [
  { id: "farmer", label: { en: "Farmer", hi: "किसान" }, icon: "🧑‍🌾" },
  { id: "labourer", label: { en: "Labourer / daily wage", hi: "मज़दूर / दिहाड़ी" }, icon: "🧱" },
  { id: "domestic_worker", label: { en: "Domestic worker", hi: "घरेलू कामगार" }, icon: "🧹" },
  { id: "street_vendor", label: { en: "Street vendor", hi: "फेरीवाला / ठेला" }, icon: "🛒" },
  { id: "artisan", label: { en: "Artisan / craftsperson", hi: "कारीगर" }, icon: "🪚" },
  { id: "small_business", label: { en: "Small business", hi: "छोटा व्यापार" }, icon: "🏪" },
  { id: "student", label: { en: "Student", hi: "छात्र / छात्रा" }, icon: "🎓" },
  { id: "salaried", label: { en: "Salaried job", hi: "नौकरी (वेतन)" }, icon: "💼" },
  { id: "homemaker", label: { en: "Homemaker", hi: "गृहिणी" }, icon: "🏠" },
  { id: "unemployed", label: { en: "Looking for work", hi: "काम की तलाश में" }, icon: "🔎" },
  { id: "retired", label: { en: "Retired / elderly", hi: "सेवानिवृत्त / बुज़ुर्ग" }, icon: "🧓" },
];

export const INCOMES: { id: IncomeBracket; label: L }[] = [
  { id: "upto_1l", label: { en: "Up to ₹1 lakh", hi: "₹1 लाख तक" } },
  { id: "1l_2_5l", label: { en: "₹1 lakh – ₹2.5 lakh", hi: "₹1 लाख – ₹2.5 लाख" } },
  { id: "2_5l_5l", label: { en: "₹2.5 lakh – ₹5 lakh", hi: "₹2.5 लाख – ₹5 लाख" } },
  { id: "5l_9l", label: { en: "₹5 lakh – ₹9 lakh", hi: "₹5 लाख – ₹9 लाख" } },
  { id: "above_9l", label: { en: "Above ₹9 lakh", hi: "₹9 लाख से ज़्यादा" } },
];

export const CATEGORIES: { id: Category; label: L }[] = [
  { id: "general", label: { en: "General", hi: "सामान्य" } },
  { id: "obc", label: { en: "OBC", hi: "ओबीसी" } },
  { id: "sc", label: { en: "SC", hi: "अनुसूचित जाति (SC)" } },
  { id: "st", label: { en: "ST", hi: "अनुसूचित जनजाति (ST)" } },
  { id: "ews", label: { en: "EWS", hi: "ईडब्ल्यूएस (EWS)" } },
];

export const FLAGS: { id: Flag; label: L; icon: string }[] = [
  { id: "has_bank_account", label: { en: "I have a bank account", hi: "मेरा बैंक खाता है" }, icon: "🏦" },
  { id: "has_bpl_card", label: { en: "We have a BPL / Antyodaya ration card", hi: "हमारे पास बीपीएल / अंत्योदय राशन कार्ड है" }, icon: "🪪" },
  { id: "owns_farmland", label: { en: "We own farmland", hi: "हमारी खेती की ज़मीन है" }, icon: "🌱" },
  { id: "has_pucca_house", label: { en: "We have a pucca (concrete) house", hi: "हमारा पक्का घर है" }, icon: "🏠" },
  { id: "has_lpg", label: { en: "We have an LPG gas connection", hi: "हमारे पास एलपीजी गैस कनेक्शन है" }, icon: "🔥" },
  { id: "daughter_under_10", label: { en: "We have a daughter below 10 years", hi: "हमारी 10 साल से छोटी बेटी है" }, icon: "👧" },
  { id: "pregnant_or_new_mother", label: { en: "Pregnant, or mother of a newborn", hi: "गर्भवती, या नवजात की मां" }, icon: "🤰" },
  { id: "has_disability", label: { en: "I have a disability", hi: "मैं दिव्यांग हूं" }, icon: "♿" },
  { id: "pays_income_tax", label: { en: "I pay income tax", hi: "मैं आयकर देता/देती हूं" }, icon: "🧾" },
];

export const SCHEME_CATEGORIES: { id: SchemeCategory; label: L; icon: string; color: string }[] = [
  { id: "farmers", label: { en: "Farmers", hi: "किसान" }, icon: "🌾", color: "bg-lime-100 text-lime-800" },
  { id: "health", label: { en: "Health", hi: "स्वास्थ्य" }, icon: "🏥", color: "bg-rose-100 text-rose-800" },
  { id: "housing", label: { en: "Housing", hi: "आवास" }, icon: "🏠", color: "bg-orange-100 text-orange-800" },
  { id: "money", label: { en: "Bank & Insurance", hi: "बैंक और बीमा" }, icon: "🏦", color: "bg-sky-100 text-sky-800" },
  { id: "workers", label: { en: "Workers", hi: "श्रमिक" }, icon: "🧱", color: "bg-amber-100 text-amber-800" },
  { id: "women", label: { en: "Women & Girls", hi: "महिला और बेटी" }, icon: "👩", color: "bg-pink-100 text-pink-800" },
  { id: "students", label: { en: "Students", hi: "छात्र" }, icon: "🎓", color: "bg-violet-100 text-violet-800" },
  { id: "elderly", label: { en: "Elderly & Disabled", hi: "बुज़ुर्ग और दिव्यांग" }, icon: "🧓", color: "bg-teal-100 text-teal-800" },
  { id: "business", label: { en: "Business & Loans", hi: "व्यापार और लोन" }, icon: "🏪", color: "bg-indigo-100 text-indigo-800" },
];

export const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];
