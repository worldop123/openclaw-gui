import { useState, useEffect, useCallback, useRef } from 'react'
import { getOpenClawService, OpenClawStatus, OpenClawConfig } from '../services/openclaw'

export function useOpenClaw(config?: Partial<OpenClawConfig>) {
  const [status, setStatus] = useState<OpenClawStatus>({
    connected: false,
    connecting: false
  })
  const [messages, setMessages] = useState<any[]>([])
  const serviceRef = useRef(getOpenClawService(config))

  // 初始化
  useEffect(() => {
    const service = serviceRef.current

    // 订阅状态变化
    const unsubscribeStatus = service.onStatusChange((newStatus) => {
      setStatus(newStatus)
    })

    // 订阅消息
    const unsubscribeConnected = service.on('connected', () => {
      console.log('[useOpenClaw] Connected!')
    })

    const unsubscribeDisconnected = service.on('disconnected', (data) => {
      console.log('[useOpenClaw] Disconnected:', data)
    })

    const unsubscribeMessage = service.on('message', (data) => {
      setMessages(prev => [...prev, { type: 'message', data, timestamp: Date.now() }])
    })

    const unsubscribeError = service.on('error', (data) => {
      setMessages(prev => [...prev, { type: 'error', data, timestamp: Date.now() }])
    })

    return () => {
      unsubscribeStatus()
      unsubscribeConnected()
      unsubscribeDisconnected()
      unsubscribeMessage()
      unsubscribeError()
    }
  }, [])

  // 连接
  const connect = useCallback(() => {
    serviceRef.current.connect()
  }, [])

  // 断开连接
  const disconnect = useCallback(() => {
    serviceRef.current.disconnect()
  }, [])

  // 发送消息
  const send = useCallback((type: string, data?: any) => {
    return serviceRef.current.send({ type, data })
  }, [])

  // 发送命令
  const sendCommand = useCallback((command: string, parameters?: any, sessionId?: string) => {
    return serviceRef.current.sendCommand(command, parameters, sessionId)
  }, [])

  // 调用工具
  const callTool = useCallback((toolName: string, parameters: any, sessionId?: string) => {
    return serviceRef.current.callTool(toolName, parameters, sessionId)
  }, [])

  return {
    status,
    messages,
    connect,
    disconnect,
    send,
    sendCommand,
    callTool,
    isConnected: status.connected,
    isConnecting: status.connecting
  }
}

export default useOpenClaw
