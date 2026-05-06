import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Navbar } from '../components/layout/Navbar'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'
import { SearchBar } from '../components/history/SearchBar'
import { FilterChips } from '../components/history/FilterChips'
import { EntryCard } from '../components/history/EntryCard'
import { Skeleton } from '../components/ui/Skeleton'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../hooks/useToast'
import { supabase } from '../lib/supabase'
import type { Entry, MoodType, AiModeId } from '../types'
import { Mic } from 'lucide-react'

export function History() {
  const { user } = useAuthStore()
  const { showSuccess, showError } = useToast()
  
  const [entries, setEntries] = useState<Entry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMood, setSelectedMood] = useState<MoodType | 'all'>('all')
  const [selectedMode, setSelectedMode] = useState<AiModeId | 'all'>('all')
  const [selectedTime, setSelectedTime] = useState<'week' | 'month' | 'all'>('all')
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [user])

  useEffect(() => {
    applyFilters()
  }, [entries, searchQuery, selectedMood, selectedMode, selectedTime])

  const fetchEntries = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data as Entry[])
    } catch (error) {
      console.error('Error fetching entries:', error)
      showError('Failed to load entries')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...entries]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.transcript.toLowerCase().includes(query) ||
          entry.ai_response.toLowerCase().includes(query)
      )
    }

    // Mood filter
    if (selectedMood !== 'all') {
      filtered = filtered.filter((entry) => entry.mood === selectedMood)
    }

    // Mode filter
    if (selectedMode !== 'all') {
      filtered = filtered.filter((entry) => entry.ai_mode === selectedMode)
    }

    // Time filter
    if (selectedTime !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      if (selectedTime === 'week') {
        cutoff.setDate(now.getDate() - 7)
      } else if (selectedTime === 'month') {
        cutoff.setDate(now.getDate() - 30)
      }
      filtered = filtered.filter((entry) => new Date(entry.created_at) >= cutoff)
    }

    setFilteredEntries(filtered)
    setPage(1)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)

      if (error) throw error

      setEntries((prev) => prev.filter((e) => e.id !== id))
      showSuccess('Entry deleted')
    } catch (error) {
      console.error('Error deleting entry:', error)
      showError('Failed to delete entry')
    }
  }

  const paginatedEntries = filteredEntries.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = filteredEntries.length > paginatedEntries.length

  return (
    <PageWrapper>
      <div className="min-h-screen pb-24 md:pb-8">
        <Navbar />
        
        <main className="pt-20 sm:pt-24 px-4 sm:px-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold gradient-text">
                Your Journal
              </h1>
              <p className="text-text-muted mt-1 text-sm sm:text-base">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} total
              </p>
            </div>
            <Badge color="var(--accent)">
              {filteredEntries.length} shown
            </Badge>
          </div>

          {/* Search */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Filters */}
          <FilterChips
            selectedMood={selectedMood}
            selectedMode={selectedMode}
            selectedTime={selectedTime}
            onMoodChange={setSelectedMood}
            onModeChange={setSelectedMode}
            onTimeChange={setSelectedTime}
          />

          {/* Entries Timeline */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass p-6">
                  <Skeleton height="20px" width="120px" className="mb-3" />
                  <Skeleton height="16px" width="100%" className="mb-2" />
                  <Skeleton height="16px" width="80%" />
                </div>
              ))}
            </div>
          ) : filteredEntries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-6"
              >
                <Mic size={64} className="mx-auto text-text-muted opacity-50" />
              </motion.div>
              <h3 className="font-heading text-2xl font-bold text-text mb-2">
                {searchQuery || selectedMood !== 'all' || selectedMode !== 'all' || selectedTime !== 'all'
                  ? 'No entries found'
                  : 'No entries yet'}
              </h3>
              <p className="text-text-muted mb-6">
                {searchQuery || selectedMood !== 'all' || selectedMode !== 'all' || selectedTime !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Hit record on the Journal page to start'}
              </p>
              {entries.length === 0 && (
                <Button variant="primary" onClick={() => window.location.href = '/journal'}>
                  Go Journal →
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              {/* Timeline line */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent to-accent2" />
                
                <div className="space-y-6">
                  <AnimatePresence>
                    {paginatedEntries.map((entry) => (
                      <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Load 10 more
                  </Button>
                </div>
              )}
            </>
          )}
        </main>

        <MobileBottomNav />
      </div>
    </PageWrapper>
  )
}
