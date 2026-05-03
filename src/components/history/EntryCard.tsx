import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Trash2, Play } from 'lucide-react'
import type { Entry } from '../../types'
import { MOOD_CONFIG } from '../../lib/moodConfig'
import { AI_MODES } from '../../lib/aiModes'
import { MoodBadge } from '../journal/MoodBadge'
import { Badge } from '../ui/Badge'
import { useSpeechSynth } from '../../hooks/useSpeechSynth'

interface EntryCardProps {
  entry: Entry
  onDelete: (id: string) => void
}

export function EntryCard({ entry, onDelete }: EntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { speak } = useSpeechSynth()

  const mode = AI_MODES.find((m) => m.id === entry.ai_mode)!
  const date = new Date(entry.created_at)

  const handleReplay = () => {
    speak(entry.ai_response, entry.tts_pitch, entry.tts_rate)
  }

  const handleDelete = () => {
    onDelete(entry.id)
    setShowDeleteConfirm(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative pl-6"
    >
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-3 w-2 h-2 rounded-full"
        style={{ backgroundColor: MOOD_CONFIG[entry.mood].color }}
      />

      {/* Card */}
      <div className="glass p-5 hover:border-accent/30 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-muted mb-2">
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              <MoodBadge mood={entry.mood} animate={false} />
              <Badge color={mode.color} bgColor={`${mode.color}20`}>
                {mode.emoji} {mode.name}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleReplay}
              className="p-2 rounded-full hover:bg-dark-glass transition-colors"
              title="Replay AI response"
            >
              <Play size={16} className="text-accent" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-full hover:bg-red-500/10 transition-colors"
              title="Delete entry"
            >
              <Trash2 size={16} className="text-red-500" />
            </motion.button>
          </div>
        </div>

        {/* Preview */}
        <p className="text-sm text-text mb-3 line-clamp-2">
          {entry.transcript.slice(0, 130)}
          {entry.transcript.length > 130 && '...'}
        </p>

        {/* Expand Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-accent hover:text-accent2 transition-colors"
        >
          <span>{isExpanded ? 'Show less' : 'Show more'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4 border-t border-border mt-4">
                {/* Full Transcript */}
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                    Your Words
                  </p>
                  <p className="text-sm text-text leading-relaxed bg-dark-card/50 p-3 rounded-lg">
                    {entry.transcript}
                  </p>
                </div>

                {/* AI Response */}
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                    AI Response
                  </p>
                  <p className="text-sm text-text leading-relaxed bg-dark-card/50 p-3 rounded-lg italic">
                    {entry.ai_response}
                  </p>
                </div>

                {/* Footer Stats */}
                <div className="flex items-center gap-4 text-xs text-text-muted pt-2 border-t border-border">
                  <span>{entry.word_count} words</span>
                  <span>•</span>
                  <span>{entry.xp_earned} XP earned</span>
                  <span>•</span>
                  <span>Pitch: {entry.tts_pitch.toFixed(1)}</span>
                  <span>•</span>
                  <span>Speed: {entry.tts_rate.toFixed(1)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Popover */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute right-0 top-12 z-50 glass p-4 border border-red-500/30 rounded-xl w-64"
            >
              <p className="text-sm text-text mb-3">
                Are you sure? This can't be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-lg hover:bg-dark-glass transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-3 py-2 text-sm bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
