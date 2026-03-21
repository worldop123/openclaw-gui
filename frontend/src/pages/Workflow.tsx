import React, { useState, useEffect, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { 
  Workflow as WorkflowIcon,
  Plus,
  Play,
  Pause,
  Save,
  Upload,
  Download,
  Settings,
  Code,
  Eye,
  Copy,
  Trash2,
  RotateCw,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Terminal,
  FileText,
  Database,
  MessageSquare
} from 'lucide-react'
import { cn } from '../lib/utils'

// 自定义节点组件
const ToolNode = ({ data }: any) => {
  return (
    <div className={cn(
      "px-4 py-3 rounded-lg border shadow-sm min-w-48",
      data.status === 'completed' && "border-green-500 bg-green-500/5",
      data.status === 'running' && "border-blue-500 bg-blue-500/5",
      data.status === 'error' && "border-red-500 bg-red-500/5",
      data.status === 'pending' && "border-yellow-500 bg-yellow-500/5"
    )}>
      <div className="flex items-center gap-3 mb-2">
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center",
          data.category === 'file' && "bg-blue-500/10 text-blue-600",
          data.category === 'system' && "bg-red-500/10 text-red-600",
          data.category === 'communication' && "bg-green-500/10 text-green-600",
          data.category === 'memory' && "bg-yellow-500/10 text-yellow-600"
        )}>
          {data.icon}
        </div>
        <div>
          <h4 className="font-semibold text-sm">{data.label}</h4>
          <p className="text-xs text-muted-foreground">{data.tool}</p>
        </div>
      </div>
      
      <div className="space-y-1">
        {data.parameters && Object.entries(data.parameters).map(([key, value]) => (
          <div key={key} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{key}:</span>
            <code className="font-mono">{String(value)}</code>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t">
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          data.status === 'completed' && "bg-green-500/10 text-green-600",
          data.status === 'running' && "bg-blue-500/10 text-blue-600",
          data.status === 'error' && "bg-red-500/10 text-red-600",
          data.status === 'pending' && "bg-yellow-500/10 text-yellow-600"
        )}>
          {data.status === 'completed' ? '已完成' :
           data.status === 'running' ? '运行中' :
           data.status === 'error' ? '错误' : '待执行'}
        </span>
        <span className="text-xs text-muted-foreground">
          {data.duration || '--'}
        </span>
      </div>
    </div>
  )
}

const StartNode = ({ data }: any) => {
  return (
    <div className="px-6 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <Play className="h-6 w-6" />
        <div>
          <h4 className="font-bold">{data.label}</h4>
          <p className="text-xs opacity-90">{data.description}</p>
        </div>
      </div>
    </div>
  )
}

const EndNode = ({ data }: any) => {
  return (
    <div className="px-6 py-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-6 w-6" />
        <div>
          <h4 className="font-bold">{data.label}</h4>
          <p className="text-xs opacity-90">{data.description}</p>
        </div>
      </div>
    </div>
  )
}

// 节点类型
const nodeTypes = {
  tool: ToolNode,
  start: StartNode,
  end: EndNode,
}

export default function Workflow() {
  // 初始节点
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'start',
      position: { x: 250, y: 0 },
      data: { 
        label: '工作流开始',
        description: '点击运行开始执行工作流'
      },
    },
    {
      id: '2',
      type: 'tool',
      position: { x: 200, y: 120 },
      data: {
        label: '读取配置',
        tool: 'read',
        category: 'file',
        icon: <FileText className="h-4 w-4" />,
        parameters: {
          path: '/root/.openclaw/workspace/SOUL.md',
        },
        status: 'completed',
        duration: '125ms',
      },
    },
    {
      id: '3',
      type: 'tool',
      position: { x: 50, y: 240 },
      data: {
        label: '执行命令',
        tool: 'exec',
        category: 'system',
        icon: <Terminal className="h-4 w-4" />,
        parameters: {
          command: 'openclaw gateway status',
        },
        status: 'running',
        duration: '--',
      },
    },
    {
      id: '4',
      type: 'tool',
      position: { x: 350, y: 240 },
      data: {
        label: '搜索记忆',
        tool: 'memory_recall',
        category: 'memory',
        icon: <Database className="h-4 w-4" />,
        parameters: {
          query: '可视化界面',
          limit: 5,
        },
        status: 'pending',
        duration: '--',
      },
    },
    {
      id: '5',
      type: 'tool',
      position: { x: 200, y: 360 },
      data: {
        label: '发送通知',
        tool: 'message',
        category: 'communication',
        icon: <MessageSquare className="h-4 w-4" />,
        parameters: {
          action: 'send',
          message: '工作流执行完成',
          channel: 'feishu',
        },
        status: 'pending',
        duration: '--',
      },
    },
    {
      id: '6',
      type: 'end',
      position: { x: 250, y: 480 },
      data: { 
        label: '工作流完成',
        description: '所有任务执行完毕'
      },
    },
  ]

  // 初始边
  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    {
      id: 'e3-5',
      source: '3',
      target: '5',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
    {
      id: 'e5-6',
      source: '5',
      target: '6',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [workflowName, setWorkflowName] = useState('OpenClaw可视化界面工作流')
  const [isRunning, setIsRunning] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [workflowStats, setWorkflowStats] = useState({
    totalSteps: 5,
    completedSteps: 1,
    runningSteps: 1,
    pendingSteps: 3,
    errorSteps: 0,
    totalDuration: '--',
  })

  // 模拟工作流执行
  const executeWorkflow = useCallback(() => {
    setIsRunning(true)
    
    // 重置状态
    setNodes(nds => nds.map(node => {
      if (node.type === 'tool') {
        return {
          ...node,
          data: {
            ...node.data,
            status: 'pending',
            duration: '--',
          }
        }
      }
      return node
    }))

    // 模拟执行步骤
    const steps = [
      { nodeId: '2', delay: 500, duration: '125ms' },
      { nodeId: '3', delay: 1500, duration: '890ms' },
      { nodeId: '4', delay: 2500, duration: '342ms' },
      { nodeId: '5', delay: 3500, duration: '218ms' },
    ]

    steps.forEach((step, index) => {
      setTimeout(() => {
        setNodes(nds => nds.map(node => {
          if (node.id === step.nodeId) {
            const newStatus = index === steps.length - 1 ? 'completed' : 'completed'
            return {
              ...node,
              data: {
                ...node.data,
                status: newStatus,
                duration: step.duration,
              }
            }
          }
          return node
        }))

        // 更新统计
        setWorkflowStats(prev => ({
          ...prev,
          completedSteps: index + 1,
          pendingSteps: steps.length - (index + 1),
        }))

        // 最后一步完成后停止
        if (index === steps.length - 1) {
          setIsRunning(false)
          setWorkflowStats(prev => ({
            ...prev,
            totalDuration: '1.8s',
          }))
        }
      }, step.delay)
    })
  }, [setNodes])

  // 处理连接
  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = { ...connection, id: `${connection.source}-${connection.target}` }
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges]
  )

  // 添加新节点
  const addToolNode = (toolType: string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type: 'tool',
      position: { x: 100 + nodes.length * 50, y: 100 + nodes.length * 50 },
      data: {
        label: '新工具节点',
        tool: toolType,
        category: 'file',
        icon: <FileText className="h-4 w-4" />,
        parameters: {},
        status: 'pending',
        duration: '--',
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  // 删除节点
  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter(node => node.id !== nodeId))
    setEdges((eds) => eds.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ))
    setSelectedNode(null)
  }

  // 重置工作流
  const resetWorkflow = () => {
    setNodes(initialNodes)
    setEdges(initialEdges)
    setIsRunning(false)
    setSelectedNode(null)
    setWorkflowStats({
      totalSteps: 5,
      completedSteps: 1,
      runningSteps: 1,
      pendingSteps: 3,
      errorSteps: 0,
      totalDuration: '--',
    })
  }

  // 选中节点时更新状态
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedNode(null)
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="h-[calc(100vh-12rem)] space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">工作流可视化</h1>
        <p className="text-muted-foreground mt-2">
          设计和执行自动化工作流，可视化任务执行过程
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="rounded-lg border bg-background px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="工作流名称"
          />
          
          <button
            onClick={isRunning ? () => setIsRunning(false) : executeWorkflow}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              isRunning
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-green-500 text-white hover:bg-green-600"
            )}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? '暂停' : '执行'}
          </button>
          
          <button
            onClick={resetWorkflow}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent"
          >
            <RotateCw className="h-4 w-4" />
            重置
          </button>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
            <Save className="h-4 w-4" />
            保存
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
            <Upload className="h-4 w-4" />
            导入
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent">
            <Download className="h-4 w-4" />
            导出
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">总步骤</div>
          <div className="text-2xl font-bold">{workflowStats.totalSteps}</div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">已完成</div>
          <div className="text-2xl font-bold text-green-600">
            {workflowStats.completedSteps}
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">运行中</div>
          <div className="text-2xl font-bold text-blue-600">
            {workflowStats.runningSteps}
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">待执行</div>
          <div className="text-2xl font-bold text-yellow-600">
            {workflowStats.pendingSteps}
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">错误</div>
          <div className="text-2xl font-bold text-red-600">
            {workflowStats.errorSteps}
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">总耗时</div>
          <div className="text-2xl font-bold">{workflowStats.totalDuration}</div>
        </div>
      </div>

      {/* Main Workflow Area */}
      <div className="flex h-[calc(100%-20rem)] gap-4">
        {/* Tool Palette */}
        <div className="w-64 rounded-lg border bg-card p-4">
          <h3 className="font-semibold mb-4">工具面板</h3>
          
          <div className="space-y-2">
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">文件操作</h4>
              <button
                onClick={() => addToolNode('read')}
                className="flex w-full items-center gap-2 rounded-lg border p-3 hover:bg-accent"
              >
                <FileText className="h-4 w-4" />
                <span>读取文件</span>
              </button>
              <button
                onClick={() => addToolNode('write')}
                className="flex w-full items-center gap-2 rounded-lg border p-3 hover:bg-accent"
              >
                <FileText className="h-4 w-4" />
                <span>写入文件</span>
              </button>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">系统命令</h4>
              <button
                onClick={() => addToolNode('exec')}
                className="flex w-full items-center gap-2 rounded-lg border p-3 hover:bg-accent"
              >
                <Terminal className="h-4 w-4" />
                <span>执行命令</span>
              </button>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">记忆系统</h4>
              <button
                onClick={() => addToolNode('memory_recall')}
                className="flex w-full items-center gap-2 rounded-lg border p-3 hover:bg-accent"
              >
                <Database className="h-4 w-4" />
                <span>回忆记忆</span>
              </button>
            </div>
          </div>
        </div>

        {/* Workflow Canvas */}
        <div className="flex-1 rounded-lg border bg-card overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(event, node) => {
              event.stopPropagation()
              setSelectedNode(node)
            }}
            fitView
          >
            <Background variant="dots" gap={12} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        {/* Properties Panel */}
        <div className="w-80 rounded-lg border bg-card p-4">
          <h3 className="font-semibold mb-4">属性面板</h3>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  节点名称
                </label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  onChange={(e) => {
                    setNodes(nds => nds.map(node => 
                      node.id === selectedNode.id 
                        ? { ...node, data: { ...node.data, label: e.target.value } }
                        : node
                    ))
                    setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: e.target.value } })
                  }}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              {selectedNode.data.parameters && (
                <div>
                  <h4 className="text-sm font-medium mb-2">参数</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedNode.data.parameters).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <input
                          type="text"
                          value={key}
                          readOnly
                          className="flex-1 rounded border bg-muted px-2 py-1 text-sm"
                        />
                        <input
                          type="text"
                          value={String(value)}
                          onChange={(e) => {
                            setNodes(nds => nds.map(node => 
                              node.id === selectedNode.id 
                                ? { 
                                    ...node, 
                                    data: { 
                                      ...node.data, 
                                      parameters: { 
                                        ...node.data.parameters, 
                                        [key]: e.target.value 
                                      } 
                                    } 
                                  }
                                : node
                            ))
                          }}
                          className="flex-1 rounded border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <button
                  onClick={() => deleteNode(selectedNode.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                  删除节点
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <WorkflowIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>选择一个节点来编辑其属性</p>
              <p className="text-sm mt-1">或拖动一个新节点到画布上</p>
            </div>
          )}
        </div>
      </div>

      {/* Execution Log */}
      <div className="rounded-lg border">
        <div className="border-b p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            执行日志
          </h3>
        </div>
        <div className="p-4">
          <div className="font-mono text-sm space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-blue-600">[INFO]</span>
              <span>工作流开始执行: {workflowName}</span>
              <span className="text-muted-foreground ml-auto">01:33:25</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-600">[SUCCESS]</span>
              <span>工具 'read' 执行完成，耗时 125ms</span>
              <span className="text-muted-foreground ml-auto">01:33:25</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-600">[RUNNING]</span>
              <span>工具 'exec' 正在执行...</span>
              <span className="text-muted-foreground ml-auto">01:33:25</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">[PENDING]</span>
              <span>工具 'memory_recall' 等待执行</span>
              <span className="text-muted-foreground ml-auto">01:33:25</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">[PENDING]</span>
              <span>工具 'message' 等待执行</span>
              <span className="text-muted-foreground ml-auto">01:33:25</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}