/* =============================================================================
 * app/loading.tsx
 *
 * Composant de chargement global affiché par Next.js pendant le chargement
 * des pages (Suspense boundary automatique).
 * ============================================================================= */

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="text-center">
        {/* ----- Animation de chargement (3 points) ----- */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            className="w-3 h-3 rounded-full loading-dot"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <div
            className="w-3 h-3 rounded-full loading-dot"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <div
            className="w-3 h-3 rounded-full loading-dot"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
        </div>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Chargement...
        </p>
      </div>
    </div>
  );
}
