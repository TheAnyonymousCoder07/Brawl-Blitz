'use client'

import { useGame } from './GameContext'
import { Button } from '@/components/ui/button'
import { Trophy, Star, Coins, Zap, Users, Settings, ShoppingBag, Gift } from 'lucide-react'

export function MainMenu() {
  const { state, dispatch } = useGame()
  const { playerStats, username } = state

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header Bar */}
      <header className="flex items-center justify-between p-4 bg-black/30 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 font-semibold">{playerStats.coins}</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-500/30">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-semibold">{playerStats.trophies}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'shop' })}
          >
            <ShoppingBag className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl text-balance">
            BRAWL BLITZ
          </h1>
          <p className="text-white/60 text-lg">Fast-paced arena battles</p>
        </div>

        {/* Player Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 w-full max-w-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">{username}</h3>
              <div className="flex items-center gap-2 text-white/60">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Level {playerStats.level}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-green-400 font-bold text-lg">{playerStats.wins}</p>
              <p className="text-white/40 text-xs">Wins</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-red-400 font-bold text-lg">{playerStats.losses}</p>
              <p className="text-white/40 text-xs">Losses</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-blue-400 font-bold text-lg">{playerStats.gamesPlayed}</p>
              <p className="text-white/40 text-xs">Games</p>
            </div>
          </div>
        </div>

        {/* Main Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button
            size="lg"
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl shadow-lg shadow-pink-500/25"
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'mode_select' })}
          >
            <Zap className="w-6 h-6 mr-2" />
            PLAY
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-14 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-xl"
              onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'hero_select' })}
            >
              <Users className="w-5 h-5 mr-2" />
              Heroes
            </Button>
            <Button
              variant="outline"
              className="h-14 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-xl"
              onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'season_pass' })}
            >
              <Gift className="w-5 h-5 mr-2" />
              Blitz Pass
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-white/30 text-sm">
        Brawl Blitz v1.0 - Play responsibly
      </footer>
    </div>
  )
}
