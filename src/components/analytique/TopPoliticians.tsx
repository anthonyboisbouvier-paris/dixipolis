/* TopPoliticians.tsx - Composant Server : classement des politiciens les plus actifs.
 * DESIGN PREMIUM : liens vers /politicien/[slug] (singulier), badges de rang podium,
 * badges de parti avec couleurs inline, effets de survol. CSS variables uniquement. */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn, formatNumber, formatDate } from "@/lib/utils";
import { MOCK_POLITICIANS } from "@/lib/constants";

const PARTY_COLORS: Record<string, { bg: string; text: string }> = {
  RE: { bg: "#fef9c3", text: "#854d0e" }, RN: { bg: "#dbeafe", text: "#1e3a5f" },
  LFI: { bg: "#fee2e2", text: "#991b1b" }, LR: { bg: "#dbeafe", text: "#1e40af" },
  PS: { bg: "#fce7f3", text: "#9d174d" }, EELV: { bg: "#dcfce7", text: "#166534" },
  PCF: { bg: "#fecdd3", text: "#7f1d1d" }, PD: { bg: "#ffedd5", text: "#9a3412" },
};
const DEFAULT_PARTY_COLOR = { bg: "var(--color-bg-section)", text: "var(--color-text-secondary)" };

function PartyBadge({ abbreviation }: { abbreviation: string }) {
  const colors = PARTY_COLORS[abbreviation] ?? DEFAULT_PARTY_COLOR;
  return (<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>{abbreviation}</span>);
}

function RankBadge({ rank }: { rank: number }) {
  const podium: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
    2: { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" },
    3: { bg: "#fff7ed", text: "#c2410c", border: "#fdba74" },
  };
  const s = podium[rank];
  return (<span className="inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold" style={s ? { backgroundColor: s.bg, color: s.text, borderColor: s.border } : { backgroundColor: "var(--color-bg-section)", color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}>{rank}</span>);
}

export default function TopPoliticians() {
  const rankedPoliticians = [...MOCK_POLITICIANS].sort((a, b) => b.speechCount - a.speechCount).slice(0, 10);
  return (
    <section className="card p-6" aria-label="Classement des politiciens">
      <div className="mb-5">
        <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Politiciens les plus actifs</h2>
        <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-muted)" }}>Classes par nombre de discours indexes</p>
      </div>
      <div className="mb-2 hidden items-center gap-3 px-3 text-xs font-medium uppercase tracking-wider sm:flex" style={{ color: "var(--color-text-muted)" }}>
        <span className="w-7 shrink-0 text-center">#</span><span className="flex-1">Politicien</span>
        <span className="w-20 shrink-0 text-center">Parti</span><span className="w-20 shrink-0 text-right">Discours</span>
        <span className="w-28 shrink-0 text-right">Activite</span><span className="w-6 shrink-0" />
      </div>
      <div style={{ borderTop: "1px solid var(--color-border)" }} />
      <div>
        {rankedPoliticians.map((politician, index) => (
          <Link key={politician.id} href={`/politicien/${politician.slug}`}
            className={cn("group flex items-center gap-3 rounded-lg px-3 py-3 no-underline transition-colors hover:bg-[var(--color-bg-section)]")}
            style={{ color: "var(--color-text-primary)", borderBottom: index < rankedPoliticians.length - 1 ? "1px solid var(--color-border)" : "none" }}>
            <div className="flex w-7 shrink-0 justify-center"><RankBadge rank={index + 1} /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{politician.fullName}</p>
              <p className="truncate text-xs sm:hidden" style={{ color: "var(--color-text-muted)" }}>{politician.partyAbbreviation} &middot; {formatNumber(politician.speechCount)} discours</p>
            </div>
            <div className="hidden w-20 shrink-0 justify-center sm:flex"><PartyBadge abbreviation={politician.partyAbbreviation} /></div>
            <span className="hidden w-20 shrink-0 text-right text-sm font-semibold sm:block" style={{ color: "var(--color-text-secondary)" }}>{formatNumber(politician.speechCount)}</span>
            <span className="hidden w-28 shrink-0 text-right text-xs sm:block" style={{ color: "var(--color-text-muted)" }}>{formatDate(politician.lastActivity, { day: "numeric", month: "short", year: "numeric" })}</span>
            <div className="flex w-6 shrink-0 justify-center"><ArrowUpRight className="h-4 w-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "var(--color-text-muted)" }} /></div>
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-4 text-center" style={{ borderTop: "1px solid var(--color-border)" }}>
        <Link href="/politiciens" className="text-sm font-medium transition-colors" style={{ color: "var(--color-primary)" }}>Voir tous les politiciens &rarr;</Link>
      </div>
    </section>
  );
}
