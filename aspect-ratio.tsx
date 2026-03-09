'use client'

import { useState } from 'react'
import { useGame } from './GameContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Coins, Lock, Check, ShoppingBag } from 'lucide-react'
import { HERO_SKINS, EMOTES } from '@/game/progression/progressionSystem'
import { HEROES } from '@/game/heroes/heroDefinitions'
import { STARTING_HEROES } from '@/game/state/gameState'

type ShopTab = 'heroes' | 'skins' | 'emotes'

export function Shop() {
  const { state, dispatch, isHeroUnlocked } = useGame()
  const [activeTab, setActiveTab] = useState<ShopTab>('heroes')
  
  const lockedHeroes = HEROES.filter(h => !isHeroUnlocked(h.id))
  
  const handlePurchaseHero = (heroId: string, cost: number) => {
    if (state.playerStats.coins >= cost) {
      dispatch({ type: 'SPEND_COINS', amount: cost })
      dispatch({ type: 'UNLOCK_HERO', heroId })
    }
  }
  
  const handlePurchaseSkin = (skinId: string, cost: number) => {
    if (state.playerStats.coins >= cost && !state.unlockedSkins.includes(skinId)) {
      dispatch({ type: 'SPEND_COINS', amount: cost })
      dispatch({ type: 'UNLOCK_SKIN', skinId })
    }
  }
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500 border-yellow-400'
      case 'epic': return 'from-purple-500 to-pink-500 border-purple-400'
      case 'rare': return 'from-blue-500 to-cyan-500 border-blue-400'
      default: return 'from-gray-500 to-gray-600 border-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 flex flex-col">
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
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">Shop</h1>
          </div>
        </div>
        
        {/* Coins */}
        <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full border border-amber-500/30">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="text-amber-300 font-bold text-lg">{state.playerStats.coins}</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-4 bg-black/20">
        {(['heroes', 'skins', 'emotes'] as ShopTab[]).map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            className={activeTab === tab 
              ? 'bg-amber-500 hover:bg-amber-600' 
              : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Heroes Tab */}
        {activeTab === 'heroes' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {lockedHeroes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-white text-xl font-bold">All Heroes Unlocked!</p>
                <p className="text-white/60">You own every hero in the game.</p>
              </div>
            ) : (
              lockedHeroes.map(hero => {
                const cost = 300 // Base hero cost
                const canAfford = state.playerStats.coins >= cost
                
                return (
                  <div
                    key={hero.id}
                    className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
                  >
                    <div 
                      className="aspect-square flex items-center justify-center"
                      style={{ backgroundColor: `#${hero.color.toString(16).padStart(6, '0')}` }}
                    >
                      <span className="text-4xl font-bold text-white/80">{hero.name.charAt(0)}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-white font-bold truncate">{hero.name}</p>
                      <p className="text-white/40 text-xs capitalize">{hero.role}</p>
                      <Button
                        size="sm"
                        className={`w-full mt-2 ${canAfford ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-500'}`}
                        onClick={() => handlePurchaseHero(hero.id, cost)}
                        disabled={!canAfford}
                      >
                        <Coins className="w-3 h-3 mr-1" />
                        {cost}
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Skins Tab */}
        {activeTab === 'skins' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {HERO_SKINS.map(skin => {
              const owned = state.unlockedSkins.includes(skin.id)
              const canAfford = state.playerStats.coins >= skin.unlockCost
              const heroOwned = isHeroUnlocked(skin.heroId || '')
              
              return (
                <div
                  key={skin.id}
                  className={`bg-white/5 rounded-xl overflow-hidden border ${
                    owned ? 'border-green-500/50' : `border-white/10`
                  }`}
                >
                  <div 
                    className={`aspect-square flex items-center justify-center bg-gradient-to-br ${getRarityColor(skin.rarity)}`}
                    style={{ backgroundColor: `#${skin.imageColor.toString(16).padStart(6, '0')}` }}
                  >
                    {owned ? (
                      <Check className="w-12 h-12 text-white" />
                    ) : !heroOwned ? (
                      <Lock className="w-12 h-12 text-white/60" />
                    ) : (
                      <span className="text-4xl font-bold text-white/80">
                        {skin.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white font-bold truncate">{skin.name}</p>
                    <p className="text-white/40 text-xs">{skin.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded capitalize bg-gradient-to-r ${getRarityColor(skin.rarity)} text-white`}>
                        {skin.rarity}
                      </span>
                      {!owned && (
                        <Button
                          size="sm"
                          className={canAfford && heroOwned ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-500'}
                          onClick={() => handlePurchaseSkin(skin.id, skin.unlockCost)}
                          disabled={!canAfford || !heroOwned || owned}
                        >
                          <Coins className="w-3 h-3 mr-1" />
                          {skin.unlockCost}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Emotes Tab */}
        {activeTab === 'emotes' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {EMOTES.map(emote => {
              const owned = state.unlockedEmotes.includes(emote.id)
              const canAfford = state.playerStats.coins >= emote.unlockCost
              
              return (
                <div
                  key={emote.id}
                  className={`bg-white/5 rounded-xl overflow-hidden border ${
                    owned ? 'border-green-500/50' : 'border-white/10'
                  } p-4 text-center`}
                >
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: `#${emote.imageColor.toString(16).padStart(6, '0')}33` }}
                  >
                    {owned ? (
                      <Check className="w-8 h-8 text-green-400" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/20" />
                    )}
                  </div>
                  <p className="text-white font-bold text-sm truncate">{emote.name}</p>
                  {!owned && (
                    <Button
                      size="sm"
                      className={`w-full mt-2 ${canAfford ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-500'}`}
                      onClick={() => {
                        if (canAfford) {
                          dispatch({ type: 'SPEND_COINS', amount: emote.unlockCost })
                          // Note: Would need to add UNLOCK_EMOTE action
                        }
                      }}
                      disabled={!canAfford}
                    >
                      <Coins className="w-3 h-3 mr-1" />
                      {emote.unlockCost}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
