import { Lightbulb, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { getTodaysPrompt, DAILY_PROMPTS } from '../../lib/dailyPrompts'

export function DailyPrompt() {
  const [promptIndex, setPromptIndex] = useState(() => {
    const today = getTodaysPrompt()
    return DAILY_PROMPTS.indexOf(today)
  })

  const currentPrompt = DAILY_PROMPTS[promptIndex]

  const handleRefresh = () => {
    setPromptIndex((prev) => (prev + 1) % DAILY_PROMPTS.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-5 flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
        <Lightbulb size={20} className="text-accent" />
      </div>
      
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.p
            key={promptIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="font-heading text-base italic text-text mb-1"
          >
            "{currentPrompt}"
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-text-muted">Today's prompt</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleRefresh}
        className="p-2 rounded-full hover:bg-dark-glass transition-colors flex-shrink-0"
      >
        <RefreshCw size={16} className="text-text-muted" />
      </motion.button>
    </motion.div>
  )
}
