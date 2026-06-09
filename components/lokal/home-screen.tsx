"use client"

import type { RegionId } from "@/data/types"
import { REGION_ORDER, REGION_PACKS, REGION_META } from "@/data/config"
import { RegionIcon } from "./region-icon"
import { Search } from "lucide-react"

interface HomeScreenProps {
  onSelectRegion: (id: RegionId) => void
  onOpenSearch: () => void
}

export function HomeScreen({ onSelectRegion, onOpenSearch }: HomeScreenProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-8">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-pretty text-3xl font-bold tracking-tight text-foreground">
            LokalSense
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Listen, understand, and respond with cultural confidence across
            Indonesia.
          </p>
        </div>
        <button
          onClick={onOpenSearch}
          aria-label="Open dictionary search"
          className="rounded-full border border-border bg-card p-2.5 text-foreground transition-all duration-300 hover:bg-secondary"
        >
          <Search className="h-5 w-5" />
        </button>
      </header>

      <p className="mb-4 text-sm font-medium text-foreground">
        Choose a region to begin
      </p>

      <div className="flex flex-col gap-4">
        {REGION_ORDER.map((id, i) => {
          const pack = REGION_PACKS[id]
          const meta = REGION_META[id]
          return (
            <button
              key={id}
              onClick={() => onSelectRegion(id)}
              className="animate-card-enter group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span
                className="absolute inset-y-0 left-0 w-1.5"
                style={{ backgroundColor: meta.colorVar }}
                aria-hidden="true"
              />
              <div className="flex items-center gap-4 pl-2">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-card"
                  style={{ backgroundColor: meta.colorVar }}
                >
                  <RegionIcon id={id} className="h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">
                      {pack.name}
                    </h2>
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                      Free
                    </span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {pack.language} · {meta.tagline}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {pack.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/50 p-4 text-center">
        <p className="text-xs font-medium text-muted-foreground">
          More language packs coming soon — unlockable for Pi members.
        </p>
      </div>
    </div>
  )
}
