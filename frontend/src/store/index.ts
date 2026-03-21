import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

interface Session {
  id: string
  type: 'main' | 'subagent' | 'acp'
  status: 'active' | 'idle' | 'completed' | 'error'
  model: string
  createdAt: string
  lastActivity: string
  messageCount: number
}

interface Tool {
  name: string
  description: string
  category: string
  parameters: string[]
  lastCalled?: string
}

interface Memory {
  id: string
  text: string
  importance: number
  category: string
  timestamp: string
}

interface OpenClawState {
  // Connection
  isConnected: boolean
  connectionStatus: string
  socket: Socket | null
  
  // Data
  sessions: Session[]
  tools: Tool[]
  memories: Memory[]
  activeWorkflow: any | null
  
  // Stats
  stats: {
    totalSessions: number
    activeSessions: number
    toolCallsToday: number
    memoryItems: number
  }
  
  // Actions
  connect: () => void
  disconnect: () => void
  sendCommand: (command: string, sessionId?: string) => void
  callTool: (toolName: string, parameters: Record<string, any>, sessionId?: string) => void
  searchMemory: (query: string, limit?: number) => Promise<Memory[]>
  
  // Updates
  setSessions: (sessions: Session[]) => void
  setTools: (tools: Tool[]) => void
  setMemories: (memories: Memory[]) => void
  updateSession: (sessionId: string, updates: Partial<Session>) => void
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useStore = create<OpenClawState>((set, get) => ({
  // Initial state
  isConnected: false,
  connectionStatus: 'Connecting...',
  socket: null,
  
  sessions: [],
  tools: [],
  memories: [],
  activeWorkflow: null,
  
  stats: {
    totalSessions: 0,
    activeSessions: 0,
    toolCallsToday: 0,
    memoryItems: 0,
  },
  
  // Connect to backend WebSocket
  connect: () => {
    const socket = io(API_URL)
    
    socket.on('connect', () => {
      console.log('Connected to backend')
      set({ 
        isConnected: true, 
        connectionStatus: 'Connected',
        socket 
      })
      
      // Request initial data
      socket.emit('get-sessions')
      socket.emit('get-tools')
      socket.emit('get-stats')
    })
    
    socket.on('disconnect', () => {
      console.log('Disconnected from backend')
      set({ 
        isConnected: false, 
        connectionStatus: 'Disconnected' 
      })
    })
    
    socket.on('openclaw-status', (data: { connected: boolean; error?: string }) => {
      set({ 
        connectionStatus: data.connected 
          ? 'Connected to OpenClaw Gateway' 
          : `Disconnected from OpenClaw Gateway${data.error ? `: ${data.error}` : ''}`
      })
    })
    
    socket.on('session-update', (data: Session[]) => {
      set({ sessions: data })
      // Update stats
      const activeSessions = data.filter(s => s.status === 'active').length
      set(state => ({
        stats: {
          ...state.stats,
          totalSessions: data.length,
          activeSessions,
        }
      }))
    })
    
    socket.on('tool-call', (data: { tool: string; parameters: any; timestamp: string }) => {
      console.log('Tool called:', data)
      // Update tool last called time
      set(state => ({
        tools: state.tools.map(tool => 
          tool.name === data.tool 
            ? { ...tool, lastCalled: data.timestamp }
            : tool
        ),
        stats: {
          ...state.stats,
          toolCallsToday: state.stats.toolCallsToday + 1,
        }
      }))
    })
    
    socket.on('memory-update', (data: Memory[]) => {
      set({ memories: data })
      set(state => ({
        stats: {
          ...state.stats,
          memoryItems: data.length,
        }
      }))
    })
    
    socket.on('stats-update', (data: any) => {
      set({ stats: data })
    })
    
    socket.on('error', (error: any) => {
      console.error('Socket error:', error)
      set({ connectionStatus: `Error: ${error.message || 'Unknown error'}` })
    })
  },
  
  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
    }
    set({ 
      isConnected: false, 
      connectionStatus: 'Disconnected',
      socket: null 
    })
  },
  
  sendCommand: (command: string, sessionId = 'main') => {
    const { socket } = get()
    if (socket && get().isConnected) {
      socket.emit('send-command', { command, sessionId })
    }
  },
  
  callTool: (toolName: string, parameters: Record<string, any>, sessionId = 'main') => {
    const { socket } = get()
    if (socket && get().isConnected) {
      socket.emit('call-tool', { toolName, parameters, sessionId })
    }
  },
  
  searchMemory: async (query: string, limit = 5): Promise<Memory[]> => {
    try {
      const response = await fetch(`${API_URL}/api/memory/search?query=${encodeURIComponent(query)}&limit=${limit}`)
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error('Error searching memory:', error)
      return []
    }
  },
  
  setSessions: (sessions: Session[]) => {
    set({ sessions })
    // Update stats
    const activeSessions = sessions.filter(s => s.status === 'active').length
    set(state => ({
      stats: {
        ...state.stats,
        totalSessions: sessions.length,
        activeSessions,
      }
    }))
  },
  
  setTools: (tools: Tool[]) => {
    set({ tools })
  },
  
  setMemories: (memories: Memory[]) => {
    set({ memories })
    set(state => ({
      stats: {
        ...state.stats,
        memoryItems: memories.length,
      }
    }))
  },
  
  updateSession: (sessionId: string, updates: Partial<Session>) => {
    set(state => ({
      sessions: state.sessions.map(session =>
        session.id === sessionId ? { ...session, ...updates } : session
      )
    }))
  },
}))