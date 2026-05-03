import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: string
  bgColor?: string
  className?: string
}

export function Badge({ children, color, bgColor, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${className}`}
      style={{
        color: color || 'var(--text)',
        backgroundColor: bgColor || 'var(--bg-glass)',
        borderColor: color ? `${color}40` : 'var(--border)'
      }}
    >
      {children}
    </span>
  )
}
