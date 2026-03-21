import { useState, useEffect } from 'react'
import { 
  Shield, 
  Server, 
  Wifi, 
  WifiOff,
  RotateCw,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Settings,
  Power
} from 'lucide-react'

type GuardianStatus = 'online' | 'offline' | 'restarting' | 'checking' | 'error'

interface GuardianLog {
  id: string
  message: string
  timestamp: Date
  type: 'info' | 'success' | 'warning' | 'error'
}

interface ServiceStatus {
  name: string
  status: 'online' | 'offline' | 'unknown'
  lastCheck: Date
  responseTime?: number
}

const initialServices: ServiceStatus[] = [
  {
    name: 'OpenClaw Gateway',
    status: 'online',
    lastCheck: new Date(),
    responseTime: 45
  },
  {
    name: 'WebSocket Server',
    status: 'online',
    lastCheck: new Date(),
    responseTime: 32
  },
  {
    name: 'API Server',
    status: 'online',
    lastCheck: new Date(),
    responseTime: 28
  },
  {
    name: 'Memory Store',
    status: 'online',
    lastCheck: new Date(),
    responseTime: 15
  }
]

const initialLogs: GuardianLog[] = [
  {
    id: 'log-001',
    message: '守护者启动成功',
    timestamp: new Date(Date.now() - 60000),
    type: 'success'
  },
  {
    id: 'log-002',
    message: '所有服务运行正常',
    timestamp: new Date(Date.now() - 30000),
    type: 'info'
  },
  {
    id: 'log-003',
    message: '检测到OpenClaw Gateway响应变慢',
    timestamp: new Date(Date.now() - 15000),
    type: 'warning'
  }
]

const statusConfig = {
  online: { label: '在线', color: 'text-green-600', bg: 'bg-green-100', dot: 'bg-green-500' },
  offline: { label: '离线', color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-500' },
  restarting: { label: '重启中', color: 'text-orange-600', bg: 'bg-orange-100', dot: 'bg-orange-500' },
  checking: { label: '检查中', color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-500' },
  error: { label: '错误', color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-500' }
}

const logTypeConfig = {
  info: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Activity },
  success: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2 },
  warning: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Activity },
  error: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle }
}

export default function Guardian() {
  const [guardianStatus, setGuardianStatus] = useState<GuardianStatus>('online')
  const [services, setServices] = useState<ServiceStatus[]>(initialServices)
  const [logs, setLogs] = useState<GuardianLog[]>(initialLogs)
  const [autoMode, setAutoMode] = useState(true)
  const [checkInterval, setCheckInterval] = useState(30)

  // 模拟守护进程检查
  useEffect(() => {
    if (!autoMode) return

    const interval = setInterval(() => {
      setServices(prev => prev.map(service => {
        // 模拟随机检查
        if (Math.random() > 0.9) {
          // 模拟服务离线
          if (service.status === 'online') {
            addLog(`检测到 ${service.name} 离线，正在自动重启...`, 'warning')
            
            setTimeout(() => {
              setServices(p => p.map(s => 
                s.name === service.name 
                  ? { ...s, status: 'online', lastCheck: new Date(), responseTime: Math.floor(Math.random() * 50) + 20 }
                  : s
              ))
              addLog(`${service.name} 已成功重启！`, 'success')
            }, 3000)
            
            return { ...service, status: 'offline', lastCheck: new Date() }
          }
        }
        
        return {
          ...service,
          lastCheck: new Date(),
          responseTime: Math.floor(Math.random() * 50) + 20
        }
      }))
    }, checkInterval * 1000)

    return () => clearInterval(interval)
  }, [autoMode, checkInterval])

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    setLogs(prev => [{
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      type
    }, ...prev.slice(0, 49)])
  }

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return '刚刚'
    if (seconds < 3600) return Math.floor(seconds / 60) + '分钟前'
    return Math.floor(seconds / 3600) + '小时前'
  }

  const restartService = (serviceName: string) => {
    addLog(`正在手动重启 ${serviceName}...`, 'info')
    
    setServices(prev => prev.map(service => 
      service.name === serviceName 
        ? { ...service, status: 'offline' as const, lastCheck: new Date() }
        : service
    ))
    
    setTimeout(() => {
      setServices(prev => prev.map(service => 
        service.name === serviceName 
          ? { ...service, status: 'online' as const, lastCheck: new Date(), responseTime: Math.floor(Math.random() * 50) + 20 }
          : service
      ))
      addLog(`${serviceName} 已成功重启！`, 'success')
    }, 2000)
  }

  const restartAll = () => {
    addLog('正在重启所有服务...', 'warning')
    
    setServices(prev => prev.map(service => ({ ...service, status: 'offline' as const, lastCheck: new Date() })))
    
    setTimeout(() => {
      setServices(prev => prev.map(service => ({ 
        ...service, 
        status: 'online' as const, 
        lastCheck: new Date(), 
        responseTime: Math.floor(Math.random() * 50) + 20 
      })))
      addLog('所有服务已成功重启！', 'success')
    }, 3000)
  }

  const onlineServices = services.filter(s => s.status === 'online').length
  const offlineServices = services.filter(s => s.status === 'offline').length
  const avgResponseTime = Math.round(services.filter(s => s.responseTime).reduce((sum, s) => sum + (s.responseTime || 0), 0) / services.filter(s => s.responseTime).length)

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8" />
              <h1 className="text-4xl font-bold">OpenClaw 守护者</h1>
            </div>
            <p className="text-green-100 text-lg">守护OpenClaw，确保永远在线！</p>
          </div>
          
          {/* Status and Controls */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{onlineServices}/{services.length}</div>
              <div className="text-green-200 text-sm">服务在线</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{avgResponseTime}ms</div>
              <div className="text-green-200 text-sm">平均响应</div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <span className="font-medium">自动守护</span>
              <button
                onClick={() => setAutoMode(!autoMode)}
                className={`w-12 h-6 rounded-full transition-all ${
                  autoMode ? 'bg-green-500' : 'bg-slate-400'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                  autoMode ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            控制面板
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">检查间隔：</span>
              <select
                value={checkInterval}
                onChange={(e) => setCheckInterval(parseInt(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10秒</option>
                <option value={30}>30秒</option>
                <option value={60}>1分钟</option>
                <option value={300}>5分钟</option>
              </select>
            </div>
            <button
              onClick={restartAll}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <RotateCw className="h-4 w-4" />
              重启所有
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Services Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 p-6 bg-slate-50">
              <h3 className="font-bold text-xl flex items-center gap-3 text-slate-800">
                <Server className="h-5 w-5" />
                服务状态
              </h3>
            </div>
            <div className="p-6 grid gap-4">
              {services.map((service, idx) => {
                const config = statusConfig[service.status]
                
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${config.dot}`} />
                        <h4 className="font-semibold text-lg text-slate-800">{service.name}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                        {service.status === 'offline' && (
                          <button
                            onClick={() => restartService(service.name)}
                            className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1.5"
                          >
                            <Power className="h-3.5 w-3.5" />
                            重启
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        最后检查：{formatTimeAgo(service.lastCheck)}
                      </div>
                      {service.responseTime && (
                        <div className="flex items-center gap-1">
                          <Activity className="h-3.5 w-3.5" />
                          响应时间：{service.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 p-6 bg-slate-50">
              <h3 className="font-bold text-xl flex items-center gap-3 text-slate-800">
                <Activity className="h-5 w-5" />
                守护日志
              </h3>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log) => {
                const config = logTypeConfig[log.type]
                const LogIcon = config.icon
                
                return (
                  <div
                    key={log.id}
                    className={`p-4 rounded-lg border ${config.bg} ${config.border}`}
                  >
                    <div className="flex items-start gap-3">
                      <LogIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className={`font-medium ${config.color}`}>守护者</span>
                          <span className="text-xs text-slate-500">{formatTimeAgo(log.timestamp)}</span>
                        </div>
                        <p className="text-sm text-slate-700">{log.message}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Guardian Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          守护者状态
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig[guardianStatus].bg}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${statusConfig[guardianStatus].dot}`} />
              <span className={`font-medium ${statusConfig[guardianStatus].color}`}>
                守护者 {statusConfig[guardianStatus].label}
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{onlineServices}</div>
            <div className="text-sm text-slate-600">服务在线</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-700">{checkInterval}秒</div>
            <div className="text-sm text-slate-600">检查间隔</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{autoMode ? '开' : '关'}</div>
            <div className="text-sm text-slate-600">自动守护</div>
          </div>
        </div>
      </div>
    </div>
  )
}
