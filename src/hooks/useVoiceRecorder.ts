import { useState, useEffect, useRef } from 'react'

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

  useEffect(() => {
    // Check for speech recognition support (works on Chrome, Edge, Safari)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setIsSupported(false)
      setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    const recognition = new SpeechRecognition()
    
    // Mobile-optimized settings
    recognition.continuous = true  // Changed to true for better mobile support
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcriptText = result[0].transcript
        
        if (result.isFinal) {
          final += transcriptText + ' '
        } else {
          interim += transcriptText
        }
      }

      if (final) {
        setTranscript((prev) => {
          const newTranscript = prev + final
          return newTranscript.trim()
        })
      }
      setInterimTranscript(interim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message)
      
      // Handle specific errors
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions in your browser settings.')
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.')
      } else if (event.error === 'network') {
        setError('Network error. Please check your internet connection.')
      } else {
        setError(`Speech recognition error: ${event.error}`)
      }
      
      setIsRecording(false)
    }

    recognition.onend = () => {
      console.log('Speech recognition ended')
      setIsRecording(false)
      setInterimTranscript('')
    }

    recognition.onstart = () => {
      console.log('Speech recognition started')
      setIsRecording(true)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (err) {
          console.error('Error aborting recognition:', err)
        }
      }
    }
  }, [])

  const startRecording = async () => {
    if (!recognitionRef.current || !isSupported) {
      setError('Speech recognition not available')
      return
    }
    
    try {
      setError(null)
      setInterimTranscript('')
      
      // Request microphone permission explicitly (important for mobile)
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (permError) {
        setError('Microphone permission denied. Please allow microphone access.')
        return
      }
      
      recognitionRef.current.start()
      console.log('Recording started')
    } catch (err: any) {
      console.error('Start recording error:', err)
      
      // Handle "already started" error
      if (err.message && err.message.includes('already started')) {
        console.log('Recognition already running')
        setIsRecording(true)
      } else {
        setError('Failed to start recording. Please try again.')
      }
    }
  }

  const stopRecording = () => {
    if (!recognitionRef.current) return
    
    try {
      recognitionRef.current.stop()
      console.log('Recording stopped')
    } catch (err) {
      console.error('Stop recording error:', err)
    }
  }

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
