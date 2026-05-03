import type { MoodType } from '../types'

interface MoodConfig {
  emoji: string
  label: string
  color: string
  score: number
  bgOpacity: string
}

export const MOOD_CONFIG: Record<MoodType, MoodConfig> = {
  happy: {
    emoji: '😊',
    label: 'Happy',
    color: '#FFD700',
    score: 6,
    bgOpacity: '1A'
  },
  excited: {
    emoji: '⚡',
    label: 'Excited',
    color: '#FF6B35',
    score: 5,
    bgOpacity: '1A'
  },
  calm: {
    emoji: '🌊',
    label: 'Calm',
    color: '#4ECDC4',
    score: 4,
    bgOpacity: '1A'
  },
  neutral: {
    emoji: '😐',
    label: 'Neutral',
    color: '#8888AA',
    score: 3,
    bgOpacity: '1A'
  },
  anxious: {
    emoji: '😰',
    label: 'Anxious',
    color: '#C084FC',
    score: 2,
    bgOpacity: '1A'
  },
  sad: {
    emoji: '💙',
    label: 'Sad',
    color: '#6C8EBF',
    score: 1,
    bgOpacity: '1A'
  },
  angry: {
    emoji: '🔥',
    label: 'Angry',
    color: '#FF4757',
    score: 0,
    bgOpacity: '1A'
  }
}
