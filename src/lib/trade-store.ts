// ---------------------------------------------------------------------------
// KonjoDuka TradeOS — datasets, rates & simulation logic
// ---------------------------------------------------------------------------

export function fmtCompact(n: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export const formatNumber = (n: number, maxFrac = 2): string =>
  new Intl.NumberFormat("en", { maximumFractionDigits: maxFrac }).format(n);

// ---------------------------------------------------------------------------
// Price discovery feeds (live-simulated with jitter in the UI)
// ---------------------------------------------------------------------------

export interface CommodityPrice {
  id: string;
  name: string;
  hsCode: string;
  unit: string;
  priceKes: number;
  priceEtb: number;
  priceUsd: number;
  change24hPct: number;
  trend: number[]; // 14-point daily series
  source: string;
}

export const MOCK_PRICES: CommodityPrice[] = [
  { id: "maize", name: "Maize (white)", hsCode: "1005.90", unit: "MT", priceKes: 42500, priceEtb: 192000, priceUsd: 328, change24hPct: 2.4, trend: [305, 311, 308, 317, 322, 318, 331, 327, 335, 341, 338, 345, 342, 348], source: "NCPB / ECOM" },
  { id: "coffee", name: "Arabica Coffee", hsCode: "0901.11", unit: "60kg bag", priceKes: 21500, priceEtb: 97200, priceUsd: 166, change24hPct: 1.1, trend: [152, 154, 151, 157, 160, 158, 163, 161, 166, 164, 167, 165, 169, 168], source: "NCE / ECX" },
  { id: "teff", name: "Teff (white)", hsCode: "1008.90", unit: "MT", priceKes: 98500, priceEtb: 445000, priceUsd: 760, change24hPct: -0.8, trend: [775, 770, 768, 780, 772, 765, 760, 758, 764, 755, 762, 757, 754, 752], source: "ECX" },
  { id: "flours", name: "Wheat Flour", hsCode: "1101.00", unit: "50kg bag", priceKes: 3950, priceEtb: 17850, priceUsd: 30.5, change24hPct: 3.2, trend: [27, 27.5, 28, 28.4, 29, 28.8, 29.4, 29.9, 30.2, 30.1, 30.8, 31, 30.6, 31.2], source: "KEBS / EFDA" },
  { id: "lentils", name: "Red Lentils", hsCode: "0713.40", unit: "MT", priceKes: 128000, priceEtb: 578600, priceUsd: 988, change24hPct: 0.5, trend: [965, 970, 962, 975, 980, 978, 985, 990, 986, 992, 995, 998, 993, 996], source: "ECX" },
  { id: "hides", name: "Hides & Skins", hsCode: "4101.20", unit: "piece", priceKes: 2850, priceEtb: 12880, priceUsd: 22, change24hPct: 1.8, trend: [20, 20.4, 20.8, 21, 20.6, 21.4, 21.8, 21.5, 22.1, 22, 22.4, 22.6, 22.3, 22.8], source: "KEBS / ECX" },
  { id: "sesame", name: "Sesame Seed (humera)", hsCode: "1207.40", unit: "MT", priceKes: 156000, priceEtb: 705100, priceUsd: 1204, change24hPct: 2.9, trend: [1130, 1145, 1140, 1160, 1175, 1170, 1190, 1184, 1200, 1210, 1198, 1215, 1209, 1222], source: "ECX" },
  { id: "steel", name: "Steel Rebar", hsCode: "7214.20", unit: "MT", priceKes: 112000, priceEtb: 506200, priceUsd: 865, change24hPct: -1.4, trend: [890, 885, 880, 878, 872, 875, 868, 860, 862, 855, 858, 850, 856, 848], source: "KAM / ESIA" },
  { id: "cement", name: "Cement (OPC 42.5)", hsCode: "2523.29", unit: "50kg bag", priceKes: 720, priceEtb: 3254, priceUsd: 5.56, change24hPct: 0.2, trend: [5.4, 5.42, 5.44, 5.41, 5.45, 5.46, 5.44, 5.48, 5.47, 5.5, 5.49, 5.52, 5.51, 5.54], source: "KAM / ESIA" },
  { id: "fertilizer", name: "DAP Fertilizer", hsCode: "3105.30", unit: "50kg bag", priceKes: 5350, priceEtb: 24182, priceUsd: 41.3, change24hPct: 4.1, trend: [37, 37.8, 38.4, 39, 39.6, 40.2, 40.8, 41.4, 41, 41.8, 42.2, 41.9, 42.6, 42.8], source: "ETG" },
  { id: "soybean", name: "Soybean Meal", hsCode: "2304.00", unit: "MT", priceKes: 68500, priceEtb: 309620, priceUsd: 529, change24hPct: -0.6, trend: [540, 537, 535, 539, 533, 530, 528, 532, 526, 524, 527, 522, 520, 523], source: "PSDA" },
];

export interface FxRate {
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  rate: number;
  spread: number; // % p.a.
}

export const FX_RATES: FxRate[] = [
  { from: "USD", fromCode: "$", to: "KES", toCode: "KSh", rate: 129.5, spread: 1.1 },
  { from: "USD", fromCode: "$", to: "ETB", toCode: "Br", rate: 57.25, spread: 0.8 },
  { from: "KES", fromCode: "KSh", to: "ETB", toCode: "Br", rate: 0.442, spread: 0.6 },
  { from: "EUR", fromCode: "€", to: "KES", toCode: "KSh", rate: 140.1, spread: 0.5 },
  { from: "EUR", fromCode: "€", to: "ETB", toCode: "Br", rate: 61.95, spread: 0.7 },
  { from: "GBP", fromCode: "£", to: "KES", toCode: "KSh", rate: 163.2, spread: 0.9 },
  { from: "CNY", fromCode: "¥", to: "KES", toCode: "KSh", rate: 17.8, spread: 1.4 },
  { from: "SAR", fromCode: "﷼", to: "KES", toCode: "KSh", rate: 34.5, spread: 1.2 },
];

export const FX_MARKERS = [
  { id: 1, instrument: "USD/KES", spot: 129.42, chgPct: 0.32, high: 129.88, low: 129.02 },
  { id: 2, instrument: "USD/ETB", spot: 57.19, chgPct: -0.18, high: 57.44, low: 56.98 },
  { id: 3, instrument: "EUR/KES", spot: 140.06, chgPct: 0.11, high: 141.02, low: 139.55 },
  { id: 4, instrument: "KES/ETB", spot: 0.4418, chgPct: 0.05, high: 0.4431, low: 0.4402 },
];

export const PRICE_ALERTS = [
  { id: 1, symbol: "SESAME", signal: "BUY", target: 1180, now: 1204, source: "ECX" },
  { id: 2, symbol: "MAIZE", signal: "HOLD", target: 350, now: 348, source: "NCPB" },
  { id: 3, symbol: "DAP", signal: "BUY", target: 41, now: 42.8, source: "ETG" },
  { id: 4, symbol: "TEFF", signal: "SELL", target: 770, now: 752, source: "ECX" },
];

// ---------------------------------------------------------------------------
// Policy / compliance library
// ---------------------------------------------------------------------------

export interface PolicyDoc {
  id: string;
  title: string;
  type: string;
  origin: string;
  destination: string;
  effective: string;
  summary: string;
  tags: string[];
}

export const MOCK_POLICIES: PolicyDoc[] = [
  { id: "afcfta", title: "AfCFTA Preferential Tariff — Schedules of Concessions", type: "Agreement", origin: "AU", destination: "KE ↔ ET", effective: "Since 2021", summary: "Phase-downs tariffs on 90% of tariff lines; rules of origin (RoO) with 60% regional value content.", tags: ["Tariff", "RoO"] },
  { id: "comesa", title: "COMESA CET & Rules of Origin", type: "Agreement", origin: "COMESA", destination: "KE → ET", effective: "Since 2000", summary: "Kenya exports enjoy CET-free access; certificate of origin (COMESA Form) required per consignment.", tags: ["Tariff", "Certificate"] },
  { id: "etiqa", title: "ETIQA Import Permits (Ethiopia)", type: "Licensing", origin: "MoI", destination: "→ ET", effective: "Rolling 6-month", summary: "Online single-window import permit; mandatory tariff classification via HS before customs declaration.", tags: ["Permit", "HS code"] },
  { id: "kra-import", title: "KRA Customs — iCMS & Pre-Arrival", type: "Procedural", origin: "KRA", destination: "→ KE", effective: "Rolling", summary: "Pre-arrival declaration in iCMS 24h before vessel/consignment arrival; AEO fast-lane for authorized traders.", tags: ["Customs", "AEO"] },
  { id: "veterinary", title: "Sanitary & Phytosanitary (SPS) for Agri-Products", type: "Regulation", origin: "KEBS / MoA", destination: "KE ↔ ET", effective: "Continuous", summary: "Phytosanitary certificates for pulses & grains; residue testing limits per AfCFTA SPS annex.", tags: ["SPS", "Agri"] },
  { id: "labour", title: "Labour & Migration Compliance for Cross-Border Transport", type: "Labour", origin: "MoT", destination: "KE ↔ ET", effective: "Continuous", summary: "COMESA Yellow Card covers third-party liability; work permits required for drivers staying over 90 days.", tags: ["Labour", "Transport"] },
  { id: "dutydrawback", title: "EAC Duty Remission / Drawback Schemes", type: "Fiscal", origin: "KEBS / Treasury", destination: "→ KE", effective: "Continuous", summary: "Refund of duty on inputs used for exports under EAC Duty Remission; full drawback at 100% for qualifying goods.", tags: ["Fiscal", "Export"] },
  { id: "banking", title: "NBE FX Retention Rules", type: "Banking", origin: "NBE", destination: "ET", effective: "Continuous", summary: "Exporters retain 50% of FX earnings in retention accounts; surrender balance within 30 days.", tags: ["FX", "Banking"] },
];

// ---------------------------------------------------------------------------
// Cross-border directory
// ---------------------------------------------------------------------------

export interface DirectoryEntry {
  id: string;
  name: string;
  country: string;
  flag: string;
  category: string;
  rating: number;
  verified: boolean;
  description: string;
}

export const MOCK_DIRECTORY: DirectoryEntry[] = [
  { id: "d1", name: "Addis Coffee Exporters PLC", country: "Ethiopia", flag: "🇪🇹", category: "Coffee & Agri", rating: 4.8, verified: true, description: "Direct-trade arabica exporter with ECX warehouse access in Adama." },
  { id: "d2", name: "Mombasa Grain Terminal Ltd", country: "Kenya", flag: "🇰🇪", category: "Logistics", rating: 4.6, verified: true, description: "Port-side silo storage and bulk handling for maize and wheat imports." },
  { id: "d3", name: "Nairobi Textile Mills", country: "Kenya", flag: "🇰🇪", category: "Textiles", rating: 4.4, verified: true, description: "Garment manufacturer with AGOA quota and fabric export capacity." },
  { id: "d4", name: "Bahir Dar Leather Works", country: "Ethiopia", flag: "🇪🇹", category: "Leather", rating: 4.7, verified: true, description: "Wet-blue and crust leather supplier; EAE export certified." },
  { id: "d5", name: "Kilimanjaro Fertilizers", country: "Tanzania", flag: "🇹🇿", category: "Inputs", rating: 4.2, verified: false, description: "DAP/NPK blenders shipping into the Northern Corridor." },
  { id: "d6", name: "Djibouti Free Zone Services", country: "Djibouti", flag: "🇩🇯", category: "Logistics", rating: 4.9, verified: true, description: "Bonded warehousing and trans-shipment hub for Ethiopian corridor cargo." },
  { id: "d7", name: "Kampala Agro Processing", country: "Uganda", flag: "🇺🇬", category: "Food & Bev", rating: 4.1, verified: false, description: "Maize flour and animal-feed processing with EAST market reach." },
  { id: "d8", name: "Hawassa Polyester Co.", country: "Ethiopia", flag: "🇪🇹", category: "Textiles", rating: 4.5, verified: true, description: "Polyester yarn spinning; supplies regional garment parks." },
  { id: "d9", name: "Moyale Border Freight", country: "Kenya", flag: "🇰🇪", category: "Logistics", rating: 4.3, verified: true, description: "Trucking and customs-brokerage across the Moyale–Hawassa corridor." },
  { id: "d10", name: "Nakuru Tractor Assemblers", country: "Kenya", flag: "🇰🇪", category: "Machinery", rating: 4.0, verified: false, description: "Compact tractor assembly for East African smallholders." },
];

export const DIRECTORY_CATEGORIES = ["ALL", "Coffee & Agri", "Leather", "Textiles", "Food & Bev", "Inputs", "Machinery", "Logistics"];

// ---------------------------------------------------------------------------
// Escrow & payments
// ---------------------------------------------------------------------------

export interface EscrowContract {
  id: string;
  counterpart: string;
  flag: string;
  commodity: string;
  value: number;
  valueCurrency: "KES" | "USD";
  status: "disputed" | "funded" | "released" | "hold" | "pending" | "refunded";
  updatedAgo: string;
  progressPct: number;
}

export const MOCK_ESCROW: EscrowContract[] = [
  { id: "ESC-2481", counterpart: "Addis Coffee Exporters", flag: "🇪🇹", commodity: "Arabica Coffee · 12 MT", value: 1_984_000, valueCurrency: "KES", status: "released", updatedAgo: "2h ago", progressPct: 100 },
  { id: "ESC-2480", counterpart: "Bahir Dar Leather Works", flag: "🇪🇹", commodity: "Wet-blue hides · 40 pcs", value: 114_000, valueCurrency: "KES", status: "funded", updatedAgo: "5h ago", progressPct: 62 },
  { id: "ESC-2479", counterpart: "Mombasa Grain Terminal", flag: "🇰🇪", commodity: "Maize (white) · 8 MT", value: 340_000, valueCurrency: "KES", status: "hold", updatedAgo: "1d ago", progressPct: 38 },
  { id: "ESC-2478", counterpart: "Moyale Border Freight", flag: "🇰🇪", commodity: "Freight & customs bond", value: 228_500, valueCurrency: "KES", status: "pending", updatedAgo: "1d ago", progressPct: 12 },
  { id: "ESC-2477", counterpart: "Hawassa Polyester Co.", flag: "🇪🇹", commodity: "Polyester yarn · 2 MT", value: 12_400, valueCurrency: "USD", status: "disputed", updatedAgo: "3d ago", progressPct: 45 },
  { id: "ESC-2476", counterpart: "Djibouti Free Zone", flag: "🇩🇯", commodity: "Bonded warehousing", value: 8_900, valueCurrency: "USD", status: "refunded", updatedAgo: "6d ago", progressPct: 0 },
];

export const escrowReleaseSummary = [
  { label: "Released", value: 2_422_500, currency: "KES" },
  { label: "In escrow", value: 754_400, currency: "KES" },
  { label: "Pending", value: 228_500, currency: "KES" },
  { label: "Disputed", value: 12_400, currency: "USD" },
];

// ---------------------------------------------------------------------------
// Logistics & tracking
// ---------------------------------------------------------------------------

export interface Shipment {
  id: string;
  consignor: string;
  consignee: string;
  route: string;
  mode: string;
  status: string;
  progressPct: number;
  eta: string;
  waypoints: { name: string; loc: string; done: boolean; time: string }[];
}

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: "KD-8821",
    consignor: "Addis Coffee Exporters",
    consignee: "Nairobi Roasters Ltd",
    route: "Addis Ababa → Moyale → Nairobi",
    mode: "Road",
    status: "In Transit",
    progressPct: 64,
    eta: "Jun 12, 18:00 EAT",
    waypoints: [
      { name: "Pickup", loc: "Addis Ababa, ET", done: true, time: "Jun 08, 09:12" },
      { name: "Hawassa checkpoint", loc: "Hawassa, ET", done: true, time: "Jun 09, 14:40" },
      { name: "Moyale border", loc: "Moyale, KE", done: true, time: "Jun 10, 11:05" },
      { name: "Customs clearance", loc: "Nairobi, KE", done: false, time: "ETA Jun 12" },
      { name: "Delivery", loc: "Nairobi, KE", done: false, time: "ETA Jun 12" },
    ],
  },
  {
    id: "KD-8819",
    consignor: "Mombasa Grain Terminal",
    consignee: "Adama Flour Mills",
    route: "Mombasa → Nairobi → Adama",
    mode: "Road",
    status: "Customs Hold",
    progressPct: 41,
    eta: "Jun 15, 10:00 EAT",
    waypoints: [
      { name: "Port discharge", loc: "Mombasa, KE", done: true, time: "Jun 05, 16:20" },
      { name: "KRA scan", loc: "Mombasa, KE", done: true, time: "Jun 06, 08:00" },
      { name: "Nairobi ICD", loc: "Nairobi, KE", done: true, time: "Jun 08, 19:30" },
      { name: "ETIQA permit", loc: "Adama, ET", done: false, time: "Awaiting docs" },
      { name: "Delivery", loc: "Adama, ET", done: false, time: "ETA Jun 15" },
    ],
  },
];

// ---------------------------------------------------------------------------
// BOQ (Bill of Quantities) & tariff simulator
// ---------------------------------------------------------------------------

export interface BoqLineInput {
  description: string;
  hscode: string;
  unit: string;
  qty: number;
  unitPriceUsd: number;
  dutyRate: number;
  vatRate: number;
}

export const BOQ_CATEGORY_TEMPLATES: Record<string, BoqLineInput[]> = {
  Agricultural: [
    { description: "Maize, white, in bulk", hscode: "1005.90.00", unit: "MT", qty: 10, unitPriceUsd: 328, dutyRate: 10, vatRate: 16 },
    { description: "Arabica coffee, green", hscode: "0901.11.00", unit: "60kg bag", qty: 100, unitPriceUsd: 166, dutyRate: 5, vatRate: 16 },
    { description: "Red lentils, dried", hscode: "0713.40.00", unit: "MT", qty: 5, unitPriceUsd: 988, dutyRate: 15, vatRate: 16 },
  ],
  Construction: [
    { description: "Steel rebar, 12mm", hscode: "7214.20.00", unit: "MT", qty: 15, unitPriceUsd: 865, dutyRate: 10, vatRate: 16 },
    { description: "Cement OPC 42.5, 50kg", hscode: "2523.29.00", unit: "bag", qty: 400, unitPriceUsd: 5.56, dutyRate: 12, vatRate: 16 },
  ],
  ConsumerGoods: [
    { description: "Instant noodles, 12-pack", hscode: "1902.30.10", unit: "ctn", qty: 60, unitPriceUsd: 14.5, dutyRate: 25, vatRate: 16 },
    { description: "Bottled water 500ml, 24-pack", hscode: "2201.10.00", unit: "ctn", qty: 80, unitPriceUsd: 6.2, dutyRate: 25, vatRate: 16 },
  ],
  Fertilizer: [
    { description: "DAP fertilizer, 50kg", hscode: "3105.30.00", unit: "bag", qty: 250, unitPriceUsd: 41.3, dutyRate: 0, vatRate: 4 },
    { description: "Urea, 50kg", hscode: "3102.10.00", unit: "bag", qty: 150, unitPriceUsd: 39.8, dutyRate: 0, vatRate: 4 },
  ],
  Machinery: [
    { description: "Diesel tractor, 45hp", hscode: "8701.20.00", unit: "unit", qty: 2, unitPriceUsd: 18200, dutyRate: 2, vatRate: 16 },
    { description: "Maize mill roller, 1t/h", hscode: "8437.80.00", unit: "unit", qty: 1, unitPriceUsd: 14500, dutyRate: 0, vatRate: 16 },
  ],
};

export function simulateBoq(lines: BoqLineInput[], fxRate: number): {
  lineItems: { desc: string; hscode: string; qty: number; unitPriceUsd: number; subtotalUsd: number; dutyUsd: number; vatUsd: number; totalUsd: number; totalKes: number }[];
  totals: { cfrUsd: number; dutyUsd: number; vatUsd: number; totalUsd: number; totalKes: number };
} {
  const lineItems = lines.map((l) => {
    const subtotalUsd = l.qty * l.unitPriceUsd;
    const dutyUsd = subtotalUsd * (l.dutyRate / 100);
    const vatUsd = (subtotalUsd + dutyUsd) * (l.vatRate / 100);
    const totalUsd = subtotalUsd + dutyUsd + vatUsd;
    return { desc: l.description, hscode: l.hscode, qty: l.qty, unitPriceUsd: l.unitPriceUsd, subtotalUsd, dutyUsd, vatUsd, totalUsd, totalKes: totalUsd * fxRate };
  });
  const cfrUsd = lineItems.reduce((s, l) => s + l.subtotalUsd, 0);
  const dutyUsd = lineItems.reduce((s, l) => s + l.dutyUsd, 0);
  const vatUsd = lineItems.reduce((s, l) => s + l.vatUsd, 0);
  const totalUsd = lineItems.reduce((s, l) => s + l.totalUsd, 0);
  return { lineItems, totals: { cfrUsd, dutyUsd, vatUsd, totalUsd, totalKes: totalUsd * fxRate } };
}

// ---------------------------------------------------------------------------
// Backend tree & Postman collection (API / admin tab)
// ---------------------------------------------------------------------------

export const BACKEND_TREE = [
  { path: "supabase/migrations", note: "RLS + seed SQL (10 files)", depth: 0 },
  { path: "src/integrations/supabase/client.ts", note: "createClient — anon key", depth: 0 },
  { path: "src/lib/trade-store.ts", note: "Datasets & dictionaries above", depth: 0 },
  { path: "src/App.tsx", note: "Single-page TradeOS shell", depth: 0 },
  { path: "supabase/functions/webhook-escrow", note: "Create + release escrow", depth: 1 },
  { path: "supabase/functions/fx-rates", note: "Daily ECB/NBE FX snapshot", depth: 1 },
  { path: "supabase/functions/price-feeds", note: "Commodity feed aggregator", depth: 1 },
];

export const POSTMAN_ENDPOINTS = [
  { method: "GET", full: "/rest/v1/commodity_prices?select=*&order=created_at.desc", desc: "Latest price snapshots", auth: "apikey" },
  { method: "GET", full: "/rest/v1/fx_rates?select=currency_pair,rate", desc: "FX pairs subscribed", auth: "apikey" },
  { method: "POST", full: "/rest/v1/escrow_contracts", desc: "Open a new escrow", auth: "JWT" },
  { method: "POST", full: "/functions/v1/webhook-escrow", desc: "Release escrow manually", auth: "JWT" },
  { method: "GET", full: "/rest/v1/policies?select=title,effective_from", desc: "Compliance documents", auth: "apikey" },
];