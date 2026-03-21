import React, { useEffect, useState } from 'react'
import { 
  Activity, 
  Cpu, 
  Database, 
  MessageSquare,
  TrendingUp,
  Clock,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  Play,
  StopCircle
} from 'lucide-react'
import { useStore } from '../store'
import { cn, formatTimeAgo } from '../lib/utils'
import StatCard from '../components/StatCard'
import SessionList from '../components/SessionList'
import ToolUsageChart from '../components/ToolUsageChart'
import RecentActivity from '../components/RecentActivity'

export default function Dashboard() {
  const { 
    sessions, 
    tools, 
    stats, 
    isConnected,
    sendCommand 
  } = useStore()
  
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkIn: 0,
    networkOut: 0,
  })
  
  const [recentCommands, setRecentCommands] = useState([
    { id: 1, command: 'read /root/.openclaw/workspace/SOUL.md', timestamp: new Date(Date.now() - 300000), success: true },
    { id: 2, command: 'exec openclaw gateway status', timestamp: new Date(Date.now() - 600000), success: true },
    { id: 3, command: 'feishu_calendar_event list', timestamp: new Date(Date.now() - 900000), success: true },
    { id: 4, command: 'memory_recall query="openclaw"', timestamp: new Date(Date.now() - 1200000), success: true },
  ])
  
  // 模拟系统监控数据
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        cpuUsage: Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 10),
        memoryUsage: Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 5),
        diskUsage: Math.min(100, prev.diskUsage + (Math.random() - 0.5) * 2),
        networkIn: Math.max(0, prev.networkIn + (Math.random() - 0.5) * 100),
        networkOut: Math.max(0, prev.networkOut + (Math.random() - 0.5) * 100),
      }))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  const activeSessions = sessions.filter(s => s.status === 'active')
  const recentTools = [...tools]
    .sort((a, b) => (b.lastCalled || '').localeCompare(a.lastCalled || ''))
    .slice(0, 5)
  
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'restart':
        sendCommand('openclaw gateway restart')
        break
      case 'status':
        sendCommand('openclaw gateway status')
        break
      case 'clear_cache':
        sendCommand('exec rm -rf /tmp/openclaw/*')
        break
      case 'test_connection':
        sendCommand('exec ping -c 1 8.8.8.8')
        break
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
        <p className="text-muted-foreground mt-2">
          监控和管理OpenClaw工作流，实时查看系统状态
        </p>
      </div>
      
      {/* Connection Status */}
      <div className={cn(
        "rounded-lg border p-4",
        isConnected 
          ? "border-green-500/20 bg-green-500/5" 
          : "border-red-500/20 bg-red-500/5"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-3 w-3 rounded-full animate-pulse",
              isConnected ? "bg-green-500" : "bg-red-500"
            )} />
            <div>
              <h3 className="font-semibold">
                {isConnected ? '已连接到OpenClaw Gateway' : '未连接到OpenClaw Gateway'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isConnected 
                  ? '所有服务运行正常，可以开始工作' 
                  : '请检查OpenClaw Gateway服务状态'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickAction('restart')}
              className="px-3 py-1.5 text-sm rounded-lg border hover:bg-accent"
            >
              <Play className="h-4 w-4 inline mr-1" />
              重启服务
            </button>
            <button
              onClick={() => handleQuickAction('status')}
              className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Activity className="h-4 w-4 inline mr-1" />
              检查状态
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="活跃会话"
          value={stats.activeSessions}
          icon={Users}
          trend="up"
          trendValue="12%"
          description="当前活跃的会话数量"
        />
        <StatCard
          title="工具调用"
          value={stats.toolCallsToday}
          icon={Zap}
          trend="up"
          trendValue="24%"
          description="今日工具调用次数"
        />
        <StatCard
          title="记忆条目"
          value={stats.memoryItems}
          icon={Database}
          trend="steady"
          description="LanceDB中的记忆数量"
        />
        <StatCard
          title="响应时间"
          value="128ms"
          icon={Clock}
          trend="down"
          trendValue="8%"
          description="平均响应时间"
        />
      </div>
      
      {/* System Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* System Metrics */}
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              系统指标
            </h3>
            <span className="text-sm text-muted-foreground">实时监控</span>
          </div>
          
          <div className="space-y-4">
            {/* CPU Usage */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">CPU使用率</span>
                <span className="font-medium">{systemStats.cpuUsage.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-openclaw-blue to-openclaw-purple transition-all duration-500"
                  style={{ width: `${systemStats.cpuUsage}%` }}
                />
              </div>
            </div>
            
            {/* Memory Usage */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">内存使用率</span>
                <span className="font-medium">{systemStats.memoryUsage.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-openclaw-green to-openclaw-blue transition-all duration-500"
                  style={{ width: `${systemStats.memoryUsage}%` }}
                />
              </div>
            </div>
            
            {/* Disk Usage */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">磁盘使用率</span>
                <span className="font-medium">{systemStats.diskUsage.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-openclaw-yellow to-openclaw-red transition-all duration-500"
                  style={{ width: `${systemStats.diskUsage}%` }}
                />
              </div>
            </div>
            
            {/* Network */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  网络流入
                </div>
                <div className="text-lg font-semibold">
                  {systemStats.networkIn.toFixed(0)} KB/s
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4 rotate-180" />
                  网络流出
                </div>
                <div className="text-lg font-semibold">
                  {systemStats.networkOut.toFixed(0)} KB/s
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tool Usage Chart */}
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              工具使用统计
            </h3>
            <span className="text-sm text-muted-foreground">今日</span>
          </div>
          <ToolUsageChart />
        </div>
      </div>
      
      {/* Recent Activity & Sessions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border">
          <div className="border-b p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              最近活动
            </h3>
          </div>
          <div className="p-4">
            <RecentActivity />
          </div>
        </div>
        
        {/* Active Sessions */}
        <div className="rounded-lg border">
          <div className="border-b p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              活跃会话
            </h3>
          </div>
          <div className="p-4">
            <SessionList sessions={activeSessions} limit={3} />
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold text-lg mb-4">快速操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleQuickAction('restart')}
            className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <Play className="h-6 w-6 mb-2 text-openclaw-blue" />
            <span className="text-sm font-medium">重启服务</span>
            <span className="text-xs text-muted-foreground">重启OpenClaw Gateway</span>
          </button>
          
          <button
            onClick={() => handleQuickAction('status')}
            className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <Activity className="h-6 w-6 mb-2 text-openclaw-green" />
            <span className="text-sm font-medium">系统状态</span>
            <span className="text-xs text-muted-foreground">检查所有服务</span>
          </button>
          
          <button
            onClick={() => handleQuickAction('clear_cache')}
            className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <Database className="h-6 w-6 mb-2 text-openclaw-yellow" />
            <span className="text-sm font-medium">清理缓存</span>
            <span className="text-xs text-muted-foreground">清理临时文件</span>
          </button>
          
          <button
            onClick={() => handleQuickAction('test_connection')}
            className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <MessageSquare className="h-6 w-6 mb-2 text-openclaw-purple" />
            <span className="text-sm font-medium">测试连接</span>
            <span className="text-xs text-muted-foreground">网络连通性测试</span>
          </button>
        </div>
      </div>
    </div>
  )
}