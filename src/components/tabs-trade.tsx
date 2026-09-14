import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Package } from "@phosphor-icons/react";
import {
  DIRECTORY_CATEGORIES, MOCK_DIRECTORY, MOCK_ESCROW, escrowReleaseSummary,
  MOCK_SHIPMENTS, BACKEND_TREE, POSTMAN_ENDPOINTS, fmtCompact, formatNumber,
} from "../lib/trade-store";
import { SectionHeader, ShipmentCard } from "./shell";

const KES_PER_USD = 129.5;
const STATUS_STYLES: Record<string, string> = {
  released: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  funded: "bg-sky-500/15 text-sky-400 ring-sky-500/30",
  hold: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  pending: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
  disputed: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
  refunded: "bg-violet-500/15 text-violet-400 ring-violet-500/30",
};

export function DirectoryTab() {
  const [cat, setCat] = useState("ALL");
  const cats = useMemo(() => ["ALL", ...Array.from(new Set(MOCK_DIRECTORY.map((d) => d.category)))], []);
  const list = cat === "ALL" ? MOCK_DIRECTORY : MOCK_DIRECTORY.filter((d) => d.category === cat);
  return (
    <div className="space-y-4">
      <SectionHeader title="Verified trade directory" subtitle="SMEs, mills, logistics & agencies across the corridor" />
      <div className="flex flex-wrap gap-1.5">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${cat === c ? "bg-emerald-500 text-emerald-950" : "border bg-card text-muted-foreground hover:border-slate-600"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((d) => (
          <motion.div key={d.id} whileHover={{ y: -2 }} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{d.flag}</span>
                <div>
                  <p className="text-sm font-semibold leading-snug">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground">{d.country} · {d.category}</p>
                </div>
              </div>
              {d.verified && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle size={12} /> Verified
                </span>
              )}
            </div>
            <p className="mt-2.5 text-sm text-muted-foreground">{d.description}</p>
            <div className="mt-3 flex items-center justify-between border-t pt-2.5">
              <span className="text-xs text-muted-foreground">Rating</span>
              <span className="font-mono text-sm font-semibold text-amber-400">★ {d.rating.toFixed(1)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function EscrowTab() {
  const total = escrowReleaseSummary.reduce((s, e) => s + (e.currency === "KES" ? e.value : e.value * KES_PER_USD), 0);
  return (
    <div className="space-y-4">
      <SectionHeader title="Escrow & payments" subtitle="Funds held in trust until customs clearance + delivery confirmation" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {escrowReleaseSummary.map((e) => (
          <div key={e.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{e.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
              {e.currency === "KES" ? "KSh " : "$"}{fmtCompact(e.value)}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-xs text-muted-foreground">Total trust value</p>
        <p className="mt-1 font-mono text-3xl font-bold tabular-nums">KSh {fmtCompact(total)}</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {MOCK_ESCROW.map((c) => (
          <motion.div key={c.id} whileHover={{ y: -2 }} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{c.flag}</span>
                <div>
                  <p className="text-sm font-semibold">{c.counterpart}</p>
                  <p className="text-[11px] text-muted-foreground">{c.commodity}</p>
                </div>
              </div>
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ring-1 ${STATUS_STYLES[c.status] ?? STATUS_STYLES.pending}`}>{c.status}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-sm text-muted-foreground">{c.id} · {c.updatedAgo}</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{c.valueCurrency === "KES" ? "KSh" : "$"}{formatNumber(c.value)}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className={`h-full rounded-full ${c.status === "disputed" ? "bg-rose-400" : "bg-emerald-400"}`} style={{ width: `${c.progressPct}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function LogisticsTab() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Corridor visibility" subtitle="Moyale & Northern Corridor waypoint tracking — live telemetry" />
      <div className="grid gap-4 lg:grid-cols-2">
        {MOCK_SHIPMENTS.map((s) => (
          <ShipmentCard key={s.id} shipment={s} />
        ))}
      </div>
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-200">
          <Package size={16} className="text-sky-400" />
          <p className="text-sm font-semibold">Consignment insights</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Avg. dwell time at Moyale OSCB: <span className="font-mono text-slate-300">14h 20m</span> — down 22% after the single-window
          rollout. Cold-chain share of corridor volume: 9%.
        </p>
      </div>
    </div>
  );
}

export function AdminTab() {
  const [copied, setCopied] = useState("");
  const copy = (s: string) => {
    navigator.clipboard?.writeText(s).catch(() => undefined);
    setCopied(s);
    setTimeout(() => setCopied(""), 1500);
  };
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <SectionHeader title="Backend tree" subtitle="Supabase + edge functions layout" />
        <div className="mt-3 space-y-1 font-mono text-xs">
          {BACKEND_TREE.map((n, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-900/60" style={{ paddingLeft: `${12 + n.depth * 16}px` }}>
              <span className="text-emerald-400">{n.depth === 0 ? "📦" : "⚡"}</span>
              <span className="text-slate-200">{n.path}</span>
              <span className="ml-auto hidden text-[10px] text-muted-foreground sm:block">{n.note}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <SectionHeader title="Postman collection" subtitle="Click an endpoint to copy" />
        <div className="mt-3 space-y-2">
          {POSTMAN_ENDPOINTS.map((e, i) => (
            <button key={i} onClick={() => copy(e.full)} className="block w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-left font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${e.method === "GET" ? "bg-sky-500/15 text-sky-400" : "bg-amber-500/15 text-amber-400"}`}>{e.method}</span>
                <span className="truncate text-slate-300">{e.full}</span>
                <span className="ml-auto shrink-0 text-[10px] text-slate-500">{e.auth}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{e.desc}{copied === e.full && <span className="text-emerald-400"> · copied ✓</span>}</p>
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-400/90">
          <span className="font-semibold">Sandbox note:</span> Runs on in-memory datasets from <code className="font-mono">lib/trade-store.ts</code>; connect Supabase REST endpoints here to go live.
        </div>
      </div>
      <div className="rounded-xl border bg-card p-4 shadow-sm lg:col-span-2">
        <SectionHeader title="Directory categories" subtitle={`${DIRECTORY_CATEGORIES.length} active verticals on the platform`} />
        <div className="mt-3 flex flex-wrap gap-2">
          {DIRECTORY_CATEGORIES.map((c) => (
            <span key={c} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}