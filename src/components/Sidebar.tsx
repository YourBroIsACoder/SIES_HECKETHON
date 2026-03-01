"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { userProfile } from "@/lib/data";
import { Icon } from "./ui/icons";
import { useTheme } from "next-themes";

const navItems = [
    { id: "dashboard", label: "Overview", iconName: "layoutGrid" as const },
    { id: "cards", label: "My Cards", iconName: "creditCard" as const },
    { id: "insights", label: "AI Council", iconName: "zap" as const },
    { id: "simulator", label: "Score Simulator", iconName: "activity" as const },
    { id: "calendar", label: "Pay Calendar", iconName: "calendar" as const },
    { id: "unlocks", label: "Score Unlocks", iconName: "target" as const },
];

export default function Sidebar({ activeTab, onTabChange, onCollapsedChange }: {
    activeTab: string;
    onTabChange: (id: string) => void;
    onCollapsedChange?: (collapsed: boolean) => void;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    function setCollapsedWithCallback(val: boolean) {
        setCollapsed(val);
        onCollapsedChange?.(val);
    }

    useEffect(() => {
        setMounted(true);
        const handleResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-6 left-6 z-40 w-10 h-10 bg-[#121214] border border-white/10 rounded-xl flex items-center justify-center text-zinc-400"
            >
                <Icon name="menu" size={20} />
            </button>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <motion.aside
                animate={{ width: collapsed ? 72 : 260 }}
                transition={{ type: "spring", stiffness: 380, damping: 38 }}
                style={{ backgroundColor: "var(--bg-sidebar)", borderColor: "var(--border-subtle)" }}
                className={`fixed left-0 top-0 h-full z-50 border-r flex flex-col overflow-hidden
                    lg:translate-x-0 transition-transform duration-300
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    {/* Logo — hidden when collapsed */}
                    <motion.div
                        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2.5 overflow-hidden shrink-0"
                    >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black text-xs shrink-0">
                            CQ
                        </div>
                        <span className="text-zinc-100 font-bold tracking-tight whitespace-nowrap">CreditIQ</span>
                    </motion.div>

                    {/* When collapsed, show only the logo icon */}
                    {collapsed && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black text-xs mx-auto">
                            CQ
                        </div>
                    )}

                    {/* Right controls — only on desktop */}
                    {!collapsed && (
                        <div className="hidden lg:flex items-center gap-1 shrink-0">
                            <button
                                className="flex items-center justify-center text-zinc-500 hover:text-white w-7 h-7 rounded-lg hover:bg-zinc-800 transition-colors"
                                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                                title="Toggle theme"
                            >
                                {mounted && resolvedTheme !== "dark" ? <Icon name="moon" size={15} /> : <Icon name="sun" size={15} />}
                            </button>
                            <button
                                className="flex items-center justify-center text-zinc-500 hover:text-white w-7 h-7 rounded-lg hover:bg-zinc-800 transition-colors"
                                onClick={() => setCollapsedWithCallback(true)}
                                title="Collapse sidebar"
                            >
                                <Icon name="chevronLeft" size={15} />
                            </button>
                            <button
                                className="lg:hidden text-zinc-500 hover:text-white w-7 h-7 rounded-lg hover:bg-zinc-800 flex items-center justify-center"
                                onClick={() => setMobileOpen(false)}
                            >
                                <Icon name="x" size={15} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Expand button — shown as floating pill when collapsed */}
                {collapsed && (
                    <div className="flex justify-center pt-3 pb-1">
                        <button
                            onClick={() => setCollapsedWithCallback(false)}
                            className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                            title="Expand sidebar"
                        >
                            <Icon name="chevronLeft" size={16} style={{ transform: "rotate(180deg)" }} />
                        </button>
                    </div>
                )}

                {/* Nav */}
                <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {!collapsed && (
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-2 mb-3 mt-1 select-none">
                            Menu
                        </p>
                    )}
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onTabChange(item.id);
                                if (mobileOpen) setMobileOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-colors
                                ${collapsed ? "justify-center" : ""}
                                ${activeTab === item.id
                                    ? "bg-zinc-800 text-white"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon name={item.iconName} size={18} style={{ color: activeTab === item.id ? "#e4e4e7" : "#71717a", flexShrink: 0 }} />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                        </button>
                    ))}
                </div>

                {/* Footer user info */}
                <div className="px-3 py-4 shrink-0" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                    <div
                        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}
                        className={`flex items-center gap-3 p-2 rounded-xl border ${collapsed ? "justify-center" : ""}`}
                    >
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                            <span className="text-zinc-300 text-xs font-semibold">{userProfile.name.charAt(0)}</span>
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-zinc-200 truncate">{userProfile.name}</p>
                                <p className="text-xs text-emerald-400 font-medium">{userProfile.creditScore} · Excellent</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
