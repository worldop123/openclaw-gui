const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const winston = require('winston');
const path = require('path');

// 配置日志
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// 环境变量
const PORT = process.env.PORT || 5000;
const OPENCLAW_GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'ws://localhost:18789';
const OPENCLAW_AUTH_TOKEN = process.env.OPENCLAW_AUTH_TOKEN || 'ef7adab7d41a68c9a33b050395e0edcc4b34e80edf65353c';

// 创建Express应用
const app = express();
const server = http.createServer(app);

// 创建Socket.io服务器
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com'] 
      : ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务（用于生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
}

// OpenClaw WebSocket连接
let openclawWs = null;
let isConnected = false;

function connectToOpenClaw() {
  if (openclawWs) {
    openclawWs.close();
  }

  openclawWs = new WebSocket(OPENCLAW_GATEWAY_URL);

  openclawWs.on('open', () => {
    logger.info('Connected to OpenClaw Gateway');
    isConnected = true;
    
    // 发送认证消息
    if (OPENCLAW_AUTH_TOKEN) {
      openclawWs.send(JSON.stringify({
        type: 'auth',
        token: OPENCLAW_AUTH_TOKEN
      }));
    }
    
    // 广播连接状态
    io.emit('openclaw-status', { connected: true });
  });

  openclawWs.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      logger.debug('Received from OpenClaw:', message.type || 'unknown');
      
      // 转发消息到前端
      io.emit('openclaw-message', message);
      
      // 处理特定消息类型
      switch (message.type) {
        case 'session-update':
          io.emit('session-update', message.data);
          break;
        case 'tool-call':
          io.emit('tool-call', message.data);
          break;
        case 'memory-update':
          io.emit('memory-update', message.data);
          break;
      }
    } catch (error) {
      logger.error('Error parsing OpenClaw message:', error);
    }
  });

  openclawWs.on('error', (error) => {
    logger.error('OpenClaw WebSocket error:', error);
    isConnected = false;
    io.emit('openclaw-status', { connected: false, error: error.message });
  });

  openclawWs.on('close', () => {
    logger.info('Disconnected from OpenClaw Gateway');
    isConnected = false;
    io.emit('openclaw-status', { connected: false });
    
    // 尝试重新连接
    setTimeout(() => {
      logger.info('Attempting to reconnect to OpenClaw Gateway...');
      connectToOpenClaw();
    }, 5000);
  });
}

// API路由
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    openclawConnected: isConnected,
    version: '1.0.0',
    services: {
      gateway: isConnected,
      memory: true,
      feishu: true,
      tasks: true
    }
  });
});

app.get('/api/sessions', async (req, res) => {
  try {
    // 这里应该从OpenClaw获取会话列表
    // 暂时返回模拟数据
    const sessions = [
      {
        id: 'main',
        type: 'main',
        status: 'active',
        model: 'ark/deepseek-v3.2',
        createdAt: '2026-03-21T01:13:00Z',
        lastActivity: new Date().toISOString(),
        messageCount: 42,
        thinkingEnabled: false,
        elevated: false
      },
      {
        id: 'sub_001',
        type: 'subagent',
        status: 'active',
        model: 'claude-3.5-sonnet',
        createdAt: '2026-03-21T10:30:00Z',
        lastActivity: new Date(Date.now() - 300000).toISOString(),
        messageCount: 15,
        thinkingEnabled: true,
        elevated: true,
        label: '代码审查'
      },
      {
        id: 'acp_001',
        type: 'acp',
        status: 'completed',
        model: 'codex',
        createdAt: '2026-03-21T09:15:00Z',
        lastActivity: new Date(Date.now() - 1800000).toISOString(),
        messageCount: 8,
        thinkingEnabled: false,
        elevated: false,
        label: 'API开发'
      },
      {
        id: 'sub_002',
        type: 'subagent',
        status: 'idle',
        model: 'gpt-4',
        createdAt: '2026-03-20T14:20:00Z',
        lastActivity: new Date(Date.now() - 3600000).toISOString(),
        messageCount: 25,
        thinkingEnabled: false,
        elevated: false,
        label: '数据分析'
      }
    ];
    
    res.json({
      sessions,
      total: sessions.length,
      active: sessions.filter(s => s.status === 'active').length
    });
  } catch (error) {
    logger.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.get('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 模拟获取特定会话
    const session = {
      id: id,
      type: 'main',
      status: 'active',
      model: 'ark/deepseek-v3.2',
      createdAt: '2026-03-21T01:13:00Z',
      lastActivity: new Date().toISOString(),
      messageCount: 42,
      thinkingEnabled: false,
      elevated: false,
      messages: [
        { role: 'user', content: '你好，帮我检查一下系统状态', timestamp: '2026-03-21T10:00:00Z' },
        { role: 'assistant', content: '系统运行正常，所有服务都在线。', timestamp: '2026-03-21T10:00:05Z' }
      ]
    };
    
    res.json(session);
  } catch (error) {
    logger.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

app.get('/api/tools', (req, res) => {
  // 返回可用的工具列表（更完整的列表）
  const tools = [
    // 文件操作
    { name: 'read', description: '读取文件内容', category: 'file', icon: '📄' },
    { name: 'write', description: '写入文件', category: 'file', icon: '✏️' },
    { name: 'edit', description: '编辑文件', category: 'file', icon: '🔧' },
    
    // 系统操作
    { name: 'exec', description: '执行命令', category: 'system', icon: '💻' },
    { name: 'process', description: '管理进程', category: 'system', icon: '⚙️' },
    
    // 通信
    { name: 'message', description: '发送消息', category: 'communication', icon: '💬' },
    
    // 飞书集成
    { name: 'feishu_calendar_event', description: '飞书日程管理', category: 'feishu', icon: '📅' },
    { name: 'feishu_task_task', description: '飞书任务管理', category: 'feishu', icon: '✅' },
    { name: 'feishu_bitable_app_table_record', description: '多维表格记录', category: 'feishu', icon: '📊' },
    { name: 'feishu_sheet', description: '电子表格操作', category: 'feishu', icon: '📈' },
    { name: 'feishu_create_doc', description: '创建文档', category: 'feishu', icon: '📝' },
    { name: 'feishu_fetch_doc', description: '获取文档', category: 'feishu', icon: '📖' },
    
    // 记忆系统
    { name: 'memory_store', description: '存储记忆', category: 'memory', icon: '💾' },
    { name: 'memory_recall', description: '回忆记忆', category: 'memory', icon: '🔍' },
    { name: 'memory_forget', description: '删除记忆', category: 'memory', icon: '🗑️' },
    
    // 浏览器
    { name: 'browser', description: '浏览器控制', category: 'browser', icon: '🌐' },
    { name: 'web_fetch', description: '网页抓取', category: 'browser', icon: '🕸️' },
    
    // 节点管理
    { name: 'nodes', description: '节点管理', category: 'nodes', icon: '📱' },
    { name: 'canvas', description: '画布控制', category: 'nodes', icon: '🎨' },
    
    // 定时任务
    { name: 'cron', description: '定时任务管理', category: 'cron', icon: '⏰' },
    
    // 会话管理
    { name: 'sessions_spawn', description: '创建会话', category: 'sessions', icon: '➕' },
    { name: 'sessions_list', description: '列出会话', category: 'sessions', icon: '📋' },
    { name: 'subagents', description: '子代理管理', category: 'sessions', icon: '🤖' }
  ];
  
  // 按类别分组
  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {});
  
  res.json({
    tools,
    groupedTools,
    categories: Object.keys(groupedTools),
    total: tools.length
  });
});

app.get('/api/tools/:name', (req, res) => {
  const { name } = req.params;
  
  // 模拟工具详情
  const toolDetails = {
    name: name,
    description: `${name}工具的详细描述`,
    category: 'system',
    parameters: ['command', 'workdir', 'env'],
    examples: [
      { command: `${name} --help`, description: '查看帮助' },
      { command: `${name} ls -la`, description: '列出文件' }
    ],
    usageStats: {
      callsToday: 15,
      callsThisWeek: 120,
      successRate: 98.5,
      avgResponseTime: 250
    }
  };
  
  res.json(toolDetails);
});

app.post('/api/command', (req, res) => {
  const { command, sessionId, parameters } = req.body;
  
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }
  
  if (!isConnected || !openclawWs) {
    return res.status(503).json({ error: 'Not connected to OpenClaw Gateway' });
  }
  
  try {
    // 发送命令到OpenClaw
    const message = {
      type: 'command',
      sessionId: sessionId || 'main',
      command: command,
      parameters: parameters || {},
      timestamp: new Date().toISOString(),
      requestId: `cmd_${Date.now()}`
    };
    
    openclawWs.send(JSON.stringify(message));
    
    res.json({ 
      success: true, 
      message: 'Command sent',
      requestId: message.requestId
    });
  } catch (error) {
    logger.error('Error sending command:', error);
    res.status(500).json({ error: 'Failed to send command' });
  }
});

app.post('/api/tool/call', (req, res) => {
  const { toolName, parameters, sessionId } = req.body;
  
  if (!toolName) {
    return res.status(400).json({ error: 'Tool name is required' });
  }
  
  if (!isConnected || !openclawWs) {
    return res.status(503).json({ error: 'Not connected to OpenClaw Gateway' });
  }
  
  try {
    // 发送工具调用到OpenClaw
    const message = {
      type: 'tool-call',
      toolName: toolName,
      parameters: parameters || {},
      sessionId: sessionId || 'main',
      timestamp: new Date().toISOString(),
      requestId: `tool_${Date.now()}`
    };
    
    openclawWs.send(JSON.stringify(message));
    
    res.json({ 
      success: true, 
      message: `Tool ${toolName} called successfully`,
      requestId: message.requestId
    });
  } catch (error) {
    logger.error('Error calling tool:', error);
    res.status(500).json({ error: 'Failed to call tool' });
  }
});

// 记忆系统API
app.get('/api/memory/search', async (req, res) => {
  try {
    const { query = '', limit = 5 } = req.query;
    
    // 模拟记忆搜索
    const memories = [
      {
        id: 'mem_001',
        text: '用户正在开发OpenClaw可视化界面项目',
        importance: 0.9,
        category: 'project',
        timestamp: '2026-03-21T01:13:00Z',
        tags: ['openclaw', 'gui', 'development']
      },
      {
        id: 'mem_002',
        text: '用户使用飞书作为主要通信工具',
        importance: 0.8,
        category: 'preference',
        timestamp: '2026-03-20T02:22:00Z',
        tags: ['feishu', 'communication']
      },
      {
        id: 'mem_003',
        text: '用户喜欢使用深色主题界面',
        importance: 0.7,
        category: 'preference',
        timestamp: '2026-03-19T15:30:00Z',
        tags: ['ui', 'theme']
      },
      {
        id: 'mem_004',
        text: '用户经常使用文件操作和系统命令工具',
        importance: 0.8,
        category: 'behavior',
        timestamp: '2026-03-18T10:45:00Z',
        tags: ['tools', 'file', 'system']
      },
      {
        id: 'mem_005',
        text: '用户计划集成飞书日历和任务管理',
        importance: 0.85,
        category: 'plan',
        timestamp: '2026-03-17T14:20:00Z',
        tags: ['feishu', 'calendar', 'tasks']
      }
    ];
    
    // 简单搜索过滤
    const results = memories
      .filter(memory => 
        !query || 
        memory.text.toLowerCase().includes(query.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      .slice(0, parseInt(limit));
    
    res.json({
      query,
      results,
      total: results.length,
      hasMore: memories.length > results.length
    });
  } catch (error) {
    logger.error('Error searching memory:', error);
    res.status(500).json({ error: 'Failed to search memory' });
  }
});

app.post('/api/memory/store', async (req, res) => {
  try {
    const { text, importance = 0.7, category = 'other', tags = [] } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // 模拟存储记忆
    const newMemory = {
      id: `mem_${Date.now()}`,
      text,
      importance: parseFloat(importance),
      category,
      tags: Array.isArray(tags) ? tags : [tags],
      timestamp: new Date().toISOString()
    };
    
    // 这里应该调用memory_store工具
    // 暂时返回成功
    
    res.json({
      success: true,
      message: 'Memory stored successfully',
      memory: newMemory
    });
  } catch (error) {
    logger.error('Error storing memory:', error);
    res.status(500).json({ error: 'Failed to store memory' });
  }
});

// 系统统计API
app.get('/api/stats', (req, res) => {
  const stats = {
    totalSessions: 4,
    activeSessions: 2,
    toolCallsToday: 42,
    toolCallsThisWeek: 285,
    memoryItems: 156,
    avgResponseTime: 128,
    uptime: '5天12小时',
    systemLoad: 0.45,
    diskUsage: '78%',
    memoryUsage: '65%'
  };
  
  res.json(stats);
});

// 飞书集成API
app.get('/api/feishu/calendars', async (req, res) => {
  try {
    // 模拟飞书日历数据
    const calendars = [
      {
        id: 'primary',
        name: '主日历',
        description: '个人主日历',
        permission: 'owner',
        color: '#4285F4',
        default: true
      },
      {
        id: 'work',
        name: '工作日历',
        description: '工作相关日程',
        permission: 'owner',
        color: '#34A853',
        default: false
      },
      {
        id: 'team',
        name: '团队日历',
        description: '团队共享日历',
        permission: 'reader',
        color: '#FBBC05',
        default: false
      }
    ];
    
    res.json({ calendars });
  } catch (error) {
    logger.error('Error fetching Feishu calendars:', error);
    res.status(500).json({ error: 'Failed to fetch Feishu calendars' });
  }
});

app.get('/api/feishu/events', async (req, res) => {
  try {
    const { start_time, end_time, calendar_id = 'primary' } = req.query;
    
    // 模拟飞书日程数据
    const events = [
      {
        id: 'event_001',
        summary: '团队周会',
        description: '每周团队同步会议',
        start_time: '2026-03-21T10:00:00+08:00',
        end_time: '2026-03-21T11:00:00+08:00',
        calendar_id: 'work',
        attendees: [
          { id: 'ou_001', name: '张三', type: 'user' },
          { id: 'ou_002', name: '李四', type: 'user' }
        ],
        location: '会议室A',
        status: 'confirmed'
      },
      {
        id: 'event_002',
        summary: '产品评审',
        description: '新产品功能评审',
        start_time: '2026-03-21T14:00:00+08:00',
        end_time: '2026-03-21T15:30:00+08:00',
        calendar_id: 'work',
        attendees: [
          { id: 'ou_003', name: '王五', type: 'user' }
        ],
        location: '线上会议',
        status: 'confirmed'
      },
      {
        id: 'event_003',
        summary: '个人健身',
        description: '健身房锻炼',
        start_time: '2026-03-21T18:00:00+08:00',
        end_time: '2026-03-21T19:00:00+08:00',
        calendar_id: 'primary',
        attendees: [],
        location: '健身房',
        status: 'tentative'
      }
    ];
    
    // 过滤
    const filteredEvents = events.filter(event => {
      if (calendar_id && event.calendar_id !== calendar_id) return false;
      if (start_time && new Date(event.start_time) < new Date(start_time)) return false;
      if (end_time && new Date(event.end_time) > new Date(end_time)) return false;
      return true;
    });
    
    res.json({ 
      events: filteredEvents,
      total: filteredEvents.length
    });
  } catch (error) {
    logger.error('Error fetching Feishu events:', error);
    res.status(500).json({ error: 'Failed to fetch Feishu events' });
  }
});

// 工作流API
app.get('/api/workflows', (req, res) => {
  const workflows = [
    {
      id: 'wf_001',
      name: '日常检查',
      description: '每日系统健康检查',
      status: 'active',
      steps: 5,
      lastRun: '2026-03-21T08:00:00Z',
      nextRun: '2026-03-22T08:00:00Z',
      successRate: 98
    },
    {
      id: 'wf_002',
      name: '数据备份',
      description: '自动备份重要数据',
      status: 'active',
      steps: 3,
      lastRun: '2026-03-21T02:00:00Z',
      nextRun: '2026-03-22T02:00:00Z',
      successRate: 100
    },
    {
      id: 'wf_003',
      name: '飞书同步',
      description: '同步飞书日历和任务',
      status: 'paused',
      steps: 4,
      lastRun: '2026-03-20T12:00:00Z',
      nextRun: null,
      successRate: 95
    }
  ];
  
  res.json({ workflows });
});

// 工具使用统计API
app.get('/api/tools/usage', (req, res) => {
  const usage = {
    daily: [
      { tool: 'read', count: 15, category: 'file' },
      { tool: 'exec', count: 12, category: 'system' },
      { tool: 'feishu_calendar_event', count: 8, category: 'feishu' },
      { tool: 'memory_recall', count: 6, category: 'memory' },
      { tool: 'message', count: 5, category: 'communication' }
    ],
    weekly: [
      { tool: 'read', count: 85, category: 'file' },
      { tool: 'exec', count: 72, category: 'system' },
      { tool: 'write', count: 45, category: 'file' },
      { tool: 'feishu_calendar_event', count: 38, category: 'feishu' },
      { tool: 'memory_recall', count: 32, category: 'memory' }
    ],
    byCategory: [
      { category: 'file', count: 150, percentage: 40 },
      { category: 'system', count: 85, percentage: 22 },
      { category: 'feishu', count: 65, percentage: 17 },
      { category: 'memory', count: 45, percentage: 12 },
      { category: 'communication', count: 25, percentage: 7 },
      { category: 'other', count: 15, percentage: 4 }
    ]
  };
  
  res.json(usage);
});

// Socket.io连接处理
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  // 发送当前状态
  socket.emit('openclaw-status', { connected: isConnected });
  socket.emit('stats-update', {
    totalSessions: 4,
    activeSessions: 2,
    toolCallsToday: 42,
    memoryItems: 156
  });
  
  // 处理客户端命令
  socket.on('send-command', (data) => {
    const { command, sessionId, parameters } = data;
    
    if (isConnected && openclawWs) {
      openclawWs.send(JSON.stringify({
        type: 'client-command',
        sessionId: sessionId || 'main',
        command: command,
        parameters: parameters || {},
        clientId: socket.id,
        timestamp: new Date().toISOString()
      }));
    }
  });
  
  // 处理工具调用
  socket.on('call-tool', (data) => {
    const { toolName, parameters, sessionId } = data;
    
    if (isConnected && openclawWs) {
      openclawWs.send(JSON.stringify({
        type: 'tool-call',
        toolName: toolName,
        parameters: parameters || {},
        sessionId: sessionId || 'main',
        clientId: socket.id,
        timestamp: new Date().toISOString()
      }));
    }
  });
  
  // 获取会话列表
  socket.on('get-sessions', () => {
    const sessions = [
      {
        id: 'main',
        type: 'main',
        status: 'active',
        model: 'ark/deepseek-v3.2',
        createdAt: '2026-03-21T01:13:00Z',
        lastActivity: new Date().toISOString(),
        messageCount: 42,
        thinkingEnabled: false,
        elevated: false
      },
      {
        id: 'sub_001',
        type: 'subagent',
        status: 'active',
        model: 'claude-3.5-sonnet',
        createdAt: '2026-03-21T10:30:00Z',
        lastActivity: new Date(Date.now() - 300000).toISOString(),
        messageCount: 15,
        thinkingEnabled: true,
        elevated: true,
        label: '代码审查'
      }
    ];
    
    socket.emit('session-update', sessions);
  });
  
  // 获取工具列表
  socket.on('get-tools', () => {
    const tools = [
      { name: 'read', description: '读取文件内容', category: 'file', lastCalled: new Date(Date.now() - 300000).toISOString() },
      { name: 'exec', description: '执行命令', category: 'system', lastCalled: new Date(Date.now() - 600000).toISOString() },
      { name: 'feishu_calendar_event', description: '飞书日程管理', category: 'feishu', lastCalled: new Date(Date.now() - 900000).toISOString() },
      { name: 'memory_recall', description: '回忆记忆', category: 'memory', lastCalled: new Date(Date.now() - 1200000).toISOString() }
    ];
    
    socket.emit('tools-update', tools);
  });
  
  // 获取统计信息
  socket.on('get-stats', () => {
    const stats = {
      totalSessions: 4,
      activeSessions: 2,
      toolCallsToday: 42,
      memoryItems: 156,
      avgResponseTime: 128,
      uptime: '5天12小时'
    };
    
    socket.emit('stats-update', stats);
  });
  
  // 搜索记忆
  socket.on('search-memory', (data) => {
    const { query, limit = 5 } = data;
    
    const memories = [
      {
        id: 'mem_001',
        text: '用户正在开发OpenClaw可视化界面项目',
        importance: 0.9,
        category: 'project',
        timestamp: '2026-03-21T01:13:00Z'
      },
      {
        id: 'mem_002',
        text: '用户使用飞书作为主要通信工具',
        importance: 0.8,
        category: 'preference',
        timestamp: '2026-03-20T02:22:00Z'
      }
    ];
    
    const results = memories.filter(memory => 
      !query || memory.text.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
    
    socket.emit('memory-results', { query, results });
  });
  
  // 订阅实时更新
  socket.on('subscribe', (channels) => {
    logger.info(`Client ${socket.id} subscribed to: ${channels.join(', ')}`);
    socket.emit('subscription-confirmed', { channels });
  });
  
  // 心跳检测
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });
  
  // 处理断开连接
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// 启动服务器
server.listen(PORT, () => {
  logger.info(`OpenClaw GUI Backend running on port ${PORT}`);
  
  // 连接到OpenClaw Gateway
  connectToOpenClaw();
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  if (openclawWs) {
    openclawWs.close();
  }
  
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io, openclawWs };