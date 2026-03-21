# 部署到 GitHub 指南

## 步骤 1: 初始化 Git 仓库

```bash
cd openclaw-gui

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "Initial commit: OpenClaw GUI - OpenClaw Visualization Interface"

# 创建 .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
env/
venv/
ENV/
.pytest_cache/

# Build outputs
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Environment variables
.env
.env.local
.env.*.local

# Docker
*.dockerignore

# Temporary files
tmp/
temp/
*.tmp

# Database
*.db
*.sqlite
*.sqlite3

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage
coverage/
.coverage
*.cover

# TypeScript
*.tsbuildinfo
EOF

# 重新添加文件
git add .
git commit -m "Add .gitignore"
```

## 步骤 2: 在 GitHub 上创建仓库

1. 访问 https://github.com/new
2. 仓库名称: `openclaw-gui`
3. 选择 Public 或 Private
4. **不要**初始化 README、.gitignore 或 LICENSE（我们已经有了）
5. 点击 "Create repository"

## 步骤 3: 推送到 GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/openclaw-gui.git

# 推送代码
git branch -M main
git push -u origin main
```

## 步骤 4: 使用个人访问令牌 (Personal Access Token)

如果需要认证：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" -> "Generate new token (classic)"
3. 选择 `repo` 权限范围
4. 生成并复制令牌
5. 推送时使用令牌作为密码

```bash
# 或者在 URL 中包含令牌
git remote set-url origin https://你的用户名:你的令牌@github.com/你的用户名/openclaw-gui.git
```

## 步骤 5: 设置 GitHub 仓库描述

在 GitHub 仓库页面，设置：

- **Description**: OpenClaw 可视化工作界面 - 现代化的 OpenClaw GUI，提供多 Agent 管理、实时监控、记忆系统和飞书集成
- **Website**: (可选)
- **Topics**: 添加标签
  - `openclaw`
  - `ai`
  - `agent`
  - `gui`
  - `visualization`
  - `feishu`
  - `react`
  - `typescript`
  - `fastapi`

## 步骤 6: 创建 GitHub Pages (可选)

如果要启用 GitHub Pages：

1. 进入仓库 Settings -> Pages
2. Source: Deploy from a branch
3. Branch: main, / (root)
4. 点击 Save

## 步骤 7: 添加 README 徽章 (可选)

在 README.md 中添加：

```markdown
![GitHub stars](https://img.shields.io/github/stars/你的用户名/openclaw-gui?style=social)
![GitHub forks](https://img.shields.io/github/forks/你的用户名/openclaw-gui?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/你的用户名/openclaw-gui?style=social)
```

## 快速部署脚本

创建一个快速部署脚本 `deploy-github.sh`:

```bash
#!/bin/bash

# 配置
GITHUB_USERNAME="你的用户名"
REPO_NAME="openclaw-gui"
GITHUB_TOKEN="你的个人访问令牌"

# 检查是否在正确的目录
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: OpenClaw GUI"
fi

# 添加远程仓库
echo "Adding remote repository..."
git remote add origin https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git 2>/dev/null || git remote set-url origin https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

# 推送
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully deployed to GitHub!"
echo "📦 Repository: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
```

---

## 故障排除

### 问题: 认证失败

确保使用个人访问令牌而不是密码。

### 问题: 远程仓库已存在

使用 `git remote set-url origin <url>` 更新远程 URL。

### 问题: 推送被拒绝

使用 `git pull origin main --allow-unrelated-histories` 先拉取。

## 下一步

部署成功后：
- 🌟 Star 你的仓库
- 📝 写一个博客介绍项目
- 🤝 邀请贡献者
- 📢 在社区分享
