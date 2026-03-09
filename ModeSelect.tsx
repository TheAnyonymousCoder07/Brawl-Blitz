'use client'

// Brawl Stars-style character portraits with bold cartoon art
// Each hero has a unique SVG design with thick outlines and vibrant colors

interface HeroPortraitProps {
  heroId: string
  color: number
  secondaryColor: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showBorder?: boolean
  isSelected?: boolean
  isLocked?: boolean
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32'
}

const svgSizes = {
  sm: 48,
  md: 64,
  lg: 96,
  xl: 128
}

// Convert hex color number to CSS hex string
const toHex = (color: number) => `#${color.toString(16).padStart(6, '0')}`

export function HeroPortrait({ 
  heroId, 
  color, 
  secondaryColor, 
  size = 'md',
  showBorder = true,
  isSelected = false,
  isLocked = false
}: HeroPortraitProps) {
  const svgSize = svgSizes[size]
  const primaryColor = toHex(color)
  const secondary = toHex(secondaryColor)
  
  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        relative rounded-xl overflow-hidden
        ${showBorder ? 'ring-2 ring-black/30' : ''}
        ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : ''}
        transition-all duration-200
      `}
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor}, ${secondary})`,
        boxShadow: showBorder ? `0 4px 0 ${secondary}, 0 6px 10px rgba(0,0,0,0.3)` : undefined
      }}
    >
      <svg 
        width={svgSize} 
        height={svgSize} 
        viewBox="0 0 100 100"
        className="absolute inset-0"
      >
        {getHeroSVG(heroId, primaryColor, secondary)}
      </svg>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
      
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <circle cx="12" cy="16" r="1"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      )}
    </div>
  )
}

function getHeroSVG(heroId: string, primary: string, secondary: string): JSX.Element {
  const stroke = "#1a1a2e"
  const strokeWidth = 3
  const highlight = "#ffffff"
  
  switch (heroId) {
    case 'titan':
      // Big armored robot/warrior
      return (
        <g>
          {/* Body */}
          <rect x="25" y="45" width="50" height="40" rx="8" fill={secondary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Shoulder pads */}
          <ellipse cx="20" cy="50" rx="12" ry="15" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          <ellipse cx="80" cy="50" rx="12" ry="15" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Head */}
          <rect x="30" y="15" width="40" height="35" rx="5" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Helmet crest */}
          <path d="M50 5 L60 15 L40 15 Z" fill={secondary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Eyes (visor) */}
          <rect x="35" y="25" width="30" height="10" rx="3" fill="#111" stroke={stroke} strokeWidth={2}/>
          <rect x="38" y="27" width="8" height="6" rx="1" fill="#00ffff"/>
          <rect x="54" y="27" width="8" height="6" rx="1" fill="#00ffff"/>
          {/* Highlight */}
          <ellipse cx="40" cy="20" rx="5" ry="3" fill={highlight} opacity="0.4"/>
        </g>
      )
      
    case 'viper':
      // Hooded sniper
      return (
        <g>
          {/* Hood */}
          <path d="M50 10 C20 10 15 50 15 70 L85 70 C85 50 80 10 50 10" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Face shadow */}
          <ellipse cx="50" cy="45" rx="25" ry="20" fill={secondary}/>
          {/* Eyes (glowing) */}
          <ellipse cx="40" cy="40" rx="8" ry="5" fill="#111"/>
          <ellipse cx="60" cy="40" rx="8" ry="5" fill="#111"/>
          <ellipse cx="42" cy="40" rx="4" ry="3" fill="#a855f7"/>
          <ellipse cx="62" cy="40" rx="4" ry="3" fill="#a855f7"/>
          {/* Mouth mask */}
          <path d="M35 55 Q50 65 65 55" fill="none" stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Snake emblem */}
          <path d="M45 70 Q50 80 55 70 Q60 60 55 55 Q50 50 50 60" fill="#22c55e" stroke={stroke} strokeWidth={2}/>
          {/* Highlight */}
          <ellipse cx="35" cy="25" rx="8" ry="5" fill={highlight} opacity="0.3"/>
        </g>
      )
      
    case 'shadow':
      // Ninja assassin
      return (
        <g>
          {/* Body/cloak */}
          <path d="M50 95 L20 95 L30 50 L50 40 L70 50 L80 95 Z" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Head */}
          <circle cx="50" cy="35" r="25" fill={secondary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Mask */}
          <rect x="25" y="30" width="50" height="15" rx="3" fill="#111" stroke={stroke} strokeWidth={2}/>
          {/* Eyes */}
          <path d="M32 37 L43 37" stroke="#ff0000" strokeWidth={3} strokeLinecap="round"/>
          <path d="M57 37 L68 37" stroke="#ff0000" strokeWidth={3} strokeLinecap="round"/>
          {/* Headband */}
          <rect x="25" y="20" width="50" height="8" fill={primary} stroke={stroke} strokeWidth={2}/>
          {/* Headband tail */}
          <path d="M75 24 Q85 20 90 30 Q85 35 80 28" fill={primary} stroke={stroke} strokeWidth={2}/>
          {/* Highlight */}
          <ellipse cx="35" cy="18" rx="6" ry="4" fill={highlight} opacity="0.3"/>
        </g>
      )
      
    case 'aurora':
      // Angelic healer
      return (
        <g>
          {/* Halo */}
          <ellipse cx="50" cy="12" rx="20" ry="5" fill="#ffd700" stroke={stroke} strokeWidth={2}/>
          {/* Hair */}
          <path d="M25 35 Q20 60 30 75 L70 75 Q80 60 75 35 Q65 25 50 25 Q35 25 25 35" fill="#f0e68c" stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Face */}
          <ellipse cx="50" cy="45" rx="20" ry="18" fill="#ffd9b3" stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Eyes */}
          <ellipse cx="42" cy="43" rx="5" ry="6" fill="#111"/>
          <ellipse cx="58" cy="43" rx="5" ry="6" fill="#111"/>
          <ellipse cx="43" cy="42" rx="2" ry="2" fill={highlight}/>
          <ellipse cx="59" cy="42" rx="2" ry="2" fill={highlight}/>
          {/* Smile */}
          <path d="M42 55 Q50 62 58 55" fill="none" stroke="#e91e63" strokeWidth={2} strokeLinecap="round"/>
          {/* Blush */}
          <ellipse cx="35" cy="50" rx="5" ry="3" fill="#ffb6c1" opacity="0.6"/>
          <ellipse cx="65" cy="50" rx="5" ry="3" fill="#ffb6c1" opacity="0.6"/>
          {/* Body/dress */}
          <path d="M30 65 Q50 60 70 65 L75 95 L25 95 Z" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Cross emblem */}
          <rect x="47" y="72" width="6" height="15" fill={highlight}/>
          <rect x="42" y="77" width="16" height="5" fill={highlight}/>
        </g>
      )
      
    case 'blaze':
      // Explosive fire character
      return (
        <g>
          {/* Fire hair/head */}
          <path d="M50 5 Q70 15 75 35 Q80 25 85 40 Q75 60 70 50 Q65 55 60 50 Q55 55 50 50 Q45 55 40 50 Q35 55 30 50 Q25 60 15 40 Q20 25 25 35 Q30 15 50 5" fill="#ff4500" stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Face */}
          <ellipse cx="50" cy="50" rx="22" ry="20" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Eyes */}
          <ellipse cx="42" cy="48" rx="6" ry="7" fill="#111"/>
          <ellipse cx="58" cy="48" rx="6" ry="7" fill="#111"/>
          <ellipse cx="42" cy="46" rx="3" ry="3" fill="#ff9500"/>
          <ellipse cx="58" cy="46" rx="3" ry="3" fill="#ff9500"/>
          {/* Angry eyebrows */}
          <path d="M33 40 L45 44" stroke={stroke} strokeWidth={3} strokeLinecap="round"/>
          <path d="M67 40 L55 44" stroke={stroke} strokeWidth={3} strokeLinecap="round"/>
          {/* Grin */}
          <path d="M38 60 Q50 70 62 60" fill="#111" stroke={stroke} strokeWidth={2}/>
          <path d="M42 62 L46 58 L50 62 L54 58 L58 62" fill={highlight}/>
          {/* Body */}
          <rect x="32" y="70" width="36" height="25" rx="5" fill={secondary} stroke={stroke} strokeWidth={strokeWidth}/>
        </g>
      )
      
    case 'frost':
      // Ice mage
      return (
        <g>
          {/* Ice crown */}
          <path d="M25 35 L35 15 L45 30 L50 10 L55 30 L65 15 L75 35" fill="#a8e6ff" stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Head */}
          <ellipse cx="50" cy="45" rx="25" ry="22" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Eyes */}
          <ellipse cx="40" cy="42" rx="7" ry="8" fill="#111"/>
          <ellipse cx="60" cy="42" rx="7" ry="8" fill="#111"/>
          <ellipse cx="40" cy="42" rx="4" ry="4" fill="#00ffff"/>
          <ellipse cx="60" cy="42" rx="4" ry="4" fill="#00ffff"/>
          {/* Cool expression */}
          <path d="M42 58 L58 58" stroke={secondary} strokeWidth={3} strokeLinecap="round"/>
          {/* Frost beard */}
          <path d="M30 55 Q35 65 40 60 Q45 70 50 65 Q55 70 60 60 Q65 65 70 55" fill="#a8e6ff" stroke={stroke} strokeWidth={2}/>
          {/* Body */}
          <path d="M28 65 L72 65 L75 95 L25 95 Z" fill={secondary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Ice crystal on chest */}
          <polygon points="50,72 55,80 50,88 45,80" fill="#a8e6ff" stroke={stroke} strokeWidth={2}/>
        </g>
      )
      
    case 'snare':
      // Trap master
      return (
        <g>
          {/* Hat */}
          <ellipse cx="50" cy="30" rx="30" ry="10" fill={secondary} stroke={stroke} strokeWidth={strokeWidth}/>
          <path d="M30 30 L35 10 L65 10 L70 30" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Face */}
          <ellipse cx="50" cy="50" rx="22" ry="20" fill="#e8c9a5" stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Goggles */}
          <ellipse cx="40" cy="45" rx="10" ry="8" fill="#111" stroke={stroke} strokeWidth={2}/>
          <ellipse cx="60" cy="45" rx="10" ry="8" fill="#111" stroke={stroke} strokeWidth={2}/>
          <ellipse cx="40" cy="45" rx="5" ry="4" fill={primary}/>
          <ellipse cx="60" cy="45" rx="5" ry="4" fill={primary}/>
          <rect x="50" y="43" width="0" height="4" stroke={stroke} strokeWidth={2}/>
          {/* Smirk */}
          <path d="M40 60 Q50 68 55 58" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round"/>
          {/* Body/vest */}
          <rect x="30" y="70" width="40" height="25" rx="5" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Belt with traps */}
          <rect x="28" y="78" width="44" height="8" fill={secondary} stroke={stroke} strokeWidth={2}/>
          <circle cx="38" cy="82" r="3" fill="#ff0000"/>
          <circle cx="50" cy="82" r="3" fill="#ff0000"/>
          <circle cx="62" cy="82" r="3" fill="#ff0000"/>
        </g>
      )
      
    case 'surge':
      // Lightning speedster
      return (
        <g>
          {/* Speed lines */}
          <path d="M5 40 L20 45" stroke={primary} strokeWidth={2} opacity="0.5"/>
          <path d="M5 50 L15 50" stroke={primary} strokeWidth={2} opacity="0.5"/>
          <path d="M5 60 L20 55" stroke={primary} strokeWidth={2} opacity="0.5"/>
          {/* Head */}
          <ellipse cx="55" cy="40" rx="25" ry="22" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Lightning bolt hair */}
          <path d="M45 20 L55 5 L50 18 L65 5 L55 22 L75 10 L60 25" fill="#fff000" stroke={stroke} strokeWidth={2}/>
          {/* Eyes */}
          <ellipse cx="48" cy="38" rx="6" ry="7" fill="#111"/>
          <ellipse cx="64" cy="38" rx="6" ry="7" fill="#111"/>
          <ellipse cx="50" cy="36" rx="2" ry="2" fill={highlight}/>
          <ellipse cx="66" cy="36" rx="2" ry="2" fill={highlight}/>
          {/* Determined smile */}
          <path d="M45 52 Q56 58 67 52" fill={highlight} stroke={stroke} strokeWidth={2}/>
          {/* Body - dynamic pose */}
          <path d="M35 60 L45 55 L65 55 L75 60 L70 95 L40 95 Z" fill={secondary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Lightning bolt on chest */}
          <polygon points="55,65 60,75 52,75 57,88 48,78 55,78" fill="#fff000" stroke={stroke} strokeWidth={2}/>
        </g>
      )
      
    case 'guardian':
      // Shield defender
      return (
        <g>
          {/* Shield behind */}
          <path d="M10 50 L10 30 Q50 10 90 30 L90 50 Q50 90 10 50" fill={secondary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Body */}
          <rect x="30" y="50" width="40" height="40" rx="8" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Head */}
          <ellipse cx="50" cy="40" rx="22" ry="20" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Helmet */}
          <path d="M28 35 Q50 15 72 35" fill={secondary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Face guard */}
          <rect x="45" y="35" width="10" height="20" fill={secondary} stroke={stroke} strokeWidth={2}/>
          {/* Eyes */}
          <ellipse cx="38" cy="42" rx="5" ry="6" fill="#111"/>
          <ellipse cx="62" cy="42" rx="5" ry="6" fill="#111"/>
          <ellipse cx="38" cy="41" rx="2" ry="2" fill="#00ffcc"/>
          <ellipse cx="62" cy="41" rx="2" ry="2" fill="#00ffcc"/>
          {/* Shield emblem on chest */}
          <path d="M42 65 L50 60 L58 65 L58 78 Q50 85 42 78 Z" fill={secondary} stroke={stroke} strokeWidth={2}/>
        </g>
      )
      
    case 'inferno':
      // Fire elemental
      return (
        <g>
          {/* Fire aura */}
          <path d="M50 0 Q60 15 55 25 Q70 20 65 35 Q80 30 70 45 Q85 50 70 60 Q50 80 30 60 Q15 50 30 45 Q20 30 35 35 Q30 20 45 25 Q40 15 50 0" fill="#ff6600" stroke={stroke} strokeWidth={2} opacity="0.7"/>
          {/* Body - flame shaped */}
          <path d="M30 95 Q25 70 35 55 Q40 40 50 35 Q60 40 65 55 Q75 70 70 95 Z" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Inner body */}
          <path d="M35 90 Q32 72 40 60 Q45 50 50 45 Q55 50 60 60 Q68 72 65 90 Z" fill={secondary}/>
          {/* Eyes */}
          <ellipse cx="42" cy="60" rx="6" ry="8" fill="#111"/>
          <ellipse cx="58" cy="60" rx="6" ry="8" fill="#111"/>
          <ellipse cx="42" cy="58" rx="3" ry="4" fill="#ffff00"/>
          <ellipse cx="58" cy="58" rx="3" ry="4" fill="#ffff00"/>
          {/* Mouth */}
          <path d="M40 75 Q50 85 60 75" fill="#ff0000" stroke={stroke} strokeWidth={2}/>
          {/* Crown flames */}
          <path d="M40 35 L45 20 L50 35 L55 18 L60 35" fill="#ffcc00" stroke={stroke} strokeWidth={2}/>
        </g>
      )
      
    case 'glacier':
      // Ancient ice being
      return (
        <g>
          {/* Ice crystal body */}
          <polygon points="50,10 75,40 70,75 50,95 30,75 25,40" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Inner crystal */}
          <polygon points="50,20 65,42 62,70 50,85 38,70 35,42" fill={secondary}/>
          {/* Eyes */}
          <polygon points="38,45 45,40 45,52 38,52" fill="#111"/>
          <polygon points="62,45 55,40 55,52 62,52" fill="#111"/>
          <ellipse cx="42" cy="47" rx="2" ry="3" fill="#00ffff"/>
          <ellipse cx="58" cy="47" rx="2" ry="3" fill="#00ffff"/>
          {/* Mouth */}
          <path d="M42 62 L50 58 L58 62" fill="none" stroke="#00ffff" strokeWidth={2}/>
          {/* Ice shards */}
          <polygon points="25,35 15,45 25,50" fill="#a8e6ff" stroke={stroke} strokeWidth={2}/>
          <polygon points="75,35 85,45 75,50" fill="#a8e6ff" stroke={stroke} strokeWidth={2}/>
          <polygon points="45,10 40,0 50,5 60,0 55,10" fill="#a8e6ff" stroke={stroke} strokeWidth={2}/>
          {/* Frost effect */}
          <ellipse cx="50" cy="50" rx="15" ry="20" fill="#ffffff" opacity="0.2"/>
        </g>
      )
      
    case 'striker':
      // All-round fighter
      return (
        <g>
          {/* Hair */}
          <path d="M25 40 Q20 25 35 15 Q50 10 65 15 Q80 25 75 40" fill="#333" stroke={stroke} strokeWidth={strokeWidth}/>
          <path d="M65 15 L70 5 L60 12" fill="#333" stroke={stroke} strokeWidth={2}/>
          {/* Face */}
          <ellipse cx="50" cy="45" rx="25" ry="22" fill="#f0c9a5" stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Eyes */}
          <ellipse cx="40" cy="43" rx="6" ry="7" fill="#111"/>
          <ellipse cx="60" cy="43" rx="6" ry="7" fill="#111"/>
          <ellipse cx="42" cy="41" rx="2" ry="2" fill={highlight}/>
          <ellipse cx="62" cy="41" rx="2" ry="2" fill={highlight}/>
          {/* Determined eyebrows */}
          <path d="M32 36 L44 38" stroke={stroke} strokeWidth={3} strokeLinecap="round"/>
          <path d="M68 36 L56 38" stroke={stroke} strokeWidth={3} strokeLinecap="round"/>
          {/* Confident smile */}
          <path d="M40 55 Q50 62 60 55" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round"/>
          {/* Body/jacket */}
          <path d="M25 65 L40 60 L60 60 L75 65 L75 95 L25 95 Z" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          {/* Jacket details */}
          <path d="M50 60 L50 95" stroke={secondary} strokeWidth={4}/>
          {/* Star emblem */}
          <polygon points="50,72 52,78 58,78 53,82 55,88 50,85 45,88 47,82 42,78 48,78" fill="#ffd700" stroke={stroke} strokeWidth={1}/>
        </g>
      )
      
    default:
      // Default hero
      return (
        <g>
          <circle cx="50" cy="40" r="25" fill={primary} stroke={stroke} strokeWidth={strokeWidth}/>
          <ellipse cx="40" cy="38" rx="5" ry="6" fill="#111"/>
          <ellipse cx="60" cy="38" rx="5" ry="6" fill="#111"/>
          <path d="M40 52 Q50 60 60 52" fill="none" stroke={stroke} strokeWidth={2}/>
          <rect x="30" y="65" width="40" height="30" rx="5" fill={secondary} stroke={stroke} strokeWidth={strokeWidth}/>
        </g>
      )
  }
}

export default HeroPortrait
