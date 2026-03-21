#!/bin/bash

# 简单启动脚本 - 手动启动各个服务

echo "=== 启动 OpenClaw GUI ==="
echo "当前目录: $(pwd)"

# 检查OpenClaw Gateway
echo "检查OpenClaw Gateway..."
if curl -s http://localhost:18789/ > /dev/null 2>&1; then
    echo "✓ OpenClaw Gateway正在运行"
else
    echo "✗ OpenClaw Gateway未运行"
    echo "请运行: openclaw gateway start"
    exit 1
fi

# 启动Python代理服务
echo "启动Python代理服务..."
cd proxy
if [ ! -d "venv" ]; then
    echo "创建Python虚拟环境..."
    python3 -m venv venv
fi

echo "激活虚拟环境并安装依赖..."
source venv/bin/activate
pip install -r requirements.txt

echo "启动FastAPI服务..."
python main.py &
PYTHON_PID=$!
cd ..

# 启动Node.js后端
echo "启动Node.js后端..."
cd backend
npm install
node src/index.js &
NODE_PID=$!
cd ..

# 启动React前端
echo "启动React前端..."
cd frontend
npm install
npm run dev &
REACT_PID=$!
cd ..

echo ""
echo "=== 服务启动完成 ==="
echo "Python代理: http://localhost:8000"
echo "Node.js后端: http://localhost:5000"
echo "React前端: http://localhost:5173"
echo ""
echo "按Ctrl+C停止所有服务"

# 等待用户中断
trap "kill $PYTHON_PID $NODE_PID $REACT_PID 2>/dev/null; echo '服务已停止'; exit" INT TERM
wait