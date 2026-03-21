import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Users, 
  Clock, 
  MoreVertical,
  Plus,
  Search,
  Filter,
  Settings
} from 'lucide-react'

interface Session {
  id: string
  title: string
  type: 'main' | 'isolated' | 'subagent'
  status: 'active' | 'idle' | 'paused'
  lastMessage: string
  lastActive: Date
  participants: number
  unread: number
}

const initialSessions: Session[] = [
  {
    id: 'session-001',
    title: '主会话',
    type: 'main',
    status: 'active',
    lastMessage: '帮我写一个Python脚本',
    lastActive: new Date(),
    participants: 2,
    unread: 3
  },
  {
    id: 'session-002',
    title: '代码开发助手',
    type: 'subagent',
    status: 'idle',
    lastMessage: 'React组件已经创建好了',
    lastActive: new Date(Date.now() - 300000),
    participants: 1,
    unread: 0
  },
  {
    id: 'session-003',
    title: '文档写作',
    type: 'isolated',
    status: 'paused',
    lastMessage: '文档需要补充更多细节',
    lastActive: new Date(Date.now() - 3600000),
    participants: 1,
    unread: 0
  }
]

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return '刚刚'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`
    return `${Math.floor(seconds / 86400)}天前`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'paused': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'main': return 'bg-blue-100 text-blue-800'
      case 'isolated': return 'bg-purple-100 text-purple-800'
      case 'subagent': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* 会话列表 */}
      <div className="w-96 flex flex-col gap-4">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">会话管理</h2>
          <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* 搜索栏 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索会话..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 筛选按钮 */}
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm flex items-center gap-1">
            <Filter className="h-4 w-4" />
            筛选
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm flex items-center gap-1">
            <Settings className="h-4 w-4" />
            配置
          </button>
        </div>

        {/* 会话列表 */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedSession?.id === session.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{session.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(session.type)}`}>
                    {session.type === 'main' ? '主会话' : session.type === 'isolated' ? '隔离' : '子代理'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(session.status)}`} />
                  {session.unread > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium">
                      {session.unread}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-2 line-clamp-2">{session.lastMessage}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {session.participants} 人
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(session.lastActive)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 会话详情 */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200">
        {selectedSession ? (
          <div className="h-full flex flex-col">
            {/* 详情头部 */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-800">{selectedSession.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${getTypeColor(selectedSession.type)}`}>
                      {selectedSession.type === 'main' ? '主会话' : selectedSession.type === 'isolated' ? '隔离会话' : '子代理会话'}
                    </span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
                      selectedSession.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedSession.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedSession.status)}`} />
                      {selectedSession.status === 'active' ? '活跃中' : selectedSession.status === 'idle' ? '空闲' : '已暂停'}
                    </div>
                  </div>
                  <p className="text-slate-600">会话 ID: {selectedSession.id}</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <MoreVertical className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* 详情内容 */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid gap-6">
                {/* 基本信息 */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4 text-slate-800">基本信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">最后消息</p>
                      <p className="text-slate-800">{selectedSession.lastMessage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">最后活跃</p>
                      <p className="text-slate-800">{formatTimeAgo(selectedSession.lastActive)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">参与人数</p>
                      <p className="text-slate-800">{selectedSession.participants} 人</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">未读消息</p>
                      <p className="text-slate-800">{selectedSession.unread} 条</p>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors">
                    打开会话
                  </button>
                  <button className="px-6 py-3 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors">
                    暂停
                  </button>
                  <button className="px-6 py-3 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">选择一个会话</h3>
              <p className="text-slate-400">从左侧列表选择一个会话查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
