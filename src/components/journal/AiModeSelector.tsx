import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { AI_MODES } from '../../lib/aiModes'
import type { AiModeId } from '../../types'

interface AiModeSelectorProps {
  activeMode: AiModeId
  onModeChange: (mode: AiModeId) => void
}

export function AiModeSelector({ activeMode, onModeChange }: AiModeSelectorProps) {
  const selectedMode = AI_MODES.find((m) => m.id === activeMode)

  return (
    <div className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          <h3 className="font-heading text-lg font-semibold text-text">AI Personality</h3>
        </div>
        <span className="text-xs text-text-muted">Choose your vibe</span>
      </div>

      {/* Scrollable mode pills - Enhanced */}
      <div className="overflow-x-auto custom-scrollbar pb-3">
        <div className="flex gap-3 min-w-max px-1">
          {AI_MODES.map((mode) => {
            const isActive = mode.id === activeMode

            return (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onModeChange(mode.id)}
                className={`relative px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2.5 transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-2xl'
                    : 'glass text-text-muted border border-border hover:border-accent/50 hover-lift'
                }`}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})`,
                        boxShadow: `0 8px 32px ${mode.gradientFrom}40, 0 0 0 1px ${mode.gradientFrom}30`
                      }
                    : undefined
                }
              >
                {/* Glow effect for active mode */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})`,
                      filter: 'blur(12px)',
                      opacity: 0.4
                    }}
                    animate={{
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                )}
                
                <motion.span
                  className="text-xl relative z-10"
                  animate={isActive ? {
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isActive ? Infinity : 0,
                    repeatDelay: 3
                  }}
                >
                  {mode.emoji}
                </motion.span>
                <span className="relative z-10">{mode.name}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Mode description - Enhanced */}
      <AnimatePresence mode="wait">
        {selectedMode && (
          <motion.div
            key={selectedMode.id}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            className="glass p-4 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${selectedMode.gradientFrom}10, ${selectedMode.gradientTo}10)`
            }}
          >
            <p className="text-sm text-text-muted text-center italic leading-relaxed">
              "{selectedMode.description}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
