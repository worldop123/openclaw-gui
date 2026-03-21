import React from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts'
import { useQuery } from '@tanstack/react-query'

const categoryColors: Record<string, string> = {
  file: '#3b82f6',      // blue-500
  system: '#10b981',    // emerald-500
  feishu: '#f59e0b',    // amber-500
  memory: '#8b5cf6',    // violet-500
  communication: '#ef4444', // red-500
  browser: '#06b6d4',   // cyan-500
  nodes: '#84cc16',     // lime-500
  cron: '#8b5cf6',      // violet-500
  sessions: '#ec4899',  // pink-500
  other: '#6b7280'      // gray-500
}

const categoryNames: Record<string, string> = {
  file: '文件操作',
  system: '系统命令',
  feishu: '飞书集成',
  memory: '记忆系统',
  communication: '通信',
  browser: '浏览器',
  nodes: '节点管理',
  cron: '定时任务',
  sessions: '会话管理',
  other: '其他'
}

const toolData = [
  { tool: 'read', category: 'file', count: 35, percentage: 24.6 },
  { tool: 'exec', category: 'system', count: 28, percentage: 19.7 },
  { tool: 'feishu_calendar_event', category: 'feishu', count: 22, percentage: 15.5 },
  { tool: 'memory_recall', category: 'memory', count: 16, percentage: 11.3 },
  { tool: 'write', category: 'file', count: 15, percentage: 10.6 },
  { tool: 'message', category: 'communication', count: 10, percentage: 7.0 },
  { tool: 'edit', category: 'file', count: 8, percentage: 5.6 },
  { tool: 'feishu_task_task', category: 'feishu', count: 6, percentage: 4.2 },
  { tool: 'memory_store', category: 'memory', count: 5, percentage: 3.5 },
  { tool: 'browser', category: 'browser', count: 3, percentage: 2.1 }
]

const categoryData = [
  { category: 'file', count: 58, percentage: 40.8 },
  { category: 'system', count: 32, percentage: 22.5 },
  { category: 'feishu', count: 24, percentage: 16.9 },
  { category: 'memory', count: 18, percentage: 12.7 },
  { category: 'communication', count: 10, percentage: 7.0 },
  { category: 'other', count: 15, percentage: 10.5 }
]

export default function ToolUsageChart() {
  const [view, setView] = React.useState<'tools' | 'categories'>('tools')
  
  const { data: usageData, isLoading } = useQuery({
    queryKey: ['tool-usage'],
    queryFn: async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return { tools: toolData, categories: categoryData }
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
  
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted-foreground">加载工具使用数据...</div>
      </div>
    )
  }
  
  const data = view === 'tools' ? toolData : categoryData
  const xAxisKey = view === 'tools' ? 'tool' : 'category'
  const barKey = view === 'tools' ? 'count' : 'percentage'
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold">
            {view === 'tools' ? data.tool : categoryNames[data.category] || data.category}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">调用次数: </span>
            <span className="font-medium">{data.count}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">占比: </span>
            <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
          {view === 'tools' && (
            <p className="text-sm">
              <span className="text-muted-foreground">类别: </span>
              <span className="font-medium">{categoryNames[data.category] || data.category}</span>
            </p>
          )}
        </div>
      )
    }
    return null
  }
  
  const CustomLegend = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      {Object.entries(categoryColors).map(([category, color]) => (
        <div key={category} className="flex items-center gap-1.5">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-muted-foreground">
            {categoryNames[category] || category}
          </span>
        </div>
      ))}
    </div>
  )
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setView('tools')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              view === 'tools'
                ? 'bg-primary text-primary-foreground'
                : 'border hover:bg-accent'
            }`}
          >
            按工具
          </button>
          <button
            onClick={() => setView('categories')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              view === 'categories'
                ? 'bg-primary text-primary-foreground'
                : 'border hover:bg-accent'
            }`}
          >
            按类别
          </button>
        </div>
        <div className="text-sm text-muted-foreground">
          今日总计: {toolData.reduce((sum, item) => sum + item.count, 0)} 次调用
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey={xAxisKey}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => {
                if (view === 'tools') {
                  return value.split('_').pop() || value
                }
                return categoryNames[value] || value
              }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              label={{ 
                value: view === 'tools' ? '调用次数' : '占比 (%)',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                style: { fill: 'hsl(var(--muted-foreground))' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={barKey} 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={categoryColors[entry.category] || categoryColors.other}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <CustomLegend />
      
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="rounded-lg border p-3">
          <div className="text-sm text-muted-foreground mb-1">最常用工具</div>
          <div className="text-lg font-semibold">{toolData[0].tool}</div>
          <div className="text-sm text-muted-foreground">
            {toolData[0].count} 次调用 ({toolData[0].percentage.toFixed(1)}%)
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm text-muted-foreground mb-1">最常用类别</div>
          <div className="text-lg font-semibold">
            {categoryNames[categoryData[0].category]}
          </div>
          <div className="text-sm text-muted-foreground">
            {categoryData[0].count} 次调用 ({categoryData[0].percentage.toFixed(1)}%)
          </div>
        </div>
      </div>
    </div>
  )
}