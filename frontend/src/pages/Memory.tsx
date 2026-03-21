import React, { useState } from 'react'
import { 
  Brain, 
  Search, 
  Filter,
  Plus,
  Trash2,
  Edit,
  Star,
  Clock,
  Tag,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  Copy,
  BookOpen,
  TrendingUp,
  BarChart3,
  Zap,
  Database,
  Calendar,
  Users,
  FileText
} from 'lucide-react'
import { useStore } from '../store'
import { cn, formatTimeAgo } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'

const memoryCategories = [
  { id: 'all', name: '全部记忆', icon: Brain, color: 'text-gray-500 bg-gray-500/10' },
  { id: 'preference', name: '偏好设置', icon: Star, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'fact', name: '事实信息', icon: BookOpen, color: 'text-blue-500 bg-blue-500/10' },
  { id: 'decision', name: '决策记录', icon: TrendingUp, color: 'text-green-500 bg-green-500/10' },
  { id: 'project', name: '项目信息', icon: FileText, color: 'text-purple-500 bg-purple-500/10' },
  { id: 'behavior', name: '行为模式', icon: Users, color: 'text-cyan-500 bg-cyan-500/10' },
  { id: 'plan', name: '计划安排', icon: Calendar, color: 'text-red-500 bg-red-500/10' },
  { id: 'interest', name: '兴趣爱好', icon: Zap, color: 'text-pink-500 bg-pink-500/10' },
  { id: 'other', name: '其他', icon: Database, color: 'text-gray-500 bg-gray-500/10' }
]

const importanceLevels = [
  { id: 'all', name: '全部重要性', color: 'bg-gray-500' },
  { id: 'high', name: '高重要性', color: 'bg-red-500', min: 0.8, max: 1.0 },
  { id: 'medium', name: '中重要性', color: 'bg-amber-500', min: 0.5, max: 0.8 },
  { id: 'low', name: '低重要性', color: 'bg-green-500', min: 0, max: 0.5 }
]

const memoryData = [
  {
    id: 'mem_001',
    text: '用户正在开发OpenClaw可视化界面项目，包含前端React、后端Node.js和Python代理服务',
    importance: 0.9,
    category: 'project',
    tags: ['openclaw', 'gui', 'development', 'react', 'nodejs', 'python'],
    timestamp: '2026-03-21T01:13:00Z',
    source: 'user_input',
    accessed: 15,
    lastAccessed: '2026-03-21T10:30:00Z'
  },
  {
    id: 'mem_002',
    text: '用户使用飞书作为主要通信工具，经常使用日历和任务管理功能',
    importance: 0.85,
    category: 'preference',
    tags: ['feishu', 'communication', 'calendar', 'tasks'],
    timestamp: '2026-03-20T02:22:00Z',
    source: 'user_input',
    accessed: 8,
    lastAccessed: '2026-03-21T09:15:00Z'
  },
  {
    id: 'mem_003',
    text: '用户喜欢使用深色主题界面，偏好现代化UI设计和简洁的布局',
    importance: 0.7,
    category: 'preference',
    tags: ['ui', 'theme', 'design', 'dark-mode'],
    timestamp: '2026-03-19T15:30:00Z',
    source: 'behavior_analysis',
    accessed: 12,
    lastAccessed: '2026-03-20T14:45:00Z'
  },
  {
    id: 'mem_004',
    text: '用户经常使用文件操作和系统命令工具，特别是read、exec和write工具',
    importance: 0.8,
    category: 'behavior',
    tags: ['tools', 'file', 'system', 'automation', 'read', 'exec', 'write'],
    timestamp: '2026-03-18T10:45:00Z',
    source: 'usage_analysis',
    accessed: 25,
    lastAccessed: '2026-03-21T11:20:00Z'
  },
  {
    id: 'mem_005',
    text: '用户计划集成飞书日历、任务管理和多维表格功能到OpenClaw GUI中',
    importance: 0.88,
    category: 'plan',
    tags: ['feishu', 'integration', 'calendar', 'tasks', 'bitable', 'gui'],
    timestamp: '2026-03-17T14:20:00Z',
    source: 'user_input',
    accessed: 6,
    lastAccessed: '2026-03-20T16:30:00Z'
  },
  {
    id: 'mem_006',
    text: '用户对实时监控和数据分析感兴趣，关注系统性能和用户体验',
    importance: 0.75,
    category: 'interest',
    tags: ['monitoring', 'analytics', 'data', 'performance', 'ux'],
    timestamp: '2026-03-16T09:15:00Z',
    source: 'conversation',
    accessed: 10,
    lastAccessed: '2026-03-19T13:20:00Z'
  },
  {
    id: 'mem_007',
    text: '用户经常使用记忆系统存储重要信息和决策，偏好结构化的数据组织',
    importance: 0.82,
    category: 'behavior',
    tags: ['memory', 'storage', 'decisions', 'organization'],
    timestamp: '2026-03-15T11:30:00Z',
    source: 'usage_analysis',
    accessed: 18,
    lastAccessed: '2026-03-21T08:45:00Z'
  },
  {
    id: 'mem_008',
    text: '用户的技术栈包括React、TypeScript、Node.js、Python和Docker',
    importance: 0.78,
    category: 'fact',
    tags: ['tech-stack', 'react', 'typescript', 'nodejs', 'python', 'docker'],
    timestamp: '2026-03-14T13:40:00Z',
    source: 'conversation',
    accessed: 14,
    lastAccessed: '2026-03-20T10:15:00Z'
  }
]

export default function Memory() {
  const { searchMemory } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImportance, setSelectedImportance] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list')
  const [showMemoryForm, setShowMemoryForm] = useState(false)
  const [newMemory, setNewMemory] = useState({
    text: '',
    importance: 0.7,
    category: 'other',
    tags: [] as string[]
  })
  
  const { data: memoryStats, isLoading: statsLoading } = useQuery({
    queryKey: ['memory-stats'],
    queryFn: async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        totalMemories: memoryData.length,
        totalTags: 42,
        avgImportance: 0.79,
        highImportance: memoryData.filter(m => m.importance >= 0.8).length,
        recentAdditions: 3,
        totalAccesses: memoryData.reduce((sum, m) => sum + m.accessed, 0)
      }
    }
  })
  
  const { data: searchResults, refetch: refetchSearch } = useQuery({
    queryKey: ['memory-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return memoryData
      const results = await searchMemory(searchQuery, 20)
      return results
    },
    enabled: false
  })
  
  // 过滤记忆
  const filteredMemories = memoryData.filter(memory => {
    if (searchQuery && !memory.text.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    
    if (selectedCategory !== 'all' && memory.category !== selectedCategory) {
      return false
    }
    
    if (selectedImportance !== 'all') {
      const level = importanceLevels.find(l => l.id === selectedImportance)
      if (level && (memory.importance < level.min || memory.importance >= level.max)) {
        return false
      }
    }
    
    return true
  })
  
  const handleSearch = () => {
    refetchSearch()
  }
  
  const handleAddMemory = () => {
    if (!newMemory.text.trim()) {
      alert('请输入记忆内容')
      return
    }
    
    // 这里应该调用memory_store API
    console.log('Adding memory:', newMemory)
    
    // 重置表单
    setNewMemory({
      text: '',
      importance: 0.7,
      category: 'other',
      tags: []
    })
    setShowMemoryForm(false)
    
    // 刷新数据
    refetchSearch()
  }
  
  const handleDeleteMemory = (memoryId: string) => {
    if (confirm('确定要删除这条记忆吗？')) {
      // 这里应该调用memory_forget API
      console.log('Deleting memory:', memoryId)
    }
  }
  
  const handleExportMemories = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      total: filteredMemories.length,
      memories: filteredMemories
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `openclaw-memories-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const getCategoryIcon = (category: string) => {
    const cat = memoryCategories.find(c => c.id === category)
    return cat ? cat.icon : Brain
  }
  
  const getCategoryColor = (category: string) => {
    const cat = memoryCategories.find(c => c.id === category)
    return cat ? cat.color : 'text-gray-500 bg-gray-500/10'
  }
  
  const getImportanceColor = (importance: number) => {
    if (importance >= 0.8) return 'text-red-500 bg-red-500/10'
    if (importance >= 0.5) return 'text-amber-500 bg-amber-500/10'
    return 'text-green-500 bg-green-500/10'
  }
  
  const getImportanceLabel = (importance: number) => {
    if (importance >= 0.8) return '高重要性'
    if (importance >= 0.5) return '中重要性'
    return '低重要性'
  }
  
  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">加载记忆数据...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">记忆系统</h1>
          <p className="text-muted-foreground mt-2">
            管理和探索LanceDB记忆系统，存储和检索重要信息
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMemories}
            className="p-2 rounded-lg border hover:bg-accent"
            title="导出记忆"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowMemoryForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            添加记忆
          </button>
        </div>
      </div>
      
      {/* Stats */}
      {memoryStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{memoryStats.totalMemories}</div>
                <div className="text-sm text-muted-foreground">总记忆数</div>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{memoryStats.highImportance}</div>
                <div className="text-sm text-muted-foreground">高重要性</div>
              </div>
              <Star className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{memoryStats.totalAccesses}</div>
                <div className="text-sm text-muted-foreground">总访问次数</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{memoryStats.avgImportance.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">平均重要性</div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}
      
      {/* Search and Filters */}
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="block w-full rounded-lg border bg-background py-2 pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="搜索记忆内容或标签..."
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
            </button>
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
                {memoryCategories.map(category => (
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
            
            {/* Importance Filter */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
                <Star className="h-4 w-4" />
                <span>重要性</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-background border rounded-lg shadow-lg z-10 hidden group-hover:block">
                {importanceLevels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedImportance(level.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center gap-2",
                      selectedImportance === level.id && "bg-accent"
                    )}
                  >
                    {level.color && (
                      <div className={cn("h-2 w-2 rounded-full", level.color)} />
                    )}
                    {level.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center border rounded-lg">
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
                onClick={() => setViewMode('timeline')}
                className={cn(
                  "px-3 py-1.5 text-sm",
                  viewMode === 'timeline'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                )}
              >
                时间线
              </button>
            </div>
          </div>
        </div>
        
        {/* Active Filters */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            找到 {filteredMemories.length} 条记忆
          </div>
          {(selectedCategory !== 'all' || selectedImportance !== 'all' || searchQuery) && (
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">筛选:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-600">
                  {memoryCategories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('all')}>×</button>
                </span>
              )}
              {selectedImportance !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-600">
                  {importanceLevels.find(s => s.id === selectedImportance)?.name}
                  <button onClick={() => setSelectedImportance('all')}>×</button>
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
                  setSelectedImportance('all')
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
      
      {/* Add Memory Form */}
      {showMemoryForm && (
        <div className="rounded-lg border p-4 bg-muted/10">
          <h3 className="font-semibold mb-4">添加新记忆</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">记忆内容</label>
              <textarea
                value={newMemory.text}
                onChange={(e) => setNewMemory({...newMemory, text: e.target.value})}
                className="w-full rounded-lg border bg-background p-3 text-sm min-h-[100px]"
                placeholder="输入要记忆的内容..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">重要性</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={newMemory.importance}
                  onChange={(e) => setNewMemory({...newMemory, importance: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>低</span>
                  <span>中</span>
                  <span>高</span>
                </div>
                <div className="text-sm mt-1">
                  当前: {getImportanceLabel(newMemory.importance)} ({newMemory.importance.toFixed(1)})
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">分类</label>
                <select
                  value={newMemory.category}
                  onChange={(e) => setNewMemory({...newMemory, category: e.target.value})}
                  className="w-full rounded-lg border bg-background p-2 text-sm"
                >
                  {memoryCategories.filter(c => c.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">标签</label>
              <input
                type="text"
                className="w-full rounded-lg border bg-background p-2 text-sm"
                placeholder="输入标签，用逗号分隔"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    const newTags = [...newMemory.tags, ...e.currentTarget.value.split(',').map(t => t.trim())]
                    setNewMemory({...newMemory, tags: newTags})
                    e.currentTarget.value = ''
                  }
                }}
              />
              {newMemory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newMemory.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = [...newMemory.tags]
                          newTags.splice(index, 1)
                          setNewMemory({...newMemory, tags: newTags})
                        }}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowMemoryForm(false)}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-accent"
              >
                取消
              </button>
              <button
                onClick={handleAddMemory}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                保存记忆
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Memories Content */}
      <div className="rounded-lg border">
        {viewMode === 'list' ? (
          <div className="p-4 space-y-4">
            {filteredMemories.map((memory) => {
              const CategoryIcon = getCategoryIcon(memory.category)
              
              return (
                <div
                  key={memory.id}
                  className="group p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn("p-2 rounded-lg", getCategoryColor(memory.category))}>
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{memory.text}</h4>
                            <div className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              getImportanceColor(memory.importance)
                            )}>
                              {getImportanceLabel(memory.importance)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{formatTimeAgo(new Date(memory.timestamp))}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3.5 w-3.5" />
                              <span>访问 {memory.accessed} 次</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="h-3.5 w-3.5" />
                              <span>{memory.tags.length} 个标签</span>
                            </div>
                          </div>
                          
                          {memory.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {memory.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 text-xs rounded-full bg-muted"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                      <button
                        onClick={() => navigator.clipboard.writeText(memory.text)}
                        className="p-1.5 hover:bg-blue-500/10 rounded text-blue-600"
                        title="复制内容"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 hover:bg-amber-500/10 rounded text-amber-600" title="编辑">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMemory(memory.id)}
                        className="p-1.5 hover:bg-red-500/10 rounded text-red-600"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMemories.map((memory) => {
              const CategoryIcon = getCategoryIcon(memory.category)
              
              return (
                <div
                  key={memory.id}
                  className="group p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn("p-2 rounded-lg", getCategoryColor(memory.category))}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-blue-500/10 rounded text-blue-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMemory(memory.id)}
                        className="p-1 hover:bg-red-500/10 rounded text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold mb-2 line-clamp-3">{memory.text}</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">重要性</span>
                      <span className={cn("font-medium", 
                        memory.importance >= 0.8 ? "text-red-500" :
                        memory.importance >= 0.5 ? "text-amber-500" : "text-green-500"
                      )}>
                        {getImportanceLabel(memory.importance)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">创建时间</span>
                      <span className="font-medium">{formatTimeAgo(new Date(memory.timestamp))}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">访问次数</span>
                      <span className="font-medium">{memory.accessed}</span>
                    </div>
                    
                    {memory.tags.length > 0 && (
                      <div className="pt-2">
                        <div className="flex flex-wrap gap-1">
                          {memory.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-1.5 py-0.5 text-xs rounded-full bg-muted"
                            >
                              {tag}
                            </span>
                          ))}
                          {memory.tags.length > 3 && (
                            <span className="px-1.5 py-0.5 text-xs rounded-full bg-muted">
                              +{memory.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-4">
            <div className="text-center py-8 text-muted-foreground">
              时间线视图开发中...
            </div>
          </div>
        )}
      </div>
      
      {/* Category Distribution */}
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          记忆分类分布
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {memoryCategories.filter(c => c.id !== 'all').map(category => {
            const count = filteredMemories.filter(m => m.category === category.id).length
            const percentage = filteredMemories.length > 0 ? (count / filteredMemories.length * 100).toFixed(1) : '0'
            
            return (
              <div key={category.id} className="text-center">
                <div className={cn("inline-flex p-3 rounded-lg mb-2", category.color)}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div className="font-medium">{category.name}</div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">{percentage}%</div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Empty State */}
      {filteredMemories.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-muted-foreground">未找到记忆</h3>
          <p className="text-sm text-muted-foreground mt-1">
            尝试调整筛选条件或添加新的记忆
          </p>
          <button
            onClick={() => setShowMemoryForm(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            添加第一条记忆
          </button>
        </div>
      )}
    </div>
  )
}