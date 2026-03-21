import { useState } from 'react'
import { 
  Package, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Pause,
  Search,
  Filter,
  Plus,
  Settings,
  Trash2,
  Download
} from 'lucide-react'

interface Skill {
  id: string
  name: string
  description: string
  version: string
  author: string
  category: string
  status: 'enabled' | 'disabled' | 'updating'
  installed: boolean
  icon: string
  rating: number
  downloads: number
  tags: string[]
}

const initialSkills: Skill[] = [
  {
    id: 'skill-001',
    name: 'Clawsec / Skill-Vetter',
    description: '安全守门人 - 审计所有技能权限，防后门、防数据泄露，系统级安全保障',
    version: '1.2.0',
    author: 'OpenClaw Team',
    category: 'security',
    status: 'enabled',
    installed: true,
    icon: '🔐',
    rating: 4.8,
    downloads: 15420,
    tags: ['安全', '权限', '审计']
  },
  {
    id: 'skill-002',
    name: 'Tavily Search',
    description: '联网大脑 - 实时联网搜索，解决AI知识滞后，查新闻、数据、资料必备',
    version: '2.1.0',
    author: 'Tavily AI',
    category: 'search',
    status: 'enabled',
    installed: true,
    icon: '🌐',
    rating: 4.9,
    downloads: 28930,
    tags: ['搜索', '联网', 'AI']
  },
  {
    id: 'skill-003',
    name: 'Self-Improving Agent',
    description: '自我进化 - 记录错误、学习纠正，越用越懂你，减少重复犯错',
    version: '1.5.0',
    author: 'OpenClaw Team',
    category: 'ai',
    status: 'enabled',
    installed: true,
    icon: '🧠',
    rating: 4.7,
    downloads: 12050,
    tags: ['学习', '进化', 'AI']
  },
  {
    id: 'skill-004',
    name: 'GitHub',
    description: '代码仓库管家 - 自然语言管理仓库、查Issue、审PR、写报告，开发必备',
    version: '3.0.0',
    author: 'GitHub',
    category: 'development',
    status: 'disabled',
    installed: true,
    icon: '💻',
    rating: 4.6,
    downloads: 21340,
    tags: ['GitHub', '代码', '开发']
  },
  {
    id: 'skill-005',
    name: 'Weather',
    description: '天气查询 - 免费、免API、双数据源，日常出行/办公场景刚需',
    version: '1.0.0',
    author: 'Community',
    category: 'utility',
    status: 'enabled',
    installed: false,
    icon: '🌤️',
    rating: 4.5,
    downloads: 8760,
    tags: ['天气', '实用', '免费']
  }
]

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'installed' && skill.installed) ||
      (statusFilter === 'enabled' && skill.status === 'enabled') ||
      (statusFilter === 'disabled' && skill.status === 'disabled')
    return matchesSearch && matchesCategory && matchesStatus
  })

  const toggleSkillStatus = (skillId: string) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        return {
          ...skill,
          status: skill.status === 'enabled' ? 'disabled' : 'enabled'
        }
      }
      return skill
    }))
  }

  const toggleInstall = (skillId: string) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        if (!skill.installed) {
          return { ...skill, installed: true, status: 'enabled' }
        } else {
          return { ...skill, installed: false, status: 'disabled' }
        }
      }
      return skill
    }))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'bg-red-100 text-red-800'
      case 'search': return 'bg-blue-100 text-blue-800'
      case 'ai': return 'bg-purple-100 text-purple-800'
      case 'development': return 'bg-green-100 text-green-800'
      case 'utility': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'security': return '安全'
      case 'search': return '搜索'
      case 'ai': return 'AI'
      case 'development': return '开发'
      case 'utility': return '实用'
      default: return '其他'
    }
  }

  const stats = {
    total: skills.length,
    installed: skills.filter(s => s.installed).length,
    enabled: skills.filter(s => s.status === 'enabled').length,
    available: skills.filter(s => !s.installed).length
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">技能管理</h2>
          <p className="text-slate-600">管理和配置 OpenClaw 技能</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {stats.enabled} 已启用
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {stats.installed} 已安装
            </span>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            发现技能
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
            placeholder="搜索技能..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 筛选 */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部分类</option>
            <option value="security">安全</option>
            <option value="search">搜索</option>
            <option value="ai">AI</option>
            <option value="development">开发</option>
            <option value="utility">实用</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部状态</option>
            <option value="installed">已安装</option>
            <option value="enabled">已启用</option>
            <option value="disabled">已禁用</option>
          </select>
        </div>
      </div>

      {/* 技能列表 */}
      <div className="grid gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* 图标 */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl">
                {skill.icon}
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-xl text-slate-800">{skill.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${getCategoryColor(skill.category)}`}>
                        {getCategoryName(skill.category)}
                      </span>
                      {skill.installed ? (
                        skill.status === 'enabled' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            已启用
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            已禁用
                          </span>
                        )
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                          可用
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-3">{skill.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {skill.installed && (
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <Settings className="h-5 w-5 text-slate-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 元信息 */}
                <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
                  <span>v{skill.version}</span>
                  <span>•</span>
                  <span>{skill.author}</span>
                  <span>•</span>
                  <span>⭐ {skill.rating}</span>
                  <span>•</span>
                  <span>📥 {skill.downloads.toLocaleString()}</span>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {skill.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-3">
                  {skill.installed ? (
                    <>
                      <button
                        onClick={() => toggleSkillStatus(skill.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                          skill.status === 'enabled'
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {skill.status === 'enabled' ? (
                          <>
                            <Pause className="h-4 w-4" />
                            禁用
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            启用
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => toggleInstall(skill.id)}
                        className="px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        卸载
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => toggleInstall(skill.id)}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      安装
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">暂无技能</h3>
          <p className="text-slate-400">没有找到匹配的技能</p>
        </div>
      )}
    </div>
  )
}
