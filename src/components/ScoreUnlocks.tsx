"use client";

import { motion } from "framer-motion";
import { scoreRangeUnlocks, userProfile } from "@/lib/data";
import { Card, CardHeader, Badge, Button, ProgressBar } from "./ui/components";
import { Icon } from "./ui/icons";

export default function ScoreUnlocks() {
    return (
        <Card>
            <CardHeader
                title="Score Tiers & Unlocks"
                subtitle="Benefits unlocked at each milestone"
                icon="trophy"
                action={<Badge variant="default">742 Current</Badge>}
            />

            <div className="space-y-3">
                {scoreRangeUnlocks.map((tier, i) => {
                    const isCurrentScore =
                        userProfile.creditScore >= parseInt(tier.range.split("-")[0]) &&
                        userProfile.creditScore <= parseInt(tier.range.split("-")[1]);
                    const isNext = tier.locked && i > 0 && !scoreRangeUnlocks[i - 1].locked;
                    const dimmed = tier.locked && !isNext;

                    return (
                        <motion.div
                            key={tier.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: dimmed ? 0.4 : 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="p-4 rounded-2xl transition-all"
                            style={{
                                background: isCurrentScore
                                    ? `${tier.color}08`
                                    : isNext
                                        ? "rgba(255,255,255,0.03)"
                                        : "transparent",
                                border: isCurrentScore
                                    ? `1px solid ${tier.color}25`
                                    : isNext
                                        ? "1px solid rgba(255,255,255,0.08)"
                                        : "1px solid rgba(255,255,255,0.04)",
                                boxShadow: isCurrentScore ? `0 0 30px ${tier.color}08` : "none",
                            }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {/* Icon node */}
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{
                                            background: tier.locked ? "rgba(255,255,255,0.05)" : `${tier.color}15`,
                                            border: `1px solid ${tier.locked ? "rgba(255,255,255,0.08)" : `${tier.color}30`}`,
                                        }}>
                                        <Icon
                                            name={tier.locked ? "lock" : "unlock"}
                                            size={13}
                                            style={{ color: tier.locked ? "#52525b" : tier.color }}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-sm" style={{ color: tier.locked ? "var(--text-muted)" : tier.color }}>
                                                {tier.label}
                                            </h3>
                                            {isCurrentScore && <Badge variant="success">Current</Badge>}
                                            {isNext && <Badge variant="info">Next</Badge>}
                                        </div>
                                        <p className="text-[10px] mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>{tier.range}</p>
                                    </div>
                                </div>

                                {isNext && tier.pointsNeeded && (
                                    <div className="text-right">
                                        <span className="text-sm font-bold" style={{ color: tier.color }}>+{tier.pointsNeeded}</span>
                                        <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>pts</span>
                                    </div>
                                )}
                            </div>

                            {/* Benefits */}
                            <div className="grid grid-cols-1 gap-1.5 pl-11">
                                {tier.benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <Icon
                                            name="star"
                                            size={9}
                                            className="shrink-0"
                                            style={{ color: tier.locked ? "#3f3f46" : tier.color, opacity: tier.locked ? 0.5 : 1 }}
                                        />
                                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Progress bar for next tier */}
                            {isNext && tier.pointsNeeded && (
                                <div className="mt-3 pl-11 pr-1">
                                    <div className="flex justify-between text-[10px] mb-1.5" style={{ color: "var(--text-muted)" }}>
                                        <span>Progress to unlock</span>
                                        <span style={{ color: tier.color }}>{Math.round((1 - tier.pointsNeeded / 100) * 100)}%</span>
                                    </div>
                                    <ProgressBar value={100 - tier.pointsNeeded} max={100} color="emerald" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <Button variant="secondary" icon="arrowRight" className="w-full mt-5">
                View Full Benefits Catalog
            </Button>
        </Card>
    );
}
