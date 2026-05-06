import { useState, useRef, useCallback } from 'react'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives?: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart?: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const startRecording = useCallback(async () => {
    // Check HTTPS requirement (more lenient for development)
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('192.168')
    
    if (window.location.protocol !== 'https:' && !isLocalhost) {
      setError('Voice recording requires HTTPS. Please use the deployed version.')
      return
    }

    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setIsSupported(false)
      setError('Speech recognition not supported. Please use Chrome, Edge, or Safari.')
      return
    }

    // Check if mediaDevices is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Microphone access not available. Please use HTTPS and a supported browser.')
      return
    }

    // Request microphone permission FIRST - CRITICAL for mobile
    try {
      console.log('🎤 Requesting microphone permission...')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      // Stop all tracks immediately (we just needed permission)
      stream.getTracks().forEach(track => track.stop())
      console.log('✅ Microphone permission granted')
      
      // Small delay to ensure permission is fully granted (helps on iOS)
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (err: any) {
      console.error('❌ Microphone permission error:', err)
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please allow microphone in your browser settings.')
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.')
      } else if (err.name === 'NotReadableError') {
        setError('Microphone is being used by another app. Please close other apps and try again.')
      } else {
        setError(`Microphone error: ${err.message || 'Unknown error'}`)
      }
      return
    }

    // Create FRESH recognition instance
    const recognition = new SpeechRecognition()
    recognition.continuous = true  // Keep continuous for better mobile experience
    recognition.interimResults = true
    recognition.lang = 'en-US'
    if (recognition.maxAlternatives !== undefined) {
      recognition.maxAlternatives = 1
    }

    recognition.onstart = () => {
      console.log('🎙️ Speech recognition started')
      setIsRecording(true)
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript
        
        if (event.results[i].isFinal) {
          final += transcriptText + ' '
          console.log('📝 Final transcript:', transcriptText)
        } else {
          interim += transcriptText
        }
      }

      if (interim) {
        setInterimTranscript(interim)
      }
      
      if (final) {
        setTranscript(prev => {
          const newTranscript = (prev + ' ' + final).trim()
          console.log('📄 Full transcript:', newTranscript)
          return newTranscript
        })
        setInterimTranscript('')
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('❌ Speech recognition error:', event.error, event.message)
      
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone permission denied. Please go to your browser settings and allow microphone access for this site, then reload the page.')
        setIsRecording(false)
      } else if (event.error === 'no-speech') {
        // Don't show error for no-speech in continuous mode, just keep listening
        console.log('⚠️ No speech detected, continuing...')
        // Don't set error or stop recording
      } else if (event.error === 'audio-capture') {
        setError('Microphone not accessible. Please check if another app is using it.')
        setIsRecording(false)
      } else if (event.error === 'network') {
        setError('Network error. Please check your internet connection and try again.')
        setIsRecording(false)
      } else if (event.error === 'aborted') {
        console.log('🛑 Recording aborted by user')
        // Don't show error for user-initiated stop
      } else {
        setError(`Recognition error: ${event.error}. Please try again.`)
        setIsRecording(false)
      }
    }

    recognition.onend = () => {
      console.log('🎙️ Speech recognition ended')
      setIsRecording(false)
      setInterimTranscript('')
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
      console.log('🎤 Starting recognition...')
    } catch (err: any) {
      console.error('Failed to start recognition:', err)
      if (err.message && err.message.includes('already started')) {
        console.log('Recognition already running')
        setIsRecording(true)
      } else {
        setError('Failed to start recording. Please try again.')
        setIsRecording(false)
      }
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        console.log('⏹️ Stopping recognition...')
      } catch (err) {
        console.warn('Error stopping recognition:', err)
      }
      recognitionRef.current = null
    }
    setIsRecording(false)
  }, [])

  const resetTranscript = () => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }

  return {
    isRecording,
    transcript: transcript.trim(),
    interimTranscript,
    startRecording,
    stopRecording,
    resetTranscript,
    error,
    isSupported
  }
}
