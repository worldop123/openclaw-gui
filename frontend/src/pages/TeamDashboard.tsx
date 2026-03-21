import { useEffect, useState } from 'react'
import { 
  Users, 
  PlayCircle,
  CheckCircle2,
  Zap,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useOpenClaw } from '../hooks/useOpenClaw'

// 员工类型定义
type EmployeeStatus = 'working' | 'idle' | 'busy' | 'away'

interface Employee {
  id: string
  name: string
  role: string
  status: EmployeeStatus
  avatar: string
  avatarColor: string
  currentTask: string | null
  taskProgress: number
  lastActive: Date
  skills: string[]
  tasksCompleted: number
  isAgent: boolean
}

interface ActivityItem {
  id: string
  employeeId: string
  employeeName: string
  action: string
  details: string
  timestamp: Date
  status: 'success' | 'info'
}

// 模拟员工数据
const initialEmployees: Employee[] = [
  {
    id: 'emp-001',
    name: '小明',
    role: '经理',
    status: 'working',
    avatar: '👨‍💼',
    avatarColor: 'from-blue-400 to-cyan-500',
    currentTask: '协调团队工作',
    taskProgress: 65,
    lastActive: new Date(),
    skills: ['管理', '协调', '决策'],
    tasksCompleted: 128,
    isAgent: false
  },
  {
    id: 'emp-002',
    name: '代码小助手',
    role: '开发',
    status: 'busy',
    avatar: '🤖',
    avatarColor: 'from-purple-400 to-pink-500',
    currentTask: '编写React组件',
    taskProgress: 82,
    lastActive: new Date(Date.now() - 30000),
    skills: ['React', 'TypeScript', 'Node.js'],
    tasksCompleted: 256,
    isAgent: true
  },
  {
    id: 'emp-003',
    name: '飞书小管家',
    role: '专家',
    status: 'working',
    avatar: '📅',
    avatarColor: 'from-indigo-400 to-violet-500',
    currentTask: '同步日历日程',
    taskProgress: 45,
    lastActive: new Date(Date.now() - 60000),
    skills: ['日历', '任务', '文档'],
    tasksCompleted: 89,
    isAgent: true
  },
  {
    id: 'emp-004',
    name: '记忆管理员',
    role: '分析师',
    status: 'idle',
    avatar: '🧠',
    avatarColor: 'from-green-400 to-emerald-500',
    currentTask: null,
    taskProgress: 0,
    lastActive: new Date(Date.now() - 120000),
    skills: ['记忆存储', '信息检索'],
    tasksCompleted: 67,
    isAgent: true
  }
]

// 模拟活动数据
const initialActivities: ActivityItem[] = [
  {
    id: 'act-001',
    employeeId: 'emp-002',
    employeeName: '代码小助手',
    action: '完成了任务',
    details: '创建了Dashboard组件',
    timestamp: new Date(Date.now() - 10000),
    status: 'success'
  },
  {
    id: 'act-002',
    employeeId: 'emp-003',
    employeeName: '飞书小管家',
    action: '调用工具',
    details: '获取今日日程',
    timestamp: new Date(Date.now() - 25000),
    status: 'info'
  }
]

// 状态颜色映射
const statusColors: Record<EmployeeStatus, string> = {
  working: 'bg-green-500',
  idle: 'bg-yellow-500',
  busy: 'bg-red-500',
  away: 'bg-gray-400'
}

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return '刚刚'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前'
  return `${Math.floor(seconds / 3600)}小时前'
}

export default function TeamDashboard() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [activities] = useState<ActivityItem[]>(initialActivities)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  
  // 使用 OpenClaw 连接
  const { 
    status: openclawStatus,
    connect,
    disconnect,
    sendCommand,
    callTool,
    isConnected,
    isConnecting
  } = useOpenClaw({
    gatewayUrl: 'ws://localhost:18789',
    autoReconnect: true
  })

  // 模拟实时更新
  useEffect(() => {
    const interval = setInterval(() => {
      setEmployees(prev => prev.map(emp => {
        if (Math.random() > 0.7) {
          const newProgress = Math.min(100, emp.taskProgress + Math.random() * 10)
          const newStatus = newProgress >= 100 ? 'idle' : emp.status
          return {
            ...emp,
            taskProgress: newProgress,
            status: newStatus,
            currentTask: newProgress >= 100 ? null : emp.currentTask,
            lastActive: new Date()
          }
        }
        return emp
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'working' || e.status === 'busy').length,
    tasksInProgress: employees.filter(e => e.currentTask).length,
    totalTasksCompleted: employees.reduce((sum, e) => sum + e.tasksCompleted, 0)
  }

  // 处理连接按钮
  const handleConnect = () => {
    if (isConnected) {
      disconnect()
    } else {
      connect()
    }
  }

  // 测试发送命令
  const handleTestCommand = () => {
    sendCommand('openclaw gateway status', {}, 'main')
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">👥 OpenClaw 团队</h1>
            <p className="text-blue-100 text-lg">查看你的AI团队成员正在做什么，实时监控工作进度！</p>
          </div>
          
          {/* OpenClaw 连接状态 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm">
              {isConnected ? (
                <Wifi className="h-5 w-5" />
              ) : (
                <WifiOff className="h-5 w-5" />
              )}
              <span className="font-medium">
                {isConnecting ? '连接中...' : isConnected ? '已连接' : '未连接'}
              </span>
            </div>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm font-medium transition-colors disabled:opacity-50"
            >
              {isConnected ? '断开' : '连接'}
            </button>
            {isConnected && (
              <button
                onClick={handleTestCommand}
                className="px-4 py-2 rounded-lg bg-yellow-500/30 hover:bg-yellow-500/40 backdrop-blur-sm font-medium transition-colors"
              >
                测试命令
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">团队成员</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <PlayCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">活跃中</p>
              <p className="text-2xl font-bold text-slate-800">{stats.activeEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">进行中</p>
              <p className="text-2xl font-bold text-slate-800">{stats.tasksInProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已完成</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalTasksCompleted}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Team Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 p-6 bg-slate-50">
              <h3 className="font-bold text-xl flex items-center gap-3 text-slate-800">
                <Users className="h-5 w-5" />
                团队成员
              </h3>
            </div>
            <div className="p-6 grid gap-6 md:grid-cols-2">
              {employees.map(emp => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedEmployee?.id === emp.id 
                      ? 'border-blue-500 shadow-xl' 
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                  }`}
                >
                  {/* Employee Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br ${emp.avatarColor}`}>
                          {emp.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusColors[emp.status]}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg text-slate-800">{emp.name}</h4>
                          {emp.isAgent && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 text-white">AI</span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">{emp.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Current Task */}
                  {emp.currentTask && (
                    <div className="mb-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-sm font-semibold text-slate-700 mb-2">{emp.currentTask}</div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${emp.avatarColor}`}
                          style={{ width: `${emp.taskProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>{emp.taskProgress.toFixed(0)}%</span>
                        <span>{formatTimeAgo(emp.lastActive)}</span>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {emp.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{emp.tasksCompleted} 任务</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 p-6 bg-slate-50">
              <h3 className="font-bold text-xl flex items-center gap-3 text-slate-800">
                <Activity className="h-5 w-5" />
                实时动态
              </h3>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {activities.map(activity => (
                <div key={activity.id} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-green-500/20' : 'bg-blue-500/20'
                  }`}>
                    {activity.status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-sm">{activity.employeeName}</span>
                      <span className="text-xs text-slate-400">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-slate-500 truncate">{activity.details}</p>
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
