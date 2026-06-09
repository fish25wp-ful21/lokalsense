import type { RegionId, RegionPack } from "./types"
import javanese from "./regions/javanese.json"
import sundanese from "./regions/sundanese.json"
import balinese from "./regions/balinese.json"

/**
 * Region pack registry.
 * To add a new language pack: drop a JSON file in /data/regions/
 * and register it here with one entry.
 */
export const REGION_PACKS: Record<RegionId, RegionPack> = {
  javanese: javanese as RegionPack,
  sundanese: sundanese as RegionPack,
  balinese: balinese as RegionPack,
}

export const REGION_ORDER: RegionId[] = ["javanese", "sundanese", "balinese"]

export const REGION_META: Record<
  RegionId,
  { icon: string; tagline: string; colorVar: string }
> = {
  javanese: {
    icon: "wayang",
    tagline: "Wayang & krama courtesy",
    colorVar: "var(--region-javanese)",
  },
  sundanese: {
    icon: "angklung",
    tagline: "Angklung & gentle speech",
    colorVar: "var(--region-sundanese)",
  },
  balinese: {
    icon: "temple",
    tagline: "Temple rituals & respect",
    colorVar: "var(--region-balinese)",
  },
}

export function getPack(id: RegionId): RegionPack {
  return REGION_PACKS[id]
}
