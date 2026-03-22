import { useEffect, useState, useRef } from 'react'
import { 
  Send, 
  Plus, 
  MessageSquare, 
  User, 
  Users, 
  Settings, 
  Coffee, 
  Monitor, 
  Briefcase, 
  Trash2,
  Smile,
  Zap,
  Sparkles,
  Save,
  X,
  Layout
} from 'lucide-react'

type OfficeRole = 'boss' | 'developer' | 'designer' | 'manager' | 'intern' | 'custom'

interface OfficeCharacter {
  id: string
  name: string
  role: OfficeRole
  roleName: string
  avatar: string
  color: string
  position: { x: number; y: number }
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
    id: 'office-001',
    name: '李总',
    role: 'boss',
    roleName: 'CEO',
    avatar: '👨‍💼',
    color: 'from-blue-600 to-indigo-700',
    position: { x: 10, y: 15 },
    status: 'working',
    currentTask: '审阅项目报告',
    mood: 'happy',
    lastActive: new Date(),
    deskNumber: 1
  },
  {
    id: 'office-002',
    name: '小张',
    role: 'developer',
    roleName: '高级开发',
    avatar: '🧑‍💻',
    color: 'from-green-600 to-emerald-700',
    position: { x: 25, y: 45 },
    status: 'working',
    currentTask: '编写 React 组件',
    mood: 'focused',
    lastActive: new Date(Date.now() - 60000),
    deskNumber: 2
  },
  {
    id: 'office-003',
    name: '小王',
    role: 'designer',
    roleName: 'UI设计师',
    avatar: '👩‍🎨',
    color: 'from-pink-600 to-rose-700',
    position: { x: 55, y: 35 },
    status: 'thinking',
    currentTask: '设计新界面',
    mood: 'excited',
    lastActive: new Date(Date.now() - 120000),
    deskNumber: 3
  },
  {
    id: 'office-004',
    name: '小赵',
    role: 'manager',
    roleName: '项目经理',
    avatar: '👩‍💼',
    color: 'from-purple-600 to-violet-700',
    position: { x: 75, y: 55 },
    status: 'talking',
    currentTask: '安排团队会议',
    mood: 'happy',
    lastActive: new Date(Date.now() - 180000),
    deskNumber: 4
  },
  {
    id: 'office-005',
    name: '小实习生',
    role: 'intern',
    roleName: '实习生',
    avatar: '🧑‍🎓',
    color: 'from-yellow-600 to-orange-700',
    position: { x: 40, y: 75 },
    status: 'idle',
    currentTask: '学习项目文档',
    mood: 'neutral',
    lastActive: new Date(Date.now() - 300000),
    deskNumber: 5
  }
]

const roleAvatars: Record<OfficeRole, string[]> = {
  boss: ['👨‍💼', '👩‍💼', '🕴️', '🤵'],
  developer: ['🧑‍💻', '👨‍💻', '👩‍💻', '🧙‍♂️', '🦸'],
  designer: ['👩‍🎨', '👨‍🎨', '🎨', '✨', '🖼️'],
  manager: ['👩‍💼', '👨‍💼', '📋', '📊', '🗂️'],
  intern: ['🧑‍🎓', '👨‍🎓', '👩‍🎓', '📚', '💡'],
  custom: ['🤖', '👻', '🦊', '🐱', '🐶', '🦄', '🌈', '⭐']
}

const moodEmojis = {
  happy: '😊',
  excited: '🤩',
  focused: '🎯',
  tired: '😴',
  neutral: '😐'
}

const statusAnimations = {
  idle: 'animate-pulse',
  working: 'animate-bounce',
  talking: 'animate-bounce',
  thinking: 'animate-pulse',
  away: 'opacity-50'
}

export default function OfficeDashboard() {
  const [characters, setCharacters] = useState<OfficeCharacter[]>(initialCharacters)
  const [selectedCharacter, setSelectedCharacter] = useState<OfficeCharacter | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-001',
      senderId: 'office-002',
      senderName: '小张',
      content: '老板好！我正在编写新的 React 组件，进度还不错！',
      timestamp: new Date(Date.now() - 300000),
      isUser: false
    },
    {
      id: 'msg-002',
      senderId: 'user',
      senderName: '你',
      content: '好的，继续加油！有问题随时找我。',
      timestamp: new Date(Date.now() - 240000),
      isUser: true
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCharacterName, setNewCharacterName] = useState('')
  const [newCharacterRole, setNewCharacterRole] = useState<OfficeRole>('custom')
  const [newCharacterAvatar, setNewCharacterAvatar] = useState('🤖')
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

    // 模拟角色回复
    setTimeout(() => {
      const randomChar = characters[Math.floor(Math.random() * characters.length)]
      const replies = [
        '好的，收到！我马上处理！',
        '这个想法太棒了！',
        '让我想想怎么实现...',
        '没问题，交给我吧！',
        '好的，我这就开始工作！',
        '收到指令！正在执行中...'
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
      id: `office-${Date.now()}`,
      name: newCharacterName,
      role: newCharacterRole,
      roleName: newCharacterRole === 'custom' ? '自定义角色' : 
                newCharacterRole === 'boss' ? 'CEO' :
                newCharacterRole === 'developer' ? '开发工程师' :
                newCharacterRole === 'designer' ? '设计师' :
                newCharacterRole === 'manager' ? '经理' : '实习生',
      avatar: newCharacterAvatar,
      color: 'from-cyan-600 to-teal-700',
      position: { 
        x: 20 + Math.random() * 60, 
        y: 20 + Math.random() * 60 
      },
      status: 'idle',
      currentTask: '熟悉环境中...',
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

  const getStatusAnimation = (status: string) => statusAnimations[status as keyof typeof statusAnimations] || ''
  const getMoodEmoji = (mood: string) => moodEmojis[mood as keyof typeof moodEmojis] || '😐'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* 办公室背景 */}
      <div className="absolute inset-0">
        {/* 地板 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-200 to-amber-100" />
        
        {/* 地毯 */}
        <div className="absolute bottom-1/4 left-1/4 right-1/4 h-20 bg-gradient-to-r from-red-600/30 to-red-700/30 rounded-full blur-sm" />
        
        {/* 墙壁 */}
        <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-slate-200 to-slate-100" />
        
        {/* 窗户 */}
        <div className="absolute top-8 left-8 right-8 h-48 grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-sky-300/50 to-sky-200/50 rounded-lg border-4 border-white/50" />
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-2">
                <div className="bg-sky-200/30 rounded" />
                <div className="bg-sky-200/30 rounded" />
                <div className="bg-sky-200/30 rounded" />
                <div className="bg-sky-200/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 主内容 */}
      <div className="relative z-10 h-screen flex">
        {/* 左侧 - 办公室场景 */}
        <div className="flex-1 relative p-8">
          {/* 顶部标题 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800">OpenClaw 办公室</h1>
                <p className="text-slate-500">你的 AI 团队工作空间</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              雇佣新员工
            </button>
          </div>

          {/* 办公室场景 - 角色 */}
          <div className="relative h-[calc(100vh-200px)]">
            {characters.map((char, idx) => (
              <div
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                className={`absolute cursor-pointer transform transition-all duration-500 hover:scale-110 ${
                  selectedCharacter?.id === char.id ? 'scale-125 z-20' : 'z-10'
                }`}
                style={{
                  left: `${char.position.x}%`,
                  top: `${char.position.y}%`,
                  animationDelay: `${idx * 0.2}s`
                }}
              >
                {/* 办公桌 */}
                <div className="relative">
                  <div className="w-24 h-6 bg-gradient-to-r from-amber-700 to-amber-800 rounded-lg shadow-lg -mb-1" />
                  <div className="flex justify-between px-2">
                    <div className="w-3 h-8 bg-amber-900 rounded-b" />
                    <div className="w-3 h-8 bg-amber-900 rounded-b" />
                  </div>
                  
                  {/* 电脑显示器 */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-8 bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-lg border-2 border-slate-600">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded" />
                      </div>
                    </div>
                    <div className="w-4 h-3 bg-slate-700 mx-auto rounded-b" />
                    <div className="w-8 h-2 bg-slate-800 mx-auto rounded" />
                  </div>

                  {/* 角色 */}
                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      {/* 角色发光背景 */}
                      <div className={`absolute -inset-3 bg-gradient-to-r ${char.color} rounded-full blur-lg opacity-40 ${getStatusAnimation(char.status)}`} />
                      
                      {/* 角色头像 */}
                      <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center text-3xl shadow-xl border-4 border-white ${getStatusAnimation(char.status)}`}>
                        {char.avatar}
                      </div>
                      
                      {/* 心情表情 */}
                      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center text-lg shadow-lg border-2 border-slate-200">
                        {getMoodEmoji(char.mood)}
                      </div>
                    </div>

                    {/* 名字标签 */}
                    <div className="mt-2 text-center">
                      <div className="inline-block bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg">
                        <p className="text-xs font-bold text-slate-700">{char.name}</p>
                        <p className="text-[10px] text-slate-500">{char.roleName}</p>
                      </div>
                    </div>

                    {/* 状态指示 */}
                    <div className="mt-1 flex justify-center">
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                        char.status === 'working' ? 'bg-green-100 text-green-700' :
                        char.status === 'talking' ? 'bg-blue-100 text-blue-700' :
                        char.status === 'thinking' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          char.status === 'working' ? 'bg-green-500 animate-pulse' :
                          char.status === 'talking' ? 'bg-blue-500 animate-pulse' :
                          char.status === 'thinking' ? 'bg-yellow-500 animate-pulse' :
                          'bg-slate-400'
                        }`} />
                        <span className="text-[10px] font-medium">
                          {char.status === 'working' ? '工作中' :
                           char.status === 'talking' ? '对话中' :
                           char.status === 'thinking' ? '思考中' : '空闲'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧 - 聊天和详情面板 */}
        <div className="w-96 bg-white/80 backdrop-blur-xl border-l border-slate-200 flex flex-col">
          {/* 选中角色详情 */}
          {selectedCharacter && (
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedCharacter.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {selectedCharacter.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-800">{selectedCharacter.name}</h3>
                  <p className="text-slate-500">{selectedCharacter.roleName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg">{getMoodEmoji(selectedCharacter.mood)}</span>
                    <span className="text-sm text-slate-400">办公桌 #{selectedCharacter.deskNumber}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCharacter(null)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {selectedCharacter.currentTask && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">{selectedCharacter.currentTask}</p>
                </div>
              )}
            </div>
          )}

          {/* 聊天区域 */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-slate-600" />
                <h3 className="font-bold text-slate-800">团队聊天</h3>
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
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                          : 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700'
                      }`}>
                        {msg.isUser ? '👤' : characters.find(c => c.id === msg.senderId)?.avatar || '🤖'}
                      </div>
                      <div className={`px-4 py-2 rounded-2xl ${
                        msg.isUser 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 rounded-tl-none shadow-sm border border-slate-200'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
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
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                  <Smile className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="对团队说点什么..."
                  className="flex-1 px-4 py-3 bg-slate-100 rounded-xl border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 创建新角色弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-8" onClick={() => setShowCreateModal(false)}>
          <div className="relative max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur-3xl opacity-50" />
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-3xl mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">雇佣新员工</h2>
                <p className="text-slate-500">为你的团队添加新角色</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">角色姓名</label>
                  <input
                    type="text"
                    value={newCharacterName}
                    onChange={(e) => setNewCharacterName(e.target.value)}
                    placeholder="输入角色姓名..."
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">角色类型</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['boss', 'developer', 'designer', 'manager', 'intern', 'custom'] as OfficeRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => setNewCharacterRole(role)}
                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                          newCharacterRole === role
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">选择头像</label>
                  <div className="flex flex-wrap gap-2">
                    {roleAvatars[newCharacterRole].map((avatar, idx) => (
                      <button
                        key={idx}
                        onClick={() => setNewCharacterAvatar(avatar)}
                        className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                          newCharacterAvatar === avatar
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 scale-110 shadow-lg'
                            : 'bg-slate-100 hover:bg-slate-200 hover:scale-105'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={createNewCharacter}
                  disabled={!newCharacterName.trim()}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Save className="h-5 w-5" />
                    加入团队！
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
