import { motion } from 'framer-motion'
import type { MoodType } from '../../types'
import { MOOD_CONFIG } from '../../lib/moodConfig'

interface MoodBadgeProps {
  mood: MoodType
  animate?: boolean
}

export function MoodBadge({ mood, animate = true }: MoodBadgeProps) {
  const moodData = MOOD_CONFIG[mood]

  const badge = (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border"
      style={{
        color: moodData.color,
        backgroundColor: `${moodData.color}${moodData.bgOpacity}`,
        borderColor: `${moodData.color}40`
      }}
    >
      <span className="text-base">{moodData.emoji}</span>
      <span>{moodData.label}</span>
    </span>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        {badge}
      </motion.div>
    )
  }

  return badge
}
