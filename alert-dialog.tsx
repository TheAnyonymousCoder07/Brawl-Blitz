'use client'

import { useGame } from './GameContext'
import { Button } from '@/components/ui/button'
import { Trophy, Skull, Star, Coins, TrendingUp, Home, RotateCcw } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

export function ResultsScreen() {
  const { state, dispatch } = useGame()
  const result = state.lastResult
  
  useEffect(() => {
    if (result?.won) {
      // Trigger confetti for victory
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        })
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        })
      }, 200)
    }
  }, [result?.won])
  
  if (!result) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">No match data available</p>
      </div>
    )
  }

  const kd = result.deaths === 0 ? result.kills : (result.kills / result.deaths).toFixed(2)

  return (
    <div className={`min-h-screen flex flex-col ${
      result.won 
        ? 'bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900' 
        : 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900'
    }`}>
      {/* Victory/Defeat Banner */}
      <div className={`py-12 text-center ${result.won ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
        <div className="text-6xl md:text-8xl font-black mb-2">
          {result.won ? (
            <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              VICTORY
            </span>
          ) : (
            <span className="bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 bg-clip-text text-transparent">
              DEFEAT
            </span>
          )}
        </div>
        <p className="text-white/60 text-lg">
          {result.won ? 'You dominated the arena!' : 'Better luck next time!'}
        </p>
      </div>

      {/* Stats */}
      <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
        {/* Performance Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
          <h2 className="text-white text-xl font-bold mb-4">Match Performance</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard 
              icon={<Target className="w-6 h-6 text-green-400" />}
              label="Kills"
              value={result.kills}
            />
            <StatCard 
              icon={<Skull className="w-6 h-6 text-red-400" />}
              label="Deaths"
              value={result.deaths}
            />
            <StatCard 
              icon={<TrendingUp className="w-6 h-6 text-blue-400" />}
              label="K/D Ratio"
              value={kd}
            />
          </div>
          
          {/* Hero Used */}
          <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
              style={{ backgroundColor: `#${state.selectedHero?.color.toString(16).padStart(6, '0')}` }}
            >
              {state.selectedHero?.name.charAt(0)}
            </div>
            <div>
              <p className="text-white font-bold">{state.selectedHero?.name}</p>
              <p className="text-white/40 text-sm capitalize">{state.selectedHero?.role}</p>
            </div>
          </div>
        </div>

        {/* Rewards Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
          <h2 className="text-white text-xl font-bold mb-4">Rewards Earned</h2>
          
          <div className="space-y-4">
            {/* Coins */}
            <div className="flex items-center justify-between bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
              <div className="flex items-center gap-3">
                <Coins className="w-8 h-8 text-amber-400" />
                <span className="text-white text-lg">Coins</span>
              </div>
              <span className="text-amber-300 font-bold text-2xl">+{result.coinsEarned}</span>
            </div>
            
            {/* XP */}
            <div className="flex items-center justify-between bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-purple-400" />
                <span className="text-white text-lg">Experience</span>
              </div>
              <span className="text-purple-300 font-bold text-2xl">+{result.xpEarned}</span>
            </div>
            
            {/* Trophies */}
            <div className={`flex items-center justify-between rounded-xl p-4 border ${
              result.trophyChange >= 0 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex items-center gap-3">
                <Trophy className={`w-8 h-8 ${result.trophyChange >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                <span className="text-white text-lg">Trophies</span>
              </div>
              <span className={`font-bold text-2xl ${result.trophyChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {result.trophyChange >= 0 ? '+' : ''}{result.trophyChange}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            size="lg"
            variant="outline"
            className="flex-1 h-14 bg-white/5 border-white/20 text-white hover:bg-white/10"
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'main_menu' })}
          >
            <Home className="w-5 h-5 mr-2" />
            Main Menu
          </Button>
          <Button
            size="lg"
            className="flex-1 h-14 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 font-bold"
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'map_select' })}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-white text-2xl font-bold">{value}</p>
      <p className="text-white/40 text-sm">{label}</p>
    </div>
  )
}

function Target({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
