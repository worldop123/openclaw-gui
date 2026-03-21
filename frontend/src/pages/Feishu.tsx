import React, { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Calendar, 
  Users, 
  FileText,
  Bell,
  Search,
  Plus,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Link,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2
} from 'lucide-react'
import { cn, formatDate, formatTimeAgo, truncateText } from '../lib/utils'

export default function Feishu() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'tasks' | 'docs' | 'im'>('calendar')
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: '1',
      title: '团队周会',
      description: '每周团队同步会议',
      startTime: '2026-03-21T10:00:00+08:00',
      endTime: '2026-03-21T11:00:00+08:00',
      location: '会议室A',
      attendees: 8,
      status: 'upcoming',
      organizer: '张三',
    },
    {
      id: '2',
      title: '产品评审',
      description: '新产品功能评审',
      startTime: '2026-03-21T14:00:00+08:00',
      endTime: '2026-03-21T15:30:00+08:00',
      location: '线上会议',
      attendees: 12,
      status: 'upcoming',
      organizer: '李四',
    },
    {
      id: '3',
      title: '技术分享',
      description: 'AI技术内部分享',
      startTime: '2026-03-20T15:00:00+08:00',
      endTime: '2026-03-20T16:30:00+08:00',
      location: '培训室',
      attendees: 25,
      status: 'completed',
      organizer: '王五',
    },
  ])

  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: '完成OpenClaw GUI开发',
      description: '开发可视化界面和集成功能',
      dueDate: '2026-03-25T23:59:59+08:00',
      priority: 'high',
      status: 'in_progress',
      assignee: '当前用户',
      progress: 75,
    },
    {
      id: '2',
      title: '编写项目文档',
      description: '完成项目技术文档和用户手册',
      dueDate: '2026-03-28T23:59:59+08:00',
      priority: 'medium',
      status: 'todo',
      assignee: '当前用户',
      progress: 30,
    },
    {
      id: '3',
      title: '测试飞书集成',
      description: '测试所有飞书API集成功能',
      dueDate: '2026-03-22T18:00:00+08:00',
      priority: 'high',
      status: 'in_progress',
      assignee: '当前用户',
      progress: 50,
    },
  ])

  const [documents, setDocuments] = useState([
    {
      id: '1',
      title: 'OpenClaw项目规划',
      type: 'doc',
      lastModified: '2026-03-20T16:30:00+08:00',
      size: '2.4 MB',
      owner: '当前用户',
      shared: true,
    },
    {
      id: '2',
      title: '技术架构设计',
      type: 'sheet',
      lastModified: '2026-03-19T11:20:00+08:00',
      size: '1.8 MB',
      owner: '张三',
      shared: true,
    },
    {
      id: '3',
      title: '会议纪要',
      type: 'doc',
      lastModified: '2026-03-18T14:45:00+08:00',
      size: '456 KB',
      owner: '李四',
      shared: false,
    },
  ])

  const [recentMessages, setRecentMessages] = useState([
    {
      id: '1',
      sender: '张三',
      content: 'OpenClaw GUI的开发进度如何？',
      timestamp: '2026-03-21T09:30:00+08:00',
      unread: true,
      chatType: 'group',
    },
    {
      id: '2',
      sender: '李四',
      content: '需要帮忙测试飞书集成吗？',
      timestamp: '2026-03-21T08:45:00+08:00',
      unread: false,
      chatType: 'private',
    },
    {
      id: '3',
      sender: '技术群',
      content: '本周技术分享资料已上传',
      timestamp: '2026-03-20T17:20:00+08:00',
      unread: false,
      chatType: 'group',
    },
  ])

  const [stats, setStats] = useState({
    upcomingEvents: 2,
    totalTasks: 3,
    completedTasks: 1,
    unreadMessages: 1,
    totalDocuments: 12,
  })

  // 处理创建新事件
  const handleCreateEvent = () => {
    const newEvent = {
      id: `event_${Date.now()}`,
      title: '新会议',
      description: '',
      startTime: new Date(Date.now() + 3600000).toISOString(),
      endTime: new Date(Date.now() + 7200000).toISOString(),
      location: '',
      attendees: 0,
      status: 'upcoming',
      organizer: '当前用户',
    }
    setCalendarEvents([newEvent, ...calendarEvents])
  }

  // 处理创建新任务
  const handleCreateTask = () => {
    const newTask = {
      id: `task_${Date.now()}`,
      title: '新任务',
      description: '',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      priority: 'medium',
      status: 'todo',
      assignee: '当前用户',
      progress: 0,
    }
    setTasks([newTask, ...tasks])
  }

  // 处理完成任务
  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', progress: 100 }
        : task
    ))
  }

  // 处理删除项目
  const handleDeleteItem = (type: string, id: string) => {
    switch (type) {
      case 'event':
        setCalendarEvents(calendarEvents.filter(event => event.id !== id))
        break
      case 'task':
        setTasks(tasks.filter(task => task.id !== id))
        break
      case 'doc':
        setDocuments(documents.filter(doc => doc.id !== id))
        break
      case 'message':
        setRecentMessages(recentMessages.filter(msg => msg.id !== id))
        break
    }
  }

  // 获取事件状态
  const getEventStatus = (startTime: string) => {
    const now = new Date()
    const eventTime = new Date(startTime)
    const diffHours = (eventTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (diffHours < 0) return 'completed'
    if (diffHours < 1) return 'soon'
    return 'upcoming'
  }

  // 获取事件状态颜色
  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/10 text-blue-600'
      case 'soon': return 'bg-yellow-500/10 text-yellow-600'
      case 'completed': return 'bg-green-500/10 text-green-600'
      default: return 'bg-gray-500/10 text-gray-600'
    }
  }

  // 获取任务优先级颜色
  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600'
      case 'medium': return 'bg-yellow-500/10 text-yellow-600'
      case 'low': return 'bg-green-500/10 text-green-600'
      default: return 'bg-gray-500/10 text-gray-600'
    }
  }

  // 获取任务状态颜色
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-500/10 text-gray-600'
      case 'in_progress': return 'bg-blue-500/10 text-blue-600'
      case 'completed': return 'bg-green-500/10 text-green-600'
      default: return 'bg-gray-500/10 text-gray-600'
    }
  }

  // 获取文档类型图标
  const getDocIcon = (type: string) => {
    switch (type) {
      case 'doc': return <FileText className="h-5 w-5" />
      case 'sheet': return <BarChart3 className="h-5 w-5" />
      case 'slide': return <TrendingUp className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">飞书集成</h1>
        <p className="text-muted-foreground mt-2">
          管理飞书日历、任务、文档和即时消息，实现无缝集成
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">即将开始</p>
              <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">总任务数</p>
              <p className="text-2xl font-bold">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">未读消息</p>
              <p className="text-2xl font-bold">{stats.unreadMessages}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">文档数量</p>
              <p className="text-2xl font-bold">{stats.totalDocuments}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">协作成员</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('calendar')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'calendar'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            日历
          </button>
          
          <button
            onClick={() => setActiveTab('tasks')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'tasks'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <CheckCircle className="h-4 w-4 inline mr-2" />
            任务
          </button>
          
          <button
            onClick={() => setActiveTab('docs')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'docs'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            文档
          </button>
          
          <button
            onClick={() => setActiveTab('im')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'im'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            消息
          </button>
        </nav>
      </div>

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">日历事件</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
                <Filter className="h-4 w-4" />
                筛选
              </button>
              <button
                onClick={handleCreateEvent}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                新建事件
              </button>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {calendarEvents.map((event) => {
              const status = getEventStatus(event.startTime)
              
              return (
                <div
                  key={event.id}
                  className="rounded-lg border overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        getEventStatusColor(status)
                      )}>
                        {status === 'upcoming' ? '即将开始' :
                         status === 'soon' ? '即将开始' : '已完成'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(event.startTime)}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.attendees} 人参加 • {event.organizer} 组织</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm hover:bg-accent">
                        <Eye className="h-3 w-3" />
                        查看
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm hover:bg-accent">
                        <Edit className="h-3 w-3" />
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteItem('event', event.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">任务管理</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
                <Filter className="h-4 w-4" />
                筛选
              </button>
              <button
                onClick={handleCreateTask}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                新建任务
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{task.title}</h4>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        getTaskPriorityColor(task.priority)
                      )}>
                        {task.priority === 'high' ? '高优先级' :
                         task.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        getTaskStatusColor(task.status)
                      )}>
                        {task.status === 'todo' ? '待办' :
                         task.status === 'in_progress' ? '进行中' : '已完成'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>截止: {formatDate(task.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{task.assignee}</span>
                        </div>
                      </div>
                      
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span>进度</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        title="标记完成"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteItem('task', task.id)}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                      title="删除任务"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">文档管理</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
                <Search className="h-4 w-4" />
                搜索文档
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
                <Upload className="h-4 w-4" />
                上传文档
              </button>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-lg border overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getDocIcon(doc.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{doc.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {doc.type === 'doc' ? '文档' :
                           doc.type === 'sheet' ? '表格' : '幻灯片'}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          最后修改: {formatTimeAgo(doc.lastModified)}
                        </span>
                      </div>
                    </div>
                    {doc.shared && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                        已共享
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{doc.owner}</span>
                    </div>
                    <span>{doc.size}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm hover:bg-accent">
                      <Eye className="h-3 w-3" />
                      打开
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm hover:bg-accent">
                      <Share2 className="h-3 w-3" />
                      分享
                    </button>
                    <button
                      onClick={() => handleDeleteItem('doc', doc.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IM Tab */}
      {activeTab === 'im' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">即时消息</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
                <Filter className="h-4 w-4" />
                筛选
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                新建对话
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "rounded-lg border p-4 hover:border-primary/50 transition-colors",
                  msg.unread && "border-primary/20 bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{msg.sender}</h4>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          msg.chatType === 'group' 
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-green-500/10 text-green-600"
                        )}>
                          {msg.chatType === 'group' ? '群聊' : '私聊'}
                        </span>
                        {msg.unread && (
                          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(msg.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {msg.content}
                    </p>
                    
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm hover:bg-accent">
                        <Eye className="h-3 w-3" />
                        查看
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm hover:bg-accent">
                        <Copy className="h-3 w-3" />
                        复制
                      </button>
                      <button
                        onClick={() => handleDeleteItem('message', msg.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-sm hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Status */}
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold text-lg mb-4">集成状态</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">API连接状态</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">日历API</span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  已连接
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">任务API</span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  已连接
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">文档API</span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  已连接
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">消息API</span>
                <span className="flex items-center gap-1 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  部分连接
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">快速操作</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-accent">
                <RefreshCw className="h-5 w-5 mb-1" />
                <span className="text-xs">同步数据</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-accent">
                <Download className="h-5 w-5 mb-1" />
                <span className="text-xs">导出数据</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-accent">
                <Settings className="h-5 w-5 mb-1" />
                <span className="text-xs">配置</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-accent">
                <Bell className="h-5 w-5 mb-1" />
                <span className="text-xs">通知设置</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}