'use client'

import { useState } from 'react'
import { useGame } from './GameContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check } from 'lucide-react'
import { MapDefinition } from '@/game/maps/mapDefinitions'

export function MapSelect() {
  const { state, dispatch, maps } = useGame()
  const [selectedMap, setSelectedMap] = useState<MapDefinition | null>(null)

  const handleConfirm = () => {
    if (selectedMap) {
      dispatch({ type: 'SELECT_MAP', map: selectedMap })
      dispatch({ type: 'START_MATCH' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 bg-black/30 border-b border-white/10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'hero_select' })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-white">Select Arena</h1>
        
        {/* Selected info */}
        {state.selectedHero && state.selectedMode && (
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: `#${state.selectedHero.color.toString(16).padStart(6, '0')}` }}
              />
              <span className="text-white text-sm">{state.selectedHero.name}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <span className="text-xl">{state.selectedMode.icon}</span>
              <span className="text-white text-sm">{state.selectedMode.name}</span>
            </div>
          </div>
        )}
      </header>

      {/* Map Grid */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {maps.map((map) => {
            const isSelected = selectedMap?.id === map.id
            
            return (
              <button
                key={map.id}
                onClick={() => setSelectedMap(map)}
                className={`
                  relative overflow-hidden rounded-2xl aspect-[16/10] text-left
                  transition-all hover:scale-[1.02]
                  ${isSelected ? 'ring-4 ring-white' : ''}
                `}
                style={{ backgroundColor: `#${map.backgroundColor.toString(16).padStart(6, '0')}` }}
              >
                {/* Map Preview */}
                <div className="absolute inset-0 p-4">
                  <MapPreview map={map} />
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{map.name}</h3>
                  <p className="text-white/60 text-sm">{map.description}</p>
                </div>
                
                {/* Selected check */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 bg-black/30 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            {selectedMap && (
              <div className="text-white">
                <p className="font-bold">{selectedMap.name}</p>
                <p className="text-white/60 text-sm">{selectedMap.objects.filter(o => o.type === 'grass').length} stealth zones</p>
              </div>
            )}
          </div>
          <Button
            size="lg"
            className="px-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 font-bold"
            onClick={handleConfirm}
            disabled={!selectedMap}
          >
            Start Battle
          </Button>
        </div>
      </footer>
    </div>
  )
}

function MapPreview({ map }: { map: MapDefinition }) {
  const scale = 0.15
  
  return (
    <svg 
      viewBox={`0 0 ${map.width} ${map.height}`}
      className="w-full h-full"
      style={{ opacity: 0.6 }}
    >
      {map.objects.map((obj, index) => {
        let fill = '#7f8c8d'
        if (obj.type === 'grass') fill = '#27ae60'
        if (obj.type === 'destructible') fill = '#c0392b'
        if (obj.color) fill = `#${obj.color.toString(16).padStart(6, '0')}`
        
        return (
          <rect
            key={index}
            x={obj.x}
            y={obj.y}
            width={obj.width}
            height={obj.height}
            fill={fill}
            rx={4}
          />
        )
      })}
      
      {/* Spawn points */}
      {map.spawnPoints.map((spawn, index) => (
        <circle
          key={`spawn-${index}`}
          cx={spawn.x}
          cy={spawn.y}
          r={15}
          fill={spawn.team === 'blue' ? '#3498db' : spawn.team === 'red' ? '#e74c3c' : '#f1c40f'}
          opacity={0.7}
        />
      ))}
      
      {/* Objectives */}
      {map.objectivePositions?.map((pos, index) => (
        <circle
          key={`obj-${index}`}
          cx={pos.x}
          cy={pos.y}
          r={20}
          fill="#f1c40f"
          stroke="#fff"
          strokeWidth={3}
        />
      ))}
    </svg>
  )
}
