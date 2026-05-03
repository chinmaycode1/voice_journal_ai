export type MoodType = 'happy' | 'excited' | 'calm' | 'sad' | 'anxious' | 'angry' | 'neutral'

export type AiModeId = 'therapist' | 'hype' | 'philosopher' | 'roast' | 'poet'

export interface Profile {
  id: string
  user_id: string
  username: string | null
  avatar_url: string | null
  default_ai_mode: AiModeId
  xp: number
  level: number
  onboarded: boolean
  created_at: string
}

export interface Entry {
  id: string
  user_id: string
  transcript: string
  ai_response: string
  ai_mode: AiModeId
  mood: MoodType
  word_count: number
  xp_earned: number
  tts_pitch: number
  tts_rate: number
  created_at: string
}

export interface MoodStreak {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_entry_date: string | null
  total_entries: number
  total_xp: number
}

export interface AiMode {
  id: AiModeId
  name: string
  emoji: string
  color: string
  gradientFrom: string
  gradientTo: string
  description: string
  defaultPitch: number
  defaultRate: number
  systemPrompt: string
}

export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'info' | 'xp'
  message: string
  duration?: number
}

export interface LevelUpInfo {
  newLevel: number
  levelName: string
  xpEarned: number
}
