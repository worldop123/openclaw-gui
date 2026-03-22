import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  MessageSquare, 
  Wrench, 
  Users, 
  Package, 
  Settings,
  Zap,
  Building,
  PackageSearch,
  Shield,
  AlertTriangle
} from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '冒险队', icon: Users },
    { path: '/company', label: '公司团队', icon: Building },
    { path: '/classic', label: '经典风格', icon: Home },
    { path: '/features', label: '功能总览', icon: PackageSearch },
    { path: '/sessions', label: '会话', icon: MessageSquare },
    { path: '/tools', label: '工具', icon: Wrench },
    { path: '/messages', label: '消息', icon: Zap },
    { path: '/skills', label: '技能', icon: Package },
    { path: '/supervisor', label: 'AI监督', icon: AlertTriangle },
    { path: '/guardian', label: '守护进程', icon: Shield },
    { path: '/settings', label: '设置', icon: Settings }
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800">OpenClaw</h1>
              <p className="text-xs text-slate-500">Complete GUI</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">系统就绪</p>
                <p className="text-xs text-slate-500">10个功能模块</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
