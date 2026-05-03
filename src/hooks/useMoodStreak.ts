import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { MoodStreak } from '../types'
import { getLevelFromXP } from '../lib/xpConfig'

export function useMoodStreak() {
  const [streakData, setStreakData] = useState<MoodStreak | null>(null)
  const [loading, setLoading] = useState(false)

  const updateStreak = async (userId: string, xpEarned: number) => {
    setLoading(true)
    try {
      // Fetch current streak data
      const { data: currentStreak, error: fetchError } = await supabase
        .from('mood_streaks')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (fetchError) throw fetchError

      const today = new Date().toISOString().split('T')[0]
      const lastEntryDate = currentStreak.last_entry_date
      
      let newCurrentStreak = currentStreak.current_streak
      
      if (!lastEntryDate) {
        // First entry ever
        newCurrentStreak = 1
      } else {
        const lastDate = new Date(lastEntryDate)
        const todayDate = new Date(today)
        const diffTime = todayDate.getTime() - lastDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) {
          // Already journaled today, don't increment streak
          newCurrentStreak = currentStreak.current_streak
        } else if (diffDays === 1) {
          // Journaled yesterday, increment streak
          newCurrentStreak = currentStreak.current_streak + 1
        } else {
          // Streak broken, reset to 1
          newCurrentStreak = 1
        }
      }

      const newLongestStreak = Math.max(newCurrentStreak, currentStreak.longest_streak)
      const newTotalXP = currentStreak.total_xp + xpEarned

      // Update streak data
      const { data: updatedStreak, error: updateError } = await supabase
        .from('mood_streaks')
        .update({
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_entry_date: today,
          total_entries: currentStreak.total_entries + 1,
          total_xp: newTotalXP
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (updateError) throw updateError

      // Fetch current profile XP and level
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('user_id', userId)
        .single()

      if (profileError) throw profileError

      const oldLevel = profile.level
      const newXP = profile.xp + xpEarned
      const newLevel = getLevelFromXP(newXP)

      // Update profile XP and level
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          xp: newXP,
          level: newLevel
        })
        .eq('user_id', userId)

      if (updateProfileError) throw updateProfileError

      setStreakData(updatedStreak as MoodStreak)
      setLoading(false)

      return {
        didLevelUp: newLevel > oldLevel,
        newLevel,
        levelName: ''
      }
    } catch (error) {
      console.error('Error updating streak:', error)
      setLoading(false)
      throw error
    }
  }

  return { updateStreak, streakData, loading }
}
