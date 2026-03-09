'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useGame } from './GameContext'
import { Button } from '@/components/ui/button'
import { Heart, Zap, Target, Clock, Users } from 'lucide-react'
import { GAME_MODES } from '@/game/modes/gameModeDefinitions'
import { MAPS } from '@/game/maps/mapDefinitions'
import { HEROES, HeroDefinition } from '@/game/heroes/heroDefinitions'
import { HeroPortrait } from './HeroPortrait'

interface KillFeedEntry {
  id: number
  killer: string
  victim: string
  timestamp: number
}

export function PhaserGame() {
  const { state, dispatch } = useGame()
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  
  const [health, setHealth] = useState(100)
  const [maxHealth, setMaxHealth] = useState(100)
  const [ultimateCharge, setUltimateCharge] = useState(0)
  const [abilityCooldown, setAbilityCooldown] = useState(0)
  const [blueScore, setBlueScore] = useState(0)
  const [redScore, setRedScore] = useState(0)
  const [matchTime, setMatchTime] = useState(180)
  const [killFeed, setKillFeed] = useState<KillFeedEntry[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [gameLoaded, setGameLoaded] = useState(false)
  
  const ultimateReady = ultimateCharge >= 100
  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const handleScoreUpdate = useCallback((blue: number, red: number) => {
    setBlueScore(blue)
    setRedScore(red)
  }, [])
  
  const handleTimeUpdate = useCallback((time: number) => {
    setMatchTime(time)
  }, [])
  
  const handlePlayerUpdate = useCallback((hp: number, maxHp: number, ult: number, ability: number) => {
    setHealth(hp)
    setMaxHealth(maxHp)
    setUltimateCharge(ult)
    setAbilityCooldown(ability)
  }, [])
  
  const handleMatchEnd = useCallback((result: { won: boolean, kills: number, deaths: number }) => {
    dispatch({ 
      type: 'SET_MATCH_RESULT', 
      payload: {
        won: result.won,
        kills: result.kills,
        deaths: result.deaths,
        coinsEarned: result.won ? 50 + result.kills * 10 : 20 + result.kills * 5,
        xpEarned: result.won ? 100 + result.kills * 20 : 50 + result.kills * 10,
        trophiesChange: result.won ? 8 : -3
      }
    })
    dispatch({ type: 'SET_SCREEN', payload: 'results' })
  }, [dispatch])
  
  const handleKillFeed = useCallback((killer: string, victim: string) => {
    setKillFeed(prev => {
      const newEntry = { id: Date.now(), killer, victim, timestamp: Date.now() }
      return [newEntry, ...prev].slice(0, 5)
    })
  }, [])
  
  // Initialize Phaser game
  useEffect(() => {
    if (!gameContainerRef.current || gameLoaded) return
    
    const initPhaser = async () => {
      // Dynamically import Phaser and GameEngine
      const Phaser = await import('phaser')
      const { createPhaserGame } = await import('@/game/engine/GameEngine')
      
      const selectedMode = state.selectedMode ? GAME_MODES.find(m => m.id === state.selectedMode) : GAME_MODES[0]
      const selectedMap = state.selectedMap ? MAPS.find(m => m.id === state.selectedMap) : MAPS[0]
const selectedHero: HeroDefinition | undefined = state.selectedHero 
    ? HEROES.find(h => h.id === state.selectedHero) 
    : HEROES[0]
      
      if (gameRef.current) {
        gameRef.current.destroy(true)
      }
      
      gameRef.current = createPhaserGame(
        gameContainerRef.current!,
        selectedMap!,
        selectedMode!,
        selectedHero!,
        Math.random() > 0.5 ? 'blue' : 'red',
        handleScoreUpdate,
        handleTimeUpdate,
        handlePlayerUpdate,
        handleMatchEnd,
        handleKillFeed,
        isMobile
      ) as unknown as Phaser.Game
      
      setGameLoaded(true)
    }
    
    initPhaser()
    
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
        setGameLoaded(false)
      }
    }
  }, [state.selectedMode, state.selectedMap, state.selectedHero, handleScoreUpdate, handleTimeUpdate, handlePlayerUpdate, handleMatchEnd, handleKillFeed, isMobile, gameLoaded])
  
  // Mobile controls handlers
  const handleMobileAttack = useCallback(() => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene('GameScene') as any
      scene?.triggerAttack()
    }
  }, [])
  
  const handleMobileAbility = useCallback(() => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene('GameScene') as any
      scene?.triggerAbility()
    }
  }, [])
  
  const handleMobileUltimate = useCallback(() => {
    if (gameRef.current && ultimateReady) {
      const scene = gameRef.current.scene.getScene('GameScene') as any
      scene?.triggerUltimate()
    }
  }, [ultimateReady])
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Remove old kill feed entries
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setKillFeed(prev => prev.filter(entry => now - entry.timestamp < 5000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const selectedHero = state.selectedHero ? HEROES.find(h => h.id === state.selectedHero) : HEROES[0]
  
  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-900">
      {/* Game Canvas Container */}
      <div 
        ref={gameContainerRef} 
        className="absolute inset-0"
        style={{ touchAction: 'none' }}
      />
      
      {/* Top HUD */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4">
        {/* Blue Team Score */}
        <div className="flex items-center gap-2 rounded-lg bg-blue-600/90 px-4 py-2 backdrop-blur-sm">
          <Users className="h-5 w-5" />
          <span className="text-xl font-bold">{blueScore}</span>
        </div>
        
        {/* Timer */}
        <div className="flex items-center gap-2 rounded-lg bg-slate-800/90 px-6 py-2 backdrop-blur-sm">
          <Clock className="h-5 w-5 text-yellow-400" />
          <span className="text-2xl font-bold tabular-nums">{formatTime(matchTime)}</span>
        </div>
        
        {/* Red Team Score */}
        <div className="flex items-center gap-2 rounded-lg bg-red-600/90 px-4 py-2 backdrop-blur-sm">
          <span className="text-xl font-bold">{redScore}</span>
          <Users className="h-5 w-5" />
        </div>
      </div>
      
      {/* Kill Feed */}
      <div className="absolute right-4 top-20 z-10 flex flex-col gap-1">
        {killFeed.map(entry => (
          <div 
            key={entry.id}
            className="flex items-center gap-2 rounded bg-slate-800/80 px-3 py-1 text-sm backdrop-blur-sm animate-in slide-in-from-right"
          >
            <span className={entry.killer.includes('Blue') ? 'text-blue-400' : 'text-red-400'}>
              {entry.killer}
            </span>
            <Target className="h-3 w-3 text-slate-400" />
            <span className={entry.victim.includes('Blue') ? 'text-blue-400' : 'text-red-400'}>
              {entry.victim}
            </span>
          </div>
        ))}
      </div>
      
      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-end gap-4">
        {/* Health Bar */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">{Math.round(health)}/{maxHealth}</span>
          </div>
          <div className="h-4 w-48 overflow-hidden rounded-full bg-slate-700/80 backdrop-blur-sm">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-200"
              style={{ width: `${(health / maxHealth) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Ability */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800/80 backdrop-blur-sm">
            {abilityCooldown > 0 ? (
              <>
                <div 
                  className="absolute inset-0 rounded-xl bg-slate-600/80"
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(2 * Math.PI * (1 - abilityCooldown / 10))}% ${50 - 50 * Math.cos(2 * Math.PI * (1 - abilityCooldown / 10))}%, 50% 50%)`
                  }}
                />
                <span className="text-lg font-bold">{Math.ceil(abilityCooldown)}</span>
              </>
            ) : (
              <Zap className="h-8 w-8 text-cyan-400" />
            )}
          </div>
          <span className="text-xs text-slate-300">SPACE</span>
        </div>
        
        {/* Ultimate */}
        <div className="flex flex-col items-center gap-1">
          <div className={`relative flex h-20 w-20 items-center justify-center rounded-xl backdrop-blur-sm ${ultimateReady ? 'bg-yellow-500/80 animate-pulse' : 'bg-slate-800/80'}`}>
            <div 
              className="absolute inset-1 rounded-lg bg-slate-900/60"
              style={{ 
                background: `conic-gradient(from 0deg, ${ultimateReady ? '#eab308' : '#22d3ee'} ${ultimateCharge * 3.6}deg, transparent ${ultimateCharge * 3.6}deg)`
              }}
            />
            <div className="relative flex flex-col items-center">
              <span className="text-2xl font-bold">{Math.round(ultimateCharge)}%</span>
              {ultimateReady && <span className="text-xs font-semibold">READY!</span>}
            </div>
          </div>
          <span className="text-xs text-slate-300">E</span>
        </div>
      </div>
      
      {/* Hero Info */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 rounded-lg bg-slate-800/80 p-3 backdrop-blur-sm">
        <div 
          className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
          style={{ backgroundColor: selectedHero?.color }}
        >
          {selectedHero?.icon}
        </div>
        <div>
          <div className="font-bold">{selectedHero?.name}</div>
          <div className="text-xs text-slate-400">{selectedHero?.role}</div>
        </div>
      </div>
      
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute right-4 bottom-4 z-10 bg-slate-800/80 backdrop-blur-sm"
        onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'main_menu' })}
      >
        Leave Match
      </Button>
      
      {/* Mobile Controls */}
      {isMobile && (
        <>
          {/* Virtual Joystick */}
          <div 
            className="absolute bottom-24 left-8 z-20 h-32 w-32 rounded-full bg-slate-800/60 backdrop-blur-sm"
            onTouchStart={(e) => {
              e.preventDefault()
              const rect = e.currentTarget.getBoundingClientRect()
              const centerX = rect.left + rect.width / 2
              const centerY = rect.top + rect.height / 2
              
              const handleMove = (touchEvent: TouchEvent) => {
                const touch = touchEvent.touches[0]
                const dx = (touch.clientX - centerX) / (rect.width / 2)
                const dy = (touch.clientY - centerY) / (rect.height / 2)
                const magnitude = Math.min(1, Math.sqrt(dx * dx + dy * dy))
                const angle = Math.atan2(dy, dx)
                
                if (gameRef.current) {
                  const scene = gameRef.current.scene.getScene('GameScene') as any
                  scene?.setJoystick(
                    Math.cos(angle) * magnitude,
                    Math.sin(angle) * magnitude
                  )
                }
              }
              
              const handleEnd = () => {
                if (gameRef.current) {
                  const scene = gameRef.current.scene.getScene('GameScene') as any
                  scene?.clearJoystick()
                }
                document.removeEventListener('touchmove', handleMove)
                document.removeEventListener('touchend', handleEnd)
              }
              
              document.addEventListener('touchmove', handleMove)
              document.addEventListener('touchend', handleEnd)
            }}
          >
            <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-600" />
          </div>
          
          {/* Attack Button */}
          <Button
            className="absolute bottom-24 right-8 z-20 h-20 w-20 rounded-full bg-red-600 text-xl hover:bg-red-700"
            onTouchStart={handleMobileAttack}
          >
            <Target className="h-10 w-10" />
          </Button>
          
          {/* Ability Button */}
          <Button
            className="absolute bottom-48 right-20 z-20 h-16 w-16 rounded-full bg-cyan-600 hover:bg-cyan-700"
            disabled={abilityCooldown > 0}
            onTouchStart={handleMobileAbility}
          >
            <Zap className="h-8 w-8" />
          </Button>
          
          {/* Ultimate Button */}
          <Button
            className={`absolute bottom-48 right-4 z-20 h-16 w-16 rounded-full ${ultimateReady ? 'bg-yellow-500 animate-pulse hover:bg-yellow-600' : 'bg-slate-600'}`}
            disabled={!ultimateReady}
            onTouchStart={handleMobileUltimate}
          >
            <span className="text-lg font-bold">ULT</span>
          </Button>
        </>
      )}
    </div>
  )
}
