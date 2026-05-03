import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div style={{ fontSize: 48 }}>😵</div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 20,
            color: 'var(--text)',
          }}>
            Something went wrong
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #7C6FFF, #FF6B9D)',
              color: 'white',
              border: 'none',
              borderRadius: 99,
              padding: '10px 24px',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
            }}
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
