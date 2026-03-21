# 贡献指南

感谢你对 OpenClaw GUI 项目的兴趣！我们欢迎任何形式的贡献。

## 📋 行为准则

### 我们的承诺

为了营造开放和友好的环境，我们承诺：
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化的语言或图像
- 恶意评论或人身攻击
- 公开或私下骚扰
- 未经许可发布他人的私人信息
- 其他不专业或不恰当的行为

## 🚀 如何贡献

### 1. 报告 Bug

在报告 Bug 之前，请先：
- 检查 [Issues](https://github.com/your-username/openclaw-gui/issues) 是否已经报告过
- 确保你使用的是最新版本

报告 Bug 时请包含：
- 清晰的标题和描述
- 复现步骤
- 预期行为和实际行为
- 屏幕截图（如果适用）
- 你的环境信息（操作系统、浏览器、Node.js 版本等）

### 2. 提出新功能

我们欢迎新功能建议！在提出之前：
- 检查 Issues 中是否已有类似建议
- 清楚地描述功能的用途和好处
- 如果可能，提供实现思路

### 3. 代码贡献

#### 开发环境设置

```bash
# Fork 并克隆项目
git clone https://github.com/your-username/openclaw-gui.git
cd openclaw-gui

# 安装依赖
cd frontend && npm install
cd ../backend && npm install
cd ../proxy && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# 创建功能分支
git checkout -b feature/your-feature-name
```

#### 代码风格

- **前端**: 使用 TypeScript，遵循 ESLint 规则
- **后端 (Node.js)**: 使用 ES6+ 语法，遵循 ESLint 规则
- **后端 (Python)**: 遵循 PEP 8 规范
- **提交信息**: 使用清晰的描述，格式：`type: subject`

#### 提交类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

#### 提交 Pull Request

1. 确保你的代码通过所有测试
2. 更新相关文档
3. 提交 PR，使用清晰的标题和描述
4. 等待代码审查
5. 根据反馈进行修改

## 📖 开发指南

### 项目架构

```
openclaw-gui/
├── frontend/     # React 前端
├── backend/      # Node.js 后端
└── proxy/        # Python 代理服务
```

### 前端开发

- 使用 React 18 + TypeScript
- 状态管理使用 Zustand
- 数据获取使用 React Query
- UI 组件使用 Shadcn/ui + Tailwind CSS

### 后端开发

- Node.js + Express
- WebSocket 支持实时通信
- RESTful API 设计

### Python 代理

- FastAPI 框架
- 与 OpenClaw Gateway 通信
- 数据预处理和转换

## 🔍 测试

### 运行测试

```bash
# 前端测试
cd frontend && npm test

# 后端测试
cd backend && npm test

# Python 测试
cd proxy && pytest
```

### 编写测试

- 为新功能编写测试
- 确保测试覆盖关键路径
- 使用有意义的测试名称

## 📄 许可证

通过贡献代码，你同意你的贡献将根据项目的 MIT 许可证进行许可。

## 🙋 需要帮助？

如果你有任何问题或需要帮助：
- 打开一个 Issue
- 在 Discord 社区中提问
- 联系维护者

---

再次感谢你的贡献！🎉
