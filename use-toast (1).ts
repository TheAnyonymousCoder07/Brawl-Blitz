// Hero Definitions for Brawl Blitz - 12 Unique Heroes

export type HeroRole = 'tank' | 'damage' | 'support' | 'assassin' | 'control'

export interface HeroAbility {
  name: string
  description: string
  cooldown: number
  damage?: number
  range?: number
  duration?: number
  effect?: string
}

export interface HeroStats {
  health: number
  speed: number
  attackDamage: number
  attackRange: number
  attackSpeed: number
}

export interface HeroDefinition {
  id: string
  name: string
  role: HeroRole
  description: string
  color: number
  secondaryColor: number
  icon: string
  stats: HeroStats
  basicAttack: HeroAbility
  ability: HeroAbility
  ultimate: HeroAbility
  passive: string
}

export const HEROES: HeroDefinition[] = [
  // 1. TITAN - Tank with high health and shield
  {
    id: 'titan',
    name: 'Titan',
    role: 'tank',
    description: 'Unstoppable juggernaut with massive health and protective shields',
    color: 0x3498db,
    secondaryColor: 0x2980b9,
    icon: 'titan',
    stats: {
      health: 200,
      speed: 140,
      attackDamage: 25,
      attackRange: 80,
      attackSpeed: 0.8
    },
    basicAttack: {
      name: 'Crushing Blow',
      description: 'Powerful melee strike that damages nearby enemies',
      cooldown: 1200,
      damage: 25,
      range: 80
    },
    ability: {
      name: 'Barrier Shield',
      description: 'Deploy a protective shield that blocks projectiles',
      cooldown: 8000,
      duration: 3000,
      effect: 'shield'
    },
    ultimate: {
      name: 'Fortress',
      description: 'Become invulnerable and gain massive shield for 4 seconds',
      cooldown: 0,
      duration: 4000,
      effect: 'invulnerable'
    },
    passive: 'Gains 10% damage reduction when below 50% health'
  },

  // 2. VIPER - Sniper with long range precision
  {
    id: 'viper',
    name: 'Viper',
    role: 'damage',
    description: 'Deadly marksman who eliminates targets from extreme range',
    color: 0x9b59b6,
    secondaryColor: 0x8e44ad,
    icon: 'viper',
    stats: {
      health: 100,
      speed: 160,
      attackDamage: 45,
      attackRange: 400,
      attackSpeed: 0.5
    },
    basicAttack: {
      name: 'Precision Shot',
      description: 'Long-range accurate shot',
      cooldown: 2000,
      damage: 45,
      range: 400
    },
    ability: {
      name: 'Poison Dart',
      description: 'Fire a dart that poisons enemies over time',
      cooldown: 6000,
      damage: 10,
      duration: 4000,
      effect: 'poison'
    },
    ultimate: {
      name: 'Deadly Eye',
      description: 'Charge a devastating shot that pierces through enemies',
      cooldown: 0,
      damage: 100,
      range: 600,
      effect: 'pierce'
    },
    passive: 'Headshots deal 50% bonus damage'
  },

  // 3. SHADOW - Fast assassin with dash attacks
  {
    id: 'shadow',
    name: 'Shadow',
    role: 'assassin',
    description: 'Swift assassin who dashes through enemies leaving destruction',
    color: 0x2c3e50,
    secondaryColor: 0x1a252f,
    icon: 'shadow',
    stats: {
      health: 90,
      speed: 220,
      attackDamage: 35,
      attackRange: 60,
      attackSpeed: 1.2
    },
    basicAttack: {
      name: 'Shadow Strike',
      description: 'Quick blade slash',
      cooldown: 800,
      damage: 35,
      range: 60
    },
    ability: {
      name: 'Phantom Dash',
      description: 'Dash forward, damaging all enemies in path',
      cooldown: 5000,
      damage: 40,
      range: 200,
      effect: 'dash'
    },
    ultimate: {
      name: 'Assassination',
      description: 'Teleport behind lowest health enemy and strike',
      cooldown: 0,
      damage: 80,
      effect: 'teleport'
    },
    passive: 'Attacks from behind deal 25% bonus damage'
  },

  // 4. AURORA - Support healer
  {
    id: 'aurora',
    name: 'Aurora',
    role: 'support',
    description: 'Radiant healer who keeps allies in the fight',
    color: 0x2ed573,
    secondaryColor: 0x27ae60,
    icon: 'aurora',
    stats: {
      health: 110,
      speed: 170,
      attackDamage: 20,
      attackRange: 250,
      attackSpeed: 0.9
    },
    basicAttack: {
      name: 'Light Beam',
      description: 'Focused beam of healing light',
      cooldown: 1100,
      damage: 20,
      range: 250
    },
    ability: {
      name: 'Healing Wave',
      description: 'Heal nearby allies over time',
      cooldown: 7000,
      damage: -40,
      duration: 3000,
      effect: 'heal'
    },
    ultimate: {
      name: 'Divine Restoration',
      description: 'Fully heal all nearby allies and grant temporary shield',
      cooldown: 0,
      damage: -100,
      effect: 'mass_heal'
    },
    passive: 'Nearby allies regenerate 2 HP per second'
  },

  // 5. BLAZE - Area damage with explosives
  {
    id: 'blaze',
    name: 'Blaze',
    role: 'damage',
    description: 'Explosive specialist who controls areas with fire',
    color: 0xff6b35,
    secondaryColor: 0xe55100,
    icon: 'blaze',
    stats: {
      health: 120,
      speed: 150,
      attackDamage: 30,
      attackRange: 200,
      attackSpeed: 0.7
    },
    basicAttack: {
      name: 'Fireball',
      description: 'Launch an explosive fireball',
      cooldown: 1400,
      damage: 30,
      range: 200
    },
    ability: {
      name: 'Napalm Zone',
      description: 'Create a burning area that damages enemies',
      cooldown: 8000,
      damage: 15,
      duration: 4000,
      effect: 'area_damage'
    },
    ultimate: {
      name: 'Inferno',
      description: 'Unleash a massive explosion dealing huge damage',
      cooldown: 0,
      damage: 80,
      range: 150,
      effect: 'explosion'
    },
    passive: 'Fire attacks leave burning ground for 2 seconds'
  },

  // 6. FROST - Crowd control with slows
  {
    id: 'frost',
    name: 'Frost',
    role: 'control',
    description: 'Ice mage who slows and freezes enemies',
    color: 0x4ecdc4,
    secondaryColor: 0x00b894,
    icon: 'frost',
    stats: {
      health: 115,
      speed: 160,
      attackDamage: 25,
      attackRange: 220,
      attackSpeed: 0.85
    },
    basicAttack: {
      name: 'Ice Shard',
      description: 'Launch a chilling ice projectile',
      cooldown: 1200,
      damage: 25,
      range: 220,
      effect: 'slow'
    },
    ability: {
      name: 'Frost Nova',
      description: 'Freeze all nearby enemies briefly',
      cooldown: 9000,
      duration: 1500,
      effect: 'freeze'
    },
    ultimate: {
      name: 'Blizzard',
      description: 'Create a massive blizzard that slows and damages',
      cooldown: 0,
      damage: 60,
      duration: 5000,
      effect: 'blizzard'
    },
    passive: 'Enemies slowed by Frost take 15% more damage'
  },

  // 7. TRAP - Trap-setting strategist
  {
    id: 'trap',
    name: 'Snare',
    role: 'control',
    description: 'Cunning tactician who controls the battlefield with traps',
    color: 0xf39c12,
    secondaryColor: 0xd68910,
    icon: 'snare',
    stats: {
      health: 105,
      speed: 165,
      attackDamage: 22,
      attackRange: 180,
      attackSpeed: 0.9
    },
    basicAttack: {
      name: 'Net Shot',
      description: 'Fire a slowing net projectile',
      cooldown: 1100,
      damage: 22,
      range: 180
    },
    ability: {
      name: 'Bear Trap',
      description: 'Place a hidden trap that roots enemies',
      cooldown: 6000,
      damage: 30,
      duration: 2000,
      effect: 'root'
    },
    ultimate: {
      name: 'Minefield',
      description: 'Deploy multiple explosive mines in an area',
      cooldown: 0,
      damage: 50,
      effect: 'mines'
    },
    passive: 'Can see enemy traps and hidden units'
  },

  // 8. SURGE - Speed-boost fighter
  {
    id: 'surge',
    name: 'Surge',
    role: 'damage',
    description: 'Lightning-fast fighter who moves at incredible speeds',
    color: 0xffe66d,
    secondaryColor: 0xf1c40f,
    icon: 'surge',
    stats: {
      health: 95,
      speed: 200,
      attackDamage: 28,
      attackRange: 100,
      attackSpeed: 1.1
    },
    basicAttack: {
      name: 'Lightning Punch',
      description: 'Electrified melee strike',
      cooldown: 900,
      damage: 28,
      range: 100
    },
    ability: {
      name: 'Speed Boost',
      description: 'Gain massive speed boost and leave damaging trail',
      cooldown: 6000,
      duration: 3000,
      effect: 'speed'
    },
    ultimate: {
      name: 'Lightning Storm',
      description: 'Dash rapidly between all enemies, striking each',
      cooldown: 0,
      damage: 40,
      effect: 'multi_dash'
    },
    passive: 'Moving charges attack damage up to 20% bonus'
  },

  // 9. GUARDIAN - Shield defender
  {
    id: 'guardian',
    name: 'Guardian',
    role: 'tank',
    description: 'Protective warrior who shields allies from harm',
    color: 0x1abc9c,
    secondaryColor: 0x16a085,
    icon: 'guardian',
    stats: {
      health: 180,
      speed: 145,
      attackDamage: 20,
      attackRange: 90,
      attackSpeed: 0.75
    },
    basicAttack: {
      name: 'Shield Bash',
      description: 'Strike with shield, knocking back enemies',
      cooldown: 1300,
      damage: 20,
      range: 90,
      effect: 'knockback'
    },
    ability: {
      name: 'Ally Shield',
      description: 'Grant a nearby ally a protective shield',
      cooldown: 7000,
      duration: 4000,
      effect: 'ally_shield'
    },
    ultimate: {
      name: 'Sanctuary',
      description: 'Create a zone where allies take 50% less damage',
      cooldown: 0,
      duration: 5000,
      effect: 'damage_reduction'
    },
    passive: 'Taking damage for allies charges ultimate faster'
  },

  // 10. INFERNO - Fire damage hero
  {
    id: 'inferno',
    name: 'Inferno',
    role: 'damage',
    description: 'Fire elemental who burns everything in its path',
    color: 0xe74c3c,
    secondaryColor: 0xc0392b,
    icon: 'inferno',
    stats: {
      health: 110,
      speed: 155,
      attackDamage: 32,
      attackRange: 180,
      attackSpeed: 0.85
    },
    basicAttack: {
      name: 'Flame Burst',
      description: 'Launch burning flames',
      cooldown: 1200,
      damage: 32,
      range: 180
    },
    ability: {
      name: 'Fire Wall',
      description: 'Create a wall of fire that blocks and damages',
      cooldown: 8000,
      damage: 20,
      duration: 4000,
      effect: 'wall'
    },
    ultimate: {
      name: 'Phoenix Rise',
      description: 'Transform into phoenix, gaining flight and fire attacks',
      cooldown: 0,
      duration: 6000,
      effect: 'transform'
    },
    passive: 'Burning enemies take 5 damage per second'
  },

  // 11. GLACIER - Ice hero that freezes
  {
    id: 'glacier',
    name: 'Glacier',
    role: 'control',
    description: 'Ancient ice being who freezes enemies solid',
    color: 0x74b9ff,
    secondaryColor: 0x0984e3,
    icon: 'glacier',
    stats: {
      health: 130,
      speed: 140,
      attackDamage: 28,
      attackRange: 200,
      attackSpeed: 0.8
    },
    basicAttack: {
      name: 'Ice Spike',
      description: 'Launch a piercing ice spike',
      cooldown: 1250,
      damage: 28,
      range: 200
    },
    ability: {
      name: 'Ice Prison',
      description: 'Trap an enemy in ice, freezing them',
      cooldown: 9000,
      duration: 2500,
      effect: 'freeze'
    },
    ultimate: {
      name: 'Absolute Zero',
      description: 'Freeze all enemies in large area for 3 seconds',
      cooldown: 0,
      duration: 3000,
      effect: 'mass_freeze'
    },
    passive: 'Frozen enemies shatter for bonus damage when hit'
  },

  // 12. STRIKER - Balanced all-round fighter
  {
    id: 'striker',
    name: 'Striker',
    role: 'damage',
    description: 'Well-rounded fighter excelling in all situations',
    color: 0xff4757,
    secondaryColor: 0xee5253,
    icon: 'striker',
    stats: {
      health: 130,
      speed: 170,
      attackDamage: 30,
      attackRange: 150,
      attackSpeed: 1.0
    },
    basicAttack: {
      name: 'Power Shot',
      description: 'Balanced projectile attack',
      cooldown: 1000,
      damage: 30,
      range: 150
    },
    ability: {
      name: 'Combat Roll',
      description: 'Roll in any direction, gaining brief invulnerability',
      cooldown: 5000,
      duration: 500,
      effect: 'dodge'
    },
    ultimate: {
      name: 'Overdrive',
      description: 'Enter overdrive, boosting all stats for 6 seconds',
      cooldown: 0,
      duration: 6000,
      effect: 'stat_boost'
    },
    passive: 'Consecutive hits increase damage by 5% up to 25%'
  }
]

export const getHeroById = (id: string): HeroDefinition | undefined => {
  return HEROES.find(hero => hero.id === id)
}

export const getHeroesByRole = (role: HeroRole): HeroDefinition[] => {
  return HEROES.filter(hero => hero.role === role)
}
