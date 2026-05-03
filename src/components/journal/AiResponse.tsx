import { motion } from 'framer-motion'
import type { AiMode } from '../../types'

interface AiResponseProps {
  response: string
  mode: AiMode
}

export function AiResponse({ response, mode }: AiResponseProps) {
  const words = response.split(' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="glass p-6 space-y-4"
    >
      {/* Mode header */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{
            background: `${mode.color}30`,
            boxShadow: `0 0 20px ${mode.color}40`
          }}
        >
          {mode.emoji}
        </div>
        <div>
          <p className="text-sm text-text-muted">AI Response</p>
          <p className="font-heading font-semibold text-text">{mode.name}</p>
        </div>
      </div>

      {/* Typewriter effect response */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.04,
              delayChildren: 0.1
            }
          }
        }}
        className="text-base leading-relaxed text-text"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: { opacity: 0, y: 4 },
              visible: { opacity: 1, y: 0 }
            }}
            className="inline-block mr-1"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}
