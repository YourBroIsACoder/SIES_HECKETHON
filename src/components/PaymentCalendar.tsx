"use client";

import { motion } from "framer-motion";
import { paymentCalendar } from "@/lib/data";
import { Card, CardHeader, Badge, Divider } from "./ui/components";
import { Icon } from "./ui/icons";

export default function PaymentCalendar() {
    const urgent = paymentCalendar.filter(p => p.urgent);

    return (
        <Card>
            <CardHeader
                title="Payment Calendar"
                subtitle="Statement dates & deadlines"
                icon="calendar"
                action={urgent.length > 0
                    ? <Badge variant="danger" dot>{urgent.length} urgent</Badge>
                    : <Badge variant="success">All clear</Badge>}
            />

            <div className="relative pt-2">
                {/* Timeline track */}
                <div className="absolute left-[23px] top-4 bottom-4 w-px"
                    style={{ background: "linear-gradient(to bottom, rgba(59,130,246,0.4), rgba(59,130,246,0.05))" }} />

                <div className="space-y-4">
                    {paymentCalendar.map((item, i) => {
                        const isStatement = item.type === "statement";
                        const accentColor = item.urgent ? "#ef4444" : isStatement ? "#3b82f6" : "#10b981";

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-start gap-4 group"
                            >
                                {/* Node */}
                                <div className="relative z-10 mt-1 w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                                    style={{
                                        background: `${accentColor}12`,
                                        border: `1px solid ${accentColor}30`,
                                        boxShadow: item.urgent ? `0 0 16px ${accentColor}25` : "none"
                                    }}>
                                    <Icon
                                        name={item.urgent ? "alertCircle" : isStatement ? "clock" : "checkCircle"}
                                        size={16}
                                        style={{ color: accentColor }}
                                    />
                                </div>

                                {/* Card */}
                                <div className="flex-1 p-3.5 rounded-2xl transition-all group-hover:translate-x-0.5"
                                    style={{
                                        background: item.urgent ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.02)",
                                        border: `1px solid ${item.urgent ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
                                    }}>
                                    <div className="flex justify-between items-start mb-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="default">{item.date}</Badge>
                                            <span className="text-[10px] font-semibold uppercase tracking-wider"
                                                style={{ color: accentColor }}>
                                                {isStatement ? "Statement closes" : "Payment due"}
                                            </span>
                                        </div>
                                        {item.urgent && <Badge variant="danger" dot>Pay Today</Badge>}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.card}</h4>
                                        <span className="text-base font-bold tabular-nums"
                                            style={{ color: item.urgent ? "#f87171" : "var(--text-secondary)" }}>
                                            ₹{(item.amount / 1000).toFixed(0)}K
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <Divider />

            <div className="flex gap-3 px-3 py-3 rounded-xl"
                style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.12)" }}>
                <Icon name="info" size={15} className="shrink-0 mt-0.5" style={{ color: "#60a5fa" }} />
                <p className="text-xs leading-relaxed" style={{ color: "rgba(147,197,253,0.75)" }}>
                    Pro tip: Paying before <strong className="text-blue-300">statement date</strong> lowers reported utilization — this is what actually moves your CIBIL score.
                </p>
            </div>
        </Card>
    );
}
