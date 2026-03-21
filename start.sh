#!/bin/bash

# OpenClaw GUI 启动脚本
# 用法: ./start.sh [dev|prod|docker]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查OpenClaw Gateway是否运行
check_openclaw_gateway() {
    print_info "检查OpenClaw Gateway状态..."
    
    if curl -s http://localhost:18789/ > /dev/null 2>&1; then
        print_success "OpenClaw Gateway正在运行"
        return 0
    else
        print_warning "OpenClaw Gateway未运行"
        
        # 尝试启动OpenClaw Gateway
        read -p "是否尝试启动OpenClaw Gateway? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "启动OpenClaw Gateway..."
            if openclaw gateway start; then
                print_success "OpenClaw Gateway启动成功"
                sleep 3
                return 0
            else
                print_error "无法启动OpenClaw Gateway"
                return 1
            fi
        else
            print_warning "请手动启动OpenClaw Gateway: openclaw gateway start"
            return 1
        fi
    fi
}

# 开发模式启动
start_dev() {
    print_info "启动开发模式..."
    
    # 检查依赖
    print_info "检查Node.js版本..."
    node --version || { print_error "Node.js未安装"; exit 1; }
    
    print_info "检查Python版本..."
    python3 --version || { print_error "Python3未安装"; exit 1; }
    
    # 检查OpenClaw Gateway
    check_openclaw_gateway || exit 1
    
    # 安装依赖
    print_info "安装前端依赖..."
    cd frontend && npm install
    cd ..
    
    print_info "安装后端依赖..."
    cd backend && npm install
    cd ..
    
    print_info "安装Python代理依赖..."
    cd proxy && pip install -r requirements.txt
    cd ..
    
    # 启动服务
    print_info "启动所有服务..."
    
    # 启动Python代理（后台）
    print_info "启动Python代理服务..."
    cd proxy && python main.py &
    PYTHON_PID=$!
    cd ..
    
    # 启动Node.js后端（后台）
    print_info "启动Node.js后端服务..."
    cd backend && npm run dev &
    NODE_PID=$!
    cd ..
    
    # 启动React前端
    print_info "启动React前端..."
    cd frontend && npm run dev
    
    # 清理
    trap "kill $PYTHON_PID $NODE_PID 2>/dev/null; exit" INT TERM
    wait
}

# 生产模式启动
start_prod() {
    print_info "启动生产模式..."
    
    # 检查OpenClaw Gateway
    check_openclaw_gateway || exit 1
    
    # 构建前端
    print_info "构建前端应用..."
    cd frontend
    npm run build
    cd ..
    
    # 启动服务
    print_info "启动生产服务..."
    
    # 启动Python代理
    print_info "启动Python代理服务..."
    cd proxy && uvicorn main:app --host 0.0.0.0 --port 8000 &
    PYTHON_PID=$!
    cd ..
    
    # 启动Node.js后端
    print_info "启动Node.js后端服务..."
    cd backend && node src/index.js &
    NODE_PID=$!
    cd ..
    
    # 启动Nginx服务前端
    print_info "启动Nginx服务..."
    nginx -c $(pwd)/nginx.conf
    
    print_success "所有服务已启动！"
    print_info "前端: http://localhost:8080"
    print_info "后端API: http://localhost:5000"
    print_info "Python代理: http://localhost:8000"
    
    # 等待
    wait
}

# Docker模式启动
start_docker() {
    print_info "使用Docker Compose启动..."
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker未安装"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose未安装"
        exit 1
    fi
    
    # 检查OpenClaw Gateway
    check_openclaw_gateway || exit 1
    
    # 构建并启动
    docker-compose up --build -d
    
    print_success "Docker容器已启动！"
    print_info "前端: http://localhost:3000"
    print_info "Nginx代理: http://localhost:8080"
    print_info "查看日志: docker-compose logs -f"
}

# 停止服务
stop_services() {
    print_info "停止所有服务..."
    
    # 停止Docker容器
    if command -v docker-compose &> /dev/null; then
        docker-compose down 2>/dev/null
    fi
    
    # 停止Nginx
    nginx -s stop 2>/dev/null || true
    
    # 停止Node.js进程
    pkill -f "node.*src/index.js" 2>/dev/null || true
    
    # 停止Python进程
    pkill -f "uvicorn.*main:app" 2>/dev/null || true
    
    print_success "所有服务已停止"
}

# 查看状态
show_status() {
    print_info "服务状态检查..."
    
    echo "=== OpenClaw Gateway ==="
    if curl -s http://localhost:18789/ > /dev/null 2>&1; then
        print_success "运行中 (http://localhost:18789)"
    else
        print_error "未运行"
    fi
    
    echo ""
    echo "=== Docker容器 ==="
    if command -v docker-compose &> /dev/null; then
        docker-compose ps
    else
        echo "Docker Compose未安装"
    fi
    
    echo ""
    echo "=== 本地进程 ==="
    
    # 检查Python代理
    if pgrep -f "uvicorn.*main:app" > /dev/null; then
        print_success "Python代理运行中 (http://localhost:8000)"
    else
        print_error "Python代理未运行"
    fi
    
    # 检查Node.js后端
    if pgrep -f "node.*src/index.js" > /dev/null; then
        print_success "Node.js后端运行中 (http://localhost:5000)"
    else
        print_error "Node.js后端未运行"
    fi
    
    # 检查Nginx
    if pgrep nginx > /dev/null; then
        print_success "Nginx运行中"
    else
        print_error "Nginx未运行"
    fi
}

# 显示帮助
show_help() {
    echo "OpenClaw GUI 管理脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  dev       启动开发模式"
    echo "  prod      启动生产模式"
    echo "  docker    使用Docker Compose启动"
    echo "  stop      停止所有服务"
    echo "  status    查看服务状态"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 dev    启动开发环境"
    echo "  $0 docker 使用Docker启动"
}

# 主函数
main() {
    case "$1" in
        dev)
            start_dev
            ;;
        prod)
            start_prod
            ;;
        docker)
            start_docker
            ;;
        stop)
            stop_services
            ;;
        status)
            show_status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"