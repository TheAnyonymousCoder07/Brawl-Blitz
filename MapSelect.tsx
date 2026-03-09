'use client'

import dynamic from 'next/dynamic'
import { useGame } from './GameContext'
import { MainMenu } from './MainMenu'
import { HeroSelect } from './HeroSelect'
import { ModeSelect } from './ModeSelect'
import { MapSelect } from './MapSelect'
import { ResultsScreen } from './ResultsScreen'
import { SeasonPass } from './SeasonPass'
import { Shop } from './Shop'
import { Spinner } from '@/components/ui/spinner'

// Dynamically import PhaserGame to avoid SSR issues with Phaser
const PhaserGame = dynamic(() => import('./PhaserGame').then(mod => mod.PhaserGame), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-12 w-12 text-cyan-400" />
        <p className="text-lg text-slate-300">Loading game...</p>
      </div>
    </div>
  )
})

export function GameWrapper() {
  const { state } = useGame()
  
  switch (state.currentScreen) {
    case 'main_menu':
      return <MainMenu />
    case 'hero_select':
      return <HeroSelect />
    case 'mode_select':
      return <ModeSelect />
    case 'map_select':
      return <MapSelect />
    case 'playing':
      return <PhaserGame />
    case 'results':
      return <ResultsScreen />
    case 'season_pass':
      return <SeasonPass />
    case 'shop':
      return <Shop />
    default:
      return <MainMenu />
  }
}
