import { useState, useEffect } from 'react'
import { 
  Wrench, 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Terminal
} from 'lucide-react'

interface ToolCall {
  id: string
  toolName: string
  toolIcon: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  duration?: number
  input: Record<string, any>
  output?: any
  error?: string
  sessionId: string
}

const initialToolCalls: ToolCall[] = [
  {
    id: 'tool-001',
    toolName: 'read',
    toolIcon: '📖',
    status: 'completed',
    startTime: new Date(Date.now() - 60000),
    endTime: new Date(Date.now() - 58000),
    duration: 2000,
    input: { path: '/root/.openclaw/workspace/SOUL.md' },
    output: { content: '# SOUL.md\n\n...' },
    sessionId: 'session-001'
  },
  {
    id: 'tool-002',
    toolName: 'exec',
    toolIcon: '💻',
    status: 'running',
    startTime: new Date(Date.now() - 30000),
    input: { command: 'cd /root/.openclaw/workspace/openclaw-gui && npm run build' },
    sessionId: 'session-001'
  },
  {
    id: 'tool-003',
    toolName: 'write',
    toolIcon: '✏️',
    status: 'failed',
    startTime: new Date(Date.now() - 120000),
    endTime: new Date(Date.now() - 118000),
    duration: 2000,
    input: { path: '/root/test.txt', content: 'Hello' },
    error: 'Permission denied: /root/test.txt',
    sessionId: 'session-001'
  }
]

export default function Tools() {
  const [toolCalls, setToolCalls] = useState<ToolCall[]>(initialToolCalls)
  const [expandedTool, setExpandedTool] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredToolCalls = toolCalls.filter(call => {
    const matchesSearch = 
      call.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(call.input).toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDuration = (start: Date, end?: Date): string => {
    if (!end) return '运行中...'
    const ms = end.getTime() - start.getTime()
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'running': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '等待中'
      case 'running': return '运行中'
      case 'completed': return '已完成'
      case 'failed': return '失败'
      default: return '未知'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 border-yellow-200'
      case 'running': return 'bg-blue-50 border-blue-200'
      case 'completed': return 'bg-green-50 border-green-200'
      case 'failed': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  useEffect(() => {
    // 模拟实时更新
    const interval = setInterval(() => {
      setToolCalls(prev => prev.map(call => {
        if (call.status === 'running' && Math.random() > 0.7) {
          return {
            ...call,
            status: 'completed',
            endTime: new Date(),
            duration: new Date().getTime() - call.startTime.getTime(),
            output: { result: 'success' }
          }
        }
        return call
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">工具调用</h2>
          <p className="text-slate-600">实时监控 OpenClaw 工具调用</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100">
            <Terminal className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              {toolCalls.filter(c => c.status === 'running').length} 运行中
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {toolCalls.filter(c => c.status === 'completed').length} 已完成
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">
              {toolCalls.filter(c => c.status === 'failed').length} 失败
            </span>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center gap-4">
        {/* 搜索 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索工具调用..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 状态筛选 */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部状态</option>
            <option value="pending">等待中</option>
            <option value="running">运行中</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
          </select>
        </div>
      </div>

      {/* 工具调用列表 */}
      <div className="space-y-4">
        {filteredToolCalls.map((call) => (
          <div
            key={call.id}
            className={`rounded-xl border-2 ${getStatusBg(call.status)}`}
          >
            {/* 头部 */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedTool(expandedTool === call.id ? null : call.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* 图标 */}
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm border border-slate-200">
                    {call.toolIcon}
                  </div>

                  {/* 信息 */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg text-slate-800">{call.toolName}</h3>
                      <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm ${
                        call.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        call.status === 'running' ? 'bg-blue-100 text-blue-800' :
                        call.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(call.status)}`} />
                        {getStatusText(call.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(call.startTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Wrench className="h-3.5 w-3.5" />
                        {formatDuration(call.startTime, call.endTime)}
                      </div>
                      {call.status === 'running' && (
                        <div className="flex items-center gap-1">
                          <PlayCircle className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                          运行中...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 展开按钮 */}
                <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
                  {expandedTool === call.id ? (
                    <ChevronUp className="h-5 w-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* 展开内容 */}
            {expandedTool === call.id && (
              <div className="px-4 pb-4 border-t border-slate-200/50">
                <div className="pt-4 space-y-4">
                  {/* 输入参数 */}
                  <div>
                    <h4 className="font-medium text-sm text-slate-700 mb-2">输入参数</h4>
                    <pre className="bg-white rounded-lg p-3 text-sm overflow-x-auto border border-slate-200">
                      <code>{JSON.stringify(call.input, null, 2)}</code>
                    </pre>
                  </div>

                  {/* 输出结果 */}
                  {call.output && (
                    <div>
                      <h4 className="font-medium text-sm text-slate-700 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        输出结果
                      </h4>
                      <pre className="bg-white rounded-lg p-3 text-sm overflow-x-auto border border-green-200">
                        <code>{JSON.stringify(call.output, null, 2)}</code>
                      </pre>
                    </div>
                  )}

                  {/* 错误信息 */}
                  {call.error && (
                    <div>
                      <h4 className="font-medium text-sm text-slate-700 mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        错误信息
                      </h4>
                      <pre className="bg-white rounded-lg p-3 text-sm overflow-x-auto border border-red-200">
                        <code className="text-red-700">{call.error}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredToolCalls.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">暂无工具调用</h3>
          <p className="text-slate-400">没有找到匹配的工具调用记录</p>
        </div>
      )}
    </div>
  )
}
