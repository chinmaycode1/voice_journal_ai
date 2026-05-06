import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Loader2, Bookmark, Check, AlertCircle } from 'lucide-react'
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder'
import { useGroqAI } from '../../hooks/useGroqAI'
import { useSpeechSynth } from '../../hooks/useSpeechSynth'
import { useMoodStreak } from '../../hooks/useMoodStreak'
import { useToast } from '../../hooks/useToast'
import { useAuthStore } from '../../store/useAuthStore'
import { useJournalStore } from '../../store/useJournalStore'
import { WaveformCanvas } from './WaveformCanvas'
import { AiResponse } from './AiResponse'
import { MoodBadge } from './MoodBadge'
import { TtsControls } from './TtsControls'
import { MicrophonePermission } from './MicrophonePermission'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { AI_MODES } from '../../lib/aiModes'
import { calculateXP } from '../../lib/xpConfig'
import { supabase } from '../../lib/supabase'
import { LEVEL_NAMES } from '../../lib/xpConfig'

interface VoiceRecorderProps {
  onAudioData?: (data: Uint8Array | undefined) => void
  onSpeakingChange?: (isSpeaking: boolean) => void
  onListeningChange?: (isListening: boolean) => void
}

export function VoiceRecorder({ onAudioData, onSpeakingChange, onListeningChange }: VoiceRecorderProps) {
  const { user } = useAuthStore()
  const { activeMode, setCurrentMood, setShowLevelUp } = useJournalStore()
  const { isRecording, transcript, interimTranscript, startRecording, stopRecording, resetTranscript, error: recorderError, isSupported } = useVoiceRecorder()
  const { callGroq, aiResponse, detectedMood, loading: aiLoading, error: aiError } = useGroqAI()
  const { speak, stop, isSpeaking } = useSpeechSynth()
  const { updateStreak } = useMoodStreak()
  const { showXPToast, showSuccess, showError } = useToast()

  const [pitch, setPitch] = useState(1.0)
  const [rate, setRate] = useState(1.0)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [micPermissionGranted, setMicPermissionGranted] = useState(false)
  
  const wasRecordingRef = useRef(false)
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Safety: cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current)
      }
      stopRecording()
    }
  }, [stopRecording])

  // Safety timeout: auto-stop after 60 seconds
  useEffect(() => {
    if (isRecording) {
      recordingTimeoutRef.current = setTimeout(() => {
        console.log('⏱️ Recording timeout - auto-stopping')
        stopRecording()
        showError('Recording stopped automatically after 60 seconds.')
      }, 60000)
    } else {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current)
        recordingTimeoutRef.current = null
      }
    }
  }, [isRecording, stopRecording, showError])

  // Notify parent of state changes
  useEffect(() => {
    if (onSpeakingChange) onSpeakingChange(isSpeaking)
  }, [isSpeaking, onSpeakingChange])

  useEffect(() => {
    if (onListeningChange) onListeningChange(isRecording)
  }, [isRecording, onListeningChange])

  const selectedMode = AI_MODES.find((m) => m.id === activeMode)!
  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length
  const autoSave = localStorage.getItem('vj-autosave') !== 'false'
  const autoPlay = localStorage.getItem('vj-autoplay') !== 'false'

  // Set default pitch and rate when mode changes
  useEffect(() => {
    setPitch(selectedMode.defaultPitch)
    setRate(selectedMode.defaultRate)
  }, [selectedMode])

  // Call AI when recording stops
  useEffect(() => {
    // Detect when recording just stopped
    if (wasRecordingRef.current && !isRecording) {
      // Wait a bit for transcript to finalize
      setTimeout(() => {
        const finalTranscript = transcript.trim()
        
        if (finalTranscript) {
          callGroq(finalTranscript, selectedMode).catch((error) => {
            console.error('Groq API error:', error)
            showError('Failed to get AI response. Please try again.')
          })
        } else {
          showError('No speech detected. Please try again.')
        }
      }, 1500)
    }
    
    // Update ref for next render
    wasRecordingRef.current = isRecording
  }, [isRecording, transcript, selectedMode, callGroq, showError])

  // Auto-play TTS when AI responds
  useEffect(() => {
    if (aiResponse && autoPlay && !isSpeaking) {
      speak(aiResponse, pitch, rate)
    }
  }, [aiResponse])

  // Auto-save when AI responds
  useEffect(() => {
    if (aiResponse && detectedMood && autoSave && !saved) {
      handleSave()
    }
  }, [aiResponse, detectedMood, autoSave])

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording()
    } else {
      resetTranscript()
      setSaved(false)
      startRecording()
    }
  }

  const handleSave = async () => {
    if (!user || !transcript || !aiResponse || isSaving || saved) return

    setIsSaving(true)
    try {
      const xpEarned = calculateXP(wordCount)
      
      // Save entry
      const { error: saveError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          transcript: transcript.trim(),
          ai_response: aiResponse,
          ai_mode: activeMode,
          mood: detectedMood,
          word_count: wordCount,
          xp_earned: xpEarned,
          tts_pitch: pitch,
          tts_rate: rate
        })
        .select()
        .single()

      if (saveError) throw saveError

      // Update streak and XP
      const streakResult = await updateStreak(user.id, xpEarned)
      
      setSaved(true)
      showXPToast(xpEarned)
      showSuccess('Entry saved!')
      setCurrentMood(detectedMood)

      // Show level up modal if leveled up
      if (streakResult.didLevelUp) {
        setShowLevelUp({
          newLevel: streakResult.newLevel,
          levelName: LEVEL_NAMES[streakResult.newLevel - 1],
          xpEarned
        })
      }
    } catch (error) {
      console.error('Save error:', error)
      showError('Failed to save entry. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePlayTTS = () => {
    if (aiResponse) {
      speak(aiResponse, pitch, rate)
    }
  }

  // Show microphone permission UI if not granted
  if (!isSupported) {
    return (
      <div className="glass p-6 border-l-4 border-red-500">
        <div className="flex items-start gap-3">
          <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-heading text-lg font-bold text-text mb-1">
              Speech Recognition Not Supported
            </h3>
            <p className="text-sm text-text-muted">
              Your browser doesn't support speech recognition. Please use:
            </p>
            <ul className="text-sm text-text-muted mt-2 space-y-1 list-disc list-inside">
              <li>Chrome (Desktop & Mobile)</li>
              <li>Edge (Desktop & Mobile)</li>
              <li>Safari (iOS 14.5+)</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (!micPermissionGranted) {
    return <MicrophonePermission onPermissionGranted={() => setMicPermissionGranted(true)} />
  }

  return (
    <div className="space-y-6">
      {/* Waveform */}
      <WaveformCanvas 
        isRecording={isRecording} 
        modeColor={selectedMode.color}
        onAudioData={onAudioData}
      />

      {/* Record Button */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRecordToggle}
            disabled={aiLoading}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl relative z-10 ${
              isRecording
                ? 'bg-red-500'
                : aiLoading
                ? 'bg-gray-500'
                : 'bg-gradient-to-br from-accent to-accent2'
            }`}
          >
            {aiLoading ? (
              <Loader2 size={32} className="animate-spin" />
            ) : isRecording ? (
              <Square size={32} />
            ) : (
              <Mic size={32} />
            )}
          </motion.button>

          {/* Pulsing ring when recording */}
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500 animate-pulse-ring"
              style={{ zIndex: 0 }}
            />
          )}
        </div>

        {/* Status text */}
        <div className="text-center">
          {isRecording && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-text-muted flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Recording...
            </motion.p>
          )}
          {aiLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-text-muted"
            >
              Thinking...
            </motion.p>
          )}
        </div>
      </div>

      {/* Transcript Display */}
      <AnimatePresence>
        {(transcript || interimTranscript) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-muted">Your words</p>
              {wordCount > 0 && (
                <Badge color="var(--accent)">
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </Badge>
              )}
            </div>
            <p className="text-base leading-relaxed text-text">
              {transcript}
              {interimTranscript && (
                <span className="text-text-muted italic"> {interimTranscript}</span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Response */}
      <AnimatePresence>
        {aiResponse && (
          <div className="space-y-4">
            <AiResponse response={aiResponse} mode={selectedMode} />

            {/* Mood Badge */}
            <div className="flex justify-center">
              <MoodBadge mood={detectedMood} />
            </div>

            {/* TTS Controls */}
            <div className="glass p-6">
              <TtsControls
                isSpeaking={isSpeaking}
                pitch={pitch}
                rate={rate}
                onPitchChange={setPitch}
                onRateChange={setRate}
                onPlay={handlePlayTTS}
                onStop={stop}
              />
            </div>

            {/* Save Button */}
            {!autoSave && (
              <Button
                onClick={handleSave}
                disabled={isSaving || saved}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check size={20} />
                    Saved ✓
                  </>
                ) : (
                  <>
                    <Bookmark size={20} />
                    Save to Journal
                  </>
                )}
              </Button>
            )}

            {saved && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-green-500"
              >
                ✓ Entry saved successfully
              </motion.p>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Errors */}
      {(recorderError || aiError) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-4 border-l-4 border-red-500 text-red-500 text-sm"
        >
          {recorderError || aiError}
        </motion.div>
      )}
    </div>
  )
}
