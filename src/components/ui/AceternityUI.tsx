"use client";
/**
 * Aceternity-inspired UI primitives for CreditIQ
 * - SpotlightCard: cursor-tracked spotlight hover glow
 * - MovingBorderCard: animated gradient border
 * - BackgroundGradient: glowing gradient wrapper
 * - ShimmerButton: shimmer CTA button
 * - GradientText: animated gradient text
 */

import { useRef, useState, ReactNode, MouseEvent } from "react";
import { motion } from "framer-motion";

// ─── SpotlightCard ────────────────────────────────────────────────────────────
interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
    spotlightColor?: string;
}

export function SpotlightCard({ children, className = "", spotlightColor = "rgba(59,130,246,0.12)" }: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,28,0.85)] ${className}`}
            style={{ backdropFilter: "blur(20px)" }}
        >
            {/* Spotlight effect */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{
                    opacity: isHovering ? 1 : 0,
                    background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
                }}
            />
            {children}
        </div>
    );
}

// ─── MovingBorderCard ─────────────────────────────────────────────────────────
interface MovingBorderProps {
    children: ReactNode;
    className?: string;
    borderColors?: string[];
    duration?: number;
}

export function MovingBorderCard({
    children,
    className = "",
    borderColors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"],
    duration = 4000,
}: MovingBorderProps) {
    const gradient = `linear-gradient(90deg, ${borderColors.join(", ")})`;

    return (
        <div className={`relative rounded-2xl p-[1.5px] overflow-hidden ${className}`}>
            {/* Spinning gradient border */}
            <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ background: gradient, backgroundSize: "200% 200%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: duration / 1000, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner content */}
            <div className="relative rounded-2xl bg-[rgba(8,11,20,0.92)] z-10">
                {children}
            </div>
        </div>
    );
}

// ─── BackgroundGradient ───────────────────────────────────────────────────────
export function BackgroundGradient({
    children,
    className = "",
    animate = true,
}: { children: ReactNode; className?: string; animate?: boolean }) {
    return (
        <div className={`relative group ${className}`}>
            <div
                className="absolute -inset-0.5 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition duration-500"
                style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)",
                    backgroundSize: "200% 200%",
                    animation: animate ? "gradient-shift 4s ease infinite" : "none",
                }}
            />
            <div className="relative rounded-2xl">{children}</div>
            <style>{`
        @keyframes gradient-shift {
          0%,100%{background-position:0% 50%}
          50%{background-position:100% 50%}
        }
      `}</style>
        </div>
    );
}

// ─── ShimmerButton ────────────────────────────────────────────────────────────
export function ShimmerButton({
    children,
    onClick,
    className = "",
    color = "#3b82f6",
}: { children: ReactNode; onClick?: () => void; className?: string; color?: string }) {
    return (
        <button
            onClick={onClick}
            className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl px-5 py-2.5 font-semibold text-sm transition-all hover:scale-105 active:scale-95 ${className}`}
            style={{
                background: `linear-gradient(135deg, ${color}30, ${color}15)`,
                border: `1px solid ${color}50`,
                color,
            }}
        >
            {/* Shimmer sweep */}
            <motion.span
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(105deg, transparent 40%, ${color}25 50%, transparent 60%)`,
                    backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10">{children}</span>
        </button>
    );
}

// ─── GlowDivider ─────────────────────────────────────────────────────────────
export function GlowDivider({ color = "#3b82f6" }: { color?: string }) {
    return (
        <div className="relative h-px my-6">
            <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        </div>
    );
}

// ─── StatBadge ────────────────────────────────────────────────────────────────
export function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
            <div className="w-1.5 h-1.5 rounded-full blink" style={{ background: color }} />
            <span className="text-xs font-medium" style={{ color }}>{label}: <strong>{value}</strong></span>
        </div>
    );
}
