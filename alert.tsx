'use client'

import { useGame } from './GameContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Lock, Check, Star, Crown } from 'lucide-react'
import { CURRENT_SEASON } from '@/game/progression/progressionSystem'

export function SeasonPass() {
  const { state, dispatch } = useGame()
  const { seasonTier, hasPremiumPass } = state
  
  const allTiers = Array.from({ length: CURRENT_SEASON.maxTier }, (_, i) => i + 1)
  
  const getFreeReward = (tier: number) => {
    return CURRENT_SEASON.freeRewards.find(r => r.tier === tier)
  }
  
  const getPremiumReward = (tier: number) => {
    return CURRENT_SEASON.premiumRewards.find(r => r.tier === tier)
  }
  
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500'
      case 'epic': return 'from-purple-500 to-pink-500'
      case 'rare': return 'from-blue-500 to-cyan-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-black/30 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'main_menu' })}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{CURRENT_SEASON.name}</h1>
            <p className="text-white/60 text-sm">{CURRENT_SEASON.theme}</p>
          </div>
        </div>
        
        {!hasPremiumPass && (
          <Button
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 font-bold"
            onClick={() => dispatch({ type: 'PURCHASE_PREMIUM_PASS' })}
          >
            <Crown className="w-4 h-4 mr-2" />
            Unlock Premium
          </Button>
        )}
      </header>

      {/* Progress Bar */}
      <div className="p-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60">Season Progress</span>
            <span className="text-white font-bold">Tier {seasonTier} / {CURRENT_SEASON.maxTier}</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all"
              style={{ width: `${(seasonTier / CURRENT_SEASON.maxTier) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rewards Track */}
      <main className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 min-w-max">
          {allTiers.map(tier => {
            const freeReward = getFreeReward(tier)
            const premiumReward = getPremiumReward(tier)
            const isUnlocked = tier <= seasonTier
            const isNext = tier === seasonTier + 1
            
            return (
              <div key={tier} className={`w-36 flex-shrink-0 ${isNext ? 'scale-105' : ''}`}>
                {/* Tier Number */}
                <div className={`text-center mb-2 ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
                  <span className="font-bold">Tier {tier}</span>
                </div>
                
                {/* Premium Reward */}
                <RewardCard
                  reward={premiumReward}
                  isUnlocked={isUnlocked && hasPremiumPass}
                  isPremium={true}
                  isLocked={!hasPremiumPass}
                  getRarityColor={getRarityColor}
                />
                
                {/* Free Reward */}
                <RewardCard
                  reward={freeReward}
                  isUnlocked={isUnlocked}
                  isPremium={false}
                  isLocked={false}
                  getRarityColor={getRarityColor}
                />
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 bg-black/30 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-white/60 text-sm">
            Play matches to earn tier progress!
          </div>
          <Button
            onClick={() => dispatch({ type: 'ADVANCE_SEASON_TIER' })}
            disabled={seasonTier >= CURRENT_SEASON.maxTier}
            className="bg-gradient-to-r from-orange-500 to-pink-500"
          >
            <Star className="w-4 h-4 mr-2" />
            Simulate Progress
          </Button>
        </div>
      </footer>
    </div>
  )
}

interface RewardCardProps {
  reward?: { name: string; rarity?: string; type: string }
  isUnlocked: boolean
  isPremium: boolean
  isLocked: boolean
  getRarityColor: (rarity?: string) => string
}

function RewardCard({ reward, isUnlocked, isPremium, isLocked, getRarityColor }: RewardCardProps) {
  if (!reward) {
    return (
      <div className={`h-24 mb-2 rounded-xl border-2 border-dashed ${
        isPremium ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-white/10 bg-white/5'
      } flex items-center justify-center`}>
        <span className="text-white/20 text-xs">Empty</span>
      </div>
    )
  }
  
  return (
    <div className={`
      h-24 mb-2 rounded-xl overflow-hidden relative
      ${isPremium ? 'border-2 border-yellow-500/50' : 'border border-white/10'}
      ${isUnlocked ? '' : 'opacity-60'}
    `}>
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(reward.rarity)}`} />
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative h-full p-3 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-white/60 text-xs capitalize">{reward.type}</span>
          {isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
        </div>
        
        <p className="text-white text-xs font-medium line-clamp-2">{reward.name}</p>
        
        {/* Status overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white/60" />
          </div>
        )}
        
        {isUnlocked && !isLocked && (
          <div className="absolute top-2 right-2">
            <Check className="w-5 h-5 text-green-400" />
          </div>
        )}
      </div>
    </div>
  )
}
