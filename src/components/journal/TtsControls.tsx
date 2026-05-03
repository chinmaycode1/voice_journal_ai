import { Play, StopCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Slider } from '../ui/Slider'

interface TtsControlsProps {
  isSpeaking: boolean
  pitch: number
  rate: number
  onPitchChange: (pitch: number) => void
  onRateChange: (rate: number) => void
  onPlay: () => void
  onStop: () => void
}

export function TtsControls({
  isSpeaking,
  pitch,
  rate,
  onPitchChange,
  onRateChange,
  onPlay,
  onStop
}: TtsControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isSpeaking ? onStop : onPlay}
          className={`p-3 rounded-full transition-colors ${
            isSpeaking
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
              : 'bg-accent/20 text-accent hover:bg-accent/30'
          }`}
        >
          {isSpeaking ? <StopCircle size={20} /> : <Play size={20} />}
        </motion.button>

        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-1"
          >
            <motion.div
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
              className="w-1 h-4 bg-accent rounded-full"
            />
            <motion.div
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
              className="w-1 h-4 bg-accent rounded-full"
            />
            <motion.div
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
              className="w-1 h-4 bg-accent rounded-full"
            />
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Slider
          value={pitch}
          onChange={onPitchChange}
          min={0.5}
          max={2.0}
          step={0.1}
          label="Pitch"
        />
        <Slider
          value={rate}
          onChange={onRateChange}
          min={0.5}
          max={1.5}
          step={0.1}
          label="Speed"
        />
      </div>
    </div>
  )
}
