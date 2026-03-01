"use client";

import { motion } from "framer-motion";
import { userProfile } from "@/lib/data";
import { Card, CardHeader, Badge, Button } from "./ui/components";
import { Icon } from "./ui/icons";

export default function CreditScoreWidget() {
    const diff = userProfile.creditScore - userProfile.previousScore;
    const progress = ((userProfile.creditScore - 300) / 550) * 100;
    const toNext = userProfile.nextMilestone - userProfile.creditScore;

    return (
        <Card glow className="flex flex-col">
            <CardHeader
                title="Credit Score"
                subtitle="Last synced today"
                icon="gauge"
                action={<Badge variant={diff >= 0 ? "success" : "danger"}>{diff >= 0 ? "+" : ""}{diff} pts</Badge>}
            />

            <div className="flex-1 flex flex-col justify-center items-center py-6">
                <div className="relative">
                    <svg className="w-56 h-32" viewBox="0 0 200 100">
                        <defs>
                            <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="35%" stopColor="#f59e0b" />
                                <stop offset="65%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        {/* Track */}
                        <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
                        {/* Glow layer */}
                        <motion.path
                            d="M 20 90 A 80 80 0 0 1 180 90"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="18"
                            strokeLinecap="round"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 * (1 - progress / 100)}
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 * (1 - progress / 100) }}
                            transition={{ duration: 1.8, ease: "easeOut" }}
                            opacity={0.3}
                            filter="url(#glow)"
                        />
                        {/* Main arc */}
                        <motion.path
                            d="M 20 90 A 80 80 0 0 1 180 90"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 * (1 - progress / 100)}
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 * (1 - progress / 100) }}
                            transition={{ duration: 1.8, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                        <motion.span
                            className="font-semibold leading-none tracking-tighter text-white"
                            style={{ fontSize: "3.2rem" }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            {userProfile.creditScore}
                        </motion.span>
                        <span className="text-[10px] uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>
                            {userProfile.scoreCategory}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-muted)" }}>Next: {userProfile.nextMilestone}</span>
                    <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{toNext} pts away</span>
                </div>
                {/* Mini progress to milestone */}
                <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #10b981, #3b82f6)", boxShadow: "0 0 8px rgba(59,130,246,0.5)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(0, ((userProfile.creditScore - 700) / (userProfile.nextMilestone - 700)) * 100)}%` }}
                        transition={{ delay: 0.6, duration: 1.2 }}
                    />
                </div>

                {/* Score factor pills */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                        { label: "Payment History", val: "100%", good: true },
                        { label: "Utilization", val: "37%", good: false },
                        { label: "Credit Age", val: "4.2 yrs", good: true },
                        { label: "Hard Inquiries", val: "1", good: true },
                    ].map(f => (
                        <div key={f.label} className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <span className="text-[10px] truncate pr-1" style={{ color: "var(--text-muted)" }}>{f.label}</span>
                            <span className="text-[11px] font-semibold shrink-0" style={{ color: f.good ? "#34d399" : "#fbbf24" }}>{f.val}</span>
                        </div>
                    ))}
                </div>

                <Button variant="secondary" icon="arrowRight" className="w-full mt-2">
                    View full report
                </Button>
            </div>
        </Card>
    );
}
