'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { GameState, createInitialGameState, GameScreen, STARTING_HEROES } from '@/game/state/gameState'
import { HeroDefinition, HEROES } from '@/game/heroes/heroDefinitions'
import { MapDefinition, MAPS } from '@/game/maps/mapDefinitions'
import { GameModeDefinition, GAME_MODES } from '@/game/modes/gameModeDefinitions'
import { calculateMatchRewards, calculateLevel } from '@/game/progression/progressionSystem'

type GameAction =
  | { type: 'SET_SCREEN'; screen: GameScreen }
  | { type: 'SELECT_HERO'; hero: HeroDefinition }
  | { type: 'SELECT_MODE'; mode: GameModeDefinition }
  | { type: 'SELECT_MAP'; map: MapDefinition }
  | { type: 'START_MATCH' }
  | { type: 'END_MATCH'; result: { won: boolean; kills: number; deaths: number } }
  | { type: 'UPDATE_USERNAME'; username: string }
  | { type: 'UNLOCK_HERO'; heroId: string }
  | { type: 'UNLOCK_SKIN'; skinId: string }
  | { type: 'ADD_COINS'; amount: number }
  | { type: 'SPEND_COINS'; amount: number }
  | { type: 'ADVANCE_SEASON_TIER' }
  | { type: 'PURCHASE_PREMIUM_PASS' }

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.screen }
    
    case 'SELECT_HERO':
      return { ...state, selectedHero: action.hero }
    
    case 'SELECT_MODE':
      return { ...state, selectedMode: action.mode }
    
    case 'SELECT_MAP':
      return { ...state, selectedMap: action.map }
    
    case 'START_MATCH':
      return { ...state, currentScreen: 'playing' }
    
    case 'END_MATCH': {
      const rewards = calculateMatchRewards(
        action.result.won,
        action.result.kills,
        action.result.deaths,
        0,
        state.selectedMode?.id || ''
      )
      
      const newStats = {
        ...state.playerStats,
        experience: state.playerStats.experience + rewards.experience,
        coins: state.playerStats.coins + rewards.coins,
        trophies: Math.max(0, state.playerStats.trophies + rewards.trophies),
        wins: state.playerStats.wins + (action.result.won ? 1 : 0),
        losses: state.playerStats.losses + (action.result.won ? 0 : 1),
        kills: state.playerStats.kills + action.result.kills,
        deaths: state.playerStats.deaths + action.result.deaths,
        gamesPlayed: state.playerStats.gamesPlayed + 1
      }
      
      newStats.level = calculateLevel(newStats.experience)
      
      return {
        ...state,
        currentScreen: 'results',
        playerStats: newStats,
        lastResult: {
          won: action.result.won,
          team: 'blue',
          kills: action.result.kills,
          deaths: action.result.deaths,
          damageDealt: 0,
          healing: 0,
          objectiveScore: 0,
          mvp: false,
          coinsEarned: rewards.coins,
          xpEarned: rewards.experience,
          trophyChange: rewards.trophies
        }
      }
    }
    
    case 'UPDATE_USERNAME':
      return { ...state, username: action.username }
    
    case 'UNLOCK_HERO':
      if (state.unlockedHeroes.includes(action.heroId)) return state
      return { ...state, unlockedHeroes: [...state.unlockedHeroes, action.heroId] }
    
    case 'UNLOCK_SKIN':
      if (state.unlockedSkins.includes(action.skinId)) return state
      return { ...state, unlockedSkins: [...state.unlockedSkins, action.skinId] }
    
    case 'ADD_COINS':
      return { ...state, playerStats: { ...state.playerStats, coins: state.playerStats.coins + action.amount } }
    
    case 'SPEND_COINS':
      return { ...state, playerStats: { ...state.playerStats, coins: state.playerStats.coins - action.amount } }
    
    case 'ADVANCE_SEASON_TIER':
      return { ...state, seasonTier: state.seasonTier + 1 }
    
    case 'PURCHASE_PREMIUM_PASS':
      return { ...state, hasPremiumPass: true }
    
    default:
      return state
  }
}

interface GameContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  heroes: HeroDefinition[]
  maps: MapDefinition[]
  modes: GameModeDefinition[]
  isHeroUnlocked: (heroId: string) => boolean
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialGameState('Player'))
  
  const isHeroUnlocked = (heroId: string) => {
    return state.unlockedHeroes.includes(heroId) || STARTING_HEROES.includes(heroId)
  }
  
  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      heroes: HEROES,
      maps: MAPS,
      modes: GAME_MODES,
      isHeroUnlocked
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
