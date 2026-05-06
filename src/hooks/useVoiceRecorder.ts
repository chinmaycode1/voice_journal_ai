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
    // Check HTTPS requirement
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
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

    // Request microphone permission FIRST
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // immediately stop, we just needed permission
      console.log('✅ Microphone permission granted')
    } catch (err: any) {
      console.error('Microphone permission error:', err)
      setError('Microphone access denied. Please allow microphone in browser settings and reload.')
      return
    }

    // Create FRESH recognition instance
    const recognition = new SpeechRecognition()
    recognition.continuous = false  // Changed back to false for better control
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
        setError('Microphone permission denied. Please allow microphone in browser settings.')
        setIsRecording(false)
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please speak louder or check your microphone.')
        setIsRecording(false)
      } else if (event.error === 'network') {
        setError('Network error. Please check your internet connection.')
        setIsRecording(false)
      } else if (event.error === 'aborted') {
        console.log('Recording aborted by user')
        // Don't show error for user-initiated stop
      } else {
        setError(`Recognition error: ${event.error}`)
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
