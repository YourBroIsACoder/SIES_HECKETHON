"use client";

import { useState } from "react";
import { Icon } from "./ui/icons";
import { creditCards } from "@/lib/data";
import { Card, CardHeader, Badge, ProgressBar, Divider, Button } from "./ui/components";
import { CreditCardVisual, CardFlipModal } from "./ui/CreditCardVisual";

export default function CardUtilization() {
    const [activeCard, setActiveCard] = useState<typeof creditCards[0] | null>(null);

    const totalUsed = creditCards.reduce((s, c) => s + c.used, 0);
    const totalLimit = creditCards.reduce((s, c) => s + c.limit, 0);
    const overallPct = Math.round((totalUsed / totalLimit) * 100);

    return (
        <>
            <Card className="flex flex-col h-full">
                <CardHeader
                    title="My Cards"
                    subtitle="Active credit lines & utilization"
                    icon="creditCard"
                    action={<Badge variant={overallPct > 30 ? "warning" : "success"}>{overallPct}% Overall Util.</Badge>}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-2">
                    {creditCards.slice(0, 2).map(card => (
                        <CreditCardVisual
                            key={card.id}
                            name={card.name}
                            type={card.brand as any}
                            colorStart={card.colorStart!}
                            colorEnd={card.colorEnd!}
                            last4={card.last4!}
                            onClick={() => setActiveCard(card)}
                        />
                    ))}
                </div>

                <div className="space-y-5 flex-1">
                    {creditCards.map(card => {
                        const pct = Math.round((card.used / card.limit) * 100);
                        const color = pct > 70 ? "red" : pct > 30 ? "amber" : "emerald";

                        return (
                            <div
                                key={card.id}
                                className="cursor-pointer group"
                                onClick={() => setActiveCard(card)}
                            >
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm text-zinc-100 group-hover:text-white transition-colors">{card.name}</span>
                                            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">••{card.last4}</span>
                                            <Badge variant={color === "emerald" ? "success" : color === "amber" ? "warning" : "danger"}>
                                                {pct > 70 ? "Critical" : pct > 30 ? "High" : "Optimal"}
                                            </Badge>
                                        </div>
                                        <span className="text-xs text-zinc-500">Statement: {card.statementDate} • Due: {card.dueDate}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-medium text-zinc-100">₹{(card.used / 1000).toFixed(0)}K</span>
                                        <span className="text-xs text-zinc-500 block">/ ₹{(card.limit / 1000).toFixed(0)}K</span>
                                    </div>
                                </div>
                                <ProgressBar value={pct} max={100} color={color as any} threshold={30} />
                            </div>
                        );
                    })}
                </div>

                <Divider />
                <Button variant="secondary" className="w-full mt-auto">+ Link new card via netbanking</Button>
            </Card>

            {/* Flip modal */}
            {activeCard && (
                <CardFlipModal
                    card={{ ...activeCard, type: activeCard.brand as any, expiry: "12/28" }}
                    onClose={() => setActiveCard(null)}
                />
            )}
        </>
    );
}
