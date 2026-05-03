import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden'
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-accent to-accent2 text-white shadow-xl hover:shadow-2xl hover:from-accent2 hover:to-accent',
    secondary: 'glass-strong text-text border border-border hover:border-accent/70 hover-lift',
    ghost: 'text-text-muted hover:text-text hover:bg-dark-glass/50',
    danger: 'border-2 border-red-500/40 text-red-500 hover:bg-red-500/15 hover:border-red-500/60'
  }
  
  const sizeStyles = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-10 py-5 text-lg'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Shine effect for primary buttons */}
      {variant === 'primary' && !disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
      </span>
    </motion.button>
  )
}
