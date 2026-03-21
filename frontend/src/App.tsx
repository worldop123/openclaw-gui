import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

// Layout
import Layout from './components/Layout'

// Pages
import Dashboard from './pages/Dashboard'
import TeamDashboard from './pages/TeamDashboard'
import Sessions from './pages/Sessions'
import Tools from './pages/Tools'
import Workflow from './pages/Workflow'
import Memory from './pages/Memory'
import Feishu from './pages/Feishu'
import Settings from './pages/Settings'

// Store
import { useStore } from './store'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function AppContent() {
  const { isConnected, connectionStatus } = useStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<TeamDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team" element={<TeamDashboard />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/workflow" element={<Workflow />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/feishu" element={<Feishu />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          classNames: {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white',
          },
        }}
      />

      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg ${
          isConnected 
            ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
            : 'bg-red-500/10 text-red-600 border border-red-500/20'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {connectionStatus && (
            <span className="text-xs opacity-75">{connectionStatus}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App