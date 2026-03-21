/**
 * OpenClaw Gateway 连接服务
 * 提供与 OpenClaw Gateway 的 WebSocket 连接和通信
 */

export interface OpenClawConfig {
  gatewayUrl: string
  authToken?: string
  autoReconnect: boolean
  reconnectInterval: number
  maxReconnectAttempts: number
}

export interface OpenClawMessage {
  type: string
  data?: any
  timestamp?: number
  sessionId?: string
}

export interface OpenClawStatus {
  connected: boolean
  connecting: boolean
  lastError?: string
  lastActive?: Date
}

const DEFAULT_CONFIG: OpenClawConfig = {
  gatewayUrl: 'ws://localhost:18789',
  autoReconnect: true,
  reconnectInterval: 5000,
  maxReconnectAttempts: 10
}

class OpenClawService {
  private config: OpenClawConfig
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private status: OpenClawStatus = {
    connected: false,
    connecting: false
  }
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private statusListeners: Set<(status: OpenClawStatus) => void> = new Set()

  constructor(config?: Partial<OpenClawConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * 连接到 OpenClaw Gateway
   */
  connect(): void {
    if (this.status.connected || this.status.connecting) {
      console.log('[OpenClaw] Already connected or connecting')
      return
    }

    this.updateStatus({ connecting: true })
    console.log(`[OpenClaw] Connecting to ${this.config.gatewayUrl}...`)

    try {
      this.ws = new WebSocket(this.config.gatewayUrl)

      this.ws.onopen = () => {
        console.log('[OpenClaw] Connected successfully!')
        this.reconnectAttempts = 0
        this.updateStatus({ connected: true, connecting: false, lastActive: new Date() })
        this.emit('connected', {})
      }

      this.ws.onmessage = (event) => {
        try {
          const message: OpenClawMessage = JSON.parse(event.data)
          console.log('[OpenClaw] Received:', message.type)
          this.updateStatus({ lastActive: new Date() })
          this.emit(message.type, message.data)
        } catch (error) {
          console.error('[OpenClaw] Failed to parse message:', error)
        }
      }

      this.ws.onerror = (error) => {
        console.error('[OpenClaw] Connection error:', error)
        this.updateStatus({ lastError: 'Connection error' })
        this.emit('error', { error: 'Connection error' })
      }

      this.ws.onclose = (event) => {
        console.log(`[OpenClaw] Disconnected: ${event.code} - ${event.reason}`)
        this.updateStatus({ connected: false, connecting: false })
        this.emit('disconnected', { code: event.code, reason: event.reason })

        if (this.config.autoReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
          this.scheduleReconnect()
        }
      }
    } catch (error) {
      console.error('[OpenClaw] Failed to create connection:', error)
      this.updateStatus({ connecting: false, lastError: 'Failed to create connection' })
      this.scheduleReconnect()
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.updateStatus({ connected: false, connecting: false })
  }

  /**
   * 发送消息到 OpenClaw Gateway
   */
  send(message: OpenClawMessage): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('[OpenClaw] Not connected, cannot send message')
      return false
    }

    try {
      const fullMessage: OpenClawMessage = {
        ...message,
        timestamp: Date.now()
      }
      this.ws.send(JSON.stringify(fullMessage))
      console.log('[OpenClaw] Sent:', message.type)
      return true
    } catch (error) {
      console.error('[OpenClaw] Failed to send message:', error)
      return false
    }
  }

  /**
   * 发送命令
   */
  sendCommand(command: string, parameters?: any, sessionId?: string): boolean {
    return this.send({
      type: 'command',
      sessionId,
      data: { command, parameters }
    })
  }

  /**
   * 调用工具
   */
  callTool(toolName: string, parameters: any, sessionId?: string): boolean {
    return this.send({
      type: 'tool-call',
      sessionId,
      data: { toolName, parameters }
    })
  }

  /**
   * 订阅事件
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  /**
   * 订阅状态变化
   */
  onStatusChange(callback: (status: OpenClawStatus) => void): () => void {
    this.statusListeners.add(callback)
    return () => {
      this.statusListeners.delete(callback)
    }
  }

  /**
   * 获取当前状态
   */
  getStatus(): OpenClawStatus {
    return { ...this.status }
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<OpenClawConfig>): void {
    this.config = { ...this.config, ...config }
  }

  // Private methods

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('[OpenClaw] Max reconnect attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.config.reconnectInterval * this.reconnectAttempts
    console.log(`[OpenClaw] Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`)

    setTimeout(() => {
      this.connect()
    }, delay)
  }

  private updateStatus(updates: Partial<OpenClawStatus>): void {
    this.status = { ...this.status, ...updates }
    this.statusListeners.forEach(callback => {
      try {
        callback({ ...this.status })
      } catch (error) {
        console.error('[OpenClaw] Status listener error:', error)
      }
    })
  }

  private emit(event: string, data: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[OpenClaw] Listener error for ${event}:`, error)
        }
      })
    }
  }
}

// 创建单例
let openclawService: OpenClawService | null = null

export function getOpenClawService(config?: Partial<OpenClawConfig>): OpenClawService {
  if (!openclawService) {
    openclawService = new OpenClawService(config)
  }
  return openclawService
}

export default OpenClawService
