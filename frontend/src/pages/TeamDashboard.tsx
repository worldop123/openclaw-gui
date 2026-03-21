import React, { useEffect, useState } from 'react'
import { 
  Users, 
  User, 
  Bot, 
  Cpu, 
  Zap, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Coffee,
  Briefcase,
  Brain,
  Calendar,
  FileText,
  Terminal,
  Database,
  Globe,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Plus,
  MoreVertical,
  Rocket,
  Sparkles,
  Star,
  Heart,
  TrendingUp,
  ChevronRight,
  Activity
} from 'lucide-react'
import { cn } from '../lib/utils'

// 员工类型定义
type EmployeeRole = 'manager' | 'developer' | 'designer' | 'analyst' | 'assistant' | 'specialist'
type EmployeeStatus = 'working' | 'idle' | 'busy' | 'away' | 'offline'

interface Employee {
  id: string
  name: string
  role: EmployeeRole
  status: EmployeeStatus
  avatar: string
  avatarColor: string
  currentTask: string | null
  taskProgress: number
  lastActive: Date
  skills: string[]
  tasksCompleted: number
  isAgent: boolean
  sessionId?: string
  mood: 'happy' | 'focused' | 'neutral' | 'tired'
}

interface Activity {
  id: string
  employeeId: string
  employeeName: string
  action: string
  details: string
  timestamp: Date
  type: 'task' | 'message' | 'tool' | 'system'
  status: 'success' | 'warning' | 'info' | 'error'
}

// 模拟员工数据
const initialEmployees: Employee[] = [
  {
    id: 'emp-001',
    name: '小明',
    role: 'manager',
    status: 'working',
    avatar: '👨‍💼',
    avatarColor: 'from-blue-400 to-cyan-500',
    currentTask: '协调团队工作',
    taskProgress: 65,
    lastActive: new Date(),
    skills: ['管理', '协调', '决策'],
    tasksCompleted: 128,
    isAgent: false,
    sessionId: 'main',
    mood: 'happy'
  },
  {
    id: 'emp-002',
    name: '代码小助手',
    role: 'developer',
    status: 'busy',
    avatar: '🤖',
    avatarColor: 'from-purple-400 to-pink-500',
    currentTask: '编写React组件',
    taskProgress: 82,
    lastActive: new Date(Date.now() - 30000),
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    tasksCompleted: 256,
    isAgent: true,
    sessionId: 'agent-code',
    mood: 'focused'
  },
  {
    id: 'emp-003',
    name: '飞书小管家',
    role: 'specialist',
    status: 'working',
    avatar: '📅',
    avatarColor: 'from-indigo-400 to-violet-500',
    currentTask: '同步日历日程',
    taskProgress: 45,
    lastActive: new Date(Date.now() - 60000),
    skills: ['日历', '任务', '文档'],
    tasksCompleted: 89,
    isAgent: true,
    sessionId: 'agent-feishu',
    mood: 'happy'
  },
  {
    id: 'emp-004',
    name: '记忆管理员',
    role: 'analyst',
    status: 'idle',
    avatar: '🧠',
    avatarColor: 'from-green-400 to-emerald-500',
    currentTask: null,
    taskProgress: 0,
    lastActive: new Date(Date.now() - 120000),
    skills: ['记忆存储', '信息检索', '数据分析'],
    tasksCompleted: 67,
    isAgent: true,
    sessionId: 'agent-memory',
    mood: 'neutral'
  },
  {
    id: 'emp-005',
    name: '文件管理员',
    role: 'assistant',
    status: 'working',
    avatar: '📁',
    avatarColor: 'from-yellow-400 to-orange-500',
    currentTask: '整理工作目录',
    taskProgress: 30,
    lastActive: new Date(Date.now() - 45000),
    skills: ['文件操作', '目录管理', '备份'],
    tasksCompleted: 145,
    isAgent: true,
    sessionId: 'agent-file',
    mood: 'focused'
  },
  {
    id: 'emp-006',
    name: '网络探索者',
    role: 'specialist',
    status: 'away',
    avatar: '🌐',
    avatarColor: 'from-cyan-400 to-blue-500',
    currentTask: null,
    taskProgress: 0,
    lastActive: new Date(Date.now() - 300000),
    skills: ['网络搜索', '信息收集', '数据抓取'],
    tasksCompleted: 52,
    isAgent: true,
    sessionId: 'agent-web',
    mood: 'tired'
  }
]

// 模拟活动数据
const initialActivities: Activity[] = [
  {
    id: 'act-001',
    employeeId: 'emp-002',
    employeeName: '代码小助手',
    action: '✨ 完成了任务',
    details: '创建了漂亮的Dashboard组件',
    timestamp: new Date(Date.now() - 10000),
    type: 'task',
    status: 'success'
  },
  {
    id: 'act-002',
    employeeId: 'emp-003',
    employeeName: '飞书小管家',
    action: '⚡ 调用工具',
    details: 'feishu_calendar_event - 获取今日日程',
    timestamp: new Date(Date.now() - 25000),
    type: 'tool',
    status: 'info'
  },
  {
    id: 'act-003',
    employeeId: 'emp-005',
    employeeName: '文件管理员',
    action: '💻 执行命令',
    details: 'read - 读取项目配置文件',
    timestamp: new Date(Date.now() - 40000),
    type: 'system',
    status: 'success'
  },
  {
    id: 'act-004',
    employeeId: 'emp-004',
    employeeName: '记忆管理员',
    action: '🧠 存储记忆',
    details: '保存了项目架构信息',
    timestamp: new Date(Date.now() - 60000),
    type: 'task',
    status: 'info'
  },
  {
    id: 'act-005',
    employeeId: 'emp-001',
    employeeName: '小明',
    action: '💬 发送消息',
    details: '给团队发送了工作安排',
    timestamp: new Date(Date.now() - 90000),
    type: 'message',
    status: 'success'
  }
]

// 角色颜色映射
const roleColors: Record<EmployeeRole, string> = {
  manager: 'from-blue-400 to-cyan-500',
  developer: 'from-purple-400 to-pink-500',
  designer: 'from-pink-400 to-rose-500',
  analyst: 'from-green-400 to-emerald-500',
  assistant: 'from-yellow-400 to-orange-500',
  specialist: 'from-indigo-400 to-violet-500'
}

// 状态颜色映射
const statusColors: Record<EmployeeStatus, string> = {
  working: 'bg-green-500',
  idle: 'bg-yellow-500',
  busy: 'bg-red-500',
  away: 'bg-gray-400',
  offline: 'bg-gray-600'
}

// 状态文本映射
const statusTexts: Record<EmployeeStatus, string> = {
  working: '工作中',
  idle: '空闲',
  busy: '忙碌',
  away: '离开',
  offline: '离线'
}

// 心情表情
const moodEmojis: Record<Employee['mood'], string> = {
  happy: '😊',
  focused: '🎯',
  neutral: '😐',
  tired: '😴'
}

export default function TeamDashboard() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // 模拟实时更新
  useEffect(() => {
    const interval = setInterval(() => {
      setEmployees(prev => prev.map(emp => {
        // 随机更新一些状态
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

    // 随机添加活动
    const activityInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const randomEmp = employees[Math.floor(Math.random() * employees.length)]
        const actions = [
          { action: '⚡ 调用工具', type: 'tool' as const, status: 'info' as const },
          { action: '✨ 完成任务', type: 'task' as const, status: 'success' as const },
          { action: '💬 发送消息', type: 'message' as const, status: 'success' as const },
          { action: '💻 执行命令', type: 'system' as const, status: 'info' as const }
        ]
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        const details = [
          '读取了工作区文件',
          '更新了项目配置',
          '同步了数据状态',
          '处理了用户请求',
          '生成了代码片段',
          '整理了文档内容'
        ]

        const newActivity: Activity = {
          id: `act-${Date.now()}`,
          employeeId: randomEmp.id,
          employeeName: randomEmp.name,
          action: randomAction.action,
          details: details[Math.floor(Math.random() * details.length)],
          timestamp: new Date(),
          type: randomAction.type,
          status: randomAction.status
        }

        setActivities(prev => [newActivity, ...prev].slice(0, 20))
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      clearInterval(activityInterval)
    }
  }, [employees])

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return '刚刚'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`
    return `${Math.floor(seconds / 86400)}天前`
  }

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'working' || e.status === 'busy').length,
    tasksInProgress: employees.filter(e => e.currentTask).length,
    totalTasksCompleted: employees.reduce((sum, e) => sum + e.tasksCompleted, 0)
  }

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-8 w-8 text-yellow-300" />
                <h1 className="text-4xl font-bold tracking-tight">👥 OpenClaw 团队</h1>
              </div>
              <p className="text-blue-100 text-lg mt-2 max-w-2xl">
                查看你的AI团队成员正在做什么，实时监控工作进度！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar with glass effect */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">团队成员</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {stats.totalEmployees}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
              <PlayCircle className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">活跃中</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.activeEmployees}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">进行中</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {stats.tasksInProgress}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">已完成</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats.totalTasksCompleted}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Team Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl overflow-hidden">
            <div className="border-b border-slate-200/50 p-6 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl flex items-center gap-3 text-slate-800">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  团队成员
                </h3>
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 font-medium">
                  {stats.activeEmployees} 在线
                </span>
              </div>
            </div>
            <div className="p-6 grid gap-6 md:grid-cols-2">
              {employees.map(emp => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-300",
                    selectedEmployee?.id === emp.id 
                      ? "border-blue-500 shadow-2xl scale-[1.02]" 
                      : "border-slate-200/50 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 bg-white"
                  )}
                >
                  <div className="relative p-6">
                    {/* Employee Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br shadow-xl",
                            emp.avatarColor
                          )}>
                            {emp.avatar}
                          </div>
                          {/* Status indicator */}
                          <div className={cn(
                            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white shadow-lg",
                            statusColors[emp.status]
                          )} />
                          {/* Mood indicator */}
                          <div className="absolute -top-1 -right-1 text-lg">
                            {moodEmojis[emp.mood]}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg text-slate-800 truncate">{emp.name}</h4>
                            {emp.isAgent && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium">
                                AI
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500 capitalize">{emp.role}</div>
                        </div>
                      </div>
                    </div>

                    {/* Current Task */}
                    {emp.currentTask && (
                      <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200/50">
                        <div className="text-sm font-semibold text-slate-700 mb-2">{emp.currentTask}</div>
                        <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700",
                              `bg-gradient-to-r ${emp.avatarColor}`
                            )}
                            style={{ width: `${emp.taskProgress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                          <span className="font-semibold">{emp.taskProgress.toFixed(0)}%</span>
                          <span>{formatTimeAgo(emp.lastActive)}</span>
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {emp.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs rounded-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-medium border border-slate-200/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{emp.tasksCompleted} 任务</span>
                      </div>
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
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl overflow-hidden">
            <div className="border-b border-slate-200/50 p-6 bg-gradient-to-r from-slate-50 to-white">
              <h3 className="font-bold text-xl flex items-center gap-3 text-slate-800">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                实时动态
              </h3>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {activities.map(activity => (
                <div key={activity.id} className="flex gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    activity.status === 'success' ? 'bg-green-500/20' :
                    activity.status === 'warning' ? 'bg-yellow-500/20' :
                    activity.status === 'error' ? 'bg-red-500/20' :
                    'bg-blue-500/20'
                  )}>
                    {activity.type === 'task' && <CheckCircle2 className="h-4 w-4" />}
                    {activity.type === 'message' && <MessageSquare className="h-4 w-4" />}
                    {activity.type === 'tool' && <Zap className="h-4 w-4" />}
                    {activity.type === 'system' && <Cpu className="h-4 w-4" />}
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
