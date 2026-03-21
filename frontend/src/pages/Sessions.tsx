import React, { useState } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  Play,
  StopCircle,
  Trash2,
  Copy,
  Settings,
  BarChart3,
  Clock,
  Zap,
  Brain,
  Code,
  User
} from 'lucide-react'
import { useStore } from '../store'
import { cn, formatTimeAgo } from '../lib/utils'
import SessionList from '../components/SessionList'
import { useQuery } from '@tanstack/react-query'

const sessionTypes = [
  { id: 'all', name: '全部会话', icon: Users },
  { id: 'main', name: '主会话', icon: User },
  { id: 'subagent', name: '子代理', icon: Brain },
  { id: 'acp', name: 'ACP会话', icon: Code }
]

const sessionStatuses = [
  { id: 'all', name: '全部状态', color: 'bg-gray-500' },
  { id: 'active', name: '活跃', color: 'bg-green-500' },
  { id: 'idle', name: '空闲', color: 'bg-amber-500' },
  { id: 'completed', name: '已完成', color: 'bg-blue-500' },
  { id: 'error', name: '错误', color: 'bg-red-500' }
]

const models = [
  { id: 'all', name: '全部模型' },
  { id: 'ark/deepseek-v3.2', name: 'DeepSeek V3.2' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'codex', name: 'Codex' }
]

export default function Sessions() {
  const { sessions, sendCommand } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedModel, setSelectedModel] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [showFilters, setShowFilters] = useState(false)
  
  const { data: sessionStats, refetch: refetchStats } = useQuery({
    queryKey: ['session-stats'],
    queryFn: async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        total: sessions.length,
        active: sessions.filter(s => s.status === 'active').length,
        idle: sessions.filter(s => s.status === 'idle').length,
        completed: sessions.filter(s => s.status === 'completed').length,
        error: sessions.filter(s => s.status === 'error').length,
        totalMessages: sessions.reduce((sum, s) => sum + s.messageCount, 0),
        avgDuration: '2.5小时'
      }
    }
  })
  
  // 过滤会话
  const filteredSessions = sessions.filter(session => {
    if (searchQuery && !session.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !(session.label?.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    
    if (selectedType !== 'all' && session.type !== selectedType) {
      return false
    }
    
    if (selectedStatus !== 'all' && session.status !== selectedStatus) {
      return false
    }
    
    if (selectedModel !== 'all' && session.model !== selectedModel) {
      return false
    }
    
    return true
  })
  
  const handleCreateSession = () => {
    const sessionType = prompt('选择会话类型 (main/subagent/acp):', 'subagent')
    const label = prompt('输入会话标签:', '新会话')
    
    if (sessionType && label) {
      sendCommand(`sessions_spawn runtime="${sessionType}" label="${label}"`)
    }
  }
  
  const handleBulkAction = (action: string) => {
    const selectedIds = filteredSessions.map(s => s.id)
    if (selectedIds.length === 0) return
    
    switch (action) {
      case 'start':
        sendCommand(`subagents steer action=start ids=${selectedIds.join(',')}`)
        break
      case 'stop':
        sendCommand(`subagents steer action=stop ids=${selectedIds.join(',')}`)
        break
      case 'delete':
        if (confirm(`确定要删除 ${selectedIds.length} 个会话吗？`)) {
          sendCommand(`subagents steer action=kill ids=${selectedIds.join(',')}`)
        }
        break
    }
  }
  
  const handleExportSessions = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      total: filteredSessions.length,
      sessions: filteredSessions
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `openclaw-sessions-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">会话管理</h1>
          <p className="text-muted-foreground mt-2">
            管理和监控所有OpenClaw会话，包括主会话、子代理和ACP会话
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetchStats()}
            className="p-2 rounded-lg border hover:bg-accent"
            title="刷新"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button
            onClick={handleExportSessions}
            className="p-2 rounded-lg border hover:bg-accent"
            title="导出会话"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={handleCreateSession}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            创建会话
          </button>
        </div>
      </div>
      
      {/* Stats */}
      {sessionStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{sessionStats.total}</div>
                <div className="text-sm text-muted-foreground">总会话数</div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-500">{sessionStats.active}</div>
                <div className="text-sm text-muted-foreground">活跃会话</div>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{sessionStats.totalMessages}</div>
                <div className="text-sm text-muted-foreground">总消息数</div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{sessionStats.avgDuration}</div>
                <div className="text-sm text-muted-foreground">平均时长</div>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>
      )}
      
      {/* Filters and Actions */}
      <div className="rounded-lg border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border bg-background py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="搜索会话ID、标签、模型..."
            />
          </div>
          
          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent"
            >
              <Filter className="h-4 w-4" />
              <span>筛选</span>
              {(selectedType !== 'all' || selectedStatus !== 'all' || selectedModel !== 'all') && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
            
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-3 py-1.5 text-sm",
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                )}
              >
                列表
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "px-3 py-1.5 text-sm",
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                )}
              >
                网格
              </button>
            </div>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Session Type */}
              <div>
                <label className="block text-sm font-medium mb-2">会话类型</label>
                <div className="flex flex-wrap gap-2">
                  {sessionTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-lg flex items-center gap-2",
                        selectedType === type.id
                          ? 'bg-primary text-primary-foreground'
                          : 'border hover:bg-accent'
                      )}
                    >
                      <type.icon className="h-4 w-4" />
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">状态</label>
                <div className="flex flex-wrap gap-2">
                  {sessionStatuses.map(status => (
                    <button
                      key={status.id}
                      onClick={() => setSelectedStatus(status.id)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-lg flex items-center gap-2",
                        selectedStatus === status.id
                          ? 'bg-primary text-primary-foreground'
                          : 'border hover:bg-accent'
                      )}
                    >
                      <div className={cn("h-2 w-2 rounded-full", status.color)} />
                      {status.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Model */}
              <div>
                <label className="block text-sm font-medium mb-2">模型</label>
                <div className="flex flex-wrap gap-2">
                  {models.map(model => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-lg",
                        selectedModel === model.id
                          ? 'bg-primary text-primary-foreground'
                          : 'border hover:bg-accent'
                      )}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">
                找到 {filteredSessions.length} 个会话
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedType('all')
                    setSelectedStatus('all')
                    setSelectedModel('all')
                    setSearchQuery('')
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg border hover:bg-accent"
                >
                  清除筛选
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Bulk Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            已选择 {filteredSessions.length} 个会话
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('start')}
              className="px-3 py-1.5 text-sm rounded-lg border hover:bg-green-500/10 text-green-600"
              disabled={filteredSessions.length === 0}
            >
              <Play className="h-4 w-4 inline mr-1" />
              启动选中
            </button>
            <button
              onClick={() => handleBulkAction('stop')}
              className="px-3 py-1.5 text-sm rounded-lg border hover:bg-amber-500/10 text-amber-600"
              disabled={filteredSessions.length === 0}
            >
              <StopCircle className="h-4 w-4 inline mr-1" />
              停止选中
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 text-sm rounded-lg border hover:bg-red-500/10 text-red-600"
              disabled={filteredSessions.length === 0}
            >
              <Trash2 className="h-4 w-4 inline mr-1" />
              删除选中
            </button>
          </div>
        </div>
      </div>
      
      {/* Sessions Content */}
      <div className="rounded-lg border">
        {viewMode === 'list' ? (
          <div className="p-4">
            <SessionList 
              sessions={filteredSessions} 
              showActions={true}
            />
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Grid view implementation would go here */}
            <div className="text-center py-8 text-muted-foreground">
              网格视图开发中...
            </div>
          </div>
        )}
      </div>
      
      {/* Empty State */}
      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-muted-foreground">未找到会话</h3>
          <p className="text-sm text-muted-foreground mt-1">
            尝试调整筛选条件或创建新的会话
          </p>
          <button
            onClick={handleCreateSession}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            创建第一个会话
          </button>
        </div>
      )}
      
      {/* Tips */}
      <div className="rounded-lg border p-4 bg-muted/20">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          会话管理提示
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• 主会话 (main) 是持久的，用于常规对话和任务</li>
          <li>• 子代理 (subagent) 用于特定任务，完成后自动结束</li>
          <li>• ACP会话 (acp) 专门用于代码编写和开发任务</li>
          <li>• 空闲会话超过24小时会自动清理以释放资源</li>
          <li>• 可以同时运行多个会话，但注意系统资源限制</li>
        </ul>
      </div>
    </div>
  )
}