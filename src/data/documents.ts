import type { L } from "@/lib/types";

export type DocumentInfo = { name: L; howToGet: L };

/** Common documents asked for by schemes, and how to get each one. */
export const DOCUMENTS: Record<string, DocumentInfo> = {
  aadhaar: {
    name: { en: "Aadhaar card", hi: "आधार कार्ड" },
    howToGet: {
      en: "Visit any Aadhaar Seva Kendra or bank with Aadhaar enrolment. Make sure your name and mobile number are correct.",
      hi: "किसी भी आधार सेवा केंद्र या आधार नामांकन वाले बैंक में जाएं। नाम और मोबाइल नंबर सही होना चाहिए।",
    },
  },
  bank_passbook: {
    name: { en: "Bank passbook (Aadhaar-linked)", hi: "बैंक पासबुक (आधार से जुड़ी)" },
    howToGet: {
      en: "Ask your bank to link Aadhaar to your account. No account? Open a free Jan Dhan account.",
      hi: "अपने बैंक से खाते को आधार से जोड़ने को कहें। खाता नहीं है? मुफ्त जन धन खाता खुलवाएं।",
    },
  },
  income_cert: {
    name: { en: "Income certificate", hi: "आय प्रमाण पत्र" },
    howToGet: {
      en: "Apply on your state's e-District portal, at a CSC centre, or at the tehsil office.",
      hi: "अपने राज्य के ई-डिस्ट्रिक्ट पोर्टल, CSC केंद्र या तहसील कार्यालय में आवेदन करें।",
    },
  },
  caste_cert: {
    name: { en: "Caste certificate", hi: "जाति प्रमाण पत्र" },
    howToGet: {
      en: "Apply on your state's e-District portal, at a CSC centre, or at the tehsil office.",
      hi: "अपने राज्य के ई-डिस्ट्रिक्ट पोर्टल, CSC केंद्र या तहसील कार्यालय में आवेदन करें।",
    },
  },
  ration_card: {
    name: { en: "Ration card / BPL card", hi: "राशन कार्ड / बीपीएल कार्ड" },
    howToGet: {
      en: "Apply at your state food department portal or the local ration office.",
      hi: "राज्य खाद्य विभाग के पोर्टल या स्थानीय राशन कार्यालय में आवेदन करें।",
    },
  },
  land_records: {
    name: { en: "Land records (khatauni / 7-12)", hi: "भूमि रिकॉर्ड (खतौनी / 7-12)" },
    howToGet: {
      en: "Download from your state's land records (Bhulekh) website, or get it from the patwari.",
      hi: "अपने राज्य की भूलेख वेबसाइट से डाउनलोड करें या पटवारी से लें।",
    },
  },
  photo: {
    name: { en: "Passport-size photo", hi: "पासपोर्ट साइज़ फोटो" },
    howToGet: { en: "Any photo studio. Keep 4-5 copies ready.", hi: "किसी भी फोटो स्टूडियो से। 4-5 कॉपी तैयार रखें।" },
  },
  age_proof: {
    name: { en: "Age proof", hi: "आयु प्रमाण" },
    howToGet: {
      en: "Birth certificate, school certificate or Aadhaar usually works.",
      hi: "जन्म प्रमाण पत्र, स्कूल प्रमाण पत्र या आधार आमतौर पर चल जाता है।",
    },
  },
  disability_cert: {
    name: { en: "Disability certificate / UDID card", hi: "दिव्यांगता प्रमाण पत्र / UDID कार्ड" },
    howToGet: {
      en: "Apply on swavlambancard.gov.in or at the district hospital medical board.",
      hi: "swavlambancard.gov.in पर या जिला अस्पताल के मेडिकल बोर्ड में आवेदन करें।",
    },
  },
  girl_birth_cert: {
    name: { en: "Daughter's birth certificate", hi: "बेटी का जन्म प्रमाण पत्र" },
    howToGet: {
      en: "From the municipality or gram panchayat where she was born.",
      hi: "जहां जन्म हुआ, उस नगरपालिका या ग्राम पंचायत से।",
    },
  },
  mcp_card: {
    name: { en: "Mother and Child Protection (MCP) card", hi: "मातृ एवं शिशु सुरक्षा (MCP) कार्ड" },
    howToGet: {
      en: "Given free at the Anganwadi centre or government health centre when pregnancy is registered.",
      hi: "गर्भावस्था पंजीकरण पर आंगनवाड़ी या सरकारी स्वास्थ्य केंद्र से मुफ्त मिलता है।",
    },
  },
  marksheet: {
    name: { en: "Previous year marksheet", hi: "पिछले साल की मार्कशीट" },
    howToGet: { en: "From your school or college.", hi: "अपने स्कूल या कॉलेज से।" },
  },
  fee_receipt: {
    name: { en: "Fee receipt / admission proof", hi: "फीस रसीद / प्रवेश प्रमाण" },
    howToGet: { en: "From your college office.", hi: "अपने कॉलेज कार्यालय से।" },
  },
  vendor_proof: {
    name: { en: "Vending certificate or letter from local body", hi: "वेंडिंग प्रमाण पत्र या नगर निकाय का पत्र" },
    howToGet: {
      en: "From your municipality. If you don't have one, ask about a Letter of Recommendation (LoR).",
      hi: "अपनी नगरपालिका से। न हो तो सिफारिश पत्र (LoR) के बारे में पूछें।",
    },
  },
  business_plan: {
    name: { en: "Simple business plan and quotation", hi: "सरल व्यापार योजना और कोटेशन" },
    howToGet: {
      en: "One page: what you sell, what you need money for, and price quotes for machines or stock.",
      hi: "एक पेज: आप क्या बेचते हैं, पैसा किस लिए चाहिए, और मशीन या सामान के दाम।",
    },
  },
  job_card: {
    name: { en: "MGNREGA job card", hi: "मनरेगा जॉब कार्ड" },
    howToGet: {
      en: "Apply at your gram panchayat. It should be given within 15 days, free.",
      hi: "ग्राम पंचायत में आवेदन करें। 15 दिन में मुफ्त मिलना चाहिए।",
    },
  },
};
