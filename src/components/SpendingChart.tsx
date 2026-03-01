"use client";

import { PieChart, Pie, Cell, Tooltip as RCTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { categorySpending } from "@/lib/data";
import { Card, CardHeader, Badge, Divider } from "./ui/components";
import { Icon } from "./ui/icons";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="px-3 py-2.5 rounded-xl shadow-xl min-w-[170px]"
            style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12 }}>
            <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-white">{d.category}</span>
                <span className="text-zinc-300 font-mono">₹{(d.amount / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex justify-between text-zinc-500 mb-2">
                <span>Card</span><span className="text-zinc-400">{d.card}</span>
            </div>
            <div className={`flex items-center gap-1.5 pt-1.5 border-t border-zinc-800`}
                style={{ color: d.optimal ? "#34d399" : "#fbbf24" }}>
                <Icon name={d.optimal ? "checkCircle" : "alertCircle"} size={11} />
                <span className="font-medium text-[11px]">{d.optimal ? "Optimal Match" : "Sub-optimal"}</span>
            </div>
        </div>
    );
}

export default function SpendingChart() {
    const suboptimal = categorySpending.filter(c => !c.optimal);

    return (
        <Card>
            <CardHeader
                title="Spending Intelligence"
                subtitle="Category analysis & reward optimization"
                icon="shoppingBag"
                action={suboptimal.length > 0
                    ? <Badge variant="warning">{suboptimal.length} sub-optimal</Badge>
                    : <Badge variant="success">Optimized</Badge>}
            />

            <div className="grid grid-cols-2 gap-6 items-center">
                {/* Donut */}
                <div className="relative h-48 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={categorySpending} cx="50%" cy="50%"
                                innerRadius={52} outerRadius={74}
                                paddingAngle={4} dataKey="amount" stroke="none">
                                {categorySpending.map((entry, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]}
                                        opacity={entry.optimal ? 0.9 : 0.3} />
                                ))}
                            </Pie>
                            <RCTooltip content={<CustomTooltip />} cursor={false} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold tracking-tight text-white">₹83K</span>
                        <span className="text-[9px] uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>Monthly</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="space-y-2.5">
                    {categorySpending.map((cat, i) => (
                        <div key={cat.category} className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: COLORS[i], opacity: cat.optimal ? 1 : 0.35, boxShadow: cat.optimal ? `0 0 6px ${COLORS[i]}80` : "none" }} />
                            <div className="flex-1 flex justify-between items-center min-w-0">
                                <span className="text-sm truncate mr-2" style={{ color: "var(--text-secondary)", opacity: cat.optimal ? 1 : 0.5 }}>{cat.category}</span>
                                <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>{cat.percentage}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Divider />

            {/* Bar chart */}
            <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categorySpending} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barSize={14}>
                        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="category" tick={{ fill: "#71717a", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#71717a", fontSize: 9 }} axisLine={false} tickLine={false}
                            tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                        <RCTooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                        <Bar dataKey="amount" radius={[5, 5, 0, 0]}>
                            {categorySpending.map((entry, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={entry.optimal ? 0.9 : 0.25} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Suboptimal callouts */}
            {suboptimal.length > 0 && (
                <div className="mt-3 space-y-2">
                    {suboptimal.map(cat => (
                        <div key={cat.category} className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
                            <Icon name="alertTriangle" size={13} style={{ color: "#fbbf24" }} />
                            <p className="text-xs" style={{ color: "rgba(253,230,138,0.7)" }}>
                                <strong className="text-amber-300">{cat.category}</strong> on {cat.card} — switch card for better rewards
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
