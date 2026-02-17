"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { MOCK_THEMES } from "@/lib/constants";
import type { ThemeData } from "@/types";

const BAR_COLORS: string[] = [
  "var(--color-primary)", "#ef4444", "var(--color-success)",
  "#f97316", "#8b5cf6", "#06b6d4", "#eab308",
];

function TrendBadge({ trend }: { trend: ThemeData["trend"] }) {
  const config = {
    up: { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "En hausse", color: "var(--color-success)" },
    down: { icon: <TrendingDown className="h-3.5 w-3.5" />, label: "En baisse", color: "#ef4444" },
    stable: { icon: <Minus className="h-3.5 w-3.5" />, label: "Stable", color: "var(--color-text-muted)" },
  };
  const { icon, label, color } = config[trend];
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ color }} title={label}>
      {icon}<span className="sr-only">{label}</span>
    </span>
  );
}
function ThemeBarRow({ theme, barColor, maxPercentage }: { theme: ThemeData; barColor: string; maxPercentage: number }) {
  const relativeWidth = (theme.percentage / maxPercentage) * 100;
  return (
    <div className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[var(--color-bg-section)]">
      <span className="w-28 shrink-0 text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{theme.theme}</span>
      <div className="relative flex-1 overflow-hidden rounded-md" style={{ height: "28px" }}>
        <div className="absolute inset-0 rounded-md" style={{ backgroundColor: "var(--color-bg-section)" }} />
        <div className="absolute inset-y-0 left-0 rounded-md" style={{ width: `${relativeWidth}%`, backgroundColor: barColor, opacity: 0.85, transition: "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)" }} />
        <span className="absolute inset-y-0 left-2 flex items-center text-xs font-semibold" style={{ color: relativeWidth > 15 ? "#ffffff" : "var(--color-text-secondary)" }}>{theme.percentage}%</span>
      </div>
      <span className="w-16 shrink-0 text-right text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{formatNumber(theme.count)}</span>
      <div className="flex w-8 shrink-0 justify-center"><TrendBadge trend={theme.trend} /></div>
    </div>
  );
}

export default function ThemeBarChart() {
  const sortedThemes = [...MOCK_THEMES].sort((a, b) => b.percentage - a.percentage);
  const maxPercentage = sortedThemes[0]?.percentage ?? 1;
  return (
    <section className="card p-6" aria-label="Repartition des themes">
      <div className="mb-5">
        <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Themes les plus abordes</h2>
        <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-muted)" }}>Repartition des discours par theme principal</p>
      </div>
      <div className="mb-1 hidden items-center gap-3 px-2 text-xs font-medium uppercase tracking-wider sm:flex" style={{ color: "var(--color-text-muted)" }}>
        <span className="w-28 shrink-0">Theme</span><span className="flex-1">Proportion</span>
        <span className="w-16 shrink-0 text-right">Total</span><span className="w-8 shrink-0 text-center">Tend.</span>
      </div>
      <div className="mb-1" style={{ borderTop: "1px solid var(--color-border)" }} />
      <div className="space-y-0.5">
        {sortedThemes.map((theme, index) => (
          <ThemeBarRow key={theme.theme} theme={theme} barColor={BAR_COLORS[index % BAR_COLORS.length]} maxPercentage={maxPercentage} />
        ))}
      </div>
      <p className="mt-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
        Donnees basees sur l&apos;ensemble des discours indexes. Les tendances sont calculees sur les 30 derniers jours.
      </p>
    </section>
  );
}
