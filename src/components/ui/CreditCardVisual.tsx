"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./icons";

interface CardData {
    id: string;
    name: string;
    bank: string;
    type: "visa" | "mastercard" | "amex";
    colorStart: string;
    colorEnd: string;
    last4: string;
    expiry?: string;
    limit: number;
    used: number;
    dueDate: string;
    statementDate: string;
    apr: number;
    category: string;
    icon: string;
}

interface CreditCardVisualProps {
    name: string;
    type: "visa" | "mastercard" | "amex";
    colorStart: string;
    colorEnd: string;
    last4: string;
    expiry?: string;
    className?: string;
    onClick?: () => void;
    small?: boolean;
}

function CardFront({ name, type, colorStart, colorEnd, last4, expiry = "12/28" }: Omit<CreditCardVisualProps, "onClick" | "small" | "className">) {
    return (
        <div
            className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
            }}
        >
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none" />

            <div className="flex justify-between items-start z-10">
                <div className="flex flex-col gap-1.5">
                    <div className="w-10 h-8 rounded bg-gradient-to-br from-yellow-200 to-yellow-600 border border-yellow-400/50 flex items-center justify-center opacity-90 shadow-inner">
                        <div className="w-6 h-4 border border-yellow-700/30 rounded-sm grid grid-cols-3 grid-rows-3 gap-px opacity-40">
                            <div className="border border-yellow-700/50 rounded-[1px] col-span-2 row-span-2"></div>
                        </div>
                    </div>
                    <Icon name="wifi" size={18} className="text-white/60 ml-1" style={{ transform: "rotate(90deg)" }} />
                </div>
                <span className="text-white/90 font-medium tracking-wide text-sm drop-shadow-md text-right max-w-[120px] leading-tight">{name}</span>
            </div>

            <div className="z-10">
                <div className="flex items-center gap-3 mb-3">
                    {[0, 1, 2].map(i => (
                        <span key={i} className="flex gap-1 opacity-80">
                            {[0, 1, 2, 3].map(j => <span key={j} className="w-1.5 h-1.5 rounded-full bg-white" />)}
                        </span>
                    ))}
                    <span className="text-white font-mono tracking-widest text-base ml-1 drop-shadow-md">{last4}</span>
                </div>
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-white/50 uppercase tracking-widest">Valid Thru</span>
                        <span className="text-white/90 font-mono tracking-wider text-sm">{expiry}</span>
                    </div>
                    <div className="h-8 flex flex-col justify-end">
                        {type === "visa" && <span className="text-white font-bold italic tracking-wider text-xl drop-shadow-lg">VISA</span>}
                        {type === "mastercard" && (
                            <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
                                <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-80 -ml-2.5" />
                            </div>
                        )}
                        {type === "amex" && <span className="text-white/90 font-bold bg-blue-500/20 px-2 py-0.5 rounded border border-white/20 text-xs">AMEX</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CardBack({ colorStart, colorEnd, limit, used, apr, dueDate, statementDate, category }: {
    colorStart: string; colorEnd: string; limit: number; used: number; apr: number; dueDate: string; statementDate: string; category: string;
}) {
    const pct = Math.round((used / limit) * 100);
    const available = limit - used;

    return (
        <div
            className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
            style={{
                background: `linear-gradient(135deg, ${colorStart}dd, ${colorEnd}dd)`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
            }}
        >
            <div className="absolute inset-0 bg-black/40" />
            {/* Magnetic stripe */}
            <div className="relative h-10 bg-zinc-900 mt-6 shrink-0" />

            <div className="relative flex-1 p-4 flex flex-col justify-between">
                {/* Signature strip */}
                <div className="bg-white/10 rounded px-2 py-1.5 mb-3 flex items-center justify-between">
                    <span className="text-white/40 text-[9px] uppercase tracking-widest">Authorized Signature</span>
                    <span className="font-mono text-white/70 text-xs">• {category}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/30 rounded-xl p-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Icon name="percent" size={10} className="text-white/50" />
                            <span className="text-white/50 text-[9px] uppercase tracking-wider">Utilization</span>
                        </div>
                        <p className="text-white font-bold text-lg">{pct}%</p>
                        <div className="h-1 bg-white/20 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct > 70 ? "#ef4444" : pct > 30 ? "#f59e0b" : "#10b981" }} />
                        </div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Icon name="trendingUp" size={10} className="text-white/50" />
                            <span className="text-white/50 text-[9px] uppercase tracking-wider">Available</span>
                        </div>
                        <p className="text-white font-bold text-sm">₹{(available / 1000).toFixed(0)}K</p>
                        <p className="text-white/40 text-[9px] mt-0.5">of ₹{(limit / 1000).toFixed(0)}K limit</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Icon name="calendar" size={10} className="text-white/50" />
                            <span className="text-white/50 text-[9px] uppercase tracking-wider">Statement</span>
                        </div>
                        <p className="text-white font-semibold text-sm">{statementDate}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Icon name="calendar" size={10} className="text-white/50" />
                            <span className="text-white/50 text-[9px] uppercase tracking-wider">Due Date</span>
                        </div>
                        <p className="text-white font-semibold text-sm">{dueDate}</p>
                    </div>
                </div>

                <div className="bg-black/30 rounded-xl p-2.5 mt-2">
                    <div className="flex justify-between items-center">
                        <span className="text-white/50 text-[9px] uppercase tracking-wider">APR</span>
                        <span className="text-white font-mono font-semibold text-sm">{apr}% p.m.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Small card for the grid (clickable, opens modal) ──────────────────────────
export function CreditCardVisual({
    name, type, colorStart, colorEnd, last4, expiry = "12/28", className = "", onClick
}: CreditCardVisualProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, rotateX: 2, rotateY: 4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={onClick}
            className={`relative w-full aspect-[1.586/1] rounded-2xl shadow-2xl border border-white/20 cursor-pointer ${className}`}
            style={{ transformStyle: "preserve-3d" }}
            title="Click to expand"
        >
            <CardFront name={name} type={type} colorStart={colorStart} colorEnd={colorEnd} last4={last4} expiry={expiry} />
        </motion.div>
    );
}

// ── Full flip-card modal ──────────────────────────────────────────────────────
export function CardFlipModal({ card, onClose }: { card: CardData; onClose: () => void }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6"
                style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.85, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.85, opacity: 0, y: 30 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    className="flex flex-col items-center gap-6 max-w-md w-full"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="self-end w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                        <Icon name="x" size={16} />
                    </button>

                    {/* The flip card */}
                    <div
                        className="w-full aspect-[1.586/1] cursor-pointer select-none"
                        style={{ perspective: "1200px" }}
                        onClick={() => setFlipped(f => !f)}
                    >
                        <motion.div
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                            className="w-full h-full relative"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <CardFront name={card.name} type={card.type} colorStart={card.colorStart} colorEnd={card.colorEnd} last4={card.last4} />
                            <CardBack
                                colorStart={card.colorStart}
                                colorEnd={card.colorEnd}
                                limit={card.limit}
                                used={card.used}
                                apr={card.apr}
                                dueDate={card.dueDate}
                                statementDate={card.statementDate}
                                category={card.category}
                            />
                        </motion.div>
                    </div>

                    <p className="text-zinc-500 text-sm flex items-center gap-2">
                        <span className="inline-block w-4 h-4 border border-zinc-600 rounded rotate-12 text-center text-[8px] leading-4">↻</span>
                        Tap card to flip
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
