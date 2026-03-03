import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Icon, IconName } from "./icons";

// ─── Glass Card ──────────────────────────────────────────────────────────────
export function Card({ children, className = "", noPadding = false, glow = false }: {
    children: ReactNode; className?: string; noPadding?: boolean; glow?: boolean;
}) {
    return (
        <div
            className={`relative rounded-[1.5rem] overflow-hidden ${noPadding ? "" : "p-6"} ${className}`}
            style={{
                background: "linear-gradient(145deg, var(--bg-card) 0%, color-mix(in srgb, var(--bg-card) 90%, transparent) 100%)",
                border: "1px solid var(--border-card)",
                boxShadow: glow
                    ? "0 0 0 1px rgba(255,255,255,0.04), 0 4px 40px rgba(0,0,0,0.4), 0 0 80px rgba(59,130,246,0.06)"
                    : "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.3)",
                backdropFilter: "blur(12px)",
            }}
        >
            {/* Subtle inner shine */}
            <div className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)" }} />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// ─── Card Header ─────────────────────────────────────────────────────────────
export function CardHeader({ title, subtitle, icon, action }: {
    title: string; subtitle?: string; icon?: IconName; action?: ReactNode;
}) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)"
                        }}>
                        <Icon name={icon} size={17} className="text-zinc-300" />
                    </div>
                )}
                <div>
                    <h2 className="text-base font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>{title}</h2>
                    {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
                </div>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
const badgeStyles = {
    default: { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.10)", color: "#a1a1aa" },
    success: { bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.25)", color: "#34d399" },
    warning: { bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.25)", color: "#fbbf24" },
    danger: { bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.25)", color: "#f87171" },
    info: { bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.25)", color: "#60a5fa" },
    amber: { bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.25)", color: "#fbbf24" },
    high: { bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.25)", color: "#fbbf24" },
    medium: { bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.25)", color: "#60a5fa" },
    critical: { bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.25)", color: "#f87171" },
};

export function Badge({ children, variant = "default", dot = false, className = "" }: {
    children: ReactNode; variant?: keyof typeof badgeStyles; dot?: boolean; className?: string;
}) {
    const s = badgeStyles[variant] || badgeStyles.default;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${className}`}
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
        >
            {dot && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />}
            {children}
        </span>
    );
}

// ─── Button ──────────────────────────────────────────────────────────────────
export function Button({
    children, variant = "primary", className = "", icon, ...props
}: {
    children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "glow";
    className?: string; icon?: IconName;
} & HTMLMotionProps<"button">) {
    const base = "inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none disabled:opacity-40 disabled:pointer-events-none rounded-xl text-sm h-10 px-4 relative overflow-hidden";

    const styles: Record<string, React.CSSProperties> = {
        primary: { background: "rgba(255,255,255,0.92)", color: "#09090b" },
        secondary: {
            background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "var(--text-primary)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)"
        },
        ghost: { background: "transparent", color: "var(--text-secondary)" },
        glow: {
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "#fff",
            boxShadow: "0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(139,92,246,0.15)"
        },
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, filter: "brightness(1.08)" }}
            whileTap={{ scale: 0.97 }}
            className={`${base} ${className}`}
            style={styles[variant]}
            {...props as any}
        >
            {variant === "glow" && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            )}
            {icon && <Icon name={icon} size={14} />}
            {children}
        </motion.button>
    );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
    return (
        <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
            {label && <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--text-muted)" }}>{label}</span>}
            {!label && null}
        </div>
    );
}

// ─── Glow Progress Bar ───────────────────────────────────────────────────────
const progressColors = {
    emerald: { fill: "#10b981", glow: "rgba(16,185,129,0.4)" },
    amber: { fill: "#f59e0b", glow: "rgba(245,158,11,0.4)" },
    red: { fill: "#ef4444", glow: "rgba(239,68,68,0.4)" },
    blue: { fill: "#3b82f6", glow: "rgba(59,130,246,0.4)" },
};

export function ProgressBar({ value, max, color = "blue", threshold = 0 }: {
    value: number; max: number; color?: keyof typeof progressColors; threshold?: number;
}) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const c = progressColors[color] || progressColors.blue;

    return (
        <div className="relative h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            {threshold > 0 && (
                <div className="absolute top-0 bottom-0 w-px z-10" style={{ left: `${threshold}%`, background: "rgba(255,255,255,0.2)" }} />
            )}
            <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ background: c.fill, boxShadow: `0 0 8px ${c.glow}` }}
            />
        </div>
    );
}

// ─── Stat Pill ───────────────────────────────────────────────────────────────
export function StatPill({ label, value, trend }: { label: string; value: string; trend?: "up" | "down" }) {
    return (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
            <span className="text-sm font-semibold flex items-center gap-1" style={{ color: trend === "up" ? "#34d399" : trend === "down" ? "#f87171" : "var(--text-primary)" }}>
                {trend === "up" && "↑"}{trend === "down" && "↓"}{value}
            </span>
        </div>
    );
}

// ─── Glow Dot ────────────────────────────────────────────────────────────────
export function LiveDot({ color = "#10b981" }: { color?: string }) {
    return (
        <span className="relative inline-flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: color }} />
            <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: color }} />
        </span>
    );
}
