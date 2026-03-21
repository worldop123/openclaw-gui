# OpenClaw GUI - 可视化工作界面

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Build Status">
  <img src="https://img.shields.io/badge/OpenClaw-compatible-orange.svg" alt="OpenClaw Compatible">
</div>

## 📖 简介

OpenClaw GUI 是一个现代化的 OpenClaw 图形用户界面，提供可视化的工作流管理、实时监控和智能控制功能。通过直观的 Web 界面，你可以像管理真实团队一样管理你的 AI 助手！

## ✨ 核心功能

### 👥 团队仪表盘
- **6个AI团队成员** - 每个都有独特的角色和技能
- **实时状态监控** - 查看谁在工作、谁在忙碌、谁在休息
- **心情指示器** - 😊开心、🎯专注、😐中性、😴疲惫
- **任务进度条** - 实时显示每个任务的完成进度
- **技能标签** - 一目了然看到每个成员的专长

### 🎛️ 中控台
- **系统统计面板** - 团队成员、活跃中、进行中、已完成
- **实时活动流** - 谁在做什么，一目了然
- **连接状态指示** - 显示与OpenClaw Gateway的连接状态
- **玻璃拟态设计** - 现代化的渐变和毛玻璃效果

### 🔌 OpenClaw Gateway 集成
- **WebSocket 连接** - 实时双向通信
- **自动重连机制** - 断线自动重连，指数退避
- **事件监听系统** - 灵活的事件订阅和回调
- **命令发送** - 支持发送命令和工具调用
- **TypeScript 类型安全** - 完整的类型定义

### 📚 完整文档
- **Wiki 指南** - 详细的团队角色介绍
- **贡献指南** - 如何参与项目开发
- **部署文档** - Docker和手动部署说明
- **安全政策** - 安全漏洞报告指南

## 🛠️ 技术栈

### 前端
- **React 18** - 现代化前端框架
- **TypeScript** - 类型安全
- **Vite** - 极速构建工具
- **React Router** - 单页面路由
- **Lucide React** - 美观的图标库

### 后端（可选）
- **Python + FastAPI** - 高性能API服务
- **Node.js + Express** - 灵活的后端服务
- **WebSocket** - 实时通信

### 部署
- **Docker** - 容器化部署
- **Docker Compose** - 服务编排
- **Nginx** - 反向代理（可选）

## 📦 快速开始

### 方式一：开发环境

```bash
# 1. 克隆项目
git clone https://github.com/worldop123/openclaw-gui.git
cd openclaw-gui

# 2. 进入前端目录
cd frontend

# 3. 安装依赖
npm install

# 4. 开发模式运行
npm run dev

# 5. 构建生产版本
npm run build

# 6. 预览生产构建
npm run preview
```

### 方式二：Docker 部署

```bash
# 1. 克隆项目
git clone https://github.com/worldop123/openclaw-gui.git
cd openclaw-gui

# 2. 使用 Docker Compose 启动
docker-compose up -d

# 3. 访问应用
# 前端: http://localhost:3000
# 后端 API: http://localhost:5000
# 代理服务: http://localhost:8000
```

### 方式三：快速启动脚本

```bash
# 使用提供的启动脚本
./start.sh

# 或者使用简化版本
./start-simple.sh
```

## 👥 你的 AI 团队

### 1. 👨‍💼 小明 - 经理
- **角色**: Manager
- **职责**: 协调团队工作、分配任务、做出决策
- **技能**: 管理、协调、决策、沟通
- **状态**: 工作中
- **心情**: 😊

### 2. 🤖 代码小助手 - 开发
- **角色**: Developer
- **职责**: 编写React组件、开发前端功能、代码优化
- **技能**: React、TypeScript、Node.js、Python、CSS
- **状态**: 忙碌
- **心情**: 🎯

### 3. 📅 飞书小管家 - 专家
- **角色**: Specialist
- **职责**: 同步日历、管理任务、处理文档、安排会议
- **技能**: 日历、任务、文档、会议、提醒
- **状态**: 工作中
- **心情**: 😊

### 4. 🧠 记忆管理员 - 分析师
- **角色**: Analyst
- **职责**: 存储记忆、快速检索、分析数据、知识图谱
- **技能**: 记忆存储、信息检索、数据分析、知识图谱
- **状态**: 空闲
- **心情**: 😐

### 5. 📁 文件管理员 - 助理
- **角色**: Assistant
- **职责**: 管理目录、读写文件、备份数据、归档文件
- **技能**: 文件操作、目录管理、备份、归档
- **状态**: 工作中
- **心情**: 🎯

### 6. 🌐 网络探索者 - 专家
- **角色**: Specialist
- **职责**: 网络搜索、信息收集、数据抓取、API集成
- **技能**: 网络搜索、信息收集、数据抓取、API集成
- **状态**: 离开
- **心情**: 😴

## 🎨 状态说明

### 状态颜色
- 🟢 **绿色** - 工作中：正在积极处理任务
- 🟡 **黄色** - 空闲：等待新任务分配
- 🔴 **红色** - 忙碌：专注处理重要任务，请勿打扰
- ⚪ **灰色** - 离开：暂时不在，稍后回来

### 心情指示
- 😊 **开心** - 工作顺利，心情愉快
- 🎯 **专注** - 全神贯注，效率很高
- 😐 **中性** - 正常工作状态
- 😴 **疲惫** - 需要休息，稍后恢复

## 🔌 OpenClaw Gateway 连接

### 配置连接

```typescript
import { useOpenClaw } from './hooks/useOpenClaw'

function MyComponent() {
  const { 
    status, 
    connect, 
    disconnect, 
    sendCommand,
    callTool,
    isConnected 
  } = useOpenClaw({
    gatewayUrl: 'ws://localhost:18789',
    autoReconnect: true,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  })

  // 连接
  const handleConnect = () => {
    connect()
  }

  // 发送命令
  const handleSendCommand = () => {
    sendCommand('openclaw gateway status', {}, 'main')
  }

  // 调用工具
  const handleCallTool = () => {
    callTool('read', { path: '/root/.openclaw/workspace/SOUL.md' }, 'main')
  }

  return (
    <div>
      <p>状态: {isConnected ? '已连接' : '未连接'}</p>
      <button onClick={handleConnect}>连接</button>
      <button onClick={handleSendCommand}>发送命令</button>
      <button onClick={handleCallTool}>调用工具</button>
    </div>
  )
}
```

### 直接使用服务

```typescript
import { getOpenClawService } from './services/openclaw'

const service = getOpenClawService({
  gatewayUrl: 'ws://localhost:18789'
})

// 连接
service.connect()

// 监听事件
service.on('connected', () => {
  console.log('已连接到 OpenClaw Gateway!')
})

service.on('message', (data) => {
  console.log('收到消息:', data)
})

service.on('disconnected', (data) => {
  console.log('断开连接:', data)
})

// 发送消息
service.sendCommand('openclaw gateway status')
service.callTool('read', { path: '/path/to/file' })

// 断开连接
service.disconnect()
```

## 📚 启用 GitHub Wiki

### 步骤 1: 启用 Wiki 功能

1. 访问你的 GitHub 仓库：https://github.com/worldop123/openclaw-gui
2. 点击 **Settings** 标签
3. 在 **Features** 部分，勾选 **Wiki**
4. 保存设置

### 步骤 2: 创建首页

1. 点击仓库顶部的 **Wiki** 标签
2. 点击 **Create the first page** 按钮
3. 页面标题填写：`Home`
4. 将 `WIKI_GUIDE.md` 文件的内容复制到编辑器中
5. 点击 **Save Page**

### 步骤 3: 添加更多页面（可选）

你可以创建多个 Wiki 页面来组织内容：
- `团队介绍` - 详细介绍每个成员
- `使用指南` - 如何使用 OpenClaw GUI
- `API 文档` - OpenClaw Gateway API 说明
- `开发指南` - 如何参与开发

## 🤝 贡献指南

我们欢迎任何形式的贡献！详细信息请查看 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 快速开始

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🔒 安全政策

请查看 [SECURITY.md](SECURITY.md) 了解如何报告安全漏洞。

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw) - 核心平台
- [React](https://react.dev/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Lucide](https://lucide.dev/) - 图标库

## 📞 支持

- **文档**: 查看 [Wiki](https://github.com/worldop123/openclaw-gui/wiki)
- **问题**: [GitHub Issues](https://github.com/worldop123/openclaw-gui/issues)
- **社区**: [Discord](https://discord.com/invite/clawd)
- **技能市场**: [ClawHub](https://clawhub.com)

---

<div align="center">
  <strong>Made with ❤️ by the OpenClaw Community</strong>
</div>
