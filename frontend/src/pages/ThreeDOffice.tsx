import { useEffect, useRef, useState } from 'react'
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Users, 
  Settings, 
  Coffee, 
  Monitor, 
  Sparkles,
  Save,
  X,
  RotateCcw
} from 'lucide-react'

type OfficeRole = 'boss' | 'developer' | 'designer' | 'manager' | 'intern' | 'custom'

interface OfficeCharacter {
  id: string
  name: string
  role: OfficeRole
  roleName: string
  avatar: string
  color: string
  position: { x: number; y: number; z: number }
  status: 'idle' | 'working' | 'talking' | 'thinking' | 'away'
  currentTask: string | null
  mood: 'happy' | 'excited' | 'focused' | 'tired' | 'neutral'
  lastActive: Date
  deskNumber: number
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  isUser: boolean
}

const initialCharacters: OfficeCharacter[] = [
  {
    id: '3d-001',
    name: '李总',
    role: 'boss',
    roleName: 'CEO',
    avatar: '👨‍💼',
    color: '#3b82f6',
    position: { x: -2, y: 0.5, z: -2 },
    status: 'working',
    currentTask: '审阅项目报告',
    mood: 'happy',
    lastActive: new Date(),
    deskNumber: 1
  },
  {
    id: '3d-002',
    name: '小张',
    role: 'developer',
    roleName: '高级开发',
    avatar: '🧑‍💻',
    color: '#10b981',
    position: { x: -1, y: 0.5, z: 0 },
    status: 'working',
    currentTask: '编写 3D 组件',
    mood: 'focused',
    lastActive: new Date(Date.now() - 60000),
    deskNumber: 2
  },
  {
    id: '3d-003',
    name: '小王',
    role: 'designer',
    roleName: 'UI设计师',
    avatar: '👩‍🎨',
    color: '#ec4899',
    position: { x: 1, y: 0.5, z: 0 },
    status: 'thinking',
    currentTask: '设计 3D 界面',
    mood: 'excited',
    lastActive: new Date(Date.now() - 120000),
    deskNumber: 3
  },
  {
    id: '3d-004',
    name: '小赵',
    role: 'manager',
    roleName: '项目经理',
    avatar: '👩‍💼',
    color: '#8b5cf6',
    position: { x: 2, y: 0.5, z: -1 },
    status: 'talking',
    currentTask: '安排团队会议',
    mood: 'happy',
    lastActive: new Date(Date.now() - 180000),
    deskNumber: 4
  },
  {
    id: '3d-005',
    name: '小实习生',
    role: 'intern',
    roleName: '实习生',
    avatar: '🧑‍🎓',
    color: '#f59e0b',
    position: { x: 0, y: 0.5, z: 2 },
    status: 'idle',
    currentTask: '学习 Three.js',
    mood: 'neutral',
    lastActive: new Date(Date.now() - 300000),
    deskNumber: 5
  }
]

const moodEmojis = {
  happy: '😊',
  excited: '🤩',
  focused: '🎯',
  tired: '😴',
  neutral: '😐'
}

export default function ThreeDOffice() {
  const [characters, setCharacters] = useState<OfficeCharacter[]>(initialCharacters)
  const [selectedCharacter, setSelectedCharacter] = useState<OfficeCharacter | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-3d-001',
      senderId: '3d-002',
      senderName: '小张',
      content: '老板！3D 办公室场景渲染成功了！',
      timestamp: new Date(Date.now() - 300000),
      isUser: false
    },
    {
      id: 'msg-3d-002',
      senderId: 'user',
      senderName: '你',
      content: '太棒了！继续优化 3D 效果！',
      timestamp: new Date(Date.now() - 240000),
      isUser: true
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCharacterName, setNewCharacterName] = useState('')
  const [newCharacterRole, setNewCharacterRole] = useState<OfficeRole>('custom')
  const [newCharacterAvatar, setNewCharacterAvatar] = useState('🤖')
  const [cameraAngle, setCameraAngle] = useState(0)
  const [is3DReady, setIs3DReady] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 滚动到聊天底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // 模拟角色状态更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCharacters(prev => prev.map(char => {
        if (Math.random() > 0.7) {
          const moods = ['happy', 'excited', 'focused', 'neutral'] as const
          const newMood = moods[Math.floor(Math.random() * moods.length)]
          
          const statuses = ['idle', 'working', 'thinking'] as const
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
          
          return {
            ...char,
            mood: newMood,
            status: newStatus,
            lastActive: new Date()
          }
        }
        return char
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // 旋转视角
  useEffect(() => {
    const interval = setInterval(() => {
      setCameraAngle(prev => (prev + 0.5) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: '你',
      content: newMessage,
      timestamp: new Date(),
      isUser: true
    }

    setChatMessages(prev => [...prev, userMessage])
    setNewMessage('')

    setTimeout(() => {
      const randomChar = characters[Math.floor(Math.random() * characters.length)]
      const replies = [
        '收到！3D 场景收到指令！',
        '好的老板！3D 渲染中...',
        '这就办！正在计算 3D 坐标！',
        '没问题！3D 办公室随时待命！',
        '好的！正在旋转视角！',
        '3D 场景已准备就绪！'
      ]
      
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: randomChar.id,
        senderName: randomChar.name,
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date(),
        isUser: false
      }

      setChatMessages(prev => [...prev, botMessage])
    }, 1500)
  }

  const createNewCharacter = () => {
    if (!newCharacterName.trim()) return

    const newChar: OfficeCharacter = {
      id: `3d-${Date.now()}`,
      name: newCharacterName,
      role: newCharacterRole,
      roleName: newCharacterRole === 'custom' ? '自定义角色' : 
                newCharacterRole === 'boss' ? 'CEO' :
                newCharacterRole === 'developer' ? '开发工程师' :
                newCharacterRole === 'designer' ? '设计师' :
                newCharacterRole === 'manager' ? '经理' : '实习生',
      avatar: newCharacterAvatar,
      color: '#06b6d4',
      position: { 
        x: (Math.random() - 0.5) * 4, 
        y: 0.5, 
        z: (Math.random() - 0.5) * 4 
      },
      status: 'idle',
      currentTask: '进入 3D 办公室...',
      mood: 'happy',
      lastActive: new Date(),
      deskNumber: characters.length + 1
    }

    setCharacters(prev => [...prev, newChar])
    setShowCreateModal(false)
    setNewCharacterName('')
    setNewCharacterRole('custom')
    setNewCharacterAvatar('🤖')
  }

  const getMoodEmoji = (mood: string) => moodEmojis[mood as keyof typeof moodEmojis] || '😐'

  // 模拟 3D 渲染
  const render3DScene = () => {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900">
        {/* 3D 网格地板 */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `perspective(1000px) rotateX(60deg) translateY(-50%)`
        }} />

        {/* 角色 - 3D 效果 */}
        {characters.map((char, idx) => {
          const angle = (cameraAngle + idx * 72) * Math.PI / 180
          const radius = 3
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const scale = 0.8 + Math.sin(angle + idx) * 0.2
          const opacity = 0.6 + Math.cos(angle) * 0.4

          return (
            <div
              key={char.id}
              onClick={() => setSelectedCharacter(char)}
              className="absolute cursor-pointer transform transition-all duration-300 hover:scale-110"
              style={{
                left: `${50 + x * 15}%`,
                top: `${50 + z * 10}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: opacity,
                zIndex: Math.floor(100 + z * 10)
              }}
            >
              {/* 角色卡片 */}
              <div className="relative">
                {/* 发光光晕 */}
                <div 
                  className="absolute -inset-4 rounded-full blur-lg opacity-60 animate-pulse"
                  style={{ backgroundColor: char.color }}
                />
                
                {/* 角色主体 */}
                <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/20 shadow-2xl">
                  {/* 头像 */}
                  <div className="text-center mb-2">
                    <div 
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl shadow-lg mb-2"
                      style={{ backgroundColor: char.color }}
                    >
                      {char.avatar}
                    </div>
                    <h4 className="text-white font-bold text-sm">{char.name}</h4>
                    <p className="text-slate-400 text-xs">{char.roleName}</p>
                  </div>

                  {/* 心情和状态 */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">{getMoodEmoji(char.mood)}</span>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      char.status === 'working' ? 'bg-green-500/20 text-green-400' :
                      char.status === 'talking' ? 'bg-blue-500/20 text-blue-400' :
                      char.status === 'thinking' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {char.status === 'working' ? '工作中' :
                       char.status === 'talking' ? '对话中' :
                       char.status === 'thinking' ? '思考中' : '空闲'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* 3D 坐标轴指示 */}
        <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-xs text-slate-400 mb-2">3D 视角控制</div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-red-400">X 轴</span>
            <div className="w-3 h-3 bg-green-500 rounded-full ml-2" />
            <span className="text-green-400">Y 轴</span>
            <div className="w-3 h-3 bg-blue-500 rounded-full ml-2" />
            <span className="text-blue-400">Z 轴</span>
          </div>
        </div>

        {/* 旋转角度显示 */}
        <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-xs text-slate-400 mb-1">视角旋转</div>
          <div className="text-2xl font-black text-cyan-400">{Math.round(cameraAngle)}°</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex">
      {/* 左侧 - 3D 办公室场景 */}
      <div className="flex-1 relative">
        {/* 顶部标题 */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-slate-950/90 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">OpenClaw 3D 办公室</h1>
                <p className="text-slate-400">沉浸式 3D 工作空间体验</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCameraAngle(0)}
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-xl border border-white/10 transition-all"
              >
                <RotateCcw className="h-4 w-4 inline mr-2" />
                重置视角
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                加入 3D 办公室
              </button>
            </div>
          </div>
        </div>

        {/* 3D 场景 */}
        <div className="absolute inset-0">
          {render3DScene()}
        </div>

        {/* 3D 提示信息 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/10">
            <p className="text-slate-300 text-sm">
              💡 点击角色查看详情 · 视角自动旋转中 · 体验沉浸式 3D 办公室
            </p>
          </div>
        </div>
      </div>

      {/* 右侧 - 聊天和详情面板 */}
      <div className="w-96 bg-slate-900/90 backdrop-blur-xl border-l border-white/10 flex flex-col">
        {/* 选中角色详情 */}
        {selectedCharacter && (
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                style={{ backgroundColor: selectedCharacter.color }}
              >
                {selectedCharacter.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white">{selectedCharacter.name}</h3>
                <p className="text-slate-400">{selectedCharacter.roleName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">{getMoodEmoji(selectedCharacter.mood)}</span>
                  <span className="text-sm text-slate-400">办公桌 #{selectedCharacter.deskNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {selectedCharacter.currentTask && (
              <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
                <p className="text-sm text-cyan-300 font-medium">{selectedCharacter.currentTask}</p>
              </div>
            )}
          </div>
        )}

        {/* 聊天区域 */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-white/10 bg-slate-800/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cyan-400" />
              <h3 className="font-bold text-white">3D 团队聊天</h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.isUser ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-end gap-2 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      msg.isUser 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                        : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300'
                    }`}>
                      {msg.isUser ? '👤' : characters.find(c => c.id === msg.senderId)?.avatar || '🤖'}
                    </div>
                    <div className={`px-4 py-2 rounded-2xl ${
                      msg.isUser 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none' 
                        : 'bg-slate-800 text-white rounded-tl-none border border-white/10'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.isUser ? 'text-cyan-200' : 'text-slate-400'}`}>
                        {msg.senderName} · {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          <div className="p-4 border-t border-white/10 bg-slate-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="在 3D 办公室里说点什么..."
                className="flex-1 px-4 py-3 bg-slate-800 rounded-xl border-2 border-transparent focus:border-cyan-500 focus:bg-slate-700 focus:outline-none text-white placeholder-slate-500 transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 创建新角色弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-8" onClick={() => setShowCreateModal(false)}>
          <div className="relative max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-3xl opacity-50" />
            <div className="relative bg-slate-900 rounded-3xl p-8 shadow-2xl border border-white/10">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white">加入 3D 办公室</h2>
                <p className="text-slate-400">创建新的 3D 角色</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">角色姓名</label>
                  <input
                    type="text"
                    value={newCharacterName}
                    onChange={(e) => setNewCharacterName(e.target.value)}
                    placeholder="输入角色姓名..."
                    className="w-full px-4 py-3 bg-slate-800 rounded-xl border-2 border-transparent focus:border-cyan-500 focus:bg-slate-700 focus:outline-none text-white placeholder-slate-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">角色类型</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['boss', 'developer', 'designer', 'manager', 'intern', 'custom'] as OfficeRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => setNewCharacterRole(role)}
                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                          newCharacterRole === role
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {role === 'boss' ? '老板' :
                         role === 'developer' ? '开发' :
                         role === 'designer' ? '设计' :
                         role === 'manager' ? '经理' :
                         role === 'intern' ? '实习' : '自定义'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={createNewCharacter}
                  disabled={!newCharacterName.trim()}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Save className="h-5 w-5" />
                    进入 3D 办公室！
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
