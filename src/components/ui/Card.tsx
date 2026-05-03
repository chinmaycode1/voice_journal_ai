import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'glass' | 'solid'
  className?: string
  animate?: boolean
}

export function Card({ children, variant = 'glass', className = '', animate = true }: CardProps) {
  const variantStyles = {
    glass: 'glass',
    solid: 'bg-dark-card border border-border rounded-2xl'
  }

  const content = (
    <div className={`${variantStyles[variant]} p-6 ${className}`}>
      {children}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        {content}
      </motion.div>
    )
  }

  return content
}
