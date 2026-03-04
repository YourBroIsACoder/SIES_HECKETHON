"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import CreditScoreWidget from "@/components/CreditScoreWidget";
import CardUtilization from "@/components/CardUtilization";
import AICouncilPanel from "@/components/AICouncilPanel";
import ScoreSimulator from "@/components/ScoreSimulator";
import SpendingChart from "@/components/SpendingChart";
import ScoreUnlocks from "@/components/ScoreUnlocks";
import PaymentCalendar from "@/components/PaymentCalendar";
import { Icon, IconName } from "@/components/ui/icons";
import { userProfile } from "@/lib/data";

const statsData = [
  { label: "VantageScore 3.0", value: "742", sub: "+24 this month", color: "#34d399", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", icon: "trendingUp" as IconName },
  { label: "Active Lines", value: "4", sub: "1 high utilization", color: "#e4e4e7", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.10)", icon: "creditCard" as IconName },
  { label: "Overall Utilization", value: "37%", sub: "Target < 30%", color: "#fbbf24", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", icon: "alertTriangle" as IconName },
  { label: "Available Boost", value: "+67", sub: "Via AI actions", color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", icon: "zap" as IconName },
];

function HeroStatCard({ stat, index }: { stat: typeof statsData[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, ease: "easeOut" }}
      className="rounded-2xl p-5 relative overflow-hidden group cursor-default"
      style={{
        background: stat.bg,
        border: `1px solid ${stat.border}`,
        boxShadow: `0 0 30px ${stat.bg}`,
      }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: stat.bg, border: `1px solid ${stat.border}` }}>
          <Icon name={stat.icon} size={17} style={{ color: stat.color }} />
        </div>
        <Icon name="arrowUpRight" size={15} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      </div>
      <div>
        <p className="text-[32px] font-semibold tracking-tight leading-none mb-1" style={{ color: stat.color }}>{stat.value}</p>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.sub}</p>
      </div>
    </motion.div>
  );
}

function TabView({ tab }: { tab: string }) {
  const gridClasses = "grid grid-cols-1 xl:grid-cols-2 gap-6";

  switch (tab) {
    case "dashboard":
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
            {statsData.map((s, i) => <HeroStatCard key={s.label} stat={s} index={i} />)}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <CreditScoreWidget />
              <CardUtilization />
            </div>
            <div className="xl:col-span-3 space-y-6">
              <AICouncilPanel />
              <ScoreSimulator />
            </div>
          </div>
        </div>
      );
    case "cards":
      return (
        <div className={gridClasses}>
          <CardUtilization /><SpendingChart />
        </div>
      );
    case "insights":
      return (
        <div className={gridClasses}>
          <AICouncilPanel /><ScoreSimulator />
        </div>
      );
    case "simulator":
      return (
        <div className={gridClasses}>
          <ScoreSimulator /><ScoreUnlocks />
        </div>
      );
    case "calendar":
      return (
        <div className={gridClasses}>
          <PaymentCalendar /><CardUtilization />
        </div>
      );
    case "unlocks":
      return (
        <div className={gridClasses}>
          <ScoreUnlocks /><SpendingChart />
        </div>
      );
    default:
      return null;
  }
}

const tabTitles: Record<string, { title: string; desc: string }> = {
  dashboard: { title: "Overview", desc: "Your comprehensive financial health summary." },
  cards: { title: "Cards & Utilization", desc: "Detailed breakdown of your credit lines and balances." },
  insights: { title: "AI Intelligence", desc: "Algorithmic strategies to maximize your score." },
  simulator: { title: "Score Simulations", desc: "Predict the impact of payments and new credit." },
  calendar: { title: "Payment Timeline", desc: "Critical dates for statement closures and payments." },
  unlocks: { title: "Benefits Catalog", desc: "Premium rewards tied to credit score tiers." },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const info = tabTitles[activeTab];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }} className="min-h-screen flex flex-col lg:flex-row selection:bg-blue-500/30">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onCollapsedChange={setSidebarCollapsed} />

      <main
        className="flex-1 min-w-0 relative transition-all duration-300"
        style={{ marginLeft: isDesktop ? (sidebarCollapsed ? 72 : 260) : 0 }}
      >
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 w-full pb-20 pt-20 lg:pt-10 lg:pb-10">

          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold tracking-tight text-zinc-100 mb-1"
              >
                {info.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="text-zinc-400 text-sm"
              >
                {info.desc}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-sm font-medium"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </div>
              <div className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-300">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              <TabView tab={activeTab} />
            </motion.div>
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
