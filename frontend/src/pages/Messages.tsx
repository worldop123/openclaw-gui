import { useState, useRef, useEffect } from 'react'
import { 
  MessageSquare, 
  User, 
  Bot, 
  Wrench, 
  Search,
  Filter,
  Download,
  Clock,
  MoreVertical
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system' | 'tool_call' | 'tool_response'
  content: string
  timestamp: Date
  sessionId: string
  metadata?: Record<string, any>
}

const initialMessages: Message[] = [
  {
    id: 'msg-001',
    type: 'user',
    content: '你好，帮我写一个Python脚本',
    timestamp: new Date(Date.now() - 120000),
    sessionId: 'session-001'
  },
  {
    id: 'msg-002',
    type: 'assistant',
    content: '好的！我来帮你写一个Python脚本。首先让我看看当前目录的结构。',
    timestamp: new Date(Date.now() - 118000),
    sessionId: 'session-001'
  },
  {
    id: 'msg-003',
    type: 'tool_call',
    content: '调用工具: read',
    timestamp: new Date(Date.now() - 115000),
    sessionId: 'session-001',
    metadata: { toolName: 'read', input: { path: '/root/.openclaw/workspace' } }
  },
  {
    id: 'msg-004',
    type: 'tool_response',
    content: '工具返回: ... (目录列表)',
    timestamp: new Date(Date.now() - 112000),
    sessionId: 'session-001',
    metadata: { toolName: 'read' }
  },
  {
    id: 'msg-005',
    type: 'assistant',
    content: '好的，我看到了目录结构。现在我来帮你创建一个Python脚本...',
    timestamp: new Date(Date.now() - 60000),
    sessionId: 'session-001'
  }
]

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [autoScroll, setAutoScroll] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || msg.type === typeFilter
    return matchesSearch && matchesType
  })

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />
      case 'assistant': return <Bot className="h-4 w-4" />
      case 'system': return <MessageSquare className="h-4 w-4" />
      case 'tool_call':
      case 'tool_response': return <Wrench className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-500'
      case 'assistant': return 'bg-purple-500'
      case 'system': return 'bg-slate-500'
      case 'tool_call': return 'bg-orange-500'
      case 'tool_response': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-50 border-blue-200'
      case 'assistant': return 'bg-purple-50 border-purple-200'
      case 'system': return 'bg-slate-50 border-slate-200'
      case 'tool_call': return 'bg-orange-50 border-orange-200'
      case 'tool_response': return 'bg-green-50 border-green-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'user': return '用户'
      case 'assistant': return '助手'
      case 'system': return '系统'
      case 'tool_call': return '工具调用'
      case 'tool_response': return '工具返回'
      default: return '未知'
    }
  }

  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [filteredMessages])

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">消息流</h2>
          <p className="text-slate-600">实时查看所有交互消息</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                autoScroll 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              自动滚动
            </button>
          </div>
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Download className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center gap-4">
        {/* 搜索 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索消息..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 类型筛选 */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部类型</option>
            <option value="user">用户</option>
            <option value="assistant">助手</option>
            <option value="system">系统</option>
            <option value="tool_call">工具调用</option>
            <option value="tool_response">工具返回</option>
          </select>
        </div>
      </div>

      {/* 消息统计 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50">
          <User className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            {messages.filter(m => m.type === 'user').length} 用户
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50">
          <Bot className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">
            {messages.filter(m => m.type === 'assistant').length} 助手
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50">
          <Wrench className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-700">
            {messages.filter(m => m.type === 'tool_call' || m.type === 'tool_response').length} 工具
          </span>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-slate-200">
        <div className="p-4 space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-xl border-2 ${getBgColor(msg.type)}`}
            >
              <div className="flex items-start gap-4">
                {/* 图标 */}
                <div className={`w-10 h-10 rounded-lg ${getTypeColor(msg.type)} flex items-center justify-center text-white flex-shrink-0`}>
                  {getTypeIcon(msg.type)}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{getTypeName(msg.type)}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-white/60 border border-slate-200">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(msg.timestamp)}
                      </span>
                      <button className="p-1 rounded hover:bg-white/50 transition-colors">
                        <MoreVertical className="h-4 w-4 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {/* 消息内容 */}
                  <div className="text-slate-700 whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {/* 元数据 */}
                  {msg.metadata && (
                    <div className="mt-3 pt-3 border-t border-slate-200/50">
                      <pre className="text-xs bg-white/50 rounded-lg p-2 overflow-x-auto">
                        <code>{JSON.stringify(msg.metadata, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {filteredMessages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">暂无消息</h3>
              <p className="text-slate-400">没有找到匹配的消息记录</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
