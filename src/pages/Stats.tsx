import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Navbar } from '../components/layout/Navbar'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'
import { Card } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'
import { useAuthStore } from '../store/useAuthStore'
import { supabase } from '../lib/supabase'
import type { MoodStreak } from '../types'
import { Flame, BookOpen, Sparkles, Trophy } from 'lucide-react'

export function Stats() {
  const { user, profile } = useAuthStore()
  const [streak, setStreak] = useState<MoodStreak | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Fetch entries (not used in current version but kept for future features)
      const { error: entriesError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (entriesError) throw entriesError

      // Fetch streak
      const { data: streakData, error: streakError } = await supabase
        .from('mood_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (streakError) throw streakError

      setStreak(streakData as MoodStreak)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Animated counter
  const AnimatedNumber = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      const duration = 1500
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }, [value])

    return <span>{count}</span>
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen pb-24 md:pb-8">
          <Navbar />
          <main className="pt-24 px-4 max-w-6xl mx-auto space-y-6">
            <Skeleton height="40px" width="200px" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="120px" />
              ))}
            </div>
          </main>
          <MobileBottomNav />
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="min-h-screen pb-24 md:pb-8">
        <Navbar />
        
        <main className="pt-24 px-4 max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <h1 className="font-heading text-3xl font-bold gradient-text">
            Your Growth
          </h1>

          {/* Top Stats Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                icon: Flame,
                value: streak?.current_streak || 0,
                label: 'day streak',
                color: '#FF6B35'
              },
              {
                icon: BookOpen,
                value: streak?.total_entries || 0,
                label: 'entries written',
                color: '#4ECDC4'
              },
              {
                icon: Sparkles,
                value: streak?.total_xp || 0,
                label: 'XP earned',
                color: '#FFD700'
              },
              {
                icon: Trophy,
                value: profile?.level || 1,
                label: profile ? `Lv.${profile.level}` : 'Level',
                color: '#7C6FFF'
              }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card variant="glass" animate={false} className="text-center">
                  <stat.icon size={32} className="mx-auto mb-3" style={{ color: stat.color }} />
                  <div className="font-heading text-4xl font-bold mb-1" style={{ color: stat.color }}>
                    <AnimatedNumber value={stat.value} />
                  </div>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Coming Soon Message */}
          <Card variant="glass">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="font-heading text-2xl font-bold text-text mb-2">
                More insights coming soon!
              </h3>
              <p className="text-text-muted max-w-md mx-auto">
                We're building mood timelines, activity heatmaps, and detailed analytics. Keep journaling to see your progress!
              </p>
            </div>
          </Card>
        </main>

        <MobileBottomNav />
      </div>
    </PageWrapper>
  )
}
