import { useToastStore } from '../store/useToastStore'

export function useToast() {
  const addToast = useToastStore((state) => state.addToast)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number) => {
    addToast({ type, message, duration })
  }

  const showXPToast = (xp: number) => {
    addToast({
      type: 'xp',
      message: `✨ +${xp} XP earned!`,
      duration: 2500
    })
  }

  const showSuccess = (message: string) => {
    addToast({ type: 'success', message })
  }

  const showError = (message: string) => {
    addToast({ type: 'error', message, duration: 4000 })
  }

  return { showToast, showXPToast, showSuccess, showError }
}
