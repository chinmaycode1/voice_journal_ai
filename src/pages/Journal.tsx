import { useState, useEffect } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Navbar } from '../components/layout/Navbar'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'
import { DailyPrompt } from '../components/journal/DailyPrompt'
import { AiModeSelector } from '../components/journal/AiModeSelector'
import { VoiceRecorder } from '../components/journal/VoiceRecorder'
import { LevelUpModal } from '../components/journal/LevelUpModal'
import { useJournalStore } from '../store/useJournalStore'
import AvatarCard from '../components/avatar/AvatarCard'

export function Journal() {
  const { activeMode, setActiveMode, showLevelUp, setShowLevelUp, currentMood } = useJournalStore()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <PageWrapper>
      <div className="min-h-screen pb-24 md:pb-8">
        <Navbar />
        
        <main className="pt-24 px-4 mx-auto" style={{ maxWidth: 1400 }}>
          {/* Two-column layout on desktop */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr 1.2fr' : '1fr',
            gap: 32,
            alignItems: 'start',
          }}>
            {/* LEFT COLUMN: Avatar (sticky on desktop) */}
            <div style={{
              position: isDesktop ? 'sticky' : 'relative',
              top: isDesktop ? 80 : 0,
            }}>
              <AvatarCard
                activeModeId={activeMode}
                isSpeaking={isSpeaking}
                isListening={isRecording}
                mood={currentMood || 'neutral'}
              />
            </div>

            {/* RIGHT COLUMN: Journal controls */}
            <div className="space-y-6">
              {/* Daily Prompt */}
              <DailyPrompt />

              {/* AI Mode Selector */}
              <AiModeSelector activeMode={activeMode} onModeChange={setActiveMode} />

              {/* Voice Recorder - The main component */}
              <VoiceRecorder 
                onAudioData={() => {}}
                onSpeakingChange={setIsSpeaking}
                onListeningChange={setIsRecording}
              />
            </div>
          </div>
        </main>

        <MobileBottomNav />

        {/* Level Up Modal */}
        <LevelUpModal
          levelUpInfo={showLevelUp}
          onClose={() => setShowLevelUp(null)}
        />
      </div>
    </PageWrapper>
  )
}
