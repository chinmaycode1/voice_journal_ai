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

  useEffect(() => {
    checkPermission()
  }, [])

  const checkPermission = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support microphone access')
        setPermissionState('denied')
        return
      }

      // Try to query permission state
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
        } catch (err) {
          // Permission query not supported, try direct access
          setPermissionState('prompt')
        }
      } else {
        setPermissionState('prompt')
      }
    } catch (err) {
      console.error('Permission check error:', err)
      setPermissionState('prompt')
    }
  }

  const requestPermission = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Stop all tracks immediately (we just needed permission)
      stream.getTracks().forEach(track => track.stop())
      
      setPermissionState('granted')
      if (onPermissionGranted) {
        onPermissionGranted()
      }
    } catch (err: any) {
      console.error('Microphone permission error:', err)
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please allow microphone permissions in your browser settings.')
        setPermissionState('denied')
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.')
        setPermissionState('denied')
      } else {
        setError('Failed to access microphone. Please try again.')
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
      <details className="text-xs text-text-muted">
        <summary className="cursor-pointer hover:text-text">
          How to enable microphone on mobile
        </summary>
        <div className="mt-2 space-y-2 pl-4">
          <p><strong>iOS (Safari):</strong> Settings → Safari → Microphone → Allow</p>
          <p><strong>Android (Chrome):</strong> Settings → Site Settings → Microphone → Allow</p>
        </div>
      </details>
    </motion.div>
  )
}
