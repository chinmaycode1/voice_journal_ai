import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { useAuthStore } from '../store/useAuthStore'

const orbs = [
  { color: '#7C6FFF', size: 600, top: '-10%', left: '-5%', duration: 20 },
  { color: '#FF6B9D', size: 500, bottom: '-10%', right: '-5%', duration: 25 },
  { color: '#4ECDC4', size: 400, top: '30%', right: '10%', duration: 18 },
  { color: '#FF6B35', size: 350, bottom: '20%', left: '5%', duration: 22 },
]

export function Auth() {
  const navigate = useNavigate()
  const { session } = useAuthStore()
  const { signIn, signUp, signInWithGoogle } = useSupabaseAuth()
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  if (session) {
    return <Navigate to="/journal" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        await signIn(email, password)
        // Will redirect automatically via auth state change
      } else {
        const result: any = await signUp(email, password, username)
        
        if (result.requiresConfirmation) {
          setSuccessMessage('Account created! Check your email (including spam) for a confirmation link.')
          setLoading(false)
        } else {
          // Auto-confirmed, will redirect via auth state change
        }
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Authentication failed. Please try again.'
      
      // Provide helpful error messages
      if (errorMsg.includes('Database error') || errorMsg.includes('relation') || errorMsg.includes('does not exist')) {
        setError('Database setup incomplete. Please run the migration in Supabase dashboard.')
      } else if (errorMsg.includes('User already registered')) {
        setError('This email is already registered. Try signing in instead.')
        setMode('signin')
      } else if (errorMsg.includes('Invalid API key') || errorMsg.includes('JWT')) {
        setError('Authentication configuration error. Please check your Supabase API key.')
      } else {
        setError(errorMsg)
      }
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      const errorMsg = err.message || 'Google sign-in failed.'
      // Check for common OAuth errors
      if (errorMsg.includes('provider') || errorMsg.includes('not enabled')) {
        setError('Google sign-in is not configured in Supabase. Please use email/password instead.')
      } else if (errorMsg.includes('redirect') || errorMsg.includes('OAuth')) {
        setError('Google OAuth setup incomplete. Please use email/password to sign up.')
      } else {
        setError(errorMsg)
      }
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Animated Orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
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

      {/* Back Button */}
      <motion.button
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', top: 24, left: 24, zIndex: 50,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'transparent', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 14,
        }}
      >
        <ArrowLeft size={18} />
        <span>Home</span>
      </motion.button>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: 40,
          width: '100%',
          maxWidth: 420,
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6, type: 'spring' }}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C6FFF, #FF6B9D)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 24,
              color: 'white',
              boxShadow: '0 0 30px rgba(124,111,255,0.5)',
            }}
          >
            VJ
          </motion.div>
        </div>

        {/* Welcome Text */}
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 24,
        }}>
          <span className="gradient-text">Welcome back</span>
        </h2>

        {/* Tab Switcher */}
        <div style={{ position: 'relative', display: 'flex', marginBottom: 32, padding: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 99 }}>
          <motion.div
            layoutId="auth-tab-indicator"
            style={{
              position: 'absolute',
              inset: 4,
              borderRadius: 99,
              background: 'linear-gradient(135deg, #7C6FFF, #FF6B9D)',
              left: mode === 'signin' ? 4 : '50%',
              right: mode === 'signin' ? '50%' : 4,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          <button
            onClick={() => setMode('signin')}
            style={{
              position: 'relative',
              zIndex: 10,
              flex: 1,
              padding: '10px 0',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: 14,
              color: mode === 'signin' ? 'white' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            style={{
              position: 'relative',
              zIndex: 10,
              flex: 1,
              padding: '10px 0',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: 14,
              color: mode === 'signup' ? 'white' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: mode === 'signin' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'signin' ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {mode === 'signup' && (
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username (optional)"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    color: 'var(--text)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.outline = '1px solid var(--accent)'}
                  onBlur={(e) => e.target.style.outline = 'none'}
                />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  color: 'var(--text)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.outline = '1px solid var(--accent)'}
                onBlur={(e) => e.target.style.outline = 'none'}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 44px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  color: 'var(--text)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.outline = '1px solid var(--accent)'}
                onBlur={(e) => e.target.style.outline = 'none'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: 14,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    padding: 12,
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: 12,
                    color: '#22c55e',
                    fontSize: 13,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: [0, 10, -10, 10, -10, 0] }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    padding: 12,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 12,
                    color: '#ef4444',
                    fontSize: 13,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #7C6FFF, #FF6B9D)',
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Google Sign In */}
        <motion.button
          onClick={handleGoogleSignIn}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          style={{
            width: '100%',
            padding: '12px 24px',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 12,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 14,
            color: '#1f2937',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
            <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
            <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </motion.button>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
