import type { GuidanceType } from "@/data/types"

export const GUIDANCE_LABELS: Record<GuidanceType, string> = {
  response: "Response tip",
  gesture: "Gesture",
  social: "Social context",
  taboo: "Avoid / taboo",
}

const STYLES: Record<GuidanceType, string> = {
  response: "bg-accent/15 text-accent-foreground border-accent/30",
  gesture: "bg-chart-4/15 text-foreground border-chart-4/40",
  social: "bg-secondary text-secondary-foreground border-border",
  taboo: "bg-destructive/10 text-destructive border-destructive/30",
}

const LEVEL_LABELS: Record<string, string> = {
  polite: "Polite",
  casual: "Casual",
  neutral: "Neutral",
  ritual: "Ritual",
}

export function GuidanceBadge({ type }: { type: GuidanceType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[type]}`}
    >
      {GUIDANCE_LABELS[type]}
    </span>
  )
}

export function LevelBadge({ level }: { level?: string }) {
  if (!level) return null
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {LEVEL_LABELS[level] ?? level}
    </span>
  )
}
