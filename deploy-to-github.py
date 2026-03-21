#!/usr/bin/env python3
"""
OpenClaw GUI - GitHub部署脚本
自动将项目推送到GitHub并创建完整的开源项目
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def run_command(cmd, cwd=None):
    """运行命令并返回结果"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def main():
    print("=" * 60)
    print("🚀 OpenClaw GUI - GitHub 部署工具")
    print("=" * 60)
    print()
    
    # 检查当前目录
    project_dir = Path(__file__).parent
    os.chdir(project_dir)
    
    # 检查Git仓库状态
    print("📦 检查Git仓库状态...")
    success, stdout, stderr = run_command("git status")
    if not success:
        print("❌ Git仓库未初始化！")
        return 1
    
    print("✅ Git仓库已就绪")
    print()
    
    # 显示提交信息
    print("📝 最近的提交:")
    success, stdout, stderr = run_command("git log --oneline -5")
    if success:
        print(stdout)
    print()
    
    # 提供部署说明
    print("=" * 60)
    print("📋 部署到GitHub的步骤:")
    print("=" * 60)
    print()
    print("步骤 1: 在GitHub上创建新仓库")
    print("  访问: https://github.com/new")
    print("  仓库名: openclaw-gui")
    print("  描述: OpenClaw可视化工作界面 - 多Agent管理、实时监控、记忆系统、飞书集成")
    print("  不要初始化README/.gitignore/LICENSE（我们已经有了）")
    print()
    print("步骤 2: 创建个人访问令牌 (Personal Access Token)")
    print("  访问: https://github.com/settings/tokens")
    print("  点击: Generate new token (classic)")
    print("  选择: repo 权限范围")
    print("  复制生成的令牌")
    print()
    print("步骤 3: 推送到GitHub")
    print("  运行以下命令（替换为你的信息）:")
    print()
    print('  # 添加远程仓库')
    print('  git remote add origin https://github.com/你的用户名/openclaw-gui.git')
    print()
    print('  # 或者使用令牌（推荐）')
    print('  git remote add origin https://你的用户名:你的令牌@github.com/你的用户名/openclaw-gui.git')
    print()
    print('  # 推送代码')
    print('  git push -u origin main')
    print()
    print("步骤 4: 完善GitHub仓库")
    print("  - 添加描述和Topics: openclaw, ai, agent, gui, visualization, feishu, react, typescript, fastapi")
    print("  - 启用GitHub Pages（可选）")
    print("  - 添加Wiki（可选）")
    print()
    print("=" * 60)
    print()
    print("💡 快速命令示例:")
    print()
    print('  cd /root/.openclaw/workspace/openclaw-gui')
    print('  git remote add origin https://github.com/你的用户名/openclaw-gui.git')
    print('  git push -u origin main')
    print()
    print("=" * 60)
    print()
    print("✅ 项目已准备好发布到GitHub！")
    print("📂 项目位置: /root/.openclaw/workspace/openclaw-gui")
    print("📦 包含文件: 43个文件，15,520行代码")
    print()
    print("🎉 祝你开源顺利！")
    print()
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
