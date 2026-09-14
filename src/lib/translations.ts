// ---------------------------------------------------------------------------
// KonjoDuka TradeOS — localization dictionaries (10 languages, EN fallback)
// ---------------------------------------------------------------------------

export type LanguageCode = "en" | "sw" | "am" | "om" | "so" | "ki" | "lu" | "ka" | "lo" | "ti";

export interface TradeLanguage {
  code: LanguageCode;
  name: string;
  nativeName: string;
  isRtl?: boolean;
}

export const SUPPORTED_LANGUAGES: TradeLanguage[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", isRtl: true },
  { code: "om", name: "Oromo", nativeName: "Afaan Oromoo" },
  { code: "so", name: "Somali", nativeName: "Soomaali" },
  { code: "ki", name: "Kikuyu", nativeName: "Gĩkũyũ" },
  { code: "lu", name: "Luhya", nativeName: "Oluluyia" },
  { code: "ka", name: "Kalenjin", nativeName: "Kalenjin" },
  { code: "lo", name: "Luo", nativeName: "Dholuo" },
  { code: "ti", name: "Tigrinya", nativeName: "ትግርኛ" },
];

export interface Dictionary {
  welcome: string;
  guest_msg: string;
  dashboard: string;
  prices: string;
  policy: string;
  boq: string;
  directory: string;
  escrow: string;
  logistics: string;
  admin: string;
  login: string;
  register: string;
  free_queries: string;
  search_placeholder: string;
  simulate: string;
  track: string;
  verified: string;
  rating: string;
}

export const FALLBACK_DICT: Dictionary = {
  welcome: "Welcome to KonjoDuka TradeOS",
  guest_msg: "Guest mode: browse prices, policy, and tools. Sign in for full access.",
  dashboard: "Dashboard",
  prices: "Price Discovery",
  policy: "Policy & Compliance",
  boq: "BOQ Simulator",
  directory: "Trade Directory",
  escrow: "Escrow & Payments",
  logistics: "Logistics & Tracking",
  admin: "Settings & API",
  login: "Log in",
  register: "Register",
  free_queries: "Free API Queries Left",
  search_placeholder: "Ask TradeOS anything...",
  simulate: "Simulate BOQ",
  track: "Track Shipment",
  verified: "Verified",
  rating: "Rating",
};

export const TRANSLATIONS: Record<LanguageCode, Partial<Dictionary>> = {
  en: FALLBACK_DICT,
  sw: {
    welcome: "Karibu kwenye KonjoDuka TradeOS",
    guest_msg: "Hali ya Wageni: Chunguza bei, sera, na zana. Ingia kwa ufikiaji kamili.",
    dashboard: "Dashibodi",
    prices: "Ugunduzi wa Bei",
    policy: "Sera na Uzingatiaji",
    boq: "Simulator ya BOQ",
    directory: "Orodha ya Biashara",
    escrow: "Eskrow na Malipo",
    logistics: "Usafirishaji na Ufuatiliaji",
    admin: "Mipangilio na API",
    login: "Ingia",
    register: "Jisajili",
    free_queries: "Maswali ya Bure ya API Yaliyosalia",
    simulate: "Simua BOQ",
    track: "Fuatilia Mzigo",
  },
  am: {
    welcome: "እንኳን ወደ KonjoDuka TradeOS በደህና መጡ",
    guest_msg: "የእንግዳ ሁነታ፡ ዋጋዎችን እና መሳሪያዎችን ይመልከቱ። ለሙሉ ተደራሽነት ይግቡ።",
    dashboard: "ዳሽቦርድ",
    prices: "የዋጋ ግኝት",
    policy: "ፖሊሲ እና ተገዢነት",
    boq: "BOQ ማስመሰያ",
    directory: "የንግድ ማውጫ",
    escrow: "ኤስክሮው እና ክፍያዎች",
    logistics: "ሎጂስቲክስ እና ክትትል",
    admin: "ቅንብሮች እና API",
    login: "ግባ",
    register: "ይመዝገቡ",
    simulate: "BOQ አስመስል",
  },
  om: { welcome: "Baga nagaa dhufte KonjoDuka TradeOS" },
  so: { welcome: "Kuso dhawaw KonjoDuka TradeOS" },
  ki: { welcome: "Ũhoro KonjoDuka TradeOS" },
  lu: { welcome: "Mirembe KonjoDuka TradeOS" },
  ka: { welcome: "Chamgei KonjoDuka TradeOS" },
  lo: { welcome: "Misawa KonjoDuka TradeOS" },
  ti: { welcome: "እንቋዕ ብደሓን መጻእኩም KonjoDuka TradeOS" },
};

export function t(lang: LanguageCode, key: keyof Dictionary): string {
  const partial = TRANSLATIONS[lang];
  if (partial && partial[key]) return partial[key];
  return FALLBACK_DICT[key];
}