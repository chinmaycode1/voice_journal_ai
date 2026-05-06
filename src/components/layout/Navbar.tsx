import { Link } from 'react-router-dom'
import { Sun, Moon, LogOut, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'
import { Avatar } from '../ui/Avatar'
import { ProgressBar } from '../ui/ProgressBar'
import { getXPToNextLevel } from '../../lib/xpConfig'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { profile, signOut } = useSupabaseAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  if (!profile) return null

  const xpInfo = getXPToNextLevel(profile.xp)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/journal" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">VJ</span>
            </div>
            <span className="font-heading text-lg sm:text-xl font-bold gradient-text hidden sm:block">
              VoiceJournal
            </span>
          </Link>

          {/* XP Progress Bar - Hidden on mobile and tablet */}
          <div className="hidden lg:block flex-1 max-w-xs mx-8">
            <ProgressBar
              current={xpInfo.current}
              max={xpInfo.needed}
              label={`Lv.${profile.level} ${xpInfo.levelName}`}
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-dark-glass transition-colors"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-text-muted sm:w-5 sm:h-5" />
              ) : (
                <Moon size={18} className="text-text-muted sm:w-5 sm:h-5" />
              )}
            </motion.button>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="focus:outline-none"
              >
                <Avatar
                  src={profile.avatar_url}
                  fallback={profile.username || 'U'}
                  size={36}
                  className="sm:w-10 sm:h-10"
                />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass border border-border rounded-xl overflow-hidden z-20"
                    >
                      <Link
                        to="/settings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-dark-glass transition-colors"
                      >
                        <Settings size={18} className="text-text-muted" />
                        <span className="text-sm text-text">Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          handleSignOut()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-glass transition-colors text-left"
                      >
                        <LogOut size={18} className="text-text-muted" />
                        <span className="text-sm text-text">Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
