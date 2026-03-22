import { useEffect, useState } from 'react'
import { 
  Zap, 
  Sparkles, 
  Star, 
  Heart,
  Coffee,
  Code,
  Cpu,
  Search,
  BookOpen,
  Shield,
  MessageSquare,
  Users,
  Settings,
  Moon,
  Sun,
  Smile,
  Frown,
  Meh,
  Brain,
  FileText,
  Globe,
  Calendar,
  CheckCircle
} from 'lucide-react'

type CharacterMood = 'happy' | 'excited' | 'focused' | 'tired' | 'sleeping' | 'thinking'

interface AnimeCharacter {
  id: string
  name: string
  role: string
  avatar: string
  color: string
  mood: CharacterMood
  status: 'idle' | 'working' | 'talking' | 'thinking' | 'away'
  currentActivity: string
  activityProgress: number
  lastUpdate: Date
  skills: string[]
  level: number
  exp: number
  maxExp: number
}

const animeCharacters: AnimeCharacter[] = [
  {
    id: 'anime-001',
    name: '小明',
    role: '团队领袖',
    avatar: '👨‍💼',
    color: 'from-blue-400 to-cyan-500',
    mood: 'happy',
    status: 'working',
    currentActivity: '协调团队工作',
    activityProgress: 75,
    lastUpdate: new Date(),
    skills: ['管理', '决策', '沟通'],
    level: 25,
    exp: 8500,
    maxExp: 10000
  },
  {
    id: 'anime-002',
    name: '代码小助手',
    role: '开发专家',
    avatar: '🧙‍♂️',
    color: 'from-purple-400 to-pink-500',
    mood: 'excited',
    status: 'working',
    currentActivity: '编写神奇代码',
    activityProgress: 88,
    lastUpdate: new Date(Date.now() - 15000),
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    level: 30,
    exp: 9500,
    maxExp: 12000
  },
  {
    id: 'anime-003',
    name: '飞书小管家',
    role: '日程管理',
    avatar: '🏹',
    color: 'from-green-400 to-emerald-500',
    mood: 'focused',
    status: 'working',
    currentActivity: '安排日程会议',
    activityProgress: 45,
    lastUpdate: new Date(Date.now() - 30000),
    skills: ['日历', '任务', '文档', '会议'],
    level: 22,
    exp: 7200,
    maxExp: 9000
  },
  {
    id: 'anime-004',
    name: '记忆管理员',
    role: '知识守护',
    avatar: '🧠',
    color: 'from-yellow-400 to-orange-500',
    mood: 'thinking',
    status: 'thinking',
    currentActivity: '整理回忆碎片',
    activityProgress: 60,
    lastUpdate: new Date(Date.now() - 45000),
    skills: ['记忆', '检索', '分析'],
    level: 20,
    exp: 6500,
    maxExp: 8000
  },
  {
    id: 'anime-005',
    name: '文件管理员',
    role: '资料整理',
    avatar: '🛡️',
    color: 'from-red-400 to-rose-500',
    mood: 'focused',
    status: 'working',
    currentActivity: '整理重要文件',
    activityProgress: 35,
    lastUpdate: new Date(Date.now() - 60000),
    skills: ['文件', '备份', '归档'],
    level: 18,
    exp: 5800,
    maxExp: 7000
  },
  {
    id: 'anime-006',
    name: '网络探索者',
    role: '情报收集',
    avatar: '🥷',
    color: 'from-indigo-400 to-violet-500',
    mood: 'sleeping',
    status: 'away',
    currentActivity: '充电中...',
    activityProgress: 0,
    lastUpdate: new Date(Date.now() - 120000),
    skills: ['搜索', '收集', '数据'],
    level: 24,
    exp: 8200,
    maxExp: 9500
  }
]

const moodEmojis = {
  happy: '😊',
  excited: '🤩',
  focused: '🎯',
  tired: '😴',
  sleeping: '💤',
  thinking: '🤔'
}

const moodColors = {
  happy: 'from-yellow-400 to-orange-400',
  excited: 'from-pink-400 to-rose-400',
  focused: 'from-blue-400 to-indigo-400',
  tired: 'from-slate-400 to-gray-400',
  sleeping: 'from-purple-400 to-indigo-400',
  thinking: 'from-cyan-400 to-teal-400'
}

const statusAnimations = {
  idle: 'animate-pulse',
  working: 'animate-bounce',
  talking: 'animate-bounce',
  thinking: 'animate-pulse',
  away: 'opacity-50'
}

export default function AnimeDashboard() {
  const [characters, setCharacters] = useState<AnimeCharacter[]>(animeCharacters)
  const [selectedCharacter, setSelectedCharacter] = useState<AnimeCharacter | null>(null)
  const [showSparkles, setShowSparkles] = useState(true)

  // 模拟实时更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCharacters(prev => prev.map(char => {
        if (char.status === 'working' && Math.random() > 0.6) {
          const newProgress = Math.min(100, char.activityProgress + Math.random() * 8)
          
          // 随机改变心情
          let newMood = char.mood
          if (Math.random() > 0.9) {
            const moods: CharacterMood[] = ['happy', 'excited', 'focused', 'thinking']
            newMood = moods[Math.floor(Math.random() * moods.length)]
          }
          
          return {
            ...char,
            activityProgress: newProgress,
            mood: newMood,
            lastUpdate: new Date()
          }
        }
        return char
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 5) return '刚刚'
    if (seconds < 60) return seconds + '秒前'
    if (seconds < 3600) return Math.floor(seconds / 60) + '分钟前'
    return Math.floor(seconds / 3600) + '小时前'
  }

  const getMoodIcon = (mood: CharacterMood) => moodEmojis[mood] || '😊'
  const getMoodColor = (mood: CharacterMood) => moodColors[mood] || moodColors.happy
  const getStatusAnimation = (status: string) => statusAnimations[status as keyof typeof statusAnimations] || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* 背景装饰 - 动态星星 */}
      {showSparkles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.5
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 p-8">
        {/* 头部标题 - 动漫风格 */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-r from-slate-800/90 via-purple-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500/30">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Sparkles className="h-12 w-12 text-yellow-400 animate-spin" />
                <h1 className="text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  OpenClaw アニメスタジオ
                </h1>
                <Sparkles className="h-12 w-12 text-yellow-400 animate-spin" />
              </div>
              <p className="text-xl text-purple-200 font-medium">
                ✨ 欢迎来到动漫风格的 OpenClaw 团队！✨
              </p>
            </div>
          </div>
        </div>

        {/* 统计面板 - 动漫卡片风格 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: '团队成员', value: characters.length, icon: Users, color: 'from-pink-500 to-rose-500' },
            { label: '活跃中', value: characters.filter(c => c.status === 'working').length, icon: Zap, color: 'from-yellow-500 to-orange-500' },
            { label: '总等级', value: characters.reduce((sum, c) => sum + c.level, 0), icon: Star, color: 'from-purple-500 to-indigo-500' },
            { label: '好心情', value: characters.filter(c => c.mood === 'happy' || c.mood === 'excited').length, icon: Heart, color: 'from-green-500 to-emerald-500' }
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`} />
                <div className="relative bg-slate-800/80 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 角色网格 - 动漫卡片风格 */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((char, idx) => (
            <div
              key={char.id}
              onClick={() => setSelectedCharacter(char)}
              className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1 ${
                selectedCharacter?.id === char.id ? 'scale-105 rotate-1' : ''
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* 发光背景 */}
              <div className={`absolute inset-0 bg-gradient-to-r ${char.color} rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity`} />
              
              {/* 角色卡片 */}
              <div className={`relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-6 border-2 transition-all duration-300 ${
                selectedCharacter?.id === char.id 
                  ? 'border-white/50 shadow-2xl shadow-purple-500/30' 
                  : 'border-white/10 hover:border-white/30'
              }`}>
                
                {/* 角色头像区域 */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    {/* 头像光环 */}
                    <div className={`absolute -inset-3 bg-gradient-to-r ${char.color} rounded-full blur-lg opacity-60 animate-pulse`} />
                    
                    {/* 头像 */}
                    <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center text-5xl shadow-2xl ${getStatusAnimation(char.status)}`}>
                      {char.avatar}
                    </div>
                    
                    {/* 心情表情 */}
                    <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r ${getMoodColor(char.mood)} flex items-center justify-center text-xl border-4 border-slate-900 shadow-lg`}>
                      {getMoodIcon(char.mood)}
                    </div>
                  </div>
                  
                  {/* 名字和角色 */}
                  <h3 className="text-2xl font-black text-white mt-4 mb-1">{char.name}</h3>
                  <p className="text-sm text-purple-300 font-medium">{char.role}</p>
                </div>

                {/* 等级条 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">等级 {char.level}</span>
                    <span className="text-xs text-yellow-400">{char.exp}/{char.maxExp}</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000`}
                      style={{ width: `${(char.exp / char.maxExp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 当前活动 */}
                {char.currentActivity && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-2xl border border-slate-600/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-slate-300 font-medium">{char.currentActivity}</span>
                    </div>
                    <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${char.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${char.activityProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{Math.round(char.activityProgress)}%</span>
                      <span>{formatTimeAgo(char.lastUpdate)}</span>
                    </div>
                  </div>
                )}

                {/* 技能标签 */}
                <div className="flex flex-wrap gap-2">
                  {char.skills.map((skill, skillIdx) => (
                    <span
                      key={skillIdx}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r ${char.color} text-white shadow-lg`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* 状态指示 */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      char.status === 'working' ? 'bg-green-400 animate-pulse' :
                      char.status === 'away' ? 'bg-slate-400' :
                      'bg-yellow-400'
                    }`} />
                    <span className="text-sm text-slate-400">
                      {char.status === 'working' ? '努力工作中' :
                       char.status === 'away' ? '暂时离开' :
                       char.status === 'thinking' ? '思考中...' : '空闲'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 选中角色详情 */}
        {selectedCharacter && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8" onClick={() => setSelectedCharacter(null)}>
            <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
              <div className={`absolute inset-0 bg-gradient-to-r ${selectedCharacter.color} rounded-3xl blur-3xl opacity-50`} />
              <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 border-2 border-white/20">
                <button 
                  onClick={() => setSelectedCharacter(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center text-white transition-colors"
                >
                  ✕
                </button>
                
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-4">
                    <div className={`absolute -inset-4 bg-gradient-to-r ${selectedCharacter.color} rounded-full blur-xl opacity-60`} />
                    <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${selectedCharacter.color} flex items-center justify-center text-7xl shadow-2xl`}>
                      {selectedCharacter.avatar}
                    </div>
                  </div>
                  <h2 className="text-4xl font-black text-white mb-2">{selectedCharacter.name}</h2>
                  <p className="text-xl text-purple-300">{selectedCharacter.role}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-2xl">{getMoodIcon(selectedCharacter.mood)}</span>
                    <span className="text-yellow-400 font-bold">Lv.{selectedCharacter.level}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-3">属性</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">经验值</span>
                          <span className="text-yellow-400 font-mono">{selectedCharacter.exp}/{selectedCharacter.maxExp}</span>
                        </div>
                        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full`}
                            style={{ width: `${(selectedCharacter.exp / selectedCharacter.maxExp) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white mb-3">当前活动</h4>
                    <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                      <p className="text-slate-300">{selectedCharacter.currentActivity}</p>
                      <div className="mt-2 h-3 bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${selectedCharacter.color} rounded-full`}
                          style={{ width: `${selectedCharacter.activityProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white mb-3">技能</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacter.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r ${selectedCharacter.color} text-white`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setSelectedCharacter(null)}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
