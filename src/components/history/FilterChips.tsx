import { motion } from 'framer-motion'
import type { MoodType, AiModeId } from '../../types'
import { MOOD_CONFIG } from '../../lib/moodConfig'
import { AI_MODES } from '../../lib/aiModes'

interface FilterChipsProps {
  selectedMood: MoodType | 'all'
  selectedMode: AiModeId | 'all'
  selectedTime: 'week' | 'month' | 'all'
  onMoodChange: (mood: MoodType | 'all') => void
  onModeChange: (mode: AiModeId | 'all') => void
  onTimeChange: (time: 'week' | 'month' | 'all') => void
}

export function FilterChips({
  selectedMood,
  selectedMode,
  selectedTime,
  onMoodChange,
  onModeChange,
  onTimeChange
}: FilterChipsProps) {
  const moods: (MoodType | 'all')[] = ['all', 'happy', 'excited', 'calm', 'neutral', 'anxious', 'sad', 'angry']
  const modes: (AiModeId | 'all')[] = ['all', ...AI_MODES.map((m) => m.id)]
  const times: ('week' | 'month' | 'all')[] = ['week', 'month', 'all']

  return (
    <div className="space-y-4">
      {/* Mood Filter */}
      <div>
        <p className="text-sm text-text-muted mb-2">Mood</p>
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => {
            const isActive = selectedMood === mood
            const moodData = mood !== 'all' ? MOOD_CONFIG[mood] : null

            return (
              <motion.button
                key={mood}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMoodChange(mood)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  isActive
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-border glass text-text-muted hover:border-accent/50'
                }`}
              >
                {moodData ? `${moodData.emoji} ${moodData.label}` : 'All'}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Mode Filter */}
      <div>
        <p className="text-sm text-text-muted mb-2">AI Mode</p>
        <div className="flex flex-wrap gap-2">
          {modes.map((mode) => {
            const isActive = selectedMode === mode
            const modeData = mode !== 'all' ? AI_MODES.find((m) => m.id === mode) : null

            return (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onModeChange(mode)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  isActive
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-border glass text-text-muted hover:border-accent/50'
                }`}
              >
                {modeData ? `${modeData.emoji} ${modeData.name}` : 'All'}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Time Filter */}
      <div>
        <p className="text-sm text-text-muted mb-2">Time Period</p>
        <div className="flex gap-2">
          {times.map((time) => {
            const isActive = selectedTime === time
            const labels = { week: 'Last 7 days', month: 'Last 30 days', all: 'All time' }

            return (
              <motion.button
                key={time}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTimeChange(time)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  isActive
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-border glass text-text-muted hover:border-accent/50'
                }`}
              >
                {labels[time]}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
