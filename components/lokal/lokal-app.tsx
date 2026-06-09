"use client"

import { useState } from "react"
import type { RegionId } from "@/data/types"
import { HomeScreen } from "./home-screen"
import { ListeningScreen } from "./listening-screen"
import { SearchScreen } from "./search-screen"
import { SettingsScreen } from "./settings-screen"
import { Home, Search, Settings } from "lucide-react"

type Screen = "home" | "listening" | "search" | "settings"

export function LokalApp() {
  const [screen, setScreen] = useState<Screen>("home")
  const [region, setRegion] = useState<RegionId | null>(null)

  const selectRegion = (id: RegionId) => {
    setRegion(id)
    setScreen("listening")
  }

  return (
    <div className="min-h-dvh bg-background">
      {screen === "home" && (
        <HomeScreen
          onSelectRegion={selectRegion}
          onOpenSearch={() => setScreen("search")}
        />
      )}
      {screen === "listening" && region && (
        <ListeningScreen
          regionId={region}
          onBack={() => setScreen("home")}
          onOpenSearch={() => setScreen("search")}
        />
      )}
      {screen === "search" && (
        <SearchScreen
          activeRegion={region}
          onBack={() => setScreen(region ? "listening" : "home")}
        />
      )}
      {screen === "settings" && (
        <SettingsScreen
          activeRegion={region}
          onSelectRegion={selectRegion}
          onBack={() => setScreen(region ? "listening" : "home")}
        />
      )}

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-around px-5 py-2">
          <NavButton
            label="Home"
            active={screen === "home" || screen === "listening"}
            onClick={() => setScreen(region ? "listening" : "home")}
            icon={<Home className="h-5 w-5" />}
          />
          <NavButton
            label="Search"
            active={screen === "search"}
            onClick={() => setScreen("search")}
            icon={<Search className="h-5 w-5" />}
          />
          <NavButton
            label="Settings"
            active={screen === "settings"}
            onClick={() => setScreen("settings")}
            icon={<Settings className="h-5 w-5" />}
          />
        </div>
      </nav>
      <div className="h-16" aria-hidden="true" />
    </div>
  )
}

function NavButton({
  label,
  active,
  onClick,
  icon,
}: {
  label: string
  active: boolean
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors duration-300 ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
