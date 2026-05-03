import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your entries..."
        className="w-full pl-12 pr-12 py-3 glass border border-border rounded-xl text-text placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
          >
            <X size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
