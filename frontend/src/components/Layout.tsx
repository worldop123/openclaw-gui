import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Workflow,
  Brain,
  MessageSquare,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  User,
  UserRound
} from 'lucide-react'

const navigation = [
  { name: '团队仪表盘', href: '/', icon: UserRound },
  { name: '系统仪表板', href: '/dashboard', icon: LayoutDashboard },
  { name: '会话管理', href: '/sessions', icon: Users },
  { name: '工具管理', href: '/tools', icon: Wrench },
  { name: '工作流', href: '/workflow', icon: Workflow },
  { name: '记忆系统', href: '/memory', icon: Brain },
  { name: '飞书集成', href: '/feishu', icon: MessageSquare },
  { name: '设置', href: '/settings', icon: Settings },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
              <span className="font-bold text-lg">OpenClaw GUI</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
            <div>
              <h1 className="font-bold text-lg">OpenClaw GUI</h1>
              <p className="text-xs text-slate-500">可视化工作界面</p>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          
          {/* Stats sidebar */}
          <div className="mt-auto space-y-4">
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="font-semibold mb-2">系统状态</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">连接状态</span>
                  <span className="text-sm font-medium text-green-600">已连接</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">活跃会话</span>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">工具调用</span>
                  <span className="text-sm font-medium">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">记忆条目</span>
                  <span className="text-sm font-medium">128</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white/95 backdrop-blur px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">打开侧边栏</span>
            <Menu className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-slate-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
              {/* Search */}
              <div className="relative flex-1 max-w-2xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="search"
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="搜索会话、工具、记忆..."
                />
              </div>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button
                type="button"
                className="relative rounded-lg p-2 hover:bg-slate-100"
                onClick={() => setNotifications(0)}
              >
                <span className="sr-only">查看通知</span>
                <Bell className="h-5 w-5 text-slate-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-x-3 rounded-lg p-2 hover:bg-slate-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="hidden text-left lg:block">
                    <p className="text-sm font-medium text-slate-700">OpenClaw 用户</p>
                    <p className="text-xs text-slate-500">管理员</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
