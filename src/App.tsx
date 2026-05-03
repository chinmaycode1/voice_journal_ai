import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useSupabaseAuth } from './hooks/useSupabaseAuth'
import { ToastContainer } from './components/ui/ToastContainer'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Landing from './pages/Landing'
import { Auth } from './pages/Auth'
import { Journal } from './pages/Journal'
import { History } from './pages/History'
import { Stats } from './pages/Stats'
import { Settings } from './pages/Settings'
import { NotFound } from './pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/journal" element={
            <ErrorBoundary>
              <Journal />
            </ErrorBoundary>
          } />
          <Route path="/history" element={<History />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  // Initialize auth
  useSupabaseAuth()

  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
