import { motion, useAnimationFrame } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import type { AiModeId, MoodType } from '../../types'

interface AvatarFaceProps {
  modeId: AiModeId
  isSpeaking: boolean
  isListening: boolean
  mood: MoodType
  size?: number
}

// ── MOUTH SHAPES: [path for closed, path for open small, path for open wide] ──
// All paths are relative to a 200x200 viewBox centered at 100,100

const FACES: Record<AiModeId, {
  // Face shape
  faceColor: string
  faceStroke: string
  faceShape: string          // SVG path for face outline
  // Eyes
  eyeColor: string
  leftEye: { cx: number; cy: number; rx: number; ry: number }
  rightEye: { cx: number; cy: number; rx: number; ry: number }
  // Pupils
  pupilSize: number
  // Eyebrows (two lines: [[x1,y1,x2,y2], [x1,y1,x2,y2]])
  browsNeutral: [[number,number,number,number],[number,number,number,number]]
  browsRaised: [[number,number,number,number],[number,number,number,number]]
  browsAngry: [[number,number,number,number],[number,number,number,number]]
  // Mouth center point + width
  mouthCx: number
  mouthCy: number
  mouthWidth: number
  // Accessories (optional SVG paths rendered on top)
  accessories?: string
  accessoryColor?: string
  // Background gradient colors
  bgFrom: string
  bgTo: string
  // Cheek blush (optional)
  blush?: boolean
  blushColor?: string
}> = {
  therapist: {
    faceColor: '#FDDBB4',
    faceStroke: '#E8A882',
    faceShape: 'M100,30 C140,30 165,55 165,95 C165,130 150,155 130,163 C120,168 110,170 100,170 C90,170 80,168 70,163 C50,155 35,130 35,95 C35,55 60,30 100,30 Z',
    eyeColor: '#5B7FA6',
    leftEye: { cx: 78, cy: 90, rx: 11, ry: 13 },
    rightEye: { cx: 122, cy: 90, rx: 11, ry: 13 },
    pupilSize: 6,
    browsNeutral: [[62,75,90,73],[110,73,138,75]],
    browsRaised: [[62,68,90,66],[110,66,138,68]],
    browsAngry: [[62,76,90,73],[110,73,138,76]],
    mouthCx: 100, mouthCy: 135, mouthWidth: 32,
    // Glasses
    accessories: 'M62,87 L94,87 L94,100 L62,100 Z M106,87 L138,87 L138,100 L106,100 Z M94,93 L106,93',
    accessoryColor: '#8B6B4A',
    bgFrom: '#E8F4F8',
    bgTo: '#B8D4E8',
    blush: true, blushColor: '#FFB5A0',
  },
  hype: {
    faceColor: '#FFCC99',
    faceStroke: '#E8A050',
    faceShape: 'M100,25 C145,25 170,52 170,92 C170,128 158,155 138,165 C125,172 112,174 100,174 C88,174 75,172 62,165 C42,155 30,128 30,92 C30,52 55,25 100,25 Z',
    eyeColor: '#3D2B1F',
    leftEye: { cx: 76, cy: 88, rx: 13, ry: 14 },
    rightEye: { cx: 124, cy: 88, rx: 13, ry: 14 },
    pupilSize: 7,
    browsNeutral: [[58,72,90,68],[110,68,142,72]],
    browsRaised: [[58,63,90,60],[110,60,142,63]],
    browsAngry: [[58,72,90,68],[110,68,142,72]],
    mouthCx: 100, mouthCy: 138, mouthWidth: 40,
    // Cap brim
    accessories: 'M55,40 Q100,20 145,40 L148,50 Q100,32 52,50 Z M45,50 L155,50 L155,58 L45,58 Z',
    accessoryColor: '#2D2D2D',
    bgFrom: '#FFF3E0',
    bgTo: '#FF8C42',
    blush: false,
  },
  philosopher: {
    faceColor: '#D4A574',
    faceStroke: '#A0724A',
    faceShape: 'M100,28 C138,28 162,54 162,94 C162,132 148,158 128,167 C118,172 109,174 100,174 C91,174 82,172 72,167 C52,158 38,132 38,94 C38,54 62,28 100,28 Z',
    eyeColor: '#4A3728',
    leftEye: { cx: 79, cy: 92, rx: 10, ry: 11 },
    rightEye: { cx: 121, cy: 92, rx: 10, ry: 11 },
    pupilSize: 5,
    browsNeutral: [[63,76,92,78],[108,78,137,76]],
    browsRaised: [[63,69,92,71],[108,71,137,69]],
    browsAngry: [[63,78,92,75],[108,75,137,78]],
    mouthCx: 100, mouthCy: 138, mouthWidth: 28,
    // Beard and mustache
    accessories: 'M72,145 Q100,175 128,145 Q120,158 100,162 Q80,158 72,145 Z M78,132 Q100,140 122,132 Q118,138 100,140 Q82,138 78,132 Z',
    accessoryColor: '#6B4A2A',
    bgFrom: '#F0E8D0',
    bgTo: '#7C6FFF',
    blush: false,
  },
  roast: {
    faceColor: '#F4C2A1',
    faceStroke: '#D4845A',
    faceShape: 'M100,26 C142,26 168,50 168,90 C168,130 152,158 130,166 C118,172 109,174 100,174 C91,174 82,172 70,166 C48,158 32,130 32,90 C32,50 58,26 100,26 Z',
    eyeColor: '#2D1F1F',
    leftEye: { cx: 77, cy: 89, rx: 12, ry: 10 },
    rightEye: { cx: 123, cy: 89, rx: 12, ry: 10 },
    pupilSize: 6,
    browsNeutral: [[60,74,88,77],[112,77,140,74]],
    browsRaised: [[60,66,88,69],[112,69,140,66]],
    browsAngry: [[60,76,88,72],[112,72,140,76]],
    mouthCx: 100, mouthCy: 135, mouthWidth: 36,
    // Smirk line (one side raised)
    accessories: 'M68,125 Q84,128 92,122',
    accessoryColor: '#D4845A',
    bgFrom: '#FFF0F0',
    bgTo: '#FF4757',
    blush: false,
  },
  poet: {
    faceColor: '#F2D0E8',
    faceStroke: '#C88AB0',
    faceShape: 'M100,24 C138,24 164,50 164,90 C164,128 150,156 130,166 C119,172 110,175 100,175 C90,175 81,172 70,166 C50,156 36,128 36,90 C36,50 62,24 100,24 Z',
    eyeColor: '#6B3FA0',
    leftEye: { cx: 78, cy: 90, rx: 11, ry: 13 },
    rightEye: { cx: 122, cy: 90, rx: 11, ry: 13 },
    pupilSize: 6,
    browsNeutral: [[62,74,90,72],[110,72,138,74]],
    browsRaised: [[62,66,90,64],[110,64,138,66]],
    browsAngry: [[62,75,90,72],[110,72,138,75]],
    mouthCx: 100, mouthCy: 136, mouthWidth: 30,
    // Flowing hair wisps
    accessories: 'M45,60 Q30,40 50,30 Q40,50 55,55 M155,60 Q170,40 150,30 Q160,50 145,55 M60,28 Q80,10 100,25 Q90,12 70,20',
    accessoryColor: '#9B5FC0',
    bgFrom: '#FDF0F8',
    bgTo: '#FF6B9D',
    blush: true, blushColor: '#FF9EC4',
  },
}

function AvatarFace({
  modeId, isSpeaking, isListening, mood, size = 200
}: AvatarFaceProps) {
  const face = FACES[modeId]
  const [blinkState, setBlinkState] = useState(1) // 1=open, 0=closed
  const [mouthOpen, setMouthOpen] = useState(0)   // 0=closed, 0.5=medium, 1=wide
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── BLINK LOOP ──
  useEffect(() => {
    const doBlink = () => {
      setBlinkState(0)
      setTimeout(() => setBlinkState(1), 120)
      // Next blink in 2.5-5s
      blinkTimerRef.current = setTimeout(doBlink, 2500 + Math.random() * 2500)
    }
    blinkTimerRef.current = setTimeout(doBlink, 1500)
    return () => { if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current) }
  }, [])

  // ── MOUTH ANIMATION LOOP ──
  useAnimationFrame((t) => {
    if (isSpeaking) {
      // Procedural lip sync — realistic speech pattern
      const fast = Math.abs(Math.sin(t * 0.012)) * 0.7
      const slow = Math.abs(Math.sin(t * 0.005)) * 0.3
      setMouthOpen(Math.min(1, fast + slow))
    } else {
      setMouthOpen(0)
    }
  })

  // ── DERIVED VALUES ──
  const brows = isListening ? face.browsRaised :
    (mood === 'angry' || mood === 'anxious') ? face.browsAngry :
    face.browsNeutral

  const mouthOpenAmount = mouthOpen * 18  // max px open
  const mouthSmile = (!isSpeaking && (mood === 'happy' || mood === 'excited')) ? 8 :
    (!isSpeaking && mood === 'sad') ? -6 : 2

  const gradId = `grad-${modeId}`
  const glowId = `glow-${modeId}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ overflow: 'visible', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.25))' }}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={face.bgFrom} stopOpacity="0.3" />
          <stop offset="100%" stopColor={face.bgTo} stopOpacity="0.15" />
        </radialGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background glow circle */}
      <motion.circle
        cx="100" cy="100" r="95"
        fill={`url(#${gradId})`}
        animate={{ r: isSpeaking ? [95, 98, 95] : 95 }}
        transition={{ duration: 0.4, repeat: isSpeaking ? Infinity : 0 }}
      />

      {/* Face */}
      <motion.path
        d={face.faceShape}
        fill={face.faceColor}
        stroke={face.faceStroke}
        strokeWidth="1.5"
        animate={{
          // Head nod when listening
          d: isListening ? face.faceShape : face.faceShape,
          scaleY: isListening ? 1.02 : 1,
        }}
        style={{ transformOrigin: '100px 100px' }}
      />

      {/* Blush cheeks */}
      {face.blush && (
        <>
          <ellipse cx="62" cy="120" rx="14" ry="8" fill={face.blushColor} opacity="0.4" />
          <ellipse cx="138" cy="120" rx="14" ry="8" fill={face.blushColor} opacity="0.4" />
        </>
      )}

      {/* Accessories (glasses, hat, beard, hair) */}
      {face.accessories && (
        <path
          d={face.accessories}
          fill={face.accessoryColor}
          stroke={face.accessoryColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />
      )}

      {/* Left eye white */}
      <motion.ellipse
        cx={face.leftEye.cx} cy={face.leftEye.cy}
        rx={face.leftEye.rx}
        ry={face.leftEye.ry}
        fill="white"
        stroke={face.faceStroke}
        strokeWidth="1"
        animate={{ ry: blinkState === 0 ? 1 : face.leftEye.ry }}
        transition={{ duration: 0.06 }}
      />

      {/* Left pupil */}
      <motion.circle
        cx={face.leftEye.cx + (isListening ? -1 : 0)}
        cy={face.leftEye.cy + (mood === 'sad' ? 2 : 0)}
        r={face.pupilSize}
        fill={face.eyeColor}
        animate={{
          r: blinkState === 0 ? 0 : face.pupilSize,
          cy: face.leftEye.cy + (mood === 'sad' ? 2 : 0),
        }}
        transition={{ duration: 0.06 }}
      />

      {/* Left eye shine */}
      <motion.circle
        cx={face.leftEye.cx - 3} cy={face.leftEye.cy - 3}
        r={2} fill="white" opacity={0.9}
        animate={{ opacity: blinkState === 0 ? 0 : 0.9 }}
      />

      {/* Right eye white */}
      <motion.ellipse
        cx={face.rightEye.cx} cy={face.rightEye.cy}
        rx={face.rightEye.rx}
        ry={face.rightEye.ry}
        fill="white"
        stroke={face.faceStroke}
        strokeWidth="1"
        animate={{ ry: blinkState === 0 ? 1 : face.rightEye.ry }}
        transition={{ duration: 0.06 }}
      />

      {/* Right pupil */}
      <motion.circle
        cx={face.rightEye.cx + (isListening ? 1 : 0)}
        cy={face.rightEye.cy + (mood === 'sad' ? 2 : 0)}
        r={face.pupilSize}
        fill={face.eyeColor}
        animate={{
          r: blinkState === 0 ? 0 : face.pupilSize,
          cy: face.rightEye.cy + (mood === 'sad' ? 2 : 0),
        }}
        transition={{ duration: 0.06 }}
      />

      {/* Right eye shine */}
      <motion.circle
        cx={face.rightEye.cx - 3} cy={face.rightEye.cy - 3}
        r={2} fill="white" opacity={0.9}
        animate={{ opacity: blinkState === 0 ? 0 : 0.9 }}
      />

      {/* Eyebrows */}
      <motion.line
        x1={brows[0][0]} y1={brows[0][1]}
        x2={brows[0][2]} y2={brows[0][3]}
        stroke={face.eyeColor} strokeWidth="3.5" strokeLinecap="round"
        animate={{ x1: brows[0][0], y1: brows[0][1], x2: brows[0][2], y2: brows[0][3] }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      />
      <motion.line
        x1={brows[1][0]} y1={brows[1][1]}
        x2={brows[1][2]} y2={brows[1][3]}
        stroke={face.eyeColor} strokeWidth="3.5" strokeLinecap="round"
        animate={{ x1: brows[1][0], y1: brows[1][1], x2: brows[1][2], y2: brows[1][3] }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      />

      {/* Mouth */}
      <motion.path
        d={
          mouthOpenAmount > 3
            // Open mouth — ellipse-like shape
            ? `M${face.mouthCx - face.mouthWidth / 2},${face.mouthCy}
               Q${face.mouthCx},${face.mouthCy + mouthSmile}
               ${face.mouthCx + face.mouthWidth / 2},${face.mouthCy}
               Q${face.mouthCx},${face.mouthCy + mouthOpenAmount + Math.abs(mouthSmile)}
               ${face.mouthCx - face.mouthWidth / 2},${face.mouthCy} Z`
            // Closed mouth — simple curve
            : `M${face.mouthCx - face.mouthWidth / 2},${face.mouthCy}
               Q${face.mouthCx},${face.mouthCy + mouthSmile + 4}
               ${face.mouthCx + face.mouthWidth / 2},${face.mouthCy}`
        }
        fill={mouthOpenAmount > 3 ? '#5B2D2D' : 'none'}
        stroke={face.faceStroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        animate={{}}
        transition={{ duration: 0.05 }}
      />

      {/* Teeth (visible when mouth open wide) */}
      {mouthOpenAmount > 8 && (
        <motion.rect
          x={face.mouthCx - face.mouthWidth / 2 + 4}
          y={face.mouthCy + 1}
          width={face.mouthWidth - 8}
          height={7}
          rx={3}
          fill="white"
          opacity={Math.min(1, (mouthOpenAmount - 8) / 6)}
        />
      )}

      {/* Speaking sound waves (side of mouth, visible when speaking) */}
      {isSpeaking && (
        <>
          {[1, 2, 3].map(i => (
            <motion.path
              key={i}
              d={`M${face.mouthCx + face.mouthWidth / 2 + 6},${face.mouthCy - 8 + i * 5}
                  Q${face.mouthCx + face.mouthWidth / 2 + 10 + i * 3},${face.mouthCy - 4 + i * 5}
                  ${face.mouthCx + face.mouthWidth / 2 + 6},${face.mouthCy + i * 5}`}
              fill="none"
              stroke={face.bgTo}
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{ opacity: [0, 0.8, 0], x: [0, 3, 6] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* Listening indicator (subtle ear waves) */}
      {isListening && (
        <>
          {[1, 2].map(i => (
            <motion.circle
              key={i}
              cx={face.leftEye.cx - 25}
              cy={face.mouthCy - 10}
              r={i * 8}
              fill="none"
              stroke="#4ECDC4"
              strokeWidth="1.5"
              animate={{ r: [i * 6, i * 12, i * 6], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </>
      )}
    </svg>
  )
}

export default AvatarFace
