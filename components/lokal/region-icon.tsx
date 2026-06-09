import type { RegionId } from "@/data/types"

interface IconProps {
  id: RegionId
  className?: string
}

/**
 * Simple, recognizable line-art motifs for each region pack.
 * Javanese: wayang (shadow puppet) silhouette
 * Sundanese: angklung (bamboo instrument)
 * Balinese: temple (pura) silhouette
 */
export function RegionIcon({ id, className = "h-8 w-8" }: IconProps) {
  if (id === "javanese") {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M24 4c-3 2-4 5-4 8 0 2 1 4 1 6l-3 2c-1 4 0 9 2 13 1 3 3 5 5 7" />
        <path d="M24 4c3 2 4 5 4 8 0 2-1 4-1 6l3 2c1 4 0 9-2 13-1 3-3 5-5 7" />
        <path d="M21 18c1 1 2 1 3 1s2 0 3-1" />
        <path d="M20 12l-4-2M28 12l4-2" />
      </svg>
    )
  }
  if (id === "sundanese") {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M10 8h28" />
        <path d="M16 8v26a3 3 0 0 0 6 0V8" />
        <path d="M26 8v32a3 3 0 0 0 6 0V8" />
        <path d="M12 40h24" />
      </svg>
    )
  }
  // balinese temple
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 4l8 8H16l8-8z" />
      <path d="M18 12h12l-2 6H20l-2-6z" />
      <path d="M19 18h10l-1 7H20l-1-7z" />
      <path d="M14 25h20v6H14z" />
      <path d="M12 31h24v8H12z" />
      <path d="M22 39v-5h4v5" />
    </svg>
  )
}
