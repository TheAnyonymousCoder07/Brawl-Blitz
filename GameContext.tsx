'use client'

import { GameProvider } from '@/components/game/GameContext'
import { GameWrapper } from '@/components/game/GameWrapper'

export default function Home() {
  return (
    <GameProvider>
      <GameWrapper />
    </GameProvider>
  )
}
