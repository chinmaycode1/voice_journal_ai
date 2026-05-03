import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, Sparkles, X } from 'lucide-react'
import type { ToastItem } from '../../types'

interface ToastProps {
  toast: ToastItem
  onClose: () => void
}

export function Toast({ toast, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
    xp: <Sparkles size={20} />
  }

  const colors = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-accent',
    xp: 'border-yellow-500'
  }

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`glass p-4 flex items-center gap-3 border-l-4 ${colors[toast.type]} min-w-[280px] max-w-[400px]`}
    >
      <div className={toast.type === 'xp' ? 'text-yellow-500' : toast.type === 'success' ? 'text-green-500' : toast.type === 'error' ? 'text-red-500' : 'text-accent'}>
        {icons[toast.type]}
      </div>
      <p className="flex-1 text-sm text-text">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-text-muted hover:text-text transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}
