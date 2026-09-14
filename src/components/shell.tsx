import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bell, Calculator, CheckCircle, Globe, HandCoins, MapPin, Package, Scales,
  SuitcaseSimple, TrendUp, Truck, Waveform, Wrench, X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { LanguageCode } from "../lib/translations";
import { SUPPORTED_LANGUAGES, t } from "../lib/translations";
import type { CommodityPrice, Shipment } from "../lib/trade-store";
import { formatNumber } from "../lib/trade-store";

export type TabId = "dashboard" | "prices" | "policy" | "boq" | "directory" | "escrow" | "logistics" | "admin";

export const NAV: { id: TabId; label: string; icon: Icon }[] = [
  { id: "dashboard", label: "Dashboard", icon: TrendUp },
  { id: "prices", label: "Price Discovery", icon: Waveform },
  { id: "policy", label: "Policy & Compliance", icon: Scales },
  { id: "boq", label: "BOQ Simulator", icon: Calculator },
  { id: "directory", label: "Trade Directory", icon: SuitcaseSimple },
  { id: "escrow", label: "Escrow & Payments", icon: HandCoins },
  { id: "logistics", label: "Logistics & Tracking", icon: Truck },
  { id: "admin", label: "Settings & API", icon: Wrench },
];

export function StatCard({ label, value, sub, tone = "default" }: { label: string; value: string; sub?: string; tone?: "default" | "up" | "down" }) {
  const toneCls = tone === "up" ? "text-emerald-400" : tone === "down" ? "text-rose-400" : "text-foreground";
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${toneCls}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground truncate">{sub}</p>}
    </motion.div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function TickerStrip({ prices, lang }: { prices: CommodityPrice[]; lang: LanguageCode }) {
  const items = prices.slice(0, 8);
  return (
    <div className="relative overflow-hidden border-b bg-slate-950/80" dir={lang === "am" || lang === "ti" ? "rtl" : "ltr"}>
      <div className="flex animate-[ticker_45s_linear_infinite] gap-8 py-2 whitespace-nowrap px-4">
        {[...items, ...items].map((p, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-mono">
            <span className="font-semibold text-slate-200">{p.name}</span>
            <span className="text-slate-400 tabular-nums">${formatNumber(p.priceUsd)}</span>
            <span className={p.change24hPct >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {p.change24hPct >= 0 ? "+" : ""}{p.change24hPct}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function TopBar({ lang, setLang, freeQueries, onLogin, onRegister, onNotify }: {
  lang: LanguageCode; setLang: (l: LanguageCode) => void; freeQueries: number;
  onLogin: () => void; onRegister: () => void; onNotify: () => void;
}) {
  const [open, setOpen] = useState(false);
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === lang)!;
  return (
    <header className="sticky top-0 z-40 border-b bg-slate-950/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 font-mono text-lg font-black text-emerald-950">K</div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-none">KonjoDuka <span className="text-emerald-400">TradeOS</span></p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">Kenya ↔ Ethiopia Corridor</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs md:flex">
            <Bell size={14} className="text-muted-foreground" />
            <span className="font-mono font-semibold text-amber-400">{freeQueries}</span>
            <span className="text-muted-foreground">free queries today</span>
          </div>

          <div className="relative">
            <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/60">
              <Globe size={14} className="text-emerald-400" />
              {current.nativeName}
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border bg-card shadow-xl"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setOpen(false); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-slate-900 ${lang === l.code ? "text-emerald-400" : "text-slate-200"}`}
                      dir={l.isRtl ? "rtl" : "ltr"}
                    >
                      <span>{l.nativeName}</span>
                      {lang === l.code && <CheckCircle size={14} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={onNotify} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/60">
            <Bell size={14} /> <span className="hidden sm:inline">Alerts</span>
          </button>
          <button onClick={onRegister} className="hidden rounded-full border px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/60 sm:block">{t(lang, "register")}</button>
          <button onClick={onLogin} className="rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-emerald-950 hover:bg-emerald-400">{t(lang, "login")}</button>
        </div>
      </div>
    </header>
  );
}

export function SideNav({ tab, setTab, nav, lang }: { tab: TabId; setTab: (t: TabId) => void; nav: typeof NAV; lang: LanguageCode }) {
  return (
    <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-52 shrink-0 flex-col gap-1 overflow-y-auto border-r bg-slate-950/60 p-3 lg:flex">
      <p className="px-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Workspace</p>
      {nav.map((item) => {
        const Icon = item.icon;
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-emerald-500/15 text-emerald-400" : "text-muted-foreground hover:bg-slate-900 hover:text-slate-200"}`}
          >
            <Icon size={17} weight={active ? "fill" : "regular"} />
            {item.label}
          </button>
        );
      })}
      <div className="mt-auto rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
        <p className="text-xs font-semibold text-emerald-400">AfCFTA Week</p>
        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">60% regional value content confirmed for pulses & grains.</p>
      </div>
    </aside>
  );
}

export function MobileNav({ tab, setTab, nav, lang }: { tab: TabId; setTab: (t: TabId) => void; nav: typeof NAV; lang: LanguageCode }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex gap-1 overflow-x-auto border-t bg-slate-950/95 px-2 py-2 backdrop-blur lg:hidden">
      {nav.map((item) => {
        const Icon = item.icon;
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            title={item.label}
            className={`flex min-w-[52px] flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium ${active ? "bg-emerald-500/15 text-emerald-400" : "text-muted-foreground"}`}
          >
            <Icon size={18} weight={active ? "fill" : "regular"} />
            <span className="max-w-14 truncate">{item.label.split(" ")[0]}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function LoginModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{mode === "login" ? "Welcome back" : "Create account"}</h3>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-slate-900"><X size={16} /></button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Kenya · Ethiopia · Djibouti · Uganda · Tanzania</p>
        <div className="mt-5 space-y-3">
          <input placeholder="work@company.com" className="w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500/60" />
          <input type="password" placeholder="Password" className="w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500/60" />
          <button onClick={onClose} className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-400">
            {mode === "login" ? "Log in → TradeOS" : "Register with NIDA / KRA"}
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {mode === "login" ? "New to TradeOS? " : "Already registered? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-semibold text-emerald-400">
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const id = setTimeout(onClose, 2600);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-slate-900 px-4 py-3 text-sm shadow-xl lg:bottom-6">
      <Bell size={16} className="text-emerald-400" />
      <span>{msg}</span>
    </div>
  );
}

export function ShipmentCard({ shipment }: { shipment: Shipment }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-sky-500/10 p-1.5 text-sky-400"><Package size={16} /></span>
          <div>
            <p className="font-mono text-sm font-semibold">{shipment.id}</p>
            <p className="text-[11px] text-muted-foreground">{shipment.mode} · {shipment.route}</p>
          </div>
        </div>
        <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-400">{shipment.status}</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Truck size={14} /> {shipment.progressPct}%</span>
        <span className="flex items-center gap-1"><MapPin size={14} /> ETA {shipment.eta}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-sky-400" style={{ width: `${shipment.progressPct}%` }} />
      </div>
      <ol className="mt-4 space-y-0">
        {shipment.waypoints.map((w, i) => (
          <li key={i} className="relative flex gap-3 pb-3 last:pb-0">
            {i < shipment.waypoints.length - 1 && <span className="absolute top-4 left-[7px] h-full w-px bg-slate-700" />}
            <span className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${w.done ? "border-emerald-400 bg-emerald-400" : "border-slate-600 bg-card"}`} />
            <div className="flex flex-1 items-center justify-between text-xs">
              <div>
                <p className={w.done ? "font-medium text-slate-200" : "text-muted-foreground"}>{w.name}</p>
                <p className="text-[11px] text-muted-foreground">{w.loc}</p>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">{w.time}</span>
            </div>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

function PackageIcon() {
  return <Package size={16} />;
}