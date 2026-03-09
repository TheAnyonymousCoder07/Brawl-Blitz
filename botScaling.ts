// Brawl Blitz Game Configuration
export const GAME_CONFIG = {
  width: 1280,
  height: 720,
  backgroundColor: '#1a1a2e',
  physics: {
    gravity: { x: 0, y: 0 },
    debug: false
  },
  matchDuration: 180000, // 3 minutes in ms
  respawnTime: 3000,
  ultimateChargeRate: 0.5,
  maxPlayers: 8
}

export const CONTROLS = {
  desktop: {
    up: 'W',
    down: 'S',
    left: 'A',
    right: 'D',
    attack: 'MOUSE_LEFT',
    ability: 'SPACE',
    ultimate: 'E'
  },
  mobile: {
    joystick: true,
    attackButton: true,
    abilityButton: true,
    ultimateButton: true
  }
}

export const UI_COLORS = {
  primary: '#ff6b35',
  secondary: '#4ecdc4',
  accent: '#ffe66d',
  danger: '#ff4757',
  success: '#2ed573',
  health: '#ff4757',
  shield: '#3498db',
  ultimate: '#9b59b6',
  background: '#1a1a2e',
  surface: '#16213e',
  text: '#ffffff',
  textDim: '#a0a0a0'
}

export const PARTICLE_COLORS = {
  fire: [0xff6b35, 0xff4757, 0xffe66d],
  ice: [0x4ecdc4, 0x3498db, 0xffffff],
  electric: [0xffe66d, 0xffffff, 0x9b59b6],
  heal: [0x2ed573, 0x4ecdc4, 0xffffff],
  explosion: [0xff6b35, 0xff4757, 0xffe66d, 0xffffff]
}
