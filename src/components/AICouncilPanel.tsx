"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./ui/icons";
import { Card, CardHeader, Badge, Button, LiveDot } from "./ui/components";
import { agentInsights, creditCards, userProfile } from "@/lib/data";
import { simulateAgentResponse } from "@/lib/simulation";

interface Message { role: "user" | "agent"; content: string; }

const AGENT_META: Record<string, { color: string; icon: string; label: string; starter: string }> = {
    orchestrator: { color: "#3b82f6", icon: "🧠", label: "Orchestrator", starter: "Give me a unified action plan for my credit profile." },
    utilization: { color: "#3b82f6", icon: "📊", label: "Utilization Agent", starter: "Analyze my card utilization and tell me what to pay first." },
    timing: { color: "#8b5cf6", icon: "⏰", label: "Timing Agent", starter: "What are my upcoming critical statement dates?" },
    rewards: { color: "#10b981", icon: "🎁", label: "Rewards Agent", starter: "How can I optimize my spending across my cards?" },
    simulator: { color: "#f59e0b", icon: "🔮", label: "Score Simulator", starter: "Simulate my score if I pay ₹51k on Axis ACE." },
    coach: { color: "#ec4899", icon: "🎯", label: "Credit Coach", starter: "What's my roadmap to 780 by June 2026?" },
};

const badgePriority: Record<string, "danger" | "warning" | "info"> = {
    critical: "danger", high: "warning", medium: "info",
};

// ── Structured Council Summary Data ──────────────────────────────────────────
const COUNCIL_SUMMARY = {
    orchestratorActivation: "AI Council activated — 4 specialized agents analyzing Axis ACE (64% utilization, 2-day statement window).",
    agents: [
        {
            id: "utilization",
            icon: "📊",
            label: "Utilization Agent",
            color: "#3b82f6",
            priority: "critical" as const,
            domain: "Risk & Recommendation",
            insight: "Axis ACE at **64% utilization** (₹51,000 / ₹80,000). This single card is the primary drag on your score. Immediate partial payment before statement close will reduce reported utilization to **29%** — the safe zone. No other card requires urgent action.",
        },
        {
            id: "timing",
            icon: "⏰",
            label: "Timing Agent",
            color: "#8b5cf6",
            priority: "high" as const,
            domain: "Statement Cycle",
            insight: "Statement closes in **2 days** (Mar 6). Bureaus record whatever balance exists at close — pay before then to maximize score gain. Post-close payments won't be reflected until next cycle. Window is closing.",
        },
        {
            id: "rewards",
            icon: "🎁",
            label: "Rewards Agent",
            color: "#10b981",
            priority: "medium" as const,
            domain: "Spend Optimization",
            insight: "Post-payment, route **fuel spend** to SBI SimplyCLICK (5× points vs. HDFC Regalia 1×). Keep high-ticket travel on Axis ACE Visa to maximise cashback once utilization is healthy.",
        },
        {
            id: "simulator",
            icon: "🔮",
            label: "Score Simulator",
            color: "#f59e0b",
            priority: "high" as const,
            domain: "Projected Impact",
            insight: "Paying ₹51,000 on Axis ACE → utilization drops from **64% → 29%**. Projected score gain: **+20 to +30 points** (742 → 762–772). Score enters the 'Very Good' band, unlocking premium card upgrades.",
        },
    ],
    summary: {
        consensus: "Pay ₹51,000 on Axis ACE within 2 days, before the Mar 6 statement close. This single action collapses a high-utilization flag and is projected to add 20–30 points — crossing into the 'Very Good' tier.",
        priority: "CRITICAL",
        outcome: "Score: 742 → 762–772 · Utilization: 64% → 29% · Timeline: 2 days",
    },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function TypingDots() {
    return (
        <div className="flex items-center gap-1 py-1 px-1">
            {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-500"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} />
            ))}
        </div>
    );
}

function MarkdownLine({ text }: { text: string }) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return (
        <span>
            {parts.map((p, i) => i % 2 === 1 ? <strong key={i} className="text-zinc-100 font-semibold">{p}</strong> : p)}
        </span>
    );
}

function MessageContent({ text }: { text: string }) {
    return (
        <div className="space-y-1 text-sm leading-relaxed text-zinc-300">
            {text.split("\n").map((line, i) => (
                <p key={i} className={line.startsWith("→") ? "pl-2 text-zinc-400" : ""}>
                    <MarkdownLine text={line || "\u00a0"} />
                </p>
            ))}
        </div>
    );
}

async function callApi(agentId: string, userMessage: string, onChunk: (c: string) => void): Promise<boolean> {
    try {
        const res = await fetch("/api/council", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                agentId, userMessage,
                cardData: { user: userProfile, cards: creditCards },
            }),
        });
        if (!res.ok || !res.body) return false;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const lines = decoder.decode(value, { stream: true }).split("\n");
            for (const line of lines) {
                if (line.startsWith("0:")) {
                    try { onChunk(JSON.parse(line.slice(2))); } catch { }
                }
            }
        }
        return true;
    } catch {
        return false;
    }
}

// ── Agent Chat View ───────────────────────────────────────────────────────────

function AgentChat({ agentId, onBack }: { agentId: string; onBack: () => void }) {
    const meta = AGENT_META[agentId];
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [partial, setPartial] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, partial]);

    async function send(text: string) {
        if (!text.trim() || streaming) return;
        setMessages(prev => [...prev, { role: "user", content: text }]);
        setInput("");
        setStreaming(true);
        setPartial("");

        let full = "";
        const onChunk = (c: string) => { full += c; setPartial(full); };
        const apiOk = await callApi(agentId, text, onChunk);
        if (!apiOk) {
            full = "";
            setPartial("");
            await simulateAgentResponse(agentId, text, (c: string) => { full += c; setPartial(full); });
        }

        setMessages(prev => [...prev, { role: "agent", content: full }]);
        setStreaming(false);
        setPartial("");
        setTimeout(() => inputRef.current?.focus(), 100);
    }

    return (
        <div className="flex flex-col" style={{ minHeight: 380 }}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <button onClick={onBack}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-zinc-400 hover:text-white"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Icon name="chevronLeft" size={14} />
                </button>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}>
                    {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{meta.label}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>AI Council · Context-aware</p>
                </div>
                <div className="flex items-center gap-2">
                    <LiveDot color={meta.color} />
                    <span className="text-xs font-medium" style={{ color: meta.color }}>Active</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1" style={{ maxHeight: 300 }}>
                {messages.length === 0 && !streaming && (
                    <div className="flex flex-col items-center justify-center pt-8 pb-4 text-center">
                        <div className="text-3xl mb-3">{meta.icon}</div>
                        <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>{meta.label} is ready</p>
                        <p className="text-xs mb-4 max-w-[200px]" style={{ color: "var(--text-muted)" }}>Full credit context loaded. Ask anything.</p>
                        <button onClick={() => send(meta.starter)}
                            className="px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors"
                            style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}25`, color: meta.color }}>
                            <Icon name="sparkles" size={12} />
                            {meta.starter}
                        </button>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "agent" && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-1"
                                style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}30` }}>
                                {meta.icon}
                            </div>
                        )}
                        <div className="max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm"
                            style={msg.role === "user"
                                ? { background: "rgba(255,255,255,0.08)", color: "var(--text-primary)", borderRadius: "1rem 1rem 0.25rem 1rem", border: "1px solid rgba(255,255,255,0.1)" }
                                : { background: "rgba(255,255,255,0.03)", borderRadius: "0.25rem 1rem 1rem 1rem", border: "1px solid rgba(255,255,255,0.06)" }
                            }>
                            {msg.role === "agent" ? <MessageContent text={msg.content} /> : <span style={{ color: "var(--text-primary)" }}>{msg.content}</span>}
                        </div>
                    </motion.div>
                ))}

                {streaming && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 justify-start">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-1"
                            style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}30` }}>
                            {meta.icon}
                        </div>
                        <div className="max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.25rem 1rem 1rem 1rem" }}>
                            {partial ? (
                                <div>
                                    <MessageContent text={partial} />
                                    <span className="inline-block w-0.5 h-3.5 bg-zinc-400 animate-pulse ml-0.5 align-middle" />
                                </div>
                            ) : <TypingDots />}
                        </div>
                    </motion.div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={streaming}
                    placeholder={`Ask ${meta.label}…`}
                    className="flex-1 px-4 py-2.5 text-sm rounded-xl focus:outline-none disabled:opacity-50 transition-all"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "var(--text-primary)",
                    }}
                />
                <motion.button type="submit" disabled={streaming || !input.trim()}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}35`, color: meta.color }}>
                    {streaming ? <Icon name="loader" size={15} /> : <Icon name="send" size={15} />}
                </motion.button>
            </form>
        </div>
    );
}

// ── Structured Council Summary View ──────────────────────────────────────────

function CouncilSummaryView({ onBack }: { onBack: () => void }) {
    return (
        <div className="space-y-3">
            {/* Back button */}
            <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <button onClick={onBack}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-zinc-400 hover:text-white"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Icon name="chevronLeft" size={14} />
                </button>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}>🧠</div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-zinc-100">Council Session Report</p>
                    <p className="text-xs text-zinc-500">Multi-agent consensus · Real-time analysis</p>
                </div>
                <Badge variant="success" dot>Live</Badge>
            </div>

            {/* Orchestrator activation */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl flex items-start gap-3"
                style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)" }}>
                <span className="text-lg shrink-0 mt-0.5">🧠</span>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Orchestrator Activation</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{COUNCIL_SUMMARY.orchestratorActivation}</p>
                </div>
            </motion.div>

            {/* Individual agent cards */}
            <div className="space-y-2">
                {COUNCIL_SUMMARY.agents.map((agent, i) => (
                    <motion.div key={agent.id}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.07 }}
                        className="p-3.5 rounded-xl"
                        style={{ background: `${agent.color}08`, border: `1px solid ${agent.color}20` }}>
                        <div className="flex items-center gap-2.5 mb-2">
                            <span className="text-base">{agent.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-sm" style={{ color: agent.color }}>{agent.label}</span>
                                    <Badge variant={badgePriority[agent.priority] || "info"}>{agent.priority}</Badge>
                                </div>
                                <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: `${agent.color}90` }}>{agent.domain}</p>
                            </div>
                        </div>
                        <div className="pl-7">
                            <MessageContent text={agent.insight} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Orchestrator summary */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="p-4 rounded-xl relative overflow-hidden"
                style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.25)", boxShadow: "0 0 30px rgba(16,185,129,0.05)" }}>
                <div className="absolute right-3 top-3 text-[40px] opacity-[0.05] pointer-events-none select-none">🧠</div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Final Orchestrator Summary</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-3">{COUNCIL_SUMMARY.summary.consensus}</p>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                        style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                        Priority: {COUNCIL_SUMMARY.summary.priority}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">{COUNCIL_SUMMARY.summary.outcome}</span>
                </div>
            </motion.div>
        </div>
    );
}

// ── Main AI Council Panel ──────────────────────────────────────────────────────

export default function AICouncilPanel() {
    const [activeAgent, setActiveAgent] = useState<string | null>(null);
    const [showCouncil, setShowCouncil] = useState(false);

    const agents = [
        { id: "utilization", priority: "critical", desc: `Axis ACE at ${Math.round((creditCards.find(c => c.id === "axis_ace")!.used / creditCards.find(c => c.id === "axis_ace")!.limit) * 100)}% — needs immediate action` },
        { id: "timing", priority: "high", desc: "Axis ACE closes in 2 days — act now" },
        { id: "rewards", priority: "medium", desc: "Missing 5× points on fuel spend" },
        { id: "simulator", priority: "high", desc: "Score could hit 762–772 by Mar 31" },
        { id: "coach", priority: "medium", desc: "8 pts from 750 · Infinia eligible" },
    ];

    const isOpen = !!activeAgent || showCouncil;

    return (
        <Card glow>
            <CardHeader
                title="AI Council"
                subtitle="6 specialized agents · Context-aware"
                icon="bot"
                action={
                    <div className="flex items-center gap-2">
                        {isOpen && (
                            <button onClick={() => { setActiveAgent(null); setShowCouncil(false); }} className="text-zinc-500 hover:text-white transition-colors">
                                <Icon name="refresh" size={14} />
                            </button>
                        )}
                        <Badge variant="success" dot>Live</Badge>
                    </div>
                }
            />

            <AnimatePresence mode="wait">
                {activeAgent ? (
                    <motion.div key={activeAgent}
                        initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
                        <AgentChat agentId={activeAgent} onBack={() => setActiveAgent(null)} />
                    </motion.div>
                ) : showCouncil ? (
                    <motion.div key="council"
                        initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
                        <CouncilSummaryView onBack={() => setShowCouncil(false)} />
                    </motion.div>
                ) : (
                    <motion.div key="grid"
                        initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.22 }}>

                        {/* Orchestrator hero — now opens Council Summary */}
                        <motion.button whileTap={{ scale: 0.99 }} onClick={() => setShowCouncil(true)}
                            className="w-full text-left mb-4 p-4 rounded-2xl relative overflow-hidden group transition-all"
                            style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
                            <div className="absolute right-3 top-3 text-[48px] opacity-[0.06] select-none pointer-events-none">🧠</div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                                    style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}>🧠</div>
                                <div>
                                    <span className="font-semibold text-sm" style={{ color: "#60a5fa" }}>Orchestrator Agent</span>
                                    <Badge variant="info" className="ml-2">Coordinator</Badge>
                                </div>
                                <Icon name="chevronRight" size={14} className="ml-auto opacity-40 group-hover:opacity-80 transition-opacity" style={{ color: "#60a5fa" }} />
                            </div>
                            <p className="text-xs leading-relaxed pl-11" style={{ color: "rgba(147,197,253,0.7)" }}>
                                Priority: Pay ₹51,000 on Axis ACE before statement close → Expected gain: <strong className="text-blue-300">+20–30 pts</strong>. Click for full council report.
                            </p>
                        </motion.button>

                        {/* Agent list */}
                        <div className="space-y-1">
                            {agents.map((agent, i) => {
                                const meta = AGENT_META[agent.id];
                                return (
                                    <motion.button key={agent.id}
                                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setActiveAgent(agent.id)}
                                        className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all"
                                        style={{ border: "1px solid transparent" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                                            style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}>
                                            {meta.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{meta.label}</span>
                                                <Badge variant={badgePriority[agent.priority] || "info"}>{agent.priority}</Badge>
                                            </div>
                                            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{agent.desc}</p>
                                        </div>
                                        <Icon name="chevronRight" size={13} className="shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" style={{ color: "var(--text-muted)" }} />
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Footer hint */}
                        <div className="mt-5 flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <Icon name="sparkles" size={12} className="shrink-0 text-amber-400" />
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                Click 🧠 for a full council session report, or any agent to open a dedicated AI chat.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
