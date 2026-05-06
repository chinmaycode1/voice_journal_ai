import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

export function useSupabaseAuth() {
  const { user, profile, session, loading, setUser, setProfile, setSession, setLoading, clearAuth } = useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        clearAuth()
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      setProfile(data as Profile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) {
        // Provide more helpful error messages
        if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
          throw new Error('Authentication configuration error. Please check your Supabase API key in .env.local')
        }
        throw error
      }
      return data
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) {
        // Provide more helpful error messages
        if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
          throw new Error('Authentication configuration error. Please check your Supabase API key in .env.local')
        }
        throw error
      }
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation required
        return { requiresConfirmation: true, user: data.user }
      }
      
      // Auto-confirmed or session created
      if (data.user) {
        await createProfileIfNeeded(data.user)
        
        // Update username if provided
        if (username) {
          await supabase
            .from('profiles')
            .update({ username })
            .eq('user_id', data.user.id)
        }
      }
      
      return { requiresConfirmation: false, user: data.user, session: data.session }
    } catch (error) {
      throw error
    }
  }

  const createProfileIfNeeded = async (user: any) => {
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!existing) {
        // Create profile manually if trigger didn't run
        await supabase.from('profiles').insert({
          user_id: user.id,
          username: user.email?.split('@')[0] || 'User',
          default_ai_mode: 'therapist',
          xp: 0,
          level: 1,
          onboarded: false,
        })

        // Create mood streak
        await supabase.from('mood_streaks').insert({
          user_id: user.id,
          current_streak: 0,
          longest_streak: 0,
          total_entries: 0,
          total_xp: 0,
        })
      }
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/journal`
        }
      })
      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      clearAuth()
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data as Profile)
      return data
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile
  }
}
