"use client"

import { useMemo, useState } from "react"
import type { RegionId } from "@/data/types"
import { REGION_META, REGION_ORDER, REGION_PACKS } from "@/data/config"
import { searchEntries, type SearchResult } from "@/lib/search"
import { GuidanceBadge, LevelBadge } from "./badges"
import { ChevronLeft, Search as SearchIcon, X, Lightbulb } from "lucide-react"

interface SearchScreenProps {
  activeRegion: RegionId | null
  onBack: () => void
}

export function SearchScreen({ activeRegion, onBack }: SearchScreenProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<RegionId | "all">(
    activeRegion ?? "all",
  )
  const [selected, setSelected] = useState<SearchResult | null>(null)

  const results = useMemo(
    () => searchEntries(query, filter === "all" ? null : filter),
    [query, filter],
  )

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-8">
      <header className="mb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Dictionary</h1>
          <p className="text-xs text-muted-foreground">
            Offline search across every term
          </p>
        </div>
      </header>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any language, meaning, or tip…"
          className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-10 text-sm text-foreground outline-none ring-ring/40 transition-all duration-300 focus:ring-2"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <FilterChip
          label="All"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {REGION_ORDER.map((id) => (
          <FilterChip
            key={id}
            label={REGION_PACKS[id].name}
            active={filter === id}
            color={REGION_META[id].colorVar}
            onClick={() => setFilter(id)}
          />
        ))}
      </div>

      <p className="mt-4 text-xs font-medium text-muted-foreground">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      <div className="mt-2 flex flex-col gap-3">
        {results.map((r, i) => (
          <button
            key={`${r.regionId}-${r.term}`}
            onClick={() => setSelected(r)}
            className="animate-card-enter relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
          >
            <span
              className="absolute inset-y-0 left-0 w-1.5"
              style={{ backgroundColor: REGION_META[r.regionId].colorVar }}
              aria-hidden="true"
            />
            <div className="pl-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-foreground">
                  {r.term}
                </h3>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {r.regionName}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {r.literal}
              </p>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {r.culturalTip}
              </p>
            </div>
          </button>
        ))}

        {results.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-foreground">
              No matches found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different word or switch the region filter.
            </p>
          </div>
        )}
      </div>

      {selected && (
        <DetailModal result={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string
  active: boolean
  color?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
        active
          ? "border-transparent text-card"
          : "border-border bg-card text-muted-foreground hover:bg-secondary"
      }`}
      style={active ? { backgroundColor: color ?? "var(--primary)" } : undefined}
    >
      {label}
    </button>
  )
}

function DetailModal({
  result,
  onClose,
}: {
  result: SearchResult
  onClose: () => void
}) {
  const accent = REGION_META[result.regionId].colorVar
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-foreground/40 px-4 pb-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="animate-popup-in relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="absolute inset-y-0 left-0 w-1.5"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="py-5 pl-6 pr-10">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {result.regionName}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">
              {result.term}
            </h2>
            <LevelBadge level={result.level} />
          </div>
          {result.pronunciation && (
            <p className="text-xs italic text-muted-foreground">
              /{result.pronunciation}/
            </p>
          )}

          <div className="mt-4 space-y-3">
            <Field label="Literal translation" value={result.literal} />
            <Field label="Contextual meaning" value={result.contextual} />
          </div>

          <div className="mt-4 rounded-xl bg-secondary/70 p-4">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-accent" />
              <GuidanceBadge type={result.guidanceType} />
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {result.culturalTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-foreground">{value}</p>
    </div>
  )
}
