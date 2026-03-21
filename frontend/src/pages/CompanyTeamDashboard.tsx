import { useEffect, useState } from 'react'
import { 
  Briefcase, 
  User, 
  Cpu, 
  Zap,
  Building,
  Users,
  ShoppingCart,
  Gamepad2,
  Layers,
  Settings
} from 'lucide-react'

type CompanyStyle = 'tech' | 'ecommerce' | 'gaming'

type EmployeeRole = 'ceo' | 'cto' | 'developer' | 'designer' | 'manager' | 'marketer' | 'support' | 'intern'

type EmployeeStatus = 'idle' | 'working' | 'meeting' | 'lunch' | 'away'

interface Employee {
  id: string
  name: string
  role: EmployeeRole
  status: EmployeeStatus
  avatar: string
  avatarColor: string
  department: string
  currentTask: string | null
  taskProgress: number
  lastActive: Date
  skills: string[]
  projects: string[]
  isAgent: boolean
}

interface CompanyStyleConfig {
  name: string
  icon: React.ReactNode
  primaryColor: string
  secondaryColor: string
  bgGradient: string
  departments: string[]
}

const companyStyles: Record<CompanyStyle, CompanyStyleConfig> = {
  tech: {
    name: '网络科技',
    icon: <Cpu className="h-5 w-5" />,
    primaryColor: 'from-blue-500 to-cyan-500',
    secondaryColor: 'from-purple-500 to-pink-500',
    bgGradient: 'from-slate-50 via-blue-50 to-purple-50',
    departments: ['技术部', '产品部', '设计部', '运营部', '市场部']
  },
  ecommerce: {
    name: '跨境电商',
    icon: <ShoppingCart className="h-5 w-5" />,
    primaryColor: 'from-orange-500 to-red-500',
    secondaryColor: 'from-green-500 to-emerald-500',
    bgGradient: 'from-orange-50 via-red-50 to-green-50',
    departments: ['运营部', '采购部', '客服部', '物流部', '财务部']
  },
  gaming: {
    name: '游戏开发',
    icon: <Gamepad2 className="h-5 w-5" />,
    primaryColor: 'from-purple-500 to-violet-500',
    secondaryColor: 'from-pink-500 to-rose-500',
    bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
    departments: ['开发部', '美术部', '策划部', '测试部', '发行部']
  }
}

const roleConfig: Record<EmployeeRole, { label: string; avatar: string }> = {
  ceo: { label: '首席执行官', avatar: '👔' },
  cto: { label: '技术总监', avatar: '👨‍💻' },
  developer: { label: '开发工程师', avatar: '🧑‍💻' },
  designer: { label: '设计师', avatar: '🎨' },
  manager: { label: '项目经理', avatar: '📋' },
  marketer: { label: '市场专员', avatar: '📣' },
  support: { label: '客服支持', avatar: '💬' },
  intern: { label: '实习生', avatar: '🎓' }
}

const createEmployees = (style: CompanyStyle): Employee[] => {
  const depts = companyStyles[style].departments
  return [
    {
      id: 'emp-001',
      name: '张总',
      role: 'ceo',
      status: 'working',
      avatar: '👔',
      avatarColor: 'from-yellow-400 to-orange-500',
      department: depts[0],
      currentTask: '制定公司战略',
      taskProgress: 70,
      lastActive: new Date(),
      skills: ['战略规划', '团队管理', '融资'],
      projects: ['年度计划', '产品路线图'],
      isAgent: false
    },
    {
      id: 'emp-002',
      name: '李技术',
      role: 'cto',
      status: 'working',
      avatar: '👨‍💻',
      avatarColor: 'from-blue-400 to-cyan-500',
      department: depts[0],
      currentTask: '技术架构设计',
      taskProgress: 85,
      lastActive: new Date(Date.now() - 30000),
      skills: ['系统架构', '代码审查', '技术选型'],
      projects: ['微服务改造', 'DevOps建设'],
      isAgent: true
    },
    {
      id: 'emp-003',
      name: '王开发',
      role: 'developer',
      status: 'working',
      avatar: '🧑‍💻',
      avatarColor: 'from-purple-400 to-pink-500',
      department: depts[0],
      currentTask: '开发新功能',
      taskProgress: 60,
      lastActive: new Date(Date.now() - 60000),
      skills: ['React', 'TypeScript', 'Node.js'],
      projects: ['用户中心', '支付系统'],
      isAgent: true
    },
    {
      id: 'emp-004',
      name: '刘设计',
      role: 'designer',
      status: 'idle',
      avatar: '🎨',
      avatarColor: 'from-pink-400 to-rose-500',
      department: depts[2] || depts[1],
      currentTask: null,
      taskProgress: 0,
      lastActive: new Date(Date.now() - 120000),
      skills: ['UI设计', 'UX设计', 'Figma'],
      projects: ['APP改版', '品牌升级'],
      isAgent: true
    },
    {
      id: 'emp-005',
      name: '陈经理',
      role: 'manager',
      status: 'meeting',
      avatar: '📋',
      avatarColor: 'from-green-400 to-emerald-500',
      department: depts[1],
      currentTask: '项目进度会议',
      taskProgress: 45,
      lastActive: new Date(Date.now() - 180000),
      skills: ['项目管理', '敏捷开发', '团队协调'],
      projects: ['Q1项目集', '里程碑跟踪'],
      isAgent: true
    },
    {
      id: 'emp-006',
      name: '赵市场',
      role: 'marketer',
      status: 'lunch',
      avatar: '📣',
      avatarColor: 'from-orange-400 to-red-500',
      department: depts[4] || depts[3],
      currentTask: null,
      taskProgress: 0,
      lastActive: new Date(Date.now() - 300000),
      skills: ['市场分析', '内容营销', 'SEO'],
      projects: ['品牌推广', '增长黑客'],
      isAgent: true
    }
  ]
}

export default function CompanyTeamDashboard() {
  const [companyStyle, setCompanyStyle] = useState<CompanyStyle>('tech')
  const [employees, setEmployees] = useState<Employee[]>(createEmployees('tech'))
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const config = companyStyles[companyStyle]

  useEffect(() => {
    setEmployees(createEmployees(companyStyle))
    setSelectedEmployee(null)
  }, [companyStyle])

  useEffect(() => {
    const interval = setInterval(() => {
      setEmployees(prev => prev.map(emp => {
        if (Math.random() > 0.7) {
          const newProgress = Math.min(100, emp.taskProgress + Math.random() * 10)
          return {
            ...emp,
            taskProgress: newProgress,
            lastActive: new Date()
          }
        }
        return emp
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return '刚刚'
    if (seconds < 3600) return Math.floor(seconds / 60) + '分钟前'
    return Math.floor(seconds / 3600) + '小时前'
  }

  const getStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case 'working': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'meeting': return 'bg-blue-500'
      case 'lunch': return 'bg-orange-500'
      case 'away': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: EmployeeStatus) => {
    switch (status) {
      case 'working': return '工作中'
      case 'idle': return '空闲'
      case 'meeting': return '会议中'
      case 'lunch': return '午餐'
      case 'away': return '离开'
      default: return '未知'
    }
  }

  return (
    <div className={'space-y-6 p-6 min-h-screen bg-gradient-to-br ' + config.bgGradient}>
      {/* Header */}
      <div className={'bg-gradient-to-r ' + config.primaryColor + ' rounded-2xl p-8 text-white'}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building className="h-8 w-8" />
              <h1 className="text-4xl font-bold">OpenClaw 团队</h1>
            </div>
            <p className="text-white/80 text-lg">管理你的团队成员，实时监控工作进度！</p>
          </div>
          
          {/* 公司风格选择 */}
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-2">
            <span className="text-white font-medium px-3">公司风格：</span>
            {(Object.keys(companyStyles) as CompanyStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => setCompanyStyle(style)}
                className={'px-4 py-2 rounded-lg transition-all flex items-center gap-2 ' + (
                  companyStyle === style 
                    ? 'bg-white text-slate-800 shadow-lg' 
                    : 'bg-transparent text-white/70 hover:bg-white/20'
                )}
              >
                {companyStyles[style].icon}
                {companyStyles[style].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className={'p-4 rounded-xl bg-gradient-to-br ' + config.primaryColor}>
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">团队成员</p>
              <p className="text-2xl font-bold text-slate-800">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">工作中</p>
              <p className="text-2xl font-bold text-slate-800">
                {employees.filter(e => e.status === 'working').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">进行中</p>
              <p className="text-2xl font-bold text-slate-800">
                {employees.filter(e => e.currentTask).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">部门数</p>
              <p className="text-2xl font-bold text-slate-800">{config.departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Team Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 p-6 bg-slate-50">
              <h3 className="font-bold text-xl flex items-center gap-3 text-slate-800">
                <Users className="h-5 w-5" />
                {config.name}团队
              </h3>
            </div>
            <div className="p-6 grid gap-6 md:grid-cols-2">
              {employees.map(emp => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={'p-6 rounded-xl border-2 cursor-pointer transition-all ' + (
                    selectedEmployee?.id === emp.id 
                      ? 'border-blue-500 shadow-xl' 
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  )}
                >
                  {/* Employee Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={'w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br ' + emp.avatarColor}>
                          {emp.avatar}
                        </div>
                        <div className={'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ' + getStatusColor(emp.status)} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg text-slate-800">{emp.name}</h4>
                          {emp.isAgent && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 text-white">AI</span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">{roleConfig[emp.role].label}</div>
                        <div className="text-xs text-slate-400">{emp.department}</div>
                      </div>
                    </div>
                  </div>

                  {/* Current Task */}
                  {emp.currentTask && (
                    <div className="mb-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-sm font-semibold text-slate-700 mb-2">{emp.currentTask}</div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={'h-full rounded-full bg-gradient-to-br ' + emp.avatarColor}
                          style={{ width: emp.taskProgress + '%' }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>{emp.taskProgress.toFixed(0)}%</span>
                        <span>{formatTimeAgo(emp.lastActive)}</span>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {emp.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <span>{emp.projects.length} 项目</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${
                        emp.status === 'working' ? 'bg-green-100 text-green-700' :
                        emp.status === 'meeting' ? 'bg-blue-100 text-blue-700' :
                        emp.status === 'lunch' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {getStatusText(emp.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Employee Details */}
        <div className="space-y-6">
          {selectedEmployee ? (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center gap-4 mb-2">
                  <div className={'w-20 h-20 rounded-xl flex items-center justify-center text-4xl bg-gradient-to-br ' + selectedEmployee.avatarColor + ' shadow-lg'}>
                    {selectedEmployee.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-slate-800">{selectedEmployee.name}</h3>
                    <p className="text-slate-600">{roleConfig[selectedEmployee.role].label}</p>
                    <p className="text-sm text-slate-500">{selectedEmployee.department}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">技能</h4>
                  <div className="space-y-2">
                    {selectedEmployee.skills.map((skill, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="text-slate-700">{skill}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">参与项目</h4>
                  <div className="space-y-2">
                    {selectedEmployee.projects.map((project, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-500" />
                          <span className="text-blue-800">{project}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
              <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">选择一位成员</h3>
              <p className="text-slate-500">从左侧选择一位团队成员查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
