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
  MoreVertical
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
  currentTask: string | null
  taskProgress: number
  lastActive: Date
  skills: string[]
  tasksCompleted: number
  isAgent: boolean
  sessionId?: string
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
    currentTask: '协调团队工作',
    taskProgress: 65,
    lastActive: new Date(),
    skills: ['管理', '协调', '决策'],
    tasksCompleted: 128,
    isAgent: false,
    sessionId: 'main'
  },
  {
    id: 'emp-002',
    name: '代码小助手',
    role: 'developer',
    status: 'busy',
    avatar: '🤖',
    currentTask: '编写React组件',
    taskProgress: 82,
    lastActive: new Date(Date.now() - 30000),
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    tasksCompleted: 256,
    isAgent: true,
    sessionId: 'agent-code'
  },
  {
    id: 'emp-003',
    name: '飞书小管家',
    role: 'specialist',
    status: 'working',
    avatar: '📅',
    currentTask: '同步日历日程',
    taskProgress: 45,
    lastActive: new Date(Date.now() - 60000),
    skills: ['日历', '任务', '文档', '会议'],
    tasksCompleted: 89,
    isAgent: true,
    sessionId: 'agent-feishu'
  },
  {
    id: 'emp-004',
    name: '记忆管理员',
    role: 'analyst',
    status: 'idle',
    avatar: '🧠',
    currentTask: null,
    taskProgress: 0,
    lastActive: new Date(Date.now() - 120000),
    skills: ['记忆存储', '信息检索', '数据分析'],
    tasksCompleted: 67,
    isAgent: true,
    sessionId: 'agent-memory'
  },
  {
    id: 'emp-005',
    name: '文件管理员',
    role: 'assistant',
    status: 'working',
    avatar: '📁',
    currentTask: '整理工作目录',
    taskProgress: 30,
    lastActive: new Date(Date.now() - 45000),
    skills: ['文件操作', '目录管理', '备份'],
    tasksCompleted: 145,
    isAgent: true,
    sessionId: 'agent-file'
  },
  {
    id: 'emp-006',
    name: '网络探索者',
    role: 'specialist',
    status: 'away',
    avatar: '🌐',
    currentTask: null,
    taskProgress: 0,
    lastActive: new Date(Date.now() - 300000),
    skills: ['网络搜索', '信息收集', '数据抓取'],
    tasksCompleted: 52,
    isAgent: true,
    sessionId: 'agent-web'
  }
]

// 模拟活动数据
const initialActivities: Activity[] = [
  {
    id: 'act-001',
    employeeId: 'emp-002',
    employeeName: '代码小助手',
    action: '完成了任务',
    details: '创建了Dashboard组件',
    timestamp: new Date(Date.now() - 10000),
    type: 'task',
    status: 'success'
  },
  {
    id: 'act-002',
    employeeId: 'emp-003',
    employeeName: '飞书小管家',
    action: '调用工具',
    details: 'feishu_calendar_event - 获取今日日程',
    timestamp: new Date(Date.now() - 25000),
    type: 'tool',
    status: 'info'
  },
  {
    id: 'act-003',
    employeeId: 'emp-005',
    employeeName: '文件管理员',
    action: '执行命令',
    details: 'read - 读取项目配置文件',
    timestamp: new Date(Date.now() - 40000),
    type: 'system',
    status: 'success'
  },
  {
    id: 'act-004',
    employeeId: 'emp-004',
    employeeName: '记忆管理员',
    action: '存储记忆',
    details: '保存了项目架构信息',
    timestamp: new Date(Date.now() - 60000),
    type: 'task',
    status: 'info'
  },
  {
    id: 'act-005',
    employeeId: 'emp-001',
    employeeName: '小明',
    action: '发送消息',
    details: '给团队发送了工作安排',
    timestamp: new Date(Date.now() - 90000),
    type: 'message',
    status: 'success'
  }
]

// 角色颜色映射
const roleColors: Record<EmployeeRole, string> = {
  manager: 'from-blue-500 to-cyan-500',
  developer: 'from-purple-500 to-pink-500',
  designer: 'from-pink-500 to-rose-500',
  analyst: 'from-green-500 to-emerald-500',
  assistant: 'from-yellow-500 to-orange-500',
  specialist: 'from-indigo-500 to-violet-500'
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

// 角色图标映射
const roleIcons: Record<EmployeeRole, React.ReactNode> = {
  manager: <Briefcase className="h-4 w-4" />,
  developer: <Terminal className="h-4 w-4" />,
  designer: <FileText className="h-4 w-4" />,
  analyst: <Brain className="h-4 w-4" />,
  assistant: <Users className="h-4 w-4" />,
  specialist: <Zap className="h-4 w-4" />
}

export default function TeamDashboard() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showAddEmployee, setShowAddEmployee] = useState(false)

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
          { action: '调用工具', type: 'tool' as const, status: 'info' as const },
          { action: '完成任务', type: 'task' as const, status: 'success' as const },
          { action: '发送消息', type: 'message' as const, status: 'success' as const },
          { action: '执行命令', type: 'system' as const, status: 'info' as const }
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

  const getStatusIcon = (status: EmployeeStatus) => {
    switch (status) {
      case 'working':
        return <PlayCircle className="h-4 w-4" />
      case 'busy':
        return <PauseCircle className="h-4 w-4" />
      case 'idle':
        return <Coffee className="h-4 w-4" />
      case 'away':
        return <Clock className="h-4 w-4" />
      case 'offline':
        return <StopCircle className="h-4 w-4" />
    }
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">👥 OpenClaw 团队</h1>
          <p className="text-muted-foreground mt-2">
            查看你的AI团队成员正在做什么，实时监控工作进度
          </p>
        </div>
        <button
          onClick={() => setShowAddEmployee(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          添加新成员
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">团队成员</p>
              <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <PlayCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">活跃中</p>
              <p className="text-2xl font-bold">{stats.activeEmployees}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">进行中</p>
              <p className="text-2xl font-bold">{stats.tasksInProgress}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已完成</p>
              <p className="text-2xl font-bold">{stats.totalTasksCompleted}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Team Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border">
            <div className="border-b p-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                团队成员
              </h3>
            </div>
            <div className="p-4 grid gap-4 md:grid-cols-2">
              {employees.map(emp => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={cn(
                    "rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md",
                    selectedEmployee?.id === emp.id ? "ring-2 ring-primary" : ""
                  )}
                >
                  {/* Employee Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br",
                        roleColors[emp.role]
                      )}>
                        {emp.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{emp.name}</h4>
                          {emp.isAgent && (
                            <span className="px-1.5 py-0.5 text-xs rounded bg-purple-500/20 text-purple-600">
                              AI
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          {roleIcons[emp.role]}
                          <span className="capitalize">{emp.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        statusColors[emp.status]
                      )} />
                      <span className="text-xs text-muted-foreground">
                        {statusTexts[emp.status]}
                      </span>
                    </div>
                  </div>

                  {/* Current Task */}
                  {emp.currentTask && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm mb-1.5">
                        <Zap className="h-3.5 w-3.5 text-yellow-500" />
                        <span className="font-medium">{emp.currentTask}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                          style={{ width: `${emp.taskProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{emp.taskProgress.toFixed(0)}%</span>
                        <span>{formatTimeAgo(emp.lastActive)}</span>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {emp.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                    {emp.skills.length > 3 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                        +{emp.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{emp.tasksCompleted} 任务</span>
                    </div>
                    <button className="p-1 hover:bg-accent rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Selected Employee Details */}
          {selectedEmployee && (
            <div className="rounded-lg border">
              <div className="border-b p-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {selectedEmployee.name}
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-center">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-gradient-to-br",
                    roleColors[selectedEmployee.role]
                  )}>
                    {selectedEmployee.avatar}
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-semibold text-lg">{selectedEmployee.name}</h4>
                  <p className="text-muted-foreground capitalize">{selectedEmployee.role}</p>
                  {selectedEmployee.isAgent && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-600">
                      AI Agent
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">状态</span>
                    <span className="flex items-center gap-1">
                      <div className={cn("w-2 h-2 rounded-full", statusColors[selectedEmployee.status])} />
                      {statusTexts[selectedEmployee.status]}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">完成任务</span>
                    <span>{selectedEmployee.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">最后活跃</span>
                    <span>{formatTimeAgo(selectedEmployee.lastActive)}</span>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">技能</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEmployee.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedEmployee.currentTask && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">当前任务</h5>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm">{selectedEmployee.currentTask}</p>
                      <div className="mt-2">
                        <div className="h-2 rounded-full bg-background overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                            style={{ width: `${selectedEmployee.taskProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-right">
                          {selectedEmployee.taskProgress.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Feed */}
          <div className="rounded-lg border">
            <div className="border-b p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                实时动态
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
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
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.details}</p>
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
