import { motion } from 'framer-motion'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
}

export function Toggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm text-text">{label}</span>}
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-accent' : 'bg-dark-card border border-border'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  )
}
