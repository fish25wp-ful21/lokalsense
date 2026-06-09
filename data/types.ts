export type GuidanceType = "response" | "gesture" | "social" | "taboo"

export interface DictionaryEntry {
  term: string
  pronunciation?: string
  literal: string
  contextual: string
  level?: "polite" | "casual" | "neutral" | "ritual"
  culturalTip: string
  guidanceType: GuidanceType
}

export interface RegionPack {
  id: RegionId
  name: string
  language: string
  description: string
  premium: boolean
  entries: DictionaryEntry[]
}

export type RegionId = "javanese" | "sundanese" | "balinese"
