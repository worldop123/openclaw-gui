import { useState } from 'react'
import { 
  Shield, 
  Search, 
  Brain, 
  Zap,
  Globe,
  FileText,
  Github,
  Briefcase,
  PackageSearch,
  Sun,
  ChevronRight
} from 'lucide-react'

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'ready' | 'in-progress' | 'planned'
  pagePath?: string
  tags: string[]
}

const features: Feature[] = [
  {
    id: 'team-dashboard',
    title: '公司团队可视化',
    description: '3种公司风格可选，8种真实职业角色，实时团队状态监控',
    icon: <Briefcase className="h-6 w-6" />,
    status: 'ready',
    pagePath: '/',
    tags: ['核心', '团队', '可视化']
  },
  {
    id: 'sessions',
    title: '会话管理',
    description: '实时会话面板，会话列表和详情，搜索和筛选',
    icon: <ChevronRight className="h-6 w-6" />,
    status: 'ready',
    pagePath: '/sessions',
    tags: ['核心', '会话']
  },
  {
    id: 'tools',
    title: '工具调用可视化',
    description: '实时工具调用监控，输入输出详情，状态跟踪',
    icon: <Zap className="h-6 w-6" />,
    status: 'ready',
    pagePath: '/tools',
    tags: ['核心', '工具']
  },
  {
    id: 'messages',
    title: '消息流可视化',
    description: '实时消息流，消息类型分类，搜索和筛选',
    icon: <ChevronRight className="h-6 w-6" />,
    status: 'ready',
    pagePath: '/messages',
    tags: ['核心', '消息']
  },
  {
    id: 'skills',
    title: '技能管理',
    description: '技能安装和配置，技能启用/禁用，技能分类',
    icon: <PackageSearch className="h-6 w-6" />,
    status: 'ready',
    pagePath: '/skills',
    tags: ['核心', '技能']
  },
  {
    id: 'settings',
    title: '配置中心',
    description: '完整设置界面，Gateway配置，外观和安全设置',
    icon: <ChevronRight className="h-6 w-6" />,
    status: 'ready',
    pagePath: '/settings',
    tags: ['核心', '设置']
  },
  {
    id: 'clawsec',
    title: '安全守门人',
    description: '审计所有技能权限，防后门、防数据泄露，系统级安全保障',
    icon: <Shield className="h-6 w-6" />,
    status: 'planned',
    tags: ['安全', '技能']
  },
  {
    id: 'tavily-search',
    title: '联网大脑',
    description: '实时联网搜索，解决AI知识滞后，查新闻、数据、资料必备',
    icon: <Search className="h-6 w-6" />,
    status: 'planned',
    tags: ['搜索', 'AI', '技能']
  },
  {
    id: 'self-improving',
    title: '自我进化',
    description: '记录错误、学习纠正，越用越懂你，减少重复犯错',
    icon: <Brain className="h-6 w-6" />,
    status: 'planned',
    tags: ['AI', '学习', '技能']
  },
  {
    id: 'proactive-agent',
    title: '主动助手',
    description: '从被动响应变主动服务，自动提醒、预测需求、提前干活',
    icon: <Zap className="h-6 w-6" />,
    status: 'planned',
    tags: ['AI', '助手', '技能']
  },
  {
    id: 'agent-browser',
    title: '浏览器自动化',
    description: '模拟人操作浏览器：打开、点击、填表、截图、抓数据',
    icon: <Globe className="h-6 w-6" />,
    status: 'planned',
    tags: ['浏览器', '自动化', '技能']
  },
  {
    id: 'summarize',
    title: '内容摘要',
    description: '网页、PDF、长文、视频一键提炼核心，信息降噪神器',
    icon: <FileText className="h-6 w-6" />,
    status: 'planned',
    tags: ['内容', '摘要', '技能']
  },
  {
    id: 'github',
    title: '代码仓库管家',
    description: '自然语言管理仓库、查Issue、审PR、写报告，开发必备',
    icon: <Github className="h-6 w-6" />,
    status: 'planned',
    tags: ['GitHub', '代码', '技能']
  },
  {
    id: 'office-automation',
    title: '办公全能王',
    description: '批量处理Word/Excel/PPT、自动周报、数据汇总、格式转换',
    icon: <Briefcase className="h-6 w-6" />,
    status: 'planned',
    tags: ['Office', '自动化', '技能']
  },
  {
    id: 'find-skills',
    title: '技能导航',
    description: '自动找适配技能、推荐插件，解决"不知道装什么"',
    icon: <PackageSearch className="h-6 w-6" />,
    status: 'planned',
    tags: ['技能', '导航', '技能']
  },
  {
    id: 'weather',
    title: '天气查询',
    description: '免费、免API、双数据源，日常出行/办公场景刚需',
    icon: <Sun className="h-6 w-6" />,
    status: 'planned',
    tags: ['天气', '实用', '技能']
  }
]

const statusConfig = {
  ready: { label: '已完成', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' },
  'in-progress': { label: '进行中', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300' },
  planned: { label: '计划中', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-300' }
}

export default function Features() {
  const [filter, setFilter] = useState<string>('all')

  const filteredFeatures = filter === 'all' 
    ? features 
    : features.filter(f => f.status === filter)

  const stats = {
    total: features.length,
    ready: features.filter(f => f.status === 'ready').length,
    inProgress: features.filter(f => f.status === 'in-progress').length,
    planned: features.filter(f => f.status === 'planned').length
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">🚀 OpenClaw 功能总览</h1>
            <p className="text-purple-100 text-lg">所有功能和技能的完整列表</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-purple-200 text-sm">总功能</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.ready}</div>
              <div className="text-purple-200 text-sm">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.inProgress}</div>
              <div className="text-purple-200 text-sm">进行中</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.planned}</div>
              <div className="text-purple-200 text-sm">计划中</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-slate-600 font-medium">筛选：</span>
        {(['all', 'ready', 'in-progress', 'planned'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === status
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {status === 'all' ? '全部' : statusConfig[status].label}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFeatures.map((feature) => {
          const config = statusConfig[feature.status]
          return (
            <div
              key={feature.id}
              className={'bg-white rounded-xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-xl ' + config.border}
            >
              <div className={'p-6 ' + config.bg}>
                <div className="flex items-center justify-between mb-4">
                  <div className={'w-12 h-12 rounded-xl flex items-center justify-center text-white ' + (
                    feature.status === 'ready' 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : feature.status === 'in-progress'
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                      : 'bg-gradient-to-br from-yellow-500 to-orange-600'
                  )}>
                    {feature.icon}
                  </div>
                  <span className={'px-3 py-1 rounded-full text-sm font-medium ' + config.bg + ' ' + config.color}>
                    {config.label}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{feature.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {feature.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12">
          <PackageSearch className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">暂无功能</h3>
          <p className="text-slate-500">没有找到匹配的功能</p>
        </div>
      )}

      {/* Bottom Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-lg mb-4 text-slate-800">📋 功能说明</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-medium text-slate-700">已完成</span>
            </div>
            <p className="text-sm text-slate-600">功能已经实现并可以使用</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="font-medium text-slate-700">进行中</span>
            </div>
            <p className="text-sm text-slate-600">正在开发中，即将完成</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="font-medium text-slate-700">计划中</span>
            </div>
            <p className="text-sm text-slate-600">未来计划实现的功能</p>
          </div>
        </div>
      </div>
    </div>
  )
}
