# OpenClaw GUI - 可视化工作界面

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Build Status">
  <img src="https://img.shields.io/badge/OpenClaw-compatible-orange.svg" alt="OpenClaw Compatible">
</div>

## 📖 简介

OpenClaw GUI 是一个现代化的 OpenClaw 图形用户界面，提供可视化的工作流管理、实时监控和智能控制功能。通过直观的 Web 界面，你可以轻松管理多个 Agent、监控系统状态、查看记忆系统，并与飞书等平台深度集成。

## ✨ 核心功能

### 🎛️ 中控台 (Dashboard)
- **实时系统监控** - CPU、内存、磁盘、网络使用率
- **会话概览** - 所有活跃会话的状态展示
- **工具使用统计** - 可视化展示工具调用频率
- **最近活动** - 实时显示系统事件流

### 🤖 Agent 管理
- **多 Agent 创建** - 支持创建多个子 Agent 和 ACP 会话
- **Agent 配置** - 自定义模型、标签、任务描述
- **实时状态监控** - 查看每个 Agent 的运行状态和资源使用
- **批量操作** - 支持启动、暂停、终止多个 Agent

### 💬 会话管理
- **会话列表** - 查看所有历史和活跃会话
- **消息查看** - 浏览会话中的消息历史
- **会话详情** - 查看会话元数据和统计信息
- **快速切换** - 在不同会话间快速切换

### 🔧 工具调用
- **工具浏览** - 查看所有可用工具及其说明
- **可视化调用** - 通过表单界面调用工具
- **参数验证** - 自动验证工具参数
- **调用历史** - 记录所有工具调用和结果

### 🧠 记忆系统
- **记忆搜索** - 快速搜索和检索记忆
- **分类浏览** - 按分类查看记忆条目
- **重要性筛选** - 按重要性级别过滤
- **记忆管理** - 添加、编辑、删除记忆

### 📅 飞书集成
- **日历管理** - 查看和创建飞书日程
- **任务看板** - 飞书任务的可视化管理
- **多维表格** - 飞书 Bitable 数据浏览和编辑
- **文档集成** - 飞书文档和 Wiki 查看

### 🔄 工作流
- **工作流设计** - 可视化设计自动化工作流
- **定时任务** - 支持 Cron 表达式调度
- **工作流监控** - 实时查看工作流执行状态
- **历史记录** - 工作流执行历史和日志

## 🛠️ 技术栈

### 前端
- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 极速构建工具
- **Tailwind CSS** + **Shadcn/ui** - 美观的 UI 组件
- **Recharts** - 强大的图表库
- **React Flow** - 工作流可视化
- **Zustand** - 轻量级状态管理
- **React Query** - 数据获取和缓存
- **Socket.io Client** - 实时通信

### 后端
- **Node.js + Express** - 高性能后端服务
- **Python + FastAPI** - 智能代理服务
- **WebSocket** - 实时双向通信
- **Redis** - 缓存和会话管理

### 部署
- **Docker** - 容器化部署
- **Docker Compose** - 服务编排
- **Nginx** - 反向代理和静态文件服务

## 🚀 快速开始

### 方式一：Docker Compose（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/your-username/openclaw-gui.git
cd openclaw-gui

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的配置

# 3. 启动所有服务
docker-compose up -d

# 4. 访问应用
# 前端: http://localhost:3000
# 后端 API: http://localhost:5000
# 代理服务: http://localhost:8000
```

### 方式二：开发环境

```bash
# 1. 克隆项目
git clone https://github.com/your-username/openclaw-gui.git
cd openclaw-gui

# 2. 启动 OpenClaw Gateway（如果未运行）
openclaw gateway start

# 3. 启动 Python 代理服务
cd proxy
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py

# 4. 启动 Node.js 后端（新终端）
cd ../backend
npm install
npm run dev

# 5. 启动前端（新终端）
cd ../frontend
npm install
npm run dev

# 6. 打开浏览器访问
# http://localhost:5173
```

## 📁 项目结构

```
openclaw-gui/
├── frontend/                 # React 前端应用
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   ├── pages/          # 页面组件
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── services/       # API 服务
│   │   ├── store/          # 状态管理
│   │   └── types/          # TypeScript 类型
│   ├── Dockerfile
│   └── package.json
├── backend/                 # Node.js 后端
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── services/       # 业务逻辑
│   │   ├── websocket/      # WebSocket 处理
│   │   └── openclaw/       # OpenClaw 集成
│   ├── Dockerfile
│   └── package.json
├── proxy/                  # Python 代理服务
│   ├── main.py            # FastAPI 应用
│   ├── openclaw_client.py # OpenClaw 客户端
│   ├── requirements.txt
│   └── Dockerfile
├── docs/                   # 文档目录
├── .env.example           # 环境变量示例
├── .gitignore
├── docker-compose.yml     # Docker 编排
├── LICENSE
├── README.md
└── start.sh              # 快速启动脚本
```

## ⚙️ 配置说明

### 环境变量

复制 `.env.example` 为 `.env` 并配置：

```bash
# OpenClaw Gateway 配置
OPENCLAW_GATEWAY_HOST=localhost
OPENCLAW_GATEWAY_PORT=18789
OPENCLAW_AUTH_TOKEN=your_auth_token_here

# 前端配置
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000

# 后端配置
PORT=5000
NODE_ENV=production

# Redis 配置
REDIS_URL=redis://localhost:6379
```

### OpenClaw Gateway 连接

确保 OpenClaw Gateway 正在运行：

```bash
# 检查 Gateway 状态
openclaw gateway status

# 如果未运行，启动 Gateway
openclaw gateway start
```

## 🔌 API 文档

### REST API

- **健康检查**: `GET /api/health`
- **会话列表**: `GET /api/sessions`
- **工具列表**: `GET /api/tools`
- **发送命令**: `POST /api/command`
- **调用工具**: `POST /api/tool/call`
- **记忆搜索**: `GET /api/memory/search`
- **存储记忆**: `POST /api/memory/store`
- **工作流列表**: `GET /api/workflows`
- **系统统计**: `GET /api/stats/system`

### WebSocket

- **连接**: `ws://localhost:5000/ws`
- **消息类型**:
  - `ping` / `pong` - 心跳检测
  - `command` - 发送命令
  - `subscribe` - 订阅事件
  - `tool-call` - 工具调用

## 🤝 贡献指南

我们欢迎任何形式的贡献！

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/openclaw-gui.git
   cd openclaw-gui
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **提交更改**
   ```bash
   git add .
   git commit -m 'Add some amazing feature'
   ```

4. **推送到分支**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **打开 Pull Request**

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw) - 核心平台
- [React](https://react.dev/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [FastAPI](https://fastapi.tiangolo.com/) - Python 后端框架
- [Shadcn/ui](https://ui.shadcn.com/) - UI 组件

## 📞 支持

- **文档**: [https://docs.openclaw.ai](https://docs.openclaw.ai)
- **社区**: [Discord](https://discord.com/invite/clawd)
- **问题**: [GitHub Issues](https://github.com/your-username/openclaw-gui/issues)
- **技能市场**: [ClawHub](https://clawhub.com)

---

<div align="center">
  <strong>Made with ❤️ by the OpenClaw Community</strong>
</div>
