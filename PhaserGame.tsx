'use client'

import { useState } from 'react'
import { useGame } from './GameContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Crosshair, Heart, Zap, Snowflake } from 'lucide-react'
import { HeroDefinition, HeroRole } from '@/game/heroes/heroDefinitions'
import { HeroPortrait } from './HeroPortrait'

const roleIcons: Record<HeroRole, React.ReactNode> = {
  tank: <Shield className="w-4 h-4" />,
  damage: <Crosshair className="w-4 h-4" />,
  support: <Heart className="w-4 h-4" />,
  assassin: <Zap className="w-4 h-4" />,
  control: <Snowflake className="w-4 h-4" />
}

const roleColors: Record<HeroRole, string> = {
  tank: 'from-blue-500 to-blue-700',
  damage: 'from-red-500 to-red-700',
  support: 'from-green-500 to-green-700',
  assassin: 'from-purple-500 to-purple-700',
  control: 'from-cyan-500 to-cyan-700'
}

export function HeroSelect() {
  const { state, dispatch, heroes, isHeroUnlocked } = useGame()
  const [selectedHero, setSelectedHero] = useState<HeroDefinition | null>(state.selectedHero)
  const [selectedRole, setSelectedRole] = useState<HeroRole | 'all'>('all')

  const filteredHeroes = selectedRole === 'all' 
    ? heroes 
    : heroes.filter(h => h.role === selectedRole)

  const handleSelectHero = (hero: HeroDefinition) => {
    if (isHeroUnlocked(hero.id)) {
      setSelectedHero(hero)
    }
  }

  const handleConfirm = () => {
    if (selectedHero) {
      dispatch({ type: 'SELECT_HERO', hero: selectedHero })
      if (state.currentScreen === 'hero_select' && !state.selectedMode) {
        dispatch({ type: 'SET_SCREEN', screen: 'main_menu' })
      } else {
        dispatch({ type: 'SET_SCREEN', screen: 'map_select' })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 bg-black/30 border-b border-white/10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: state.selectedMode ? 'mode_select' : 'main_menu' })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-white">Select Hero</h1>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Hero Grid */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Role Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedRole === 'all' ? 'default' : 'outline'}
              size="sm"
              className={selectedRole === 'all' ? 'bg-white/20' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}
              onClick={() => setSelectedRole('all')}
            >
              All
            </Button>
            {(['tank', 'damage', 'support', 'assassin', 'control'] as HeroRole[]).map(role => (
              <Button
                key={role}
                variant={selectedRole === role ? 'default' : 'outline'}
                size="sm"
                className={selectedRole === role ? `bg-gradient-to-r ${roleColors[role]}` : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}
                onClick={() => setSelectedRole(role)}
              >
                {roleIcons[role]}
                <span className="ml-1 capitalize">{role}</span>
              </Button>
            ))}
          </div>

          {/* Heroes Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {filteredHeroes.map(hero => {
              const unlocked = isHeroUnlocked(hero.id)
              const isSelected = selectedHero?.id === hero.id
              
              return (
                <button
                  key={hero.id}
                  onClick={() => handleSelectHero(hero)}
                  className={`
                    relative flex flex-col items-center gap-2 p-2 rounded-xl transition-all
                    ${unlocked ? 'hover:scale-105 hover:bg-white/10' : 'opacity-60'}
                    ${isSelected ? 'bg-white/20 scale-105' : ''}
                  `}
                >
                  {/* Brawl Stars Style Portrait */}
                  <HeroPortrait 
                    heroId={hero.icon}
                    color={hero.color}
                    secondaryColor={hero.secondaryColor}
                    size="lg"
                    isSelected={isSelected}
                    isLocked={!unlocked}
                  />
                  
                  {/* Name with role color */}
                  <div className="text-center">
                    <p className="text-white text-sm font-bold truncate">{hero.name}</p>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r ${roleColors[hero.role]}`}>
                      {roleIcons[hero.role]}
                      <span className="capitalize">{hero.role}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Hero Details */}
        {selectedHero && (
          <div className="w-full lg:w-96 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            {/* Large Brawl Stars Portrait */}
            <div className="flex justify-center mb-4">
              <HeroPortrait 
                heroId={selectedHero.icon}
                color={selectedHero.color}
                secondaryColor={selectedHero.secondaryColor}
                size="xl"
                showBorder={true}
              />
            </div>
            
            <h2 className="text-3xl font-black text-white text-center mb-2 drop-shadow-lg" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000' }}>
              {selectedHero.name}
            </h2>
            
            <div className="flex justify-center mb-4">
              <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r ${roleColors[selectedHero.role]} text-white text-sm font-bold shadow-lg`}>
                {roleIcons[selectedHero.role]}
                <span className="capitalize">{selectedHero.role}</span>
              </div>
            </div>
            
            <p className="text-white/60 text-sm text-center mb-6">{selectedHero.description}</p>
            
            {/* Stats */}
            <div className="space-y-3 mb-6">
              <StatBar label="Health" value={selectedHero.stats.health} max={200} color="bg-red-500" />
              <StatBar label="Speed" value={selectedHero.stats.speed} max={220} color="bg-green-500" />
              <StatBar label="Damage" value={selectedHero.stats.attackDamage} max={50} color="bg-orange-500" />
              <StatBar label="Range" value={selectedHero.stats.attackRange} max={400} color="bg-blue-500" />
            </div>
            
            {/* Abilities */}
            <div className="space-y-3">
              <AbilityCard 
                name={selectedHero.basicAttack.name}
                description={selectedHero.basicAttack.description}
                type="Basic"
              />
              <AbilityCard 
                name={selectedHero.ability.name}
                description={selectedHero.ability.description}
                type="Ability"
                cooldown={selectedHero.ability.cooldown / 1000}
              />
              <AbilityCard 
                name={selectedHero.ultimate.name}
                description={selectedHero.ultimate.description}
                type="Ultimate"
              />
            </div>
            
            <Button
              className="w-full mt-6 h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg font-bold"
              onClick={handleConfirm}
              disabled={!isHeroUnlocked(selectedHero.id)}
            >
              Select Hero
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percent = (value / max) * 100
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/60">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function AbilityCard({ name, description, type, cooldown }: { name: string; description: string; type: string; cooldown?: number }) {
  const bgColor = type === 'Basic' ? 'bg-gray-500/20' : type === 'Ability' ? 'bg-blue-500/20' : 'bg-purple-500/20'
  const borderColor = type === 'Basic' ? 'border-gray-500/30' : type === 'Ability' ? 'border-blue-500/30' : 'border-purple-500/30'
  
  return (
    <div className={`p-3 rounded-lg ${bgColor} border ${borderColor}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-white font-medium text-sm">{name}</span>
        <span className="text-white/40 text-xs">{type}</span>
      </div>
      <p className="text-white/50 text-xs">{description}</p>
      {cooldown && <p className="text-white/40 text-xs mt-1">Cooldown: {cooldown}s</p>}
    </div>
  )
}
