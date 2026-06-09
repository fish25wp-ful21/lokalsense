"use client"

import { useEffect } from "react"
import type { DictionaryEntry, RegionId } from "@/data/types"
import { REGION_META } from "@/data/config"
import { GuidanceBadge, LevelBadge } from "./badges"
import { X, Lightbulb } from "lucide-react"

export interface PopupItem {
  id: string
  entry: DictionaryEntry
  regionId: RegionId
}

interface TranslationPopupProps {
  item: PopupItem
  onDismiss: (id: string) => void
  autoDismissMs?: number
}

export function TranslationPopup({
  item,
  onDismiss,
  autoDismissMs = 9000,
}: TranslationPopupProps) {
  const { entry, regionId, id } = item
  const accent = REGION_META[regionId].colorVar

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), autoDismissMs)
    return () => clearTimeout(timer)
  }, [id, autoDismissMs, onDismiss])

  return (
    <div
      role="alert"
      onClick={() => onDismiss(id)}
      className="animate-popup-in pointer-events-auto relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
    >
      <span
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDismiss(id)
        }}
        aria-label="Dismiss"
        className="absolute right-2 top-2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="py-4 pl-5 pr-9">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-foreground">{entry.term}</h3>
          <LevelBadge level={entry.level} />
        </div>
        {entry.pronunciation && (
          <p className="text-xs italic text-muted-foreground">
            /{entry.pronunciation}/
          </p>
        )}

        <p className="mt-2 text-base font-semibold text-foreground">
          {entry.literal}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {entry.contextual}
        </p>

        <div className="mt-3 rounded-xl bg-secondary/70 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-accent" />
            <GuidanceBadge type={entry.guidanceType} />
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            {entry.culturalTip}
          </p>
        </div>
      </div>
    </div>
  )
}
