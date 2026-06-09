"use client"

import type { RegionId } from "@/data/types"
import { REGION_ORDER, REGION_PACKS, REGION_META } from "@/data/config"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { RegionIcon } from "./region-icon"
import { ChevronLeft, Check, ShieldCheck, Lock } from "lucide-react"

interface SettingsScreenProps {
  activeRegion: RegionId | null
  onSelectRegion: (id: RegionId) => void
  onBack: () => void
}

export function SettingsScreen({
  activeRegion,
  onSelectRegion,
  onBack,
}: SettingsScreenProps) {
  const { isAuthenticated, hasError, authMessage, reinitialize } = usePiAuth()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-8">
      <header className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </header>

      {/* Pi account */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Pi Network</p>
            <p className="text-xs text-muted-foreground">
              {isAuthenticated
                ? "Signed in — premium packs ready when available"
                : authMessage}
            </p>
          </div>
          {isAuthenticated && (
            <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
              <Check className="h-3.5 w-3.5" /> Active
            </span>
          )}
        </div>
        {hasError && (
          <button
            onClick={() => reinitialize()}
            className="mt-4 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            Retry Pi sign-in
          </button>
        )}
      </section>

      {/* Region re-select */}
      <section className="mt-6">
        <p className="mb-3 text-sm font-semibold text-foreground">
          Active region
        </p>
        <div className="flex flex-col gap-3">
          {REGION_ORDER.map((id) => {
            const pack = REGION_PACKS[id]
            const meta = REGION_META[id]
            const active = activeRegion === id
            return (
              <button
                key={id}
                onClick={() => onSelectRegion(id)}
                className={`flex items-center gap-3 rounded-2xl border bg-card p-4 text-left transition-all duration-300 ${
                  active
                    ? "border-primary shadow-sm"
                    : "border-border hover:bg-secondary"
                }`}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-card"
                  style={{ backgroundColor: meta.colorVar }}
                >
                  <RegionIcon id={id} className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">
                    {pack.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pack.language}
                  </p>
                </div>
                {active && <Check className="h-5 w-5 text-primary" />}
              </button>
            )
          })}
        </div>
      </section>

      {/* Premium */}
      <section className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/50 p-5">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-bold text-foreground">Premium packs</p>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          The three included packs are free forever. Additional regional packs
          will be unlockable for authenticated Pi members. Payments arrive in a
          future update.
        </p>
      </section>

      {/* About */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-bold text-foreground">About LokalSense</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          A fully offline cultural companion. Audio is processed on your device —
          no speech is sent to any server. Dictionaries and etiquette tips ship
          inside the app.
        </p>
        <p className="mt-3 text-[11px] text-muted-foreground">Version 1.0.0</p>
      </section>
    </div>
  )
}
