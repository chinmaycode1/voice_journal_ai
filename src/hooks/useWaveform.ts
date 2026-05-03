import { useEffect, useRef, useState } from 'react'

export function useWaveform(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isRecording: boolean,
  modeColor: string
) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [audioData, setAudioData] = useState<Uint8Array | undefined>(undefined)
  const frameCountRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    if (isRecording) {
      // Start recording visualization
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream
          audioContextRef.current = new AudioContext()
          analyserRef.current = audioContextRef.current.createAnalyser()
          analyserRef.current.fftSize = 256
          analyserRef.current.smoothingTimeConstant = 0.8

          const source = audioContextRef.current.createMediaStreamSource(stream)
          source.connect(analyserRef.current)

          const bufferLength = analyserRef.current.frequencyBinCount
          dataArrayRef.current = new Uint8Array(bufferLength)

          const draw = () => {
            if (!analyserRef.current || !dataArrayRef.current) return

            animationFrameRef.current = requestAnimationFrame(draw)

            // @ts-ignore - Type mismatch between ArrayBufferLike and ArrayBuffer
            analyserRef.current.getByteFrequencyData(dataArrayRef.current)

            // Update audio data state (throttled - every 3rd frame)
            frameCountRef.current++
            if (frameCountRef.current % 3 === 0) {
              setAudioData(new Uint8Array(dataArrayRef.current))
            }

            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

            const barWidth = canvas.offsetWidth / bufferLength
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
              const barHeight = (dataArrayRef.current[i] / 255) * (canvas.offsetHeight / 2)
              const opacity = 0.3 + (dataArrayRef.current[i] / 255) * 0.7

              ctx.fillStyle = modeColor + Math.floor(opacity * 255).toString(16).padStart(2, '0')
              ctx.fillRect(
                x,
                canvas.offsetHeight / 2 - barHeight / 2,
                barWidth - 1,
                barHeight
              )

              // Add glow
              ctx.shadowBlur = 8
              ctx.shadowColor = modeColor

              x += barWidth
            }
          }

          draw()
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err)
        })
    } else {
      // Draw idle animation
      const drawIdle = () => {
        animationFrameRef.current = requestAnimationFrame(drawIdle)

        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

        const time = Date.now() / 500
        const amplitude = 20
        const frequency = 0.02

        ctx.beginPath()
        ctx.strokeStyle = 'var(--text-muted)'
        ctx.lineWidth = 2

        for (let x = 0; x < canvas.offsetWidth; x++) {
          const y = canvas.offsetHeight / 2 + Math.sin(x * frequency + time) * amplitude
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()
      }

      drawIdle()
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch((err) => {
          console.warn('AudioContext already closed:', err)
        })
      }

      setAudioData(undefined)
    }
  }, [isRecording, modeColor, canvasRef])

  return { audioData }
}
