import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, MagnifyingGlass } from "@phosphor-icons/react";
import type { LanguageCode } from "../lib/translations";
import { t } from "../lib/translations";
import { MOCK_POLICIES, BOQ_CATEGORY_TEMPLATES, simulateBoq, fmtCompact, formatNumber } from "../lib/trade-store";
import { SectionHeader } from "./shell";

const KES_PER_USD = 129.5;

export function PolicyTab({ lang }: { lang: LanguageCode }) {
  const [q, setQ] = useState("");
  const filtered = MOCK_POLICIES.filter((p) =>
    (p.title + p.summary + p.tags.join(" ") + p.type).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="grid gap-4">
      <div className="relative">
        <MagnifyingGlass size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t(lang, "search_placeholder")}
          className="w-full rounded-xl border bg-card py-3 pr-4 pl-10 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus:border-emerald-500/60"
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((p) => (
          <motion.div key={p.id} whileHover={{ y: -2 }} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-500/10 p-1.5 text-emerald-400"><FileText size={16} /></span>
                <div>
                  <p className="text-sm font-semibold leading-snug">{p.title}</p>
                  <p className="text-[11px] text-muted-foreground">{p.origin} · {p.destination} · {p.effective}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-md bg-slate-500/10 px-2 py-0.5 text-[11px] font-medium text-slate-300">{p.type}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] text-slate-300">{tag}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No policies match “{q}”.</div>
      )}
    </div>
  );
}

export function BoqTab() {
  const categories = useMemo(() => Object.keys(BOQ_CATEGORY_TEMPLATES), []);
  const [cat, setCat] = useState(categories[0]);
  const [lines, setLines] = useState(BOQ_CATEGORY_TEMPLATES[cat].map((l) => ({ ...l })));
  const [fx, setFx] = useState(KES_PER_USD);

  const switchCat = (c: string) => {
    setCat(c);
    setLines(BOQ_CATEGORY_TEMPLATES[c].map((l) => ({ ...l })));
  };

  const update = (i: number, key: "qty" | "unitPriceUsd" | "dutyRate" | "vatRate", v: number) => {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, [key]: v } : l)));
  };

  const result = useMemo(() => simulateBoq(lines, fx), [lines, fx]);
  const dutyPct = result.totals.cfrUsd > 0 ? (result.totals.dutyUsd / result.totals.cfrUsd) * 100 : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="space-y-3 lg:col-span-2">
        <SectionHeader title="Bill of Quantities" subtitle="Landing-duty simulation per HS line" />
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => switchCat(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${cat === c ? "bg-emerald-500 text-emerald-950" : "border bg-card text-muted-foreground hover:border-slate-600"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
          {lines.map((l, i) => (
            <div key={l.hscode + i} className="rounded-xl border bg-card p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{l.description}</p>
                <span className="font-mono text-[11px] text-muted-foreground">{l.hscode}</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {(["qty", "unitPriceUsd", "dutyRate", "vatRate"] as const).map((key) => (
                  <label key={key} className="block">
                    <span className="text-[10px] text-muted-foreground uppercase">{key === "qty" ? "Qty" : key === "unitPriceUsd" ? "USD/unit" : key === "dutyRate" ? "Duty %" : "VAT %"}</span>
                    <input
                      type="number"
                      value={l[key]}
                      onChange={(e) => update(i, key, Number(e.target.value))}
                      className="mt-0.5 w-full rounded-md border bg-slate-950 px-2 py-1 font-mono text-xs outline-none focus:border-emerald-500/60"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 lg:col-span-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <SectionHeader title="Duty breakdown" subtitle={`FX: USD → KES ${formatNumber(fx)}`} />
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground"><span>CIF value</span><span className="font-mono">${fmtCompact(result.totals.cfrUsd)}</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-slate-400" style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground"><span>Import duty ({dutyPct.toFixed(1)}%)</span><span className="font-mono text-amber-400">${fmtCompact(result.totals.dutyUsd)}</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(100, dutyPct)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground"><span>VAT</span><span className="font-mono text-sky-400">${fmtCompact(result.totals.vatUsd)}</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.min(100, (result.totals.vatUsd / result.totals.cfrUsd) * 100)}%` }} />
              </div>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-4">
              <p className="text-xs text-emerald-400/80 uppercase tracking-wide">Landing cost estimate</p>
              <p className="mt-1 font-mono text-3xl font-bold text-emerald-400 tabular-nums">
                KSh {fmtCompact(result.totals.totalKes)}
              </p>
              <p className="text-xs text-muted-foreground">≈ ${fmtCompact(result.totals.totalUsd)} · all-in incl. duty + VAT</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <SectionHeader title="Line items" />
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-[11px] text-muted-foreground uppercase">
                  <th className="pb-2 pr-3 font-medium">Description</th>
                  <th className="pb-2 pr-3 font-medium">HS</th>
                  <th className="pb-2 pr-3 text-right font-medium">Qty</th>
                  <th className="pb-2 pr-3 text-right font-medium">USD total</th>
                  <th className="pb-2 text-right font-medium">KES total</th>
                </tr>
              </thead>
              <tbody>
                {result.lineItems.map((li, i) => (
                  <tr key={i} className="border-b border-slate-800/60">
                    <td className="py-2 pr-3 text-slate-200">{li.desc}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">{li.hscode}</td>
                    <td className="py-2 pr-3 text-right font-mono tabular-nums">{li.qty}</td>
                    <td className="py-2 pr-3 text-right font-mono tabular-nums">${formatNumber(li.totalUsd)}</td>
                    <td className="py-2 text-right font-mono tabular-nums">KSh {fmtCompact(li.totalKes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}