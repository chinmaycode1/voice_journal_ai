import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AI_MODES } from '../lib/aiModes'

const orbs = [
  { color: '#7C6FFF', size: 600, top: '-10%', left: '-5%', duration: 20 },
  { color: '#FF6B9D', size: 500, bottom: '-10%', right: '-5%', duration: 25 },
  { color: '#4ECDC4', size: 400, top: '30%', right: '10%', duration: 18 },
  { color: '#FF6B35', size: 350, bottom: '20%', left: '5%', duration: 22 },
]

const features = [
  {
    emoji: '🎙️',
    title: 'Speak Freely',
    desc: 'Record your thoughts in your own voice. Live transcription appears word by word as you speak. No typing needed.',
    color: '#7C6FFF',
  },
  {
    emoji: '🧠',
    title: '5 AI Modes',
    desc: 'Therapist, Hype Friend, Philosopher, Roast Mode, Poet. Each one responds completely differently to the same words.',
    color: '#FF6B9D',
  },
  {
    emoji: '📈',
    title: 'Grow Daily',
    desc: 'Streak tracking, XP system, mood timeline, and a contribution heatmap. Your journal becomes a mirror of your growth.',
    color: '#4ECDC4',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>
      {/* ── ANIMATED ORB BACKGROUND ── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          overflow: 'hidden', pointerEvents: 'none',
        }}
      >
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: orb.color,
              filter: 'blur(80px)',
              opacity: 0.15,
              top: orb.top,
              left: orb.left,
              right: orb.right,
              bottom: orb.bottom,
            }}
            animate={{
              x: [0, 60, -40, 20, 0],
              y: [0, -50, 30, -20, 0],
              scale: [1, 1.1, 0.95, 1.05, 1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* ── FLOATING NAVBAR ── */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 100, padding: '16px 32px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(9,9,15,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C6FFF, #FF6B9D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: 14, color: 'white',
            }}
          >
            VJ
          </div>
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600, fontSize: 17,
              color: 'var(--text)',
            }}
          >
            VoiceJournal
          </span>
        </div>

        {/* Sign In */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/auth')}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            padding: '8px 20px',
            borderRadius: 99,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
          }}
        >
          Sign In
        </motion.button>
      </motion.nav>

      {/* ── HERO SECTION ── */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          position: 'relative', zIndex: 10,
        }}
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            border: '1px solid rgba(124,111,255,0.35)',
            borderRadius: 99, padding: '6px 16px', marginBottom: 28,
            background: 'rgba(124,111,255,0.08)',
            color: '#7C6FFF', fontSize: 13,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          ✦ AI Voice Journaling
        </motion.div>

        {/* Main heading — MUST HAVE SPACES BETWEEN WORDS */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(40px, 7vw, 80px)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 800,
          }}
        >
          <span className="gradient-text">Speak Your Mind.</span>
          <br />
          <span className="gradient-text">Let AI Reflect It Back.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 18, color: 'var(--text-muted)',
            maxWidth: 520, lineHeight: 1.7, marginBottom: 40,
          }}
        >
          Record your thoughts. Get AI responses that actually make you think.
          Track your mood over time.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(124,111,255,0.6)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/auth')}
            style={{
              background: 'linear-gradient(135deg, #7C6FFF 0%, #FF6B9D 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: 17,
              padding: '16px 40px',
              borderRadius: 99,
              boxShadow: '0 0 30px rgba(124,111,255,0.35)',
              letterSpacing: '0.01em',
            }}
          >
            Start Journaling — It's Free →
          </motion.button>
          <p
            style={{
              marginTop: 14, fontSize: 13,
              color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif',
            }}
          >
            No credit card &bull; Free forever &bull; Works in your browser
          </p>
        </motion.div>
      </div>

      {/* ── FEATURES SECTION ── */}
      <div
        style={{
          padding: '80px 24px', maxWidth: 1100, margin: '0 auto',
          position: 'relative', zIndex: 10,
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700, textAlign: 'center',
            marginBottom: 48,
          }}
        >
          <span className="gradient-text">Everything you need to grow</span>
        </motion.h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6, boxShadow: `0 20px 60px ${f.color}25` }}
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 20,
                padding: 28,
                cursor: 'default',
              }}
            >
              <div
                style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${f.color}20`,
                  border: `1px solid ${f.color}40`,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 24,
                  marginBottom: 16,
                }}
              >
                {f.emoji}
              </div>
              <h3
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 20, fontWeight: 600,
                  color: 'var(--text)', marginBottom: 10,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7,
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── AI MODES SECTION ── */}
      <div
        style={{
          padding: '60px 24px 80px', maxWidth: 1000, margin: '0 auto',
          position: 'relative', zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
            }}
          >
            <span className="gradient-text">Choose your AI's personality</span>
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 16, color: 'var(--text-muted)',
              marginTop: 12,
            }}
          >
            Five completely different ways to respond to the same thoughts
          </p>
        </motion.div>

        {/* MODE CARDS — GRID, NOT FULL WIDTH STRIPS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: 16,
          }}
        >
          {AI_MODES.map((mode, i) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, type: 'spring', stiffness: 200 }}
              whileHover={{
                scale: 1.07,
                rotate: i % 2 === 0 ? 1.5 : -1.5,
                boxShadow: `0 20px 60px ${mode.color}50`,
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: `linear-gradient(135deg, ${mode.gradientFrom} 0%, ${mode.gradientTo} 100%)`,
                borderRadius: 20, padding: '28px 20px',
                textAlign: 'center', cursor: 'pointer',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Shine overlay */}
              <div
                style={{
                  position: 'absolute', top: 0, left: '-100%',
                  width: '60%', height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  transform: 'skewX(-15deg)',
                  transition: 'left 0.5s',
                }}
              />
              <div style={{ fontSize: 44, marginBottom: 12 }}>{mode.emoji}</div>
              <div
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700, fontSize: 15,
                  color: 'white', marginBottom: 6,
                }}
              >
                {mode.name}
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12, color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.5,
                }}
              >
                {mode.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div
        style={{
          padding: '80px 24px 120px', textAlign: 'center',
          position: 'relative', zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700,
              marginBottom: 32,
            }}
          >
            <span className="gradient-text">Ready to start talking?</span>
          </h2>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(124,111,255,0.6)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/auth')}
            style={{
              background: 'linear-gradient(135deg, #7C6FFF 0%, #FF6B9D 100%)',
              color: 'white', border: 'none', cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600, fontSize: 17,
              padding: '16px 40px', borderRadius: 99,
              boxShadow: '0 0 30px rgba(124,111,255,0.35)',
            }}
          >
            Start Journaling — It's Free →
          </motion.button>
          <p
            style={{
              marginTop: 60, fontSize: 13,
              color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif',
            }}
          >
            Made with 🤍 by Chinmay Sawargaonkar
          </p>
        </motion.div>
      </div>
    </div>
  )
}
