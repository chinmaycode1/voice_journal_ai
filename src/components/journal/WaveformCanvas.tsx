import { useRef } from 'react'
import { useWaveform } from '../../hooks/useWaveform'

interface WaveformCanvasProps {
  isRecording: boolean
  modeColor: string
  onAudioData?: (data: Uint8Array | undefined) => void
}

export function WaveformCanvas({ isRecording, modeColor, onAudioData }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const { audioData } = useWaveform(canvasRef, isRecording, modeColor)

  // Pass audio data to parent
  if (onAudioData && audioData) {
    onAudioData(audioData)
  }

  return (
    <div className="w-full h-24 glass rounded-xl overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  )
}
