import { useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { LevelUpInfo } from '../../types'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

interface LevelUpModalProps {
  levelUpInfo: LevelUpInfo | null
  onClose: () => void
}

export function LevelUpModal({ levelUpInfo, onClose }: LevelUpModalProps) {
  useEffect(() => {
    if (levelUpInfo) {
      // Fire confetti
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#7C6FFF', '#FF6B9D', '#4ECDC4', '#FFD700']
      })
    }
  }, [levelUpInfo])

  if (!levelUpInfo) return null

  return (
    <Modal isOpen={true} onClose={onClose} maxWidth="400px">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-7xl"
        >
          🎉
        </motion.div>

        <div>
          <h2 className="font-heading text-3xl font-bold gradient-text mb-2">
            Level Up!
          </h2>
          <p className="text-text-muted">
            You've reached a new milestone
          </p>
        </div>

        <div className="glass p-6 space-y-2">
          <div className="text-5xl font-heading font-bold text-accent">
            {levelUpInfo.newLevel}
          </div>
          <div className="text-xl font-heading text-text">
            {levelUpInfo.levelName}
          </div>
          <div className="text-sm text-text-muted">
            +{levelUpInfo.xpEarned} XP earned
          </div>
        </div>

        <Button onClick={onClose} variant="primary" size="lg" className="w-full">
          Keep Journaling ✨
        </Button>
      </div>
    </Modal>
  )
}
