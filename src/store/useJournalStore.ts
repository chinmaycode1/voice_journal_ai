import { create } from 'zustand'
import type { AiModeId, MoodType, Entry, LevelUpInfo } from '../types'

interface JournalState {
  activeMode: AiModeId
  currentTranscript: string
  currentAiResponse: string
  currentMood: MoodType
  isSaving: boolean
  lastSavedEntry: Entry | null
  showLevelUp: LevelUpInfo | null
  setActiveMode: (mode: AiModeId) => void
  setCurrentTranscript: (transcript: string) => void
  setCurrentAiResponse: (response: string) => void
  setCurrentMood: (mood: MoodType) => void
  setIsSaving: (saving: boolean) => void
  setLastSavedEntry: (entry: Entry | null) => void
  setShowLevelUp: (info: LevelUpInfo | null) => void
  resetCurrent: () => void
}

export const useJournalStore = create<JournalState>((set) => ({
  activeMode: 'therapist',
  currentTranscript: '',
  currentAiResponse: '',
  currentMood: 'neutral',
  isSaving: false,
  lastSavedEntry: null,
  showLevelUp: null,
  setActiveMode: (mode) => set({ activeMode: mode }),
  setCurrentTranscript: (transcript) => set({ currentTranscript: transcript }),
  setCurrentAiResponse: (response) => set({ currentAiResponse: response }),
  setCurrentMood: (mood) => set({ currentMood: mood }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setLastSavedEntry: (entry) => set({ lastSavedEntry: entry }),
  setShowLevelUp: (info) => set({ showLevelUp: info }),
  resetCurrent: () => set({
    currentTranscript: '',
    currentAiResponse: '',
    currentMood: 'neutral',
    lastSavedEntry: null
  })
}))
