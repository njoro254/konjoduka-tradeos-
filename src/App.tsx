import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "@phosphor-icons/react";
import type { LanguageCode } from "./lib/translations";
import { t } from "./lib/translations";
import { NAV, TopBar, SideNav, MobileNav, TickerStrip, LoginModal, Toast } from "./components/shell";
import type { TabId } from "./components/shell";
import { useLivePrices, DashboardTab, PricesTab } from "./components/tabs-overview";
import { PolicyTab, BoqTab } from "./components/tabs-operations";
import { DirectoryTab, EscrowTab, LogisticsTab, AdminTab } from "./components/tabs-trade";

export default function App() {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [lang, setLang] = useState<LanguageCode>("en");
  const [freeQueries, setFreeQueries] = useState(3);
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { prices } = useLivePrices();
  const shellRef = useRef<HTMLDivElement>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setFreeQueries((q) => Math.max(0, q - 1));
  };

  const tabLabel = (id: TabId) => {
    const en = NAV.find((n) => n.id === id)!.label;
    if (lang === "en") return en;
    const key = id === "policy" ? "policy" : id === "directory" ? "directory" : id === "escrow" ? "escrow" : id === "logistics" ? "logistics" : id === "admin" ? "admin" : id;
    const tr = t(lang, key as any);
    return tr && !tr.startsWith("t:") ? tr : en;
  };

  useEffect(() => {
    const onResize = () => undefined;
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div ref={shellRef} dir={lang === "am" || lang === "ti" ? "rtl" : "ltr"} className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <TopBar
        lang={lang}
        setLang={setLang}
        freeQueries={freeQueries}
        onLogin={() => setLoginOpen(true)}
        onRegister={() => setLoginOpen(true)}
        onNotify={() => notify("3 new price alerts · sesame BUY signal at $1,204")}
      />
      <TickerStrip prices={prices} lang={lang} />

      <div className="flex">
        <SideNav tab={tab} setTab={setTab} nav={NAV} lang={lang} />
        <main className="min-w-0 flex-1 px-4 py-6 pb-24 lg:px-6 lg:pb-8">
          <div className="mb-5 flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{tabLabel(tab)}</h1>
            <p className="text-sm text-muted-foreground">{t(lang, "guest_msg")}</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {tab === "dashboard" && <DashboardTab prices={prices} lang={lang} />}
              {tab === "prices" && <PricesTab prices={prices} lang={lang} />}
              {tab === "policy" && <PolicyTab lang={lang} />}
              {tab === "boq" && <BoqTab />}
              {tab === "directory" && <DirectoryTab />}
              {tab === "escrow" && <EscrowTab />}
              {tab === "logistics" && <LogisticsTab />}
              {tab === "admin" && <AdminTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileNav tab={tab} setTab={setTab} nav={NAV} lang={lang} />
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}