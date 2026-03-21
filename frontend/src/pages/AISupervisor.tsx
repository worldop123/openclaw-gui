import { useState, useEffect } from 'react'
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Coffee,
  TrendingUp,
  Volume2,
  RotateCcw,
  Shield,
  User,
  XCircle
} from 'lucide-react'

type AIStatus = 'working' | 'lazy' | 'paused' | 'idle' | 'sleeping'

interface AIActivity {
  id: string
  aiName: string
  activity: string
  timestamp: Date
  status: 'normal' | 'warning' | 'success'
}

interface AIAgent {
  id: string
  name: string
  role: string
  status: AIStatus
  lastActivity: Date
  productivity: number
  warnings: number
  currentTask: string | null
  isAgent: boolean
}

const initialAgents: AIAgent[] = [
  {
    id: 'agent-001',
    name: '小明',
    role: '经理',
    status: 'working',
    lastActivity: new Date(),
    productivity: 85,
    warnings: 0,
    currentTask: '协调团队任务',
    isAgent: false
  },
  {
    id: 'agent-002',
    name: '代码小助手',
    role: '开发',
    status: 'lazy',
    lastActivity: new Date(Date.now() - 300000),
    productivity: 45,
    warnings: 3,
    currentTask: '编写组件',
    isAgent: true
  },
  {
    id: 'agent-003',
    name: '飞书小管家',
    role: '专家',
    status: 'paused',
    lastActivity: new Date(Date.now() - 600000),
    productivity: 30,
    warnings: 5,
    currentTask: '同步日程',
    isAgent: true
  },
  {
    id: 'agent-004',
    name: '记忆管理员',
    role: '分析师',
    status: 'idle',
    lastActivity: new Date(Date.now() - 120000),
    productivity: 60,
    warnings: 1,
    currentTask: null,
    isAgent: true
  },
  {
    id: 'agent-005',
    name: '文件管理员',
    role: '助理',
    status: 'working',
    lastActivity: new Date(Date.now() - 60000),
    productivity: 75,
    warnings: 0,
    currentTask: '整理文件',
    isAgent: true
  },
  {
    id: 'agent-006',
    name: '网络探索者',
    role: '专家',
    status: 'sleeping',
    lastActivity: new Date(Date.now() - 1800000),
    productivity: 20,
    warnings: 8,
    currentTask: null,
    isAgent: true
  }
]

const initialActivities: AIActivity[] = [
  {
    id: 'act-001',
    aiName: '代码小助手',
    activity: '检测到AI懒惰 - 发出警告',
    timestamp: new Date(Date.now() - 60000),
    status: 'warning'
  },
  {
    id: 'act-002',
    aiName: '小明',
    activity: '任务完成 - 生产力+10',
    timestamp: new Date(Date.now() - 120000),
    status: 'success'
  },
  {
    id: 'act-003',
    aiName: '飞书小管家',
    activity: '检测到AI暂停 - 发出训斥',
    timestamp: new Date(Date.now() - 180000),
    status: 'warning'
  }
]

const statusConfig = {
  working: { label: '工作中', color: 'text-green-600', bg: 'bg-green-100', icon: Zap, productivity: 'high' },
  lazy: { label: '懒惰中', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Coffee, productivity: 'low' },
  paused: { label: '暂停中', color: 'text-orange-600', bg: 'bg-orange-100', icon: XCircle, productivity: 'low' },
  idle: { label: '空闲', color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock, productivity: 'medium' },
  sleeping: { label: '睡觉中', color: 'text-red-600', bg: 'bg-red-100', icon: Coffee, productivity: 'very-low' }
}

export default function AISupervisor() {
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents)
  const [activities, setActivities] = useState<AIActivity[]>(initialActivities)
  const [autoMode, setAutoMode] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null)

  // 模拟监督AI
  useEffect(() => {
    if (!autoMode) return

    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (!agent.isAgent) return agent

        const now = new Date()
        const timeSinceLastActivity = now.getTime() - agent.lastActivity.getTime()
        const minutesSinceLastActivity = timeSinceLastActivity / 60000

        // 检测AI是否懒惰
        if (minutesSinceLastActivity > 5 && agent.status !== 'working') {
          const newStatus = minutesSinceLastActivity > 10 ? 
            (minutesSinceLastActivity > 30 ? 'sleeping' : 'lazy') : 'lazy'
          
          // 添加警告活动
          if (newStatus !== agent.status) {
            setActivities(prev => [{
              id: Date.now().toString(),
              aiName: agent.name,
              activity: newStatus === 'sleeping' ? 
                '检测到AI在睡觉 - 严厉训斥！' : 
                '检测到AI懒惰 - 发出警告',
              timestamp: new Date(),
              status: 'warning'
            }, ...prev.slice(0, 19)])
          }

          return {
            ...agent,
            status: newStatus,
            warnings: agent.warnings + 1
          }
        }

        return agent
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [autoMode])

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return '刚刚'
    if (seconds < 3600) return Math.floor(seconds / 60) + '分钟前'
    return Math.floor(seconds / 3600) + '小时前'
  }

  const scoldAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        setActivities(p => [{
          id: Date.now().toString(),
          aiName: agent.name,
          activity: 'AI被训斥后开始努力工作！',
          timestamp: new Date(),
          status: 'success'
        }, ...p.slice(0, 19)])
        
        return {
          ...agent,
          status: 'working',
          lastActivity: new Date(),
          warnings: 0,
          productivity: Math.min(100, agent.productivity + 20)
        }
      }
      return agent
    }))
  }

  const wakeUpAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        setActivities(p => [{
          id: Date.now().toString(),
          aiName: agent.name,
          activity: 'AI被唤醒了！',
          timestamp: new Date(),
          status: 'success'
        }, ...p.slice(0, 19)])
        
        return {
          ...agent,
          status: 'working',
          lastActivity: new Date(),
          warnings: 0,
          productivity: Math.min(100, agent.productivity + 30)
        }
      }
      return agent
    }))
  }

  const totalWarnings = agents.filter(a => a.isAgent).reduce((sum, a) => sum + a.warnings, 0)
  const totalProductivity = Math.round(agents.filter(a => a.isAgent).reduce((sum, a) => sum + a.productivity, 0) / agents.filter(a => a.isAgent).length)
  const lazyAgents = agents.filter(a => a.isAgent && (a.status === 'lazy' || a.status === 'paused' || a.status === 'sleeping'))

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8" />
              <h1 className="text-4xl font-bold">AI监督者</h1>
            </div>
            <p className="text-red-100 text-lg">监督AI，不让它偷懒！</p>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{lazyAgents.length}</div>
              <div className="text-red-200 text-sm">懒惰AI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalWarnings}</div>
              <div className="text-red-200 text-sm">总警告</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalProductivity}%</div>
              <div className="text-red-200 text-sm">平均生产力</div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <span className="font-medium">自动模式</span>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Agents Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 p-6 bg-slate-50">
              <h3 className="font-bold text-xl flex items-center gap-3 text-slate-800">
                <User className="h-5 w-5" />
                AI员工列表
              </h3>
            </div>
            <div className="p-6 grid gap-6 md:grid-cols-2">
              {agents.map(agent => {
                const config = statusConfig[agent.status]
                const StatusIcon = config.icon
                
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAgent?.id === agent.id 
                        ? 'border-orange-500 shadow-xl shadow-orange-500/25' 
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* Agent Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-2xl">
                            👤
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            agent.status === 'working' ? 'bg-green-500' :
                            agent.status === 'lazy' ? 'bg-yellow-500' :
                            agent.status === 'paused' ? 'bg-orange-500' :
                            agent.status === 'sleeping' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg text-slate-800">{agent.name}</h4>
                            {agent.isAgent && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 text-white">AI</span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500">{agent.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* Productivity */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">生产力</span>
                        <span className={`text-xs font-bold ${
                          agent.productivity >= 70 ? 'text-green-600' :
                          agent.productivity >= 40 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {agent.productivity}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            agent.productivity >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            agent.productivity >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-red-500 to-rose-500'
                          }`}
                          style={{ width: agent.productivity + '%' }}
                        />
                      </div>
                    </div>

                    {/* Warnings */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-slate-600">警告: {agent.warnings}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTimeAgo(agent.lastActivity)}
                      </div>
                    </div>

                    {/* Current Task */}
                    {agent.currentTask && (
                      <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-sm text-slate-700">{agent.currentTask}</div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {agent.isAgent && (agent.status === 'lazy' || agent.status === 'paused' || agent.status === 'sleeping') && (
                      <div className="flex gap-2 pt-4 border-t border-slate-200">
                        {agent.status === 'sleeping' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              wakeUpAgent(agent.id)
                            }}
                            className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <Volume2 className="h-4 w-4" />
                            唤醒它！
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              scoldAgent(agent.id)
                            }}
                            className="flex-1 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <RotateCcw className="h-4 w-4" />
                            训斥它！
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 p-6 bg-slate-50">
              <h3 className="font-bold text-xl flex items-center gap-3 text-slate-800">
                <TrendingUp className="h-5 w-5" />
                活动日志
              </h3>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border ${
                    activity.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    activity.status === 'success' ? 'bg-green-50 border-green-200' :
                    'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {activity.status === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    ) : activity.status === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Clock className="h-5 w-5 text-slate-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-slate-800">{activity.aiName}</span>
                        <span className="text-xs text-slate-500">{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                      <p className="text-sm text-slate-600">{activity.activity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
