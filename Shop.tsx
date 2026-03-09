'use client'

import { useGame } from './GameContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Clock, Trophy } from 'lucide-react'

export function ModeSelect() {
  const { dispatch, modes } = useGame()

  const handleSelectMode = (mode: typeof modes[0]) => {
    dispatch({ type: 'SELECT_MODE', mode })
    dispatch({ type: 'SET_SCREEN', screen: 'hero_select' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 bg-black/30 border-b border-white/10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'main_menu' })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-white">Select Game Mode</h1>
      </header>

      {/* Mode Grid */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        {modes.map((mode, index) => {
          const gradients = [
            'from-orange-500 to-red-600',
            'from-purple-500 to-pink-600',
            'from-green-500 to-teal-600',
            'from-blue-500 to-indigo-600'
          ]
          
          return (
            <button
              key={mode.id}
              onClick={() => handleSelectMode(mode)}
              className={`
                relative overflow-hidden rounded-2xl p-6 text-left
                bg-gradient-to-br ${gradients[index % gradients.length]}
                hover:scale-[1.02] transition-transform
                shadow-lg shadow-black/25
              `}
            >
              {/* Icon */}
              <div className="text-4xl mb-3 opacity-80">{mode.icon}</div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-white mb-2">{mode.name}</h2>
              
              {/* Description */}
              <p className="text-white/80 text-sm mb-4">{mode.description}</p>
              
              {/* Info Pills */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full text-white/90 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{mode.maxPlayers} Players</span>
                </div>
                <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full text-white/90 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(mode.duration / 60)}:{(mode.duration % 60).toString().padStart(2, '0')}</span>
                </div>
                {mode.teamBased && (
                  <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full text-white/90 text-sm">
                    <Trophy className="w-4 h-4" />
                    <span>Team</span>
                  </div>
                )}
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
            </button>
          )
        })}
      </main>
    </div>
  )
}
