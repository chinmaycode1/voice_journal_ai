import { motion, AnimatePresence } from 'framer-motion'
import AvatarFace from './AvatarFace'
import { AI_MODES } from '../../lib/aiModes'
import type { AiModeId, MoodType } from '../../types'

interface AvatarCardProps {
  activeModeId: AiModeId
  isSpeaking: boolean
  isListening: boolean
  mood: MoodType
}

function AvatarCard({
  activeModeId, isSpeaking, isListening, mood
}: AvatarCardProps) {
  const mode = AI_MODES.find(m => m.id === activeModeId)!

  return (
    <div style={{ width: '100%', maxWidth: 360, margin: '0 auto' }}>
      <motion.div
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 10, marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 22 }}>{mode.emoji}</span>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700, fontSize: 18,
          background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {mode.name}
        </span>

        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{ display: 'flex', gap: 3, alignItems: 'center' }}
            >
              {[0,1,2,3].map(i => (
                <motion.div key={i}
                  animate={{ scaleY: [1, 2.5, 0.8, 2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  style={{
                    width: 3, height: 14, borderRadius: 99,
                    background: mode.color,
                    transformOrigin: 'bottom',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeModeId}
          initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            position: 'relative',
            background: `radial-gradient(ellipse at 50% 40%, ${mode.color}18 0%, ${mode.color}05 60%, transparent 100%)`,
            border: `1px solid ${mode.color}30`,
            borderRadius: 28,
            padding: '32px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 120, height: 120, borderRadius: '50%',
            background: `${mode.color}10`,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -30, left: -30,
            width: 80, height: 80, borderRadius: '50%',
            background: `${mode.gradientTo}10`,
            pointerEvents: 'none',
          }} />

          <motion.div
            animate={{
              background: isListening
                ? 'rgba(255,71,87,0.15)'
                : isSpeaking
                ? `${mode.color}20`
                : 'rgba(255,255,255,0.05)',
              borderColor: isListening
                ? 'rgba(255,71,87,0.4)'
                : isSpeaking
                ? `${mode.color}40`
                : 'rgba(255,255,255,0.1)',
            }}
            style={{
              position: 'absolute', top: 14, left: 16,
              display: 'flex', alignItems: 'center', gap: 6,
              border: '1px solid',
              borderRadius: 99, padding: '4px 12px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              animate={{
                backgroundColor: isListening ? '#FF4757'
                  : isSpeaking ? mode.color : '#8888AA',
                scale: (isListening || isSpeaking) ? [1, 1.4, 1] : 1,
              }}
              transition={{ duration: 0.6, repeat: (isListening || isSpeaking) ? Infinity : 0 }}
              style={{ width: 7, height: 7, borderRadius: '50%' }}
            />
            <span style={{
              fontSize: 11, fontFamily: 'Inter, sans-serif',
              color: 'var(--text-muted)',
            }}>
              {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
            </span>
          </motion.div>

          <motion.div
            animate={{
              y: isSpeaking ? [0, -3, 0] : isListening ? [0, -2, 0] : 0,
            }}
            transition={{
              duration: isSpeaking ? 0.3 : 1.5,
              repeat: (isSpeaking || isListening) ? Infinity : 0,
              ease: 'easeInOut',
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
              padding: '10px'
            }}
          >
            <AvatarFace
              modeId={activeModeId}
              isSpeaking={isSpeaking}
              isListening={isListening}
              mood={mood}
              size={180}
            />
          </motion.div>

          <motion.p
            key={activeModeId + '-desc'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.65, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12, color: 'var(--text-muted)',
              textAlign: 'center', marginTop: 14,
              fontStyle: 'italic', lineHeight: 1.5,
            }}
          >
            "{mode.description}"
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AvatarCard
