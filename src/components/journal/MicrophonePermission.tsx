import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '../ui/Button'

interface MicrophonePermissionProps {
  onPermissionGranted?: () => void
}

export function MicrophonePermission({ onPermissionGranted }: MicrophonePermissionProps) {
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking')
  const [error, setError] = useState<string | null>(null)

  const checkPermission = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support microphone access. Please use Chrome, Edge, or Safari.')
        setPermissionState('denied')
        return
      }

      // Try to query permission state (not supported on all browsers)
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied')
          
          if (result.state === 'granted' && onPermissionGranted) {
            onPermissionGranted()
          }

          // Listen for permission changes
          result.onchange = () => {
            setPermissionState(result.state as 'prompt' | 'granted' | 'denied')
            if (result.state === 'granted' && onPermissionGranted) {
              onPermissionGranted()
            }
          }
        } catch {
          // Permission query not supported (common on iOS Safari)
          console.log('Permission query not supported, will prompt on request')
          setPermissionState('prompt')
        }
      } else {
        // Permissions API not available (iOS Safari)
        setPermissionState('prompt')
      }
    } catch {
      console.error('Permission check error')
      setPermissionState('prompt')
    }
  }

  useEffect(() => {
    checkPermission()
  }, [])

  const requestPermission = async () => {
    setError(null)
    try {
      console.log('🎤 Requesting microphone permission...')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      console.log('✅ Microphone stream obtained')
      
      // Stop all tracks immediately (we just needed permission)
      stream.getTracks().forEach(track => {
        track.stop()
        console.log('🛑 Track stopped:', track.label)
      })
      
      setPermissionState('granted')
      if (onPermissionGranted) {
        onPermissionGranted()
      }
    } catch (err) {
      console.error('❌ Microphone permission error:', err)
      const error = err as Error
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please allow microphone permissions in your browser settings.')
        setPermissionState('denied')
      } else if (error.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.')
        setPermissionState('denied')
      } else if (error.name === 'NotReadableError') {
        setError('Microphone is being used by another app. Please close other apps and try again.')
        setPermissionState('denied')
      } else if (error.name === 'OverconstrainedError') {
        setError('Microphone constraints not supported. Trying basic access...')
        // Retry with basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ audio: true })
          basicStream.getTracks().forEach(track => track.stop())
          setPermissionState('granted')
          if (onPermissionGranted) {
            onPermissionGranted()
          }
        } catch {
          setError('Failed to access microphone. Please try again.')
          setPermissionState('denied')
        }
      } else {
        setError(`Failed to access microphone: ${error.message || 'Unknown error'}. Please try again.`)
        setPermissionState('denied')
      }
    }
  }

  if (permissionState === 'checking') {
    return (
      <div className="glass p-6 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm text-text-muted">Checking microphone permissions...</p>
      </div>
    )
  }

  if (permissionState === 'granted') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-4 flex items-center gap-3 border-l-4 border-green-500"
      >
        <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
        <p className="text-sm text-text">Microphone access granted ✓</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 space-y-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
          <Mic size={24} className="text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-lg font-bold text-text mb-1">
            Microphone Access Required
          </h3>
          <p className="text-sm text-text-muted leading-relaxed">
            VoiceJournal needs access to your microphone to record your voice entries. 
            Your audio is processed locally and only the transcript is saved.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Button
          onClick={requestPermission}
          variant="primary"
          size="lg"
          className="w-full"
        >
          <Mic size={20} />
          Allow Microphone Access
        </Button>

        {permissionState === 'denied' && (
          <p className="text-xs text-text-muted text-center">
            If you denied permission, please enable it in your browser settings and refresh the page.
          </p>
        )}
      </div>

      {/* Instructions for mobile */}
      <details className="text-xs text-text-muted border-t border-white/10 pt-3">
        <summary className="cursor-pointer hover:text-text font-medium">
          📱 How to enable microphone on mobile
        </summary>
        <div className="mt-3 space-y-3 pl-2">
          <div>
            <p className="font-semibold text-text mb-1">🍎 iOS (Safari):</p>
            <ol className="list-decimal list-inside space-y-1 text-text-muted">
              <li>Open <strong>Settings</strong> app</li>
              <li>Scroll down to <strong>Safari</strong></li>
              <li>Tap <strong>Microphone</strong></li>
              <li>Select <strong>Ask</strong> or <strong>Allow</strong></li>
              <li>Reload this page</li>
            </ol>
          </div>
          <div>
            <p className="font-semibold text-text mb-1">🤖 Android (Chrome):</p>
            <ol className="list-decimal list-inside space-y-1 text-text-muted">
              <li>Tap the <strong>lock icon</strong> in address bar</li>
              <li>Tap <strong>Permissions</strong></li>
              <li>Enable <strong>Microphone</strong></li>
              <li>Reload this page</li>
            </ol>
          </div>
          <div className="bg-accent/10 border border-accent/30 rounded p-2 mt-2">
            <p className="text-xs text-accent">
              💡 <strong>Tip:</strong> Make sure you're using HTTPS (secure connection) and have a stable internet connection.
            </p>
          </div>
        </div>
      </details>
    </motion.div>
  )
}
