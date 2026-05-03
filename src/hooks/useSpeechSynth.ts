import { useState, useEffect } from 'react'

export function useSpeechSynth() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSupported(false)
    }
  }, [])

  const speak = (text: string, pitch: number, rate: number, onEnd?: () => void) => {
    if (!isSupported) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Select voice - prefer Google voices with English
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (voice) => voice.name.includes('Google') && voice.lang.startsWith('en')
    ) || voices.find((voice) => voice.lang.startsWith('en'))
    
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.pitch = pitch
    utterance.rate = rate

    utterance.onend = () => {
      setIsSpeaking(false)
      onEnd?.()
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const stop = () => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  return { speak, stop, isSpeaking, isSupported }
}
