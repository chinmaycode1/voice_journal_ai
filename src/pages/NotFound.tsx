import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Home } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated dots background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <h1 className="font-heading text-9xl font-bold gradient-text mb-4">
            404
          </h1>
          <h2 className="font-heading text-2xl font-bold text-text mb-2">
            Lost your thoughts?
          </h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            This page doesn't exist. Let's get you back to journaling.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg">
              <Home size={20} />
              Go Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
