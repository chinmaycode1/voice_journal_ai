import { Link, useLocation } from 'react-router-dom'
import { Mic, BookOpen, BarChart2, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

export function MobileBottomNav() {
  const location = useLocation()

  const navItems = [
    { path: '/journal', icon: Mic, label: 'Journal' },
    { path: '/history', icon: BookOpen, label: 'History' },
    { path: '/stats', icon: BarChart2, label: 'Stats' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 sm:h-18 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full relative min-w-0"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1"
              >
                <Icon
                  size={20}
                  className={`${isActive ? 'text-accent' : 'text-text-muted'} sm:w-6 sm:h-6`}
                />
                <span
                  className={`text-xs ${
                    isActive ? 'text-accent font-medium' : 'text-text-muted'
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
