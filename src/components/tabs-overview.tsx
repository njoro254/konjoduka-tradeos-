import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import type { LanguageCode } from "../lib/translations";
import { t } from "../lib/translations";
import { MOCK_PRICES, FX_RATES, FX_MARKERS, PRICE_ALERTS, fmtCompact, formatNumber } from "../lib/trade-store";
import type { CommodityPrice } from "../lib/trade-store";
import { StatCard, SectionHeader } from "./shell";

export function useLivePrices() {
  const [prices, setPrices] = useState(MOCK_PRICES);
  const [tick, setTick] = useState(0);
  const start = useMemo(() => Date.now(), []);
  return { prices };
}

const CHART_TOOLTIP = {
  contentStyle: { background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#e2e8f0" },
};

export function DashboardTab({ prices, lang }: { prices: CommodityPrice[]; lang: LanguageCode }) {
  const etbRate = FX_RATES.find((r) => r.from === "KES")!;
  const volume = prices.reduce((s, p) => s + p.priceUsd, 0);
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label={t(lang, "prices")} value={`$${fmtCompact(volume)}`} sub="11 tracked commodity contracts" />
        <StatCard label="ETB / KES" value={String(etbRate.rate)} tone={etbRate.spread > 1 ? "up" : "down"} sub="NBE reference, spread 0.6%" />
        <StatCard label="Corridor velocity" value="2,341" tone="up" sub="MT moved MTD · Moyale" />
        <StatCard label="Escrow in trust" value="KSh 754k" tone="up" sub="5 active contracts" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm lg:col-span-2">
          <SectionHeader title="Market snapshot" subtitle="14-day price trend · USD" />
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prices.map((p) => ({ name: p.name.split(" ")[0], value: p.priceUsd, change: p.change24hPct }))}>
                <defs>
                  <linearGradient id="gDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
                <Tooltip {...CHART_TOOLTIP} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#gDash)" name="USD / unit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {PRICE_ALERTS.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 shadow-sm">
              <div>
                <p className="font-mono text-sm font-semibold">{a.symbol}</p>
                <p className="text-[11px] text-muted-foreground">target {a.target}</p>
              </div>
              <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${a.signal === "BUY" ? "bg-emerald-500/15 text-emerald-400" : a.signal === "SELL" ? "bg-rose-500/15 text-rose-400" : "bg-amber-500/15 text-amber-400"}`}>{a.signal}</span>
            </div>
          ))}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck size={18} />
              <p className="text-sm font-semibold">AfCFTA tariff week</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Schedules of concessions updated — 60% RoO threshold confirmed on pulses.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricesTab({ prices, lang }: { prices: CommodityPrice[]; lang: LanguageCode }) {
  const [selected, setSelected] = useState(prices[0]);
  const chart = useMemo(() => selected.trend.map((v, i) => ({ day: `D${i + 1}`, value: v })), [selected]);
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {prices.map((p) => (
          <motion.button
            key={p.id}
            whileHover={{ y: -2 }}
            onClick={() => setSelected(p)}
            className={`rounded-xl border p-4 text-left shadow-sm transition-colors ${selected.id === p.id ? "border-emerald-500/60 bg-emerald-500/5" : "border bg-card hover:border-slate-600"}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">HS {p.hsCode} · {p.source}</p>
              </div>
              <span className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold ${p.change24hPct >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                {p.change24hPct >= 0 ? "+" : ""}{p.change24hPct}%
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between font-mono tabular-nums">
              <p className="text-xl font-semibold">${formatNumber(p.priceUsd)}</p>
              <p className="text-xs text-muted-foreground">KSh {fmtCompact(p.priceKes)}</p>
            </div>
            <p className="text-[11px] text-muted-foreground">per {p.unit}</p>
          </motion.button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <SectionHeader
          title={`${selected.name} · 14-day trend`}
          subtitle={`HS ${selected.hsCode} · per ${selected.unit} · USD`}
          action={
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> LIVE
            </span>
          }
        />
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="gSel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={56} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip {...CHART_TOOLTIP} />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#gSel)" name="USD" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-sm">
          <div><p className="text-[11px] text-muted-foreground">Spot</p><p className="font-mono font-semibold">${formatNumber(selected.priceUsd)}</p></div>
          <div><p className="text-[11px] text-muted-foreground">KES</p><p className="font-mono font-semibold">KSh {fmtCompact(selected.priceKes)}</p></div>
          <div><p className="text-[11px] text-muted-foreground">ETB</p><p className="font-mono font-semibold">Br {fmtCompact(selected.priceEtb)}</p></div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <SectionHeader title="Currency matrix" subtitle="Interbank reference rates · indicative" />
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {FX_RATES.map((r) => (
            <div key={`${r.from}${r.to}`} className="flex items-center justify-between rounded-lg border px-3 py-2.5">
              <span className="text-sm font-semibold">{r.from}<ArrowRight size={12} className="mx-1 inline text-muted-foreground" />{r.to}</span>
              <span className="font-mono text-sm tabular-nums">{formatNumber(r.rate, 3)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {FX_MARKERS.map((m) => (
            <span key={m.id} className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono">
              {m.instrument} <b className="tabular-nums">{m.spot}</b>
              <span className={m.chgPct >= 0 ? "text-emerald-400" : "text-rose-400"}>({m.chgPct >= 0 ? "+" : ""}{m.chgPct}%)</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}