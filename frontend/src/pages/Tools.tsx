import React, { useState } from 'react'
import { 
  Wrench, 
  Search, 
  Filter,
  Zap,
  FileText,
  Cpu,
  MessageSquare,
  Calendar,
  Database,
  Globe,
  Users,
  Clock,
  Star,
  TrendingUp,
  Play,
  Code,
  Settings,
  MoreVertical,
  Copy,
  Download,
  BookOpen
} from 'lucide-react'
import { useStore } from '../store'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'

const toolCategories = [
  { id: 'all', name: '全部工具', icon: Wrench, color: 'text-gray-500 bg-gray-500/10' },
  { id: 'file', name: '文件操作', icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
  { id: 'system', name: '系统命令', icon: Cpu, color: 'text-green-500 bg-green-500/10' },
  { id: 'feishu', name: '飞书集成', icon: MessageSquare, color: 'text-red-500 bg-red-500/10' },
  { id: 'memory', name: '记忆系统', icon: Database, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'communication', name: '通信', icon: MessageSquare, color: 'text-purple-500 bg-purple-500/10' },
  { id: 'browser', name: '浏览器', icon: Globe, color: 'text-cyan-500 bg-cyan-500/10' },
  { id: 'nodes', name: '节点管理', icon: Users, color: 'text-lime-500 bg-lime-500/10' },
  { id: 'cron', name: '定时任务', icon: Clock, color: 'text-violet-500 bg-violet-500/10' },
  { id: 'sessions', name: '会话管理', icon: Users, color: 'text-pink-500 bg-pink-500/10' }
]

const toolStatus = [
  { id: 'all', name: '全部状态' },
  { id: 'available', name: '可用', color: 'bg-green-500' },
  { id: 'restricted', name: '受限', color: 'bg-amber-500' },
  { id: 'unavailable', name: '不可用', color: 'bg-red-500' }
]

export default function Tools() {
  const { tools, callTool } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showToolForm, setShowToolForm] = useState(false)
  
  const { data: toolStats, isLoading: statsLoading } = useQuery({
    queryKey: ['tool-stats'],
    queryFn: async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        totalTools: 45,
        callsToday: 142,
        callsThisWeek: 985,
        successRate: 98.5,
        avgResponseTime: 128,
        mostUsed: 'read',
        mostUsedCategory: 'file'
      }
    }
  })
  
  const { data: toolUsage, isLoading: usageLoading } = useQuery({
    queryKey: ['tool-usage'],
    queryFn: async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return [
        { tool: 'read', category: 'file', calls: 35, success: 34, avgTime: 95 },
        { tool: 'exec', category: 'system', calls: 28, success: 27, avgTime: 210 },
        { tool: 'feishu_calendar_event', category: 'feishu', calls: 22, success: 21, avgTime: 320 },
        { tool: 'memory_recall', category: 'memory', calls: 16, success: 16, avgTime: 150 },
        { tool: 'write', category: 'file', calls: 15, success: 15, avgTime: 120 },
        { tool: 'message', category: 'communication', calls: 10, success: 9, avgTime: 180 },
        { tool: 'edit', category: 'file', calls: 8, success: 8, avgTime: 110 },
        { tool: 'feishu_task_task', category: 'feishu', calls: 6, success: 6, avgTime: 280 }
      ]
    }
  })
  
  // 过滤工具
  const filteredTools = tools.filter(tool => {
    if (searchQuery && !tool.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tool.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
      return false
    }
    
    // 状态过滤（模拟）
    if (selectedStatus === 'restricted' && !['exec', 'write'].includes(tool.name)) {
      return false
    }
    
    if (selectedStatus === 'unavailable' && !['browser', 'canvas'].includes(tool.name)) {
      return false
    }
    
    return true
  })
  
  const handleToolCall = (toolName: string) => {
    const parameters = prompt(`输入 ${toolName} 的参数 (JSON格式):`, '{}')
    try {
      if (parameters) {
        const params = JSON.parse(parameters)
        callTool(toolName, params)
      }
    } catch (error) {
      alert('参数格式错误，请输入有效的JSON')
    }
  }
  
  const handleQuickCall = (toolName: string, presetParams: any) => {
    if (confirm(`确定要调用 ${toolName} 吗？`)) {
      callTool(toolName, presetParams)
    }
  }
  
  const getCategoryIcon = (category: string) => {
    const cat = toolCategories.find(c => c.id === category)
    return cat ? cat.icon : Wrench
  }
  
  const getCategoryColor = (category: string) => {
    const cat = toolCategories.find(c => c.id === category)
    return cat ? cat.color : 'text-gray-500 bg-gray-500/10'
  }
  
  if (statsLoading || usageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">加载工具数据...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">工具管理</h1>
          <p className="text-muted-foreground mt-2">
            管理和调用OpenClaw的所有工具，监控使用统计和性能
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowToolForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Wrench className="h-5 w-5" />
            快速调用
          </button>
        </div>
      </div>
      
      {/* Stats */}
      {toolStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{toolStats.totalTools}</div>
                <div className="text-sm text-muted-foreground">总工具数</div>
              </div>
              <Wrench className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{toolStats.callsToday}</div>
                <div className="text-sm text-muted-foreground">今日调用</div>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{toolStats.successRate}%</div>
                <div className="text-sm text-muted-foreground">成功率</div>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{toolStats.avgResponseTime}ms</div>
                <div className="text-sm text-muted-foreground">平均响应</div>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="rounded-lg border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border bg-background py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="搜索工具名称、描述、类别..."
            />
          </div>
          
          {/* View and Filter Controls */}
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
                <Filter className="h-4 w-4" />
                <span>类别</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-background border rounded-lg shadow-lg z-10 hidden group-hover:block">
                {toolCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center gap-2",
                      selectedCategory === category.id && "bg-accent"
                    )}
                  >
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
                <Zap className="h-4 w-4" />
                <span>状态</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-background border rounded-lg shadow-lg z-10 hidden group-hover:block">
                {toolStatus.map(status => (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center gap-2",
                      selectedStatus === status.id && "bg-accent"
                    )}
                  >
                    {status.color && (
                      <div className={cn("h-2 w-2 rounded-full", status.color)} />
                    )}
                    {status.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "px-3 py-1.5 text-sm",
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                )}
              >
                网格
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-3 py-1.5 text-sm",
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                )}
              >
                列表
              </button>
            </div>
          </div>
        </div>
        
        {/* Active Filters */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            找到 {filteredTools.length} 个工具
          </div>
          {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">筛选:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-600">
                  {toolCategories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('all')}>×</button>
                </span>
              )}
              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-600">
                  {toolStatus.find(s => s.id === selectedStatus)?.name}
                  <button onClick={() => setSelectedStatus('all')}>×</button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-600">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>×</button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedStatus('all')
                  setSearchQuery('')
                }}
                className="ml-auto text-sm text-primary hover:underline"
              >
                清除所有筛选
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Tools Grid/List */}
      <div className="rounded-lg border">
        {viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool, index) => {
              const CategoryIcon = getCategoryIcon(tool.category)
              const categoryColor = getCategoryColor(tool.category)
              const usage = toolUsage?.find(u => u.tool === tool.name)
              
              return (
                <div
                  key={tool.name}
                  className="group p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn("p-2 rounded-lg", categoryColor)}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToolCall(tool.name)}
                        className="p-1 hover:bg-green-500/10 rounded text-green-600"
                        title="调用工具"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-blue-500/10 rounded text-blue-600" title="查看文档">
                        <BookOpen className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-accent rounded">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold mb-1">{tool.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {tool.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">类别</span>
                      <span className="font-medium">{tool.category}</span>
                    </div>
                    
                    {usage && (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">今日调用</span>
                          <span className="font-medium">{usage.calls}次</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">成功率</span>
                          <span className="font-medium text-green-600">
                            {((usage.success / usage.calls) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">平均耗时</span>
                          <span className="font-medium">{usage.avgTime}ms</span>
                        </div>
                      </>
                    )}
                    
                    <div className="pt-2">
                      <button
                        onClick={() => handleToolCall(tool.name)}
                        className="w-full py-1.5 text-sm rounded-lg border hover:bg-accent"
                      >
                        调用工具
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">工具</th>
                    <th className="text-left py-3 px-4 font-medium">描述</th>
                    <th className="text-left py-3 px-4 font-medium">类别</th>
                    <th className="text-left py-3 px-4 font-medium">状态</th>
                    <th className="text-left py-3 px-4 font-medium">使用统计</th>
                    <th className="text-left py-3 px-4 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.map((tool) => {
                    const usage = toolUsage?.find(u => u.tool === tool.name)
                    const successRate = usage ? ((usage.success / usage.calls) * 100).toFixed(1) : 'N/A'
                    
                    return (
                      <tr key={tool.name} className="border-b hover:bg-accent/50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{tool.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-muted-foreground max-w-xs">
                            {tool.description}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1.5 rounded", getCategoryColor(tool.category))}>
                              {React.createElement(getCategoryIcon(tool.category), { className: "h-3.5 w-3.5" })}
                            </div>
                            <span className="text-sm">{tool.category}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              tool.name === 'exec' || tool.name === 'write' 
                                ? 'bg-amber-500' 
                                : ['browser', 'canvas'].includes(tool.name)
                                ? 'bg-red-500'
                                : 'bg-green-500'
                            )} />
                            <span className="text-sm">
                              {tool.name === 'exec' || tool.name === 'write' 
                                ? '受限' 
                                : ['browser', 'canvas'].includes(tool.name)
                                ? '不可用'
                                : '可用'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {usage ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>调用:</span>
                                <span className="font-medium">{usage.calls}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span>成功率:</span>
                                <span className="font-medium text-green-600">{successRate}%</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span>耗时:</span>
                                <span className="font-medium">{usage.avgTime}ms</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">暂无数据</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToolCall(tool.name)}
                              className="px-3 py-1 text-sm rounded-lg border hover:bg-green-500/10 text-green-600"
                            >
                              调用
                            </button>
                            <button className="p-1.5 hover:bg-accent rounded">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Call Presets */}
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          快速调用预设
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleQuickCall('read', { path: '/root/.openclaw/workspace/SOUL.md' })}
            className="p-3 rounded-lg border hover:bg-accent text-left"
          >
            <div className="font-medium">读取SOUL.md</div>
            <div className="text-sm text-muted-foreground">查看项目灵魂文件</div>
          </button>
          
          <button
            onClick={() => handleQuickCall('exec', { command: 'openclaw gateway status' })}
            className="p-3 rounded-lg border hover:bg-accent text-left"
          >
            <div className="font-medium">检查服务状态</div>
            <div className="text-sm text-muted-foreground">查看OpenClaw Gateway状态</div>
          </button>
          
          <button
            onClick={() => handleQuickCall('feishu_calendar_event', { 
              action: 'list',
              start_time: new Date().toISOString(),
              end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            })}
            className="p-3 rounded-lg border hover:bg-accent text-left"
          >
            <div className="font-medium">查看本周日程</div>
            <div className="text-sm text-muted-foreground">获取飞书日历事件</div>
          </button>
          
          <button
            onClick={() => handleQuickCall('memory_recall', { query: 'openclaw', limit: 5 })}
            className="p-3 rounded-lg border hover:bg-accent text-left"
          >
            <div className="font-medium">搜索记忆</div>
            <div className="text-sm text-muted-foreground">查找OpenClaw相关记忆</div>
          </button>
        </div>
      </div>
      
      {/* Usage Statistics */}
      {toolUsage && (
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            工具使用统计
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">工具</th>
                  <th className="text-left py-2 px-3 font-medium">类别</th>
                  <th className="text-left py-2 px-3 font-medium">调用次数</th>
                  <th className="text-left py-2 px-3 font-medium">成功次数</th>
                  <th className="text-left py-2 px-3 font-medium">成功率</th>
                  <th className="text-left py-2 px-3 font-medium">平均耗时</th>
                  <th className="text-left py-2 px-3 font-medium">趋势</th>
                </tr>
              </thead>
              <tbody>
                {toolUsage.map((usage, index) => (
                  <tr key={index} className="border-b hover:bg-accent/50">
                    <td className="py-2 px-3 font-medium">{usage.tool}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1 rounded", getCategoryColor(usage.category))}>
                          {React.createElement(getCategoryIcon(usage.category), { className: "h-3 w-3" })}
                        </div>
                        <span className="text-sm">{usage.category}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">{usage.calls}</td>
                    <td className="py-2 px-3">{usage.success}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(usage.success / usage.calls) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          {((usage.success / usage.calls) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3">{usage.avgTime}ms</td>
                    <td className="py-2 px-3">
                      <div className="text-sm text-green-600">
                        ↑ {Math.floor(Math.random() * 20) + 5}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-muted-foreground">未找到工具</h3>
          <p className="text-sm text-muted-foreground mt-1">
            尝试调整筛选条件或搜索不同的工具名称
          </p>
        </div>
      )}
    </div>
  )
}