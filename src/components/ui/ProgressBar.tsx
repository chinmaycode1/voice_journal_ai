import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  max: number
  label?: string
  className?: string
}

export function ProgressBar({ current, max, label, className = '' }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100)

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-accent font-medium">{label}</span>
          <span className="text-text-muted">{current} / {max} XP</span>
        </div>
      )}
      <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-accent to-accent2 rounded-full"
        />
      </div>
    </div>
  )
}
