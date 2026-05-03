export const XP_PER_ENTRY = 10
export const XP_PER_10_WORDS = 2

export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  50,     // Level 2
  150,    // Level 3
  300,    // Level 4
  500,    // Level 5
  750,    // Level 6
  1050,   // Level 7
  1400,   // Level 8
  1850,   // Level 9
  2500    // Level 10
]

export const LEVEL_NAMES = [
  'Newcomer',
  'Seeker',
  'Thinker',
  'Explorer',
  'Reflector',
  'Philosopher',
  'Sage',
  'Visionary',
  'Luminary',
  'Transcendent'
]

export function calculateXP(wordCount: number): number {
  const wordBonus = Math.floor(wordCount / 10) * XP_PER_10_WORDS
  return XP_PER_ENTRY + wordBonus
}

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

export function getXPToNextLevel(xp: number): {
  current: number
  needed: number
  levelName: string
  nextLevelName: string
} {
  const currentLevel = getLevelFromXP(xp)
  const currentLevelName = LEVEL_NAMES[currentLevel - 1]
  
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return {
      current: xp,
      needed: xp,
      levelName: currentLevelName,
      nextLevelName: currentLevelName
    }
  }
  
  const nextLevelThreshold = LEVEL_THRESHOLDS[currentLevel]
  const nextLevelName = LEVEL_NAMES[currentLevel]
  
  return {
    current: xp,
    needed: nextLevelThreshold,
    levelName: currentLevelName,
    nextLevelName: nextLevelName
  }
}
