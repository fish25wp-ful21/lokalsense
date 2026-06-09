import type { DictionaryEntry, RegionId } from "@/data/types"
import { REGION_PACKS, REGION_ORDER } from "@/data/config"

export interface SearchResult extends DictionaryEntry {
  regionId: RegionId
  regionName: string
}

function normalize(s: string): string {
  return s.toLowerCase().trim()
}

/**
 * Offline fuzzy-ish search across all indexed fields of a region pack
 * (or all packs when regionId is null). Matches term, translation,
 * contextual meaning, and cultural tips.
 */
export function searchEntries(
  query: string,
  regionId: RegionId | null,
): SearchResult[] {
  const q = normalize(query)
  const packs = regionId
    ? [REGION_PACKS[regionId]]
    : REGION_ORDER.map((id) => REGION_PACKS[id])

  const results: { result: SearchResult; score: number }[] = []

  for (const pack of packs) {
    for (const entry of pack.entries) {
      if (!q) {
        results.push({
          result: { ...entry, regionId: pack.id, regionName: pack.name },
          score: 0,
        })
        continue
      }
      const haystacks = [
        entry.term,
        entry.literal,
        entry.contextual,
        entry.culturalTip,
        entry.pronunciation ?? "",
      ].map(normalize)

      let score = 0
      if (normalize(entry.term) === q) score += 100
      if (normalize(entry.term).startsWith(q)) score += 40
      haystacks.forEach((h, i) => {
        if (h.includes(q)) score += i === 0 ? 30 : 10
      })

      if (score > 0) {
        results.push({
          result: { ...entry, regionId: pack.id, regionName: pack.name },
          score,
        })
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).map((r) => r.result)
}
