import React from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Zap,
  FileText,
  Calendar,
  MessageSquare,
  Database,
  Cpu
} from 'lucide-react'
import { cn, formatTimeAgo } from '../lib/utils'

interface ActivityItem {
  id: string
  type: 'tool' | 'command' | 'session' | 'memory' | 'system' | 'feishu'
  title: string
  description: string
  timestamp: Date
  status: 'success' | 'error' | 'warning' | 'info'
  user?: string
  duration?: number
  details?: Record<string, any>
}

const activityData: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'tool',
    title: 'read /root/.openclaw/workspace/SOUL.md',
    description: '读取SOUL.md文件内容',
    timestamp: new Date(Date.now() - 300000), // 5分钟前
    status: 'success',
    duration: 120
  },
  {
    id: 'act_002',
    type: 'command',
    title: 'openclaw gateway status',
    description: '检查OpenClaw Gateway状态',
    timestamp: new Date(Date.now() - 600000), // 10分钟前
    status: 'success',
    duration: 85
  },
  {
    id: 'act_003',
    type: 'feishu',
    title: 'feishu_calendar_event list',
    description: '获取飞书日历日程列表',
    timestamp: new Date(Date.now() - 900000), // 15分钟前
    status: 'success',
    duration: 210
  },
  {
    id: 'act_004',
    type: 'memory',
    title: 'memory_recall query="openclaw"',
    description: '搜索关于OpenClaw的记忆',
    timestamp: new Date(Date.now() - 1200000), // 20分钟前
    status: 'success',
    duration: 150
  },
  {
    id: 'act_005',
    type: 'session',
    title: 'sessions_spawn runtime="acp"',
    description: '创建新的ACP会话',
    timestamp: new Date(Date.now() - 1800000), // 30分钟前
    status: 'success',
    duration: 320
  },
  {
    id: 'act_006',
    type: 'system',
    title: 'exec df -h',
    description: '检查磁盘使用情况',
    timestamp: new Date(Date.now() - 2400000), // 40分钟前
    status: 'warning',
    duration: 95
  },
  {
    id: 'act_007',
    type: 'tool',
    title: 'write /tmp/test.txt',
    description: '写入测试文件',
    timestamp: new Date(Date.now() - 3000000), // 50分钟前
    status: 'error',
    duration: 45
  },
  {
    id: 'act_008',
    type: 'feishu',
    title: 'feishu_task_task create',
    description: '创建飞书任务',
    timestamp: new Date(Date.now() - 3600000), // 1小时前
    status: 'success',
    duration: 180
  }
]

const typeIcons = {
  tool: Zap,
  command: Cpu,
  session: User,
  memory: Database,
  system: Cpu,
  feishu: MessageSquare
}

const typeColors = {
  tool: 'text-blue-500 bg-blue-500/10',
  command: 'text-green-500 bg-green-500/10',
  session: 'text-purple-500 bg-purple-500/10',
  memory: 'text-amber-500 bg-amber-500/10',
  system: 'text-cyan-500 bg-cyan-500/10',
  feishu: 'text-red-500 bg-red-500/10'
}

const statusIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: XCircle,
  info: Clock
}

const statusColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500'
}

export default function RecentActivity() {
  const [filter, setFilter] = React.useState<string>('all')
  
  const filteredActivities = activityData.filter(activity => 
    filter === 'all' || activity.type === filter
  )
  
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      tool: '工具调用',
      command: '命令执行',
      session: '会话管理',
      memory: '记忆操作',
      system: '系统命令',
      feishu: '飞书集成'
    }
    return labels[type] || type
  }
  
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            "px-3 py-1.5 text-sm rounded-lg whitespace-nowrap",
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'border hover:bg-accent'
          )}
        >
          全部活动
        </button>
        {Object.keys(typeIcons).map(type => {
          const Icon = typeIcons[type as keyof typeof typeIcons]
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg flex items-center gap approximately whitespace-nowrap",
                filter === type
                  ? 'bg-primary text-primary-foreground'
                  : 'border hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              {getTypeLabel(type)}
            </button>
          )
        })}
      </div>
      
      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.map((activity) => {
          const TypeIcon = typeIcons[activity.type]
          const StatusIcon = statusIcons[activity.status]
          
          return (
            <div
              key={activity.id}
              className="group flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              {/* Type Icon */}
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                typeColors[activity.type]
              )}>
                <TypeIcon className="h-5 w-5" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm truncate">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusIcon className={cn(
                      "h-4 w-4",
                      statusColors[activity.status]
                    )} />
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
                
                {/* Details */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{activity.duration}ms</span>
                  </div>
                  <div className="text-xs px-2 py-0.5 rounded-full bg-muted">
                    {getTypeLabel(activity.type)}
                  </div>
                  {activity.user && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{activity.user}</span>
                    </div>
                  )}
                </div>
                
                {/* Status Details */}
                {activity.status === 'error' && (
                  <div className="mt-2 text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded">
                    执行失败：权限不足或文件不存在
                  </div>
                )}
                {activity.status === 'warning' && (
                  <div className="mt-2 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                    磁盘使用率超过80%，建议清理
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">
            {activityData.filter(a => a.status === 'success').length}
          </div>
          <div className="text-xs text-muted-foreground">成功</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">
            {activityData.filter(a => a.status === 'warning').length}
          </div>
          <div className="text-xs text-muted-foreground">警告</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">
            {activityData.filter(a => a.status === 'error').length}
          </div>
          <div className="text-xs text-muted-foreground">失败</div>
        </div>
      </div>
      
      {/* View All Link */}
      <div className="text-center pt-2">
        <button className="text-sm text-primary hover:underline">
          查看所有活动记录 →
        </button>
      </div>
    </div>
  )
}