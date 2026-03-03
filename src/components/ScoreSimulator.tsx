"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { scoreSimulations, spendingData } from "@/lib/data";
import { Card, CardHeader, Badge, Button } from "./ui/components";
import { Icon } from "./ui/icons";
import { motion } from "framer-motion";

function CheckBox({ active }: { active: boolean }) {
    return (
        <div className="w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0"
            style={{
                background: active ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${active ? "#3b82f6" : "rgba(255,255,255,0.12)"}`,
                boxShadow: active ? "0 0 10px rgba(59,130,246,0.4)" : "none",
            }}>
            {active && <Icon name="check" size={11} style={{ color: "#fff" }} />}
        </div>
    );
}

export default function ScoreSimulator() {
    const [selected, setSelected] = useState<number[]>([]);
    const boost = selected.reduce((s, i) => s + scoreSimulations[i].impact, 0);
    const base = 742;

    const toggle = (i: number) =>
        setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);

    const projectedData = [
        ...spendingData,
        ...(boost > 0 ? [{ month: "Mar", score: base + Math.round(boost * 0.6), utilization: 28 }, { month: "Apr", score: base + boost, utilization: 22 }] : []),
    ];

    return (
        <Card>
            <CardHeader
                title="Simulations Hub"
                subtitle="Historical trend & what-if scenarios"
                icon="activity"
                action={boost > 0
                    ? <Badge variant="success">Projected: {base + boost}</Badge>
                    : undefined}
            />

            {/* Chart */}
            <div className="h-40 w-full mb-6 relative" style={{ minHeight: 160, minWidth: 10 }}>
                <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={projectedData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[680, 810]} tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={false}
                            contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "white", fontSize: "12px", padding: "8px 12px" }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fill="url(#simGrad)"
                            dot={{ r: 3, fill: "#18181b", stroke: "#3b82f6", strokeWidth: 2 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Boost banner */}
            {boost > 0 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-4 px-4 py-3 rounded-xl flex items-center justify-between"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", boxShadow: "0 0 20px rgba(16,185,129,0.08)" }}>
                    <span className="text-sm font-semibold" style={{ color: "#34d399" }}>Stacked impact</span>
                    <span className="text-lg font-bold tabular-nums" style={{ color: "#34d399" }}>+{boost} pts → {base + boost}</span>
                </motion.div>
            )}

            {/* Actions */}
            <div className="space-y-2">
                <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Recommended Actions</h3>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>Select to stack</span>
                </div>

                {scoreSimulations.map((sim, i) => {
                    const active = selected.includes(i);
                    const effortVariant = sim.effort === "High" ? "danger" : sim.effort === "Medium" ? "warning" : "success";

                    return (
                        <motion.button key={i} whileTap={{ scale: 0.99 }} onClick={() => toggle(i)}
                            className="w-full text-left p-3.5 rounded-2xl flex justify-between items-center transition-all"
                            style={{
                                background: active ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
                                border: `1px solid ${active ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.06)"}`,
                                boxShadow: active ? "0 0 16px rgba(59,130,246,0.08)" : "none",
                            }}>
                            <div className="flex items-start gap-3">
                                <CheckBox active={active} />
                                <div>
                                    <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{sim.action}</p>
                                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sim.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-3">
                                <Badge variant={effortVariant as any}>{sim.effort}</Badge>
                                <span className="text-base font-bold tabular-nums w-10 text-right"
                                    style={{ color: active ? "#34d399" : "var(--text-muted)" }}>
                                    +{sim.impact}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </Card>
    );
}
