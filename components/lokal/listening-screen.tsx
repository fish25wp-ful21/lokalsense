"use client"

import { useCallback, useState } from "react"
import type { DictionaryEntry, RegionId } from "@/data/types"
import { REGION_PACKS, REGION_META } from "@/data/config"
import { useListening } from "@/hooks/use-listening"
import { RegionIcon } from "./region-icon"
import { TranslationPopup, type PopupItem } from "./translation-popup"
import { ChevronLeft, Mic, MicOff, Search } from "lucide-react"

interface ListeningScreenProps {
  regionId: RegionId
  onBack: () => void
  onOpenSearch: () => void
}

export function ListeningScreen({
  regionId,
  onBack,
  onOpenSearch,
}: ListeningScreenProps) {
  const pack = REGION_PACKS[regionId]
  const meta = REGION_META[regionId]
  const [popups, setPopups] = useState<PopupItem[]>([])

  const handleDetect = useCallback(
    (entry: DictionaryEntry) => {
      setPopups((prev) => {
        const id = `${entry.term}-${Date.now()}`
        const next = [{ id, entry, regionId }, ...prev]
        return next.slice(0, 3)
      })
    },
    [regionId],
  )

  const { isListening, permission, simulated, lastHeard, start, stop } =
    useListening({ regionId, onDetect: handleDetect })

  const dismiss = useCallback((id: string) => {
    setPopups((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-8">
      <header className="flex items-center justify-between">
        <button
          onClick={() => {
            stop()
            onBack()
          }}
          aria-label="Back to regions"
          className="rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-card"
            style={{ backgroundColor: meta.colorVar }}
          >
            <RegionIcon id={regionId} className="h-5 w-5" />
          </span>
          <div className="text-center">
            <p className="text-base font-bold leading-none text-foreground">
              {pack.name}
            </p>
            <p className="text-[11px] text-muted-foreground">{pack.language}</p>
          </div>
        </div>
        <button
          onClick={onOpenSearch}
          aria-label="Open dictionary search"
          className="rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:bg-secondary"
        >
          <Search className="h-5 w-5" />
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center py-10">
        <div className="relative flex h-44 w-44 items-center justify-center">
          {isListening && (
            <>
              <span
                className="absolute inset-0 animate-ping rounded-full opacity-20"
                style={{ backgroundColor: meta.colorVar }}
              />
              <span
                className="absolute inset-4 animate-pulse rounded-full opacity-25"
                style={{ backgroundColor: meta.colorVar }}
              />
            </>
          )}
          <button
            onClick={isListening ? stop : start}
            aria-label={isListening ? "Stop listening" : "Start listening"}
            className="relative flex h-28 w-28 items-center justify-center rounded-full text-card shadow-lg transition-all duration-300 active:scale-95"
            style={{
              backgroundColor: isListening ? meta.colorVar : "var(--primary)",
            }}
          >
            {isListening ? (
              <Mic className="h-11 w-11" />
            ) : (
              <MicOff className="h-11 w-11" />
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-foreground">
          {isListening ? "Listening for regional speech…" : "Tap to start listening"}
        </p>
        <p className="mt-1 max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
          {isListening
            ? "Keep the app open while you talk. Known terms appear as tips below."
            : "We'll ask for microphone access so we can recognize spoken phrases on-device."}
        </p>

        {isListening && simulated && (
          <p className="mt-3 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">
            Demo mode — simulating detected phrases
          </p>
        )}
        {isListening && permission === "denied" && (
          <p className="mt-2 max-w-xs text-center text-[11px] text-destructive">
            Microphone blocked. Showing simulated detections so you can preview
            the experience.
          </p>
        )}
        {isListening && !!lastHeard && !simulated && (
          <p className="mt-3 max-w-xs truncate rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">
            Heard: {lastHeard}
          </p>
        )}
      </div>

      {/* Pop-up stack */}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-30 mx-auto flex w-full max-w-md flex-col gap-3 px-5">
        {popups.map((item) => (
          <TranslationPopup key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </div>
  )
}
