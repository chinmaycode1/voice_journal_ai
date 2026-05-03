import { useState } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Navbar } from '../components/layout/Navbar'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Toggle } from '../components/ui/Toggle'
import { Avatar } from '../components/ui/Avatar'
import { AiModeSelector } from '../components/journal/AiModeSelector'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { useTheme } from '../hooks/useTheme'
import { useToast } from '../hooks/useToast'
import { Download, Loader2, LogOut } from 'lucide-react'
import { exportJournalAsPDF } from '../lib/pdfExport'
import { supabase } from '../lib/supabase'
import type { Entry } from '../types'

export function Settings() {
  const { profile, updateProfile, signOut } = useSupabaseAuth()
  const { theme, toggleTheme } = useTheme()
  const { showSuccess, showError } = useToast()
  
  const [username, setUsername] = useState(profile?.username || '')
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [autoPlay, setAutoPlay] = useState(localStorage.getItem('vj-autoplay') !== 'false')
  const [autoSave, setAutoSave] = useState(localStorage.getItem('vj-autosave') !== 'false')
  const [exportingPDF, setExportingPDF] = useState(false)

  if (!profile) return null

  const handleUsernameUpdate = async () => {
    try {
      await updateProfile({ username })
      setIsEditingUsername(false)
      showSuccess('Username updated!')
    } catch (error) {
      showError('Failed to update username')
    }
  }

  const handleAutoPlayToggle = (enabled: boolean) => {
    setAutoPlay(enabled)
    localStorage.setItem('vj-autoplay', enabled.toString())
  }

  const handleAutoSaveToggle = (enabled: boolean) => {
    setAutoSave(enabled)
    localStorage.setItem('vj-autosave', enabled.toString())
  }

  const handleExportPDF = async () => {
    setExportingPDF(true)
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false })

      if (error) throw error

      await exportJournalAsPDF(data as Entry[], profile.username || 'User')
      showSuccess('PDF exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      showError('Failed to export PDF')
    } finally {
      setExportingPDF(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      showError('Failed to sign out')
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-screen pb-24 md:pb-8">
        <Navbar />
        
        <main className="pt-24 px-4 max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <h1 className="font-heading text-3xl font-bold gradient-text">
            Settings
          </h1>

          {/* Profile Card */}
          <Card variant="glass">
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-text">Profile</h2>
              
              <div className="flex items-center gap-4">
                <Avatar
                  src={profile.avatar_url}
                  fallback={profile.username || 'U'}
                  size={80}
                />
                <div className="flex-1">
                  {isEditingUsername ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUsernameUpdate()}
                        className="flex-1 px-3 py-2 bg-dark-card border border-border rounded-lg text-text focus:border-accent focus:outline-none"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleUsernameUpdate}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-heading text-lg font-bold text-text">
                        {profile.username || 'Set username'}
                      </p>
                      <button
                        onClick={() => setIsEditingUsername(true)}
                        className="text-sm text-accent hover:text-accent2"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-text-muted mt-1">
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences Card */}
          <Card variant="glass">
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-text">Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text font-medium">Dark Mode</p>
                    <p className="text-sm text-text-muted">Toggle between dark and light theme</p>
                  </div>
                  <Toggle enabled={theme === 'dark'} onChange={toggleTheme} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text font-medium">Auto-play TTS</p>
                    <p className="text-sm text-text-muted">Automatically read AI responses aloud</p>
                  </div>
                  <Toggle enabled={autoPlay} onChange={handleAutoPlayToggle} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text font-medium">Auto-save Entries</p>
                    <p className="text-sm text-text-muted">Save entries automatically after AI responds</p>
                  </div>
                  <Toggle enabled={autoSave} onChange={handleAutoSaveToggle} />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-text-muted mb-3">Default AI Mode</p>
                <AiModeSelector
                  activeMode={profile.default_ai_mode}
                  onModeChange={async (mode) => {
                    try {
                      await updateProfile({ default_ai_mode: mode })
                      showSuccess('Default mode updated!')
                    } catch (error) {
                      showError('Failed to update mode')
                    }
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Export Card */}
          <Card variant="glass">
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-text">Export</h2>
              <p className="text-sm text-text-muted">
                Download all your journal entries as a PDF
              </p>
              <Button
                onClick={handleExportPDF}
                disabled={exportingPDF}
                variant="secondary"
                className="w-full"
              >
                {exportingPDF ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Export Journal as PDF
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card variant="glass" className="border-red-500/30">
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-red-500">Danger Zone</h2>
              <Button
                onClick={handleSignOut}
                variant="danger"
                className="w-full"
              >
                <LogOut size={20} />
                Sign Out
              </Button>
            </div>
          </Card>
        </main>

        <MobileBottomNav />
      </div>
    </PageWrapper>
  )
}
