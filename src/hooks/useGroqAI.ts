import { useState } from 'react'
import type { AiMode, MoodType } from '../types'

export function useGroqAI() {
  const [aiResponse, setAiResponse] = useState('')
  const [detectedMood, setDetectedMood] = useState<MoodType>('neutral')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callGroq = async (transcript: string, aiMode: AiMode) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: aiMode.systemPrompt },
            { role: 'user', content: transcript }
          ],
          max_tokens: 280,
          temperature: 0.88
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error?.message || response.statusText
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Groq API key in .env.local')
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.')
        } else {
          throw new Error(`Groq API error: ${errorMessage}`)
        }
      }

      const data = await response.json()
      const fullResponse = data.choices[0]?.message?.content || ''

      // Extract mood from response
      const moodMatch = fullResponse.match(/MOOD:(\w+)/)
      const mood = moodMatch ? (moodMatch[1].toLowerCase() as MoodType) : 'neutral'
      
      // Remove MOOD line from displayed text
      const cleanedResponse = fullResponse.replace(/\n?MOOD:\w+\s*$/, '').trim()

      setAiResponse(cleanedResponse)
      setDetectedMood(mood)
      setLoading(false)
    } catch (err) {
      console.error('Groq API Error:', err)
      const message = err instanceof Error ? err.message : 'Failed to get AI response'
      setError(message)
      setLoading(false)
      throw err
    }
  }

  const reset = () => {
    setAiResponse('')
    setDetectedMood('neutral')
    setError(null)
    setLoading(false)
  }

  return { callGroq, aiResponse, detectedMood, loading, error, reset }
}
