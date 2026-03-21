import React from 'react'
import { 
  User, 
  Cpu, 
  Clock, 
  MessageSquare,
  Activity,
  Zap,
  Brain,
  Code,
  MoreVertical,
  Play,
  StopCircle,
  Trash2,
  Settings
} from 'lucide-react'
import { cn, formatTimeAgo } from '../lib/utils'

interface Session {
  id: string
  type: 'main' | 'subagent' | 'acp'
  status: 'active' | 'idle' | 'completed' | 'error'
  model: string
  createdAt: string
  lastActivity: string
  messageCount: number
  thinkingEnabled?: boolean
  elevated?: boolean
  label?: string
}

interface SessionListProps {
  sessions: Session[]
  limit?: number
  showActions?: boolean
  compact?: boolean
}

const modelIcons: Record<string, React.ComponentType<any>> = {
  'ark/deepseek-v3.2': Brain,
  'claude-3.5-sonnet': Cpu,
  'gpt-4': Zap,
  'codex': Code,
  'default': Cpu
}

const modelColors: Record<string, string> = {
  'ark/deepseek-v3.2': 'text-blue-500 bg-blue-500/10',
  'claude-3.5-sonnet': 'text-purple-500 bg-purple-500/10',
  'gpt-4': 'text-green-500 bg-green-500/10',
  'codex': 'text-amber-500 bg-amber-500/10',
  'default': 'text-gray-500 bg-gray-500/10'
}

const statusColors: Record<string, string> = {
  active: 'text-green-500 bg-green-500/10',
  idle: 'text-amber-500 bg-amber-500/10',
  completed: 'text-blue-500 bg-blue-500/10',
  error: 'text-red-500 bg-red-500/10'
}

const statusLabels: Record<string, string> = {
  active: '活跃',
  idle: '空闲',
  completed: '已完成',
  error: '错误'
}

const typeLabels: Record<string, string> = {
  main: '主会话',
  subagent: '子代理',
  acp: 'ACP会话'
}

const typeIcons: Record<string, React.ComponentType<any>> = {
  main: User,
  subagent: Cpu,
  acp: Code
}

export default function SessionList({ 
  sessions, 
  limit, 
  showActions = true,
  compact = false 
}: SessionListProps) {
  const displayedSessions = limit ? sessions.slice(0, limit) : sessions
  
  const getModelName = (model: string) => {
    const modelMap: Record<string, string> = {
      'ark/deepseek-v3.2': 'DeepSeek V3.2',
      'claude-3.5-sonnet': 'Claude 3.5 Sonnet',
      'gpt-4': 'GPT-4',
      'codex': 'Codex'
    }
    return modelMap[model] || model
  }
  
  const getModelIcon = (model: string) => {
    return modelIcons[model] || modelIcons.default
  }
  
  const handleSessionAction = (sessionId: string, action: string) => {
    console.log(`Session ${sessionId}: ${action}`)
    // 这里应该调用相应的API
  }
  
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-medium text-muted-foreground">暂无会话</h3>
        <p className="text-sm text-muted-foreground mt-1">
          还没有创建任何会话
        </p>
      </div>
    )
  }
  
  if (compact) {
    return (
      <div className="space-y-2">
        {displayedSessions.map((session) => {
          const ModelIcon = getModelIcon(session.model)
          const TypeIcon = typeIcons[session.type]
          
          return (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  modelColors[session.model] || modelColors.default
                )}>
                  <ModelIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {session.label || typeLabels[session.type]}
                    </span>
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      statusColors[session.status]
                    )}>
                      {statusLabels[session.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TypeIcon className="h-3 w-3" />
                    <span>{getModelName(session.model)}</span>
                    <span>•</span>
                    <span>{session.messageCount} 条消息</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatTimeAgo(new Date(session.lastActivity))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      {displayedSessions.map((session) => {
        const ModelIcon = getModelIcon(session.model)
        const TypeIcon = typeIcons[session.type]
        const isActive = session.status === 'active'
        
        return (
          <div
            key={session.id}
            className="group p-4 rounded-lg border hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  modelColors[session.model] || modelColors.default
                )}>
                  <ModelIcon className="h-5 w-5" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">
                      {session.label || typeLabels[session.type]}
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        statusColors[session.status]
                      )}>
                        {statusLabels[session.status]}
                      </span>
                      {session.thinkingEnabled && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500">
                          思考模式
                        </span>
                      )}
                      {session.elevated && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                          提升权限
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TypeIcon className="h-3.5 w-3.5" />
                      <span>{typeLabels[session.type]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5" />
                      <span>{getModelName(session.model)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{session.messageCount} 条消息</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>创建于 {formatTimeAgo(new Date(session.createdAt))}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>最后活动 {formatTimeAgo(new Date(session.lastActivity))}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {showActions && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isActive ? (
                    <button
                      onClick={() => handleSessionAction(session.id, 'stop')}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                      title="停止会话"
                    >
                      <StopCircle className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSessionAction(session.id, 'start')}
                      className="p-1.5 rounded hover:bg-green-500/10 text-green-500"
                      title="启动会话"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleSessionAction(session.id, 'configure')}
                    className="p-1.5 rounded hover:bg-blue-500/10 text-blue-500"
                    title="配置会话"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleSessionAction(session.id, 'delete')}
                    className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                    title="删除会话"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-accent">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-xl font-bold">
                  {session.messageCount}
                </div>
                <div className="text-xs text-muted-foreground">消息数量</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {isActive ? '实时' : formatTimeAgo(new Date(session.lastActivity))}
                </div>
                <div className="text-xs text-muted-foreground">活动状态</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {session.thinkingEnabled ? '启用' : '禁用'}
                </div>
                <div className="text-xs text-muted-foreground">思考模式</div>
              </div>
            </div>
          </div>
        )
      })}
      
      {limit && sessions.length > limit && (
        <div className="text-center pt-2">
          <button className="text-sm text-primary hover:underline">
            查看所有 {sessions.length} 个会话 →
          </button>
        </div>
      )}
    </div>
  )
}