// ─── AI Council Simulation Engine ────────────────────────────────────────────
// Smart templated responses per agent, filled with real card data.
// Used as fallback when OpenAI key is missing/invalid.

import { creditCards, userProfile } from "@/lib/data";

const c = creditCards;
const axisCard = c.find(x => x.id === "axis_ace")!;
const icicCard = c.find(x => x.id === "icici_amazon")!;
const hdfcCard = c.find(x => x.id === "hdfc_regalia")!;
const sbiCard = c.find(x => x.id === "sbi_simply")!;

const axisPct = Math.round((axisCard.used / axisCard.limit) * 100);
const icicPct = Math.round((icicCard.used / icicCard.limit) * 100);
const hdfcPct = Math.round((hdfcCard.used / hdfcCard.limit) * 100);
const totalUtil = Math.round((c.reduce((s, x) => s + x.used, 0) / c.reduce((s, x) => s + x.limit, 0)) * 100);

function pickResponse(agentId: string, msg: string): string {
    const lower = msg.toLowerCase();

    const agentResponses: Record<string, string[]> = {
        orchestrator: [
            `Coordinating all 5 agents for your profile, ${userProfile.name}.\n\n**Priority Action Plan:**\n1. Pay ₹51,000 on Axis ACE immediately → utilization drops from ${axisPct}% to ~15% (+28 pts)\n2. Pre-pay Amazon ICICI before statement closure → shows ₹34K instead of ₹64K to bureaus (+9 pts)\n3. Switch fuel spend to SBI BPCL for 5× rewards (zero score impact, pure gain)\n\n**Projected score by March 31:** 742 → 779 if all 3 actions taken.\n**Agents in agreement:** Utilization ✓  Timing ✓  Rewards ✓`,

            `After cross-referencing the Timing Agent and Utilization Agent:\n\n⚠️ Conflict detected: Paying Axis ACE before Feb 27 is in direct conflict with your availability if you also pay Amazon ICICI. I recommend Axis ACE first — 3× more score impact.\n\n**Net expected gain:** +28 pts in 30 days\n**Confidence:** High (based on CIBIL V2 utilization weight of 30%)`,
        ],

        utilization: [
            `📊 **Utilization Breakdown — ${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" })}**\n\nAxis ACE ••9011: ${axisPct}% 🔴 CRITICAL\nAmazon ICICI ••2289: ${icicPct}% 🟡 High\nHDFC Regalia ••4382: ${hdfcPct}% ✅ Optimal\nSBI SimplyCLICK ••6552: 11% ✅ Optimal\n\nOverall utilization: ${totalUtil}% — above the 30% danger threshold.\n\n**Recommended payments to reach safe zone:**\n→ Axis ACE: Pay ₹${(axisCard.used - axisCard.limit * 0.15).toLocaleString("en-IN")} to hit 15%\n→ Amazon ICICI: Pay ₹${(icicCard.used - icicCard.limit * 0.20).toLocaleString("en-IN")} to hit 20%\n\nPrioritize Axis ACE — it has the highest impact per rupee paid.`,

            `The #1 lever for your score right now is Axis ACE at ${axisPct}% utilization.\n\nCredit bureaus report the balance on your **statement date** — not your current balance. Axis ACE closes on ${axisCard.statementDate}. If you pay before then, bureaus see the lower balance and your score adjusts in the next reporting cycle (~30 days).\n\nPayment needed: ₹${Math.round(axisCard.used - axisCard.limit * 0.15).toLocaleString("en-IN")} → drops utilization to 15% → expected gain: **+18 to +28 points**.`,
        ],

        timing: [
            `⏰ **Upcoming Critical Dates**\n\nFeb 27 (TOMORROW) → Amazon ICICI statement closes\n  Pay ₹${Math.round(icicCard.used * 0.5).toLocaleString("en-IN")}+ before midnight to reduce reported balance\n\nMar 1 → HDFC Regalia statement closes\n  Balance ₹${hdfcCard.used.toLocaleString("en-IN")} at ${hdfcPct}% — already in safe zone ✅\n\nMar 4 → Axis ACE statement closes\n  ⚠️ Current balance ₹${axisCard.used.toLocaleString("en-IN")} will be reported unless you pay before\n\n**Pro tip:** The window between statement close and due date is 15 days. Pay before statement close, not just before due date — that's what hits your credit report.`,

            `Statement timing is where most people lose 20–40 points without knowing it.\n\nYour Amazon ICICI (••2289) closes Feb 27 — that's the date the bank reports your balance to CIBIL. Right now it's at ₹${icicCard.used.toLocaleString("en-IN")} (${icicPct}%). Pay ₹30,000 today and they'll report ₹34,000 instead — a 12% utilization vs 64%.\n\nThis single action could add **+9 points** in the next cycle.`,
        ],

        rewards: [
            `🎁 **Rewards Optimization Report**\n\n**Suboptimal spend detected:**\n→ You're spending ₹5,500/month on fuel with HDFC Regalia (1× reward points)\n→ SBI BPCL SimplyCLICK gives **5× reward points** on fuel\n→ Missing ~₹825/month in reward value\n\n**Optimal card mapping:**\n• Dining → HDFC Regalia (10× Dining Points)\n• Travel → Axis ACE (5× Travel Miles)\n• Online shop → SBI SimplyCLICK (5× online)\n• Fuel → SBI BPCL (5× fuel — switch now!)\n• Groceries → Amazon ICICI (5% cashback)\n\nSwitching fuel spend alone saves you ~₹9,900/year in rewards.`,

            `Looking at your spending patterns:\n\nYou have ₹83K/month in total card spend. The reward gap between optimal and current routing is approximately **₹1,800–₹2,200/month**.\n\nThe biggest quick win: Move fuel to SBI SimplyCLICK. Second win: All Amazon.in purchases should go to Amazon ICICI for 5% flat cashback — not Regalia.\n\nNo score impact from switching cards for spend — only utilization matters to your score.`,
        ],

        simulator: [
            `🔮 **Score Simulation: Optimal Payment Strategy**\n\nBase: 742 (current)\n\nScenario — Pay all 3 priority actions:\n→ Pay ₹51K on Axis ACE (util: ${axisPct}% → 15%): +28 pts\n→ Pay ₹30K on Amazon ICICI (util: ${icicPct}% → 35%): +9 pts\n→ Request HDFC limit increase (util: ${hdfcPct}% → 19%): +11 pts\n\n**Projected score: 790** by March 31, 2026\n**Confidence: 87%**\n\nThis crosses you into 'Very Good' (750+) and 'Exceptional' (800+) territory — unlocking HDFC Infinia eligibility and sub-10% personal loan rates.`,

            `What-if: You close SBI SimplyCLICK card.\n\n⚠️ Don't do it.\n\n→ Closing the card eliminates 4 years of credit history on that account\n→ Credit age drops → −15 to −22 points\n→ Available credit decreases → overall utilization jumps from ${totalUtil}% to ~${Math.round((c.filter(x => x.id !== "sbi_simply").reduce((s, x) => s + x.used, 0) / c.filter(x => x.id !== "sbi_simply").reduce((s, x) => s + x.limit, 0)) * 100)}%\n\nNet effect: −12 points. Keep the card open, preferably with a small recurring charge (₹500 OTT subscription) to keep it active.`,
        ],

        coach: [
            `🎯 **Your Credit Roadmap — 742 → 780+ by June 2026**\n\n**Month 1 (March):**\n• Pay Axis ACE → cross 750 threshold\n• Apply for HDFC Infinia (eligible at 750+)\n• Expected: 742 → 770\n\n**Month 2 (April):**\n• Limit increase on HDFC Regalia (soft pull only)\n• Maintain all cards under 30%\n• Expected: 770 → 778\n\n**Month 3 (June):**\n• New card age builds\n• Consistent on-time payments compound\n• Expected: 778 → 790+\n\nAt 800+, you unlock sub-8.5% home loans from SBI/HDFC — saving ₹3–5L over a 20-year loan on ₹50L principal.`,

            `You're 8 points from 750 — a psychological and practical milestone.\n\nAt 750, you qualify for:\n→ HDFC Infinia (invite-only above 750)\n→ Axis Magnus upgrade path\n→ Personal loans at 11–12% instead of 16–18%\n→ Home loan at 8.75% instead of 9.2%\n\nThe fastest path: One payment on Axis ACE gets you there in 30 days.\n\nYour 6-month trajectory at current pace: **780 by June 2026** — assuming no new credit applications and on-time payments on all 4 cards.`,
        ],
    };

    const responses = agentResponses[agentId] || agentResponses["orchestrator"];
    // Pick based on message content or randomly rotate
    const idx = lower.includes("pay") || lower.includes("debt") ? 0
        : lower.includes("date") || lower.includes("when") ? Math.min(1, responses.length - 1)
            : lower.includes("card") || lower.includes("close") ? Math.min(1, responses.length - 1)
                : Math.floor(Math.random() * responses.length);

    return responses[Math.min(idx, responses.length - 1)];
}

export async function simulateAgentResponse(
    agentId: string,
    userMessage: string,
    onChunk: (chunk: string) => void
): Promise<void> {
    const response = pickResponse(agentId, userMessage);

    // Typewriter stream effect
    const words = response.split("");
    for (let i = 0; i < words.length; i++) {
        await new Promise<void>(resolve => setTimeout(resolve, i < 10 ? 30 : 12));
        onChunk(words[i]);
    }
}
