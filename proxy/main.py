#!/usr/bin/env python3
"""
OpenClaw GUI Proxy Service
用于与OpenClaw Gateway通信的Python代理服务
"""

import asyncio
import json
import logging
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import aiohttp
import redis

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 环境变量
OPENCLAW_GATEWAY_HOST = os.getenv('OPENCLAW_GATEWAY_HOST', 'localhost')
OPENCLAW_GATEWAY_PORT = os.getenv('OPENCLAW_GATEWAY_PORT', '18789')
OPENCLAW_AUTH_TOKEN = os.getenv('OPENCLAW_AUTH_TOKEN', 'ef7adab7d41a68c9a33b050395e0edcc4b34e80edf65353c')
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')

# CORS配置将在lifespan后添加

# Redis连接池
redis_pool = None

class OpenClawClient:
    """OpenClaw Gateway客户端"""
    
    def __init__(self):
        self.ws = None
        self.connected = False
        self.subscribers = []
        self.gateway_url = f"ws://{OPENCLAW_GATEWAY_HOST}:{OPENCLAW_GATEWAY_PORT}"
    
    async def connect(self):
        """连接到OpenClaw Gateway"""
        try:
            self.ws = await websockets.connect(self.gateway_url)
            self.connected = True
            logger.info(f"Connected to OpenClaw Gateway at {self.gateway_url}")
            
            # 发送认证
            if OPENCLAW_AUTH_TOKEN:
                await self.send({
                    "type": "auth",
                    "token": OPENCLAW_AUTH_TOKEN
                })
            
            # 启动消息处理循环
            asyncio.create_task(self._message_handler())
            return True
        except Exception as e:
            logger.error(f"Failed to connect to OpenClaw Gateway: {e}")
            self.connected = False
            return False
    
    async def send(self, message: Dict[str, Any]):
        """发送消息到OpenClaw Gateway"""
        if not self.connected or not self.ws:
            raise ConnectionError("Not connected to OpenClaw Gateway")
        
        try:
            await self.ws.send(json.dumps(message))
        except Exception as e:
            logger.error(f"Failed to send message: {e}")
            self.connected = False
            raise
    
    async def _message_handler(self):
        """处理来自OpenClaw Gateway的消息"""
        try:
            async for message in self.ws:
                try:
                    data = json.loads(message)
                    logger.debug(f"Received from OpenClaw: {data.get('type', 'unknown')}")
                    
                    # 通知所有订阅者
                    for subscriber in self.subscribers:
                        await subscriber(data)
                        
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse message: {e}")
        except websockets.exceptions.ConnectionClosed:
            logger.info("Connection to OpenClaw Gateway closed")
            self.connected = False
    
    def subscribe(self, callback):
        """订阅OpenClaw消息"""
        self.subscribers.append(callback)
    
    def unsubscribe(self, callback):
        """取消订阅"""
        if callback in self.subscribers:
            self.subscribers.remove(callback)

# 全局OpenClaw客户端实例
openclaw_client = OpenClawClient()

# Pydantic模型
class CommandRequest(BaseModel):
    command: str
    session_id: Optional[str] = "main"
    parameters: Optional[Dict[str, Any]] = None

class ToolCallRequest(BaseModel):
    tool_name: str
    parameters: Dict[str, Any]
    session_id: Optional[str] = "main"

class MemoryQuery(BaseModel):
    query: str
    limit: Optional[int] = 5

class MemoryStoreRequest(BaseModel):
    text: str
    importance: Optional[float] = 0.7
    category: Optional[str] = "other"
    tags: Optional[List[str]] = []

class SessionCreateRequest(BaseModel):
    label: Optional[str] = None
    runtime: Optional[str] = "subagent"
    agent_id: Optional[str] = None
    model: Optional[str] = None
    task: str

class WorkflowCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    steps: List[Dict[str, Any]]
    schedule: Optional[Dict[str, Any]] = None
    enabled: Optional[bool] = True

class FeishuEventCreateRequest(BaseModel):
    summary: str
    start_time: str
    end_time: str
    description: Optional[str] = None
    calendar_id: Optional[str] = "primary"
    attendees: Optional[List[Dict[str, str]]] = None
    location: Optional[str] = None

# API路由
@app.get("/")
async def root():
    return {
        "service": "OpenClaw GUI Proxy",
        "version": "1.0.0",
        "openclaw_connected": openclaw_client.connected
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "openclaw_connected": openclaw_client.connected,
        "timestamp": asyncio.get_event_loop().time()
    }

@app.get("/api/sessions")
async def get_sessions():
    """获取所有会话"""
    try:
        # 这里应该从OpenClaw获取真实的会话数据
        # 暂时返回模拟数据
        return {
            "sessions": [
                {
                    "id": "main",
                    "type": "main",
                    "status": "active",
                    "model": "ark/deepseek-v3.2",
                    "created_at": "2026-03-21T01:13:00Z",
                    "last_activity": "2026-03-21T01:13:00Z",
                    "message_count": 42
                }
            ],
            "total": 1
        }
    except Exception as e:
        logger.error(f"Error fetching sessions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch sessions")

@app.get("/api/tools")
async def get_tools():
    """获取可用工具列表"""
    return {
        "tools": [
            {
                "name": "read",
                "description": "读取文件内容",
                "category": "file",
                "parameters": ["path", "offset", "limit"]
            },
            {
                "name": "write",
                "description": "写入文件",
                "category": "file",
                "parameters": ["path", "content"]
            },
            {
                "name": "exec",
                "description": "执行命令",
                "category": "system",
                "parameters": ["command", "workdir", "env"]
            },
            {
                "name": "message",
                "description": "发送消息",
                "category": "communication",
                "parameters": ["action", "message", "channel"]
            },
            {
                "name": "feishu_calendar_event",
                "description": "飞书日程管理",
                "category": "feishu",
                "parameters": ["action", "start_time", "end_time", "summary"]
            },
            {
                "name": "feishu_task_task",
                "description": "飞书任务管理",
                "category": "feishu",
                "parameters": ["action", "summary", "current_user_id"]
            },
            {
                "name": "memory_store",
                "description": "存储记忆",
                "category": "memory",
                "parameters": ["text", "importance", "category"]
            },
            {
                "name": "memory_recall",
                "description": "回忆记忆",
                "category": "memory",
                "parameters": ["query", "limit"]
            }
        ]
    }

@app.post("/api/command")
async def send_command(request: CommandRequest):
    """发送命令到OpenClaw"""
    try:
        if not openclaw_client.connected:
            raise HTTPException(status_code=503, detail="Not connected to OpenClaw Gateway")
        
        # 构建命令消息
        message = {
            "type": "command",
            "session_id": request.session_id,
            "command": request.command,
            "parameters": request.parameters or {},
            "timestamp": asyncio.get_event_loop().time()
        }
        
        # 发送到OpenClaw
        await openclaw_client.send(message)
        
        return {
            "success": True,
            "message": "Command sent successfully",
            "command_id": f"cmd_{int(asyncio.get_event_loop().time() * 1000)}"
        }
    except Exception as e:
        logger.error(f"Error sending command: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send command: {str(e)}")

@app.post("/api/tool/call")
async def call_tool(request: ToolCallRequest):
    """调用工具"""
    try:
        if not openclaw_client.connected:
            raise HTTPException(status_code=503, detail="Not connected to OpenClaw Gateway")
        
        # 构建工具调用消息
        message = {
            "type": "tool-call",
            "tool_name": request.tool_name,
            "parameters": request.parameters,
            "session_id": request.session_id,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        # 发送到OpenClaw
        await openclaw_client.send(message)
        
        return {
            "success": True,
            "message": f"Tool {request.tool_name} called successfully",
            "tool_call_id": f"tool_{int(asyncio.get_event_loop().time() * 1000)}"
        }
    except Exception as e:
        logger.error(f"Error calling tool: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to call tool: {str(e)}")

@app.get("/api/memory/search")
async def search_memory(query: str, limit: int = 5):
    """搜索记忆"""
    try:
        # 这里应该通过OpenClaw调用memory_recall工具
        # 返回更丰富的模拟数据
        memories = [
            {
                "id": "mem_001",
                "text": "用户正在开发OpenClaw可视化界面项目，包含前端、后端和代理服务",
                "importance": 0.9,
                "category": "project",
                "timestamp": "2026-03-21T01:13:00Z",
                "tags": ["openclaw", "gui", "development", "react", "fastapi"]
            },
            {
                "id": "mem_002",
                "text": "用户使用飞书作为主要通信工具，经常使用日历和任务功能",
                "importance": 0.85,
                "category": "preference",
                "timestamp": "2026-03-20T02:22:00Z",
                "tags": ["feishu", "communication", "calendar", "tasks"]
            },
            {
                "id": "mem_003",
                "text": "用户喜欢使用深色主题界面，偏好现代化UI设计",
                "importance": 0.7,
                "category": "preference",
                "timestamp": "2026-03-19T15:30:00Z",
                "tags": ["ui", "theme", "design"]
            },
            {
                "id": "mem_004",
                "text": "用户经常使用文件操作和系统命令工具，特别是read、exec和write",
                "importance": 0.8,
                "category": "behavior",
                "timestamp": "2026-03-18T10:45:00Z",
                "tags": ["tools", "file", "system", "automation"]
            },
            {
                "id": "mem_005",
                "text": "用户计划集成飞书日历、任务管理和多维表格功能",
                "importance": 0.88,
                "category": "plan",
                "timestamp": "2026-03-17T14:20:00Z",
                "tags": ["feishu", "integration", "calendar", "tasks", "bitable"]
            },
            {
                "id": "mem_006",
                "text": "用户对实时监控和数据分析感兴趣",
                "importance": 0.75,
                "category": "interest",
                "timestamp": "2026-03-16T09:15:00Z",
                "tags": ["monitoring", "analytics", "data"]
            },
            {
                "id": "mem_007",
                "text": "用户经常使用记忆系统存储重要信息和决策",
                "importance": 0.82,
                "category": "behavior",
                "timestamp": "2026-03-15T11:30:00Z",
                "tags": ["memory", "storage", "decisions"]
            }
        ]
        
        # 搜索过滤
        results = []
        if query:
            query_lower = query.lower()
            for memory in memories:
                if (query_lower in memory["text"].lower() or 
                    any(query_lower in tag.lower() for tag in memory.get("tags", []))):
                    results.append(memory)
        else:
            results = memories
        
        # 按重要性排序并限制数量
        results.sort(key=lambda x: x["importance"], reverse=True)
        results = results[:limit]
        
        return {
            "query": query,
            "results": results,
            "total": len(results),
            "has_more": len(memories) > len(results)
        }
    except Exception as e:
        logger.error(f"Error searching memory: {e}")
        raise HTTPException(status_code=500, detail="Failed to search memory")

@app.post("/api/memory/store")
async def store_memory(request: MemoryStoreRequest):
    """存储记忆"""
    try:
        if not openclaw_client.connected:
            raise HTTPException(status_code=503, detail="Not connected to OpenClaw Gateway")
        
        # 构建记忆存储消息
        message = {
            "type": "memory-store",
            "text": request.text,
            "importance": request.importance,
            "category": request.category,
            "tags": request.tags,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        # 发送到OpenClaw
        await openclaw_client.send(message)
        
        # 返回存储的记忆
        stored_memory = {
            "id": f"mem_{int(asyncio.get_event_loop().time() * 1000)}",
            "text": request.text,
            "importance": request.importance,
            "category": request.category,
            "tags": request.tags,
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "message": "Memory stored successfully",
            "memory": stored_memory
        }
    except Exception as e:
        logger.error(f"Error storing memory: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to store memory: {str(e)}")

@app.delete("/api/memory/{memory_id}")
async def delete_memory(memory_id: str):
    """删除记忆"""
    try:
        if not openclaw_client.connected:
            raise HTTPException(status_code=503, detail="Not connected to OpenClaw Gateway")
        
        # 构建记忆删除消息
        message = {
            "type": "memory-forget",
            "memory_id": memory_id,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        # 发送到OpenClaw
        await openclaw_client.send(message)
        
        return {
            "success": True,
            "message": f"Memory {memory_id} deleted successfully"
        }
    except Exception as e:
        logger.error(f"Error deleting memory: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete memory: {str(e)}")

@app.get("/api/memory/categories")
async def get_memory_categories():
    """获取记忆分类"""
    try:
        categories = [
            {"id": "preference", "name": "偏好设置", "count": 12, "icon": "⭐"},
            {"id": "fact", "name": "事实信息", "count": 25, "icon": "📚"},
            {"id": "decision", "name": "决策记录", "count": 8, "icon": "🎯"},
            {"id": "project", "name": "项目信息", "count": 15, "icon": "🚀"},
            {"id": "behavior", "name": "行为模式", "count": 18, "icon": "📊"},
            {"id": "plan", "name": "计划安排", "count": 10, "icon": "📅"},
            {"id": "interest", "name": "兴趣爱好", "count": 7, "icon": "❤️"},
            {"id": "other", "name": "其他", "count": 23, "icon": "📦"}
        ]
        
        return {
            "categories": categories,
            "total": sum(cat["count"] for cat in categories)
        }
    except Exception as e:
        logger.error(f"Error fetching memory categories: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch memory categories")

@app.get("/api/feishu/calendars")
async def get_feishu_calendars():
    """获取飞书日历列表"""
    try:
        # 这里应该通过OpenClaw调用feishu_calendar_calendar工具
        return {
            "calendars": [
                {
                    "id": "primary",
                    "name": "主日历",
                    "description": "个人主日历",
                    "permission": "owner"
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching Feishu calendars: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch Feishu calendars")

# WebSocket端点
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket连接端点"""
    await websocket.accept()
    
    # 发送连接状态
    await websocket.send_json({
        "type": "connection",
        "status": "connected",
        "openclaw_connected": openclaw_client.connected
    })
    
    # 定义消息处理器
    async def openclaw_message_handler(message: Dict[str, Any]):
        """处理OpenClaw消息并转发到WebSocket客户端"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending message to WebSocket client: {e}")
    
    # 订阅OpenClaw消息
    openclaw_client.subscribe(openclaw_message_handler)
    
    try:
        while True:
            # 接收客户端消息
            data = await websocket.receive_json()
            logger.info(f"Received from WebSocket client: {data.get('type', 'unknown')}")
            
            # 处理不同类型的消息
            message_type = data.get("type")
            
            if message_type == "ping":
                await websocket.send_json({"type": "pong", "timestamp": asyncio.get_event_loop().time()})
            
            elif message_type == "command":
                # 转发命令到OpenClaw
                if openclaw_client.connected:
                    await openclaw_client.send(data)
            
            elif message_type == "subscribe":
                # 处理订阅请求
                channels = data.get("channels", [])
                await websocket.send_json({
                    "type": "subscription",
                    "channels": channels,
                    "status": "subscribed"
                })
    
    except WebSocketDisconnect:
        logger.info(f"WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        # 取消订阅
        openclaw_client.unsubscribe(openclaw_message_handler)

# 应用生命周期
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时
    logger.info("Starting OpenClaw GUI Proxy...")
    
    # 连接到Redis
    global redis_pool
    try:
        redis_pool = redis.ConnectionPool.from_url(REDIS_URL)
        logger.info(f"Connected to Redis at {REDIS_URL}")
    except Exception as e:
        logger.warning(f"Failed to connect to Redis: {e}")
        redis_pool = None
    
    # 连接到OpenClaw Gateway
    if await openclaw_client.connect():
        logger.info("Successfully connected to OpenClaw Gateway")
    else:
        logger.warning("Failed to connect to OpenClaw Gateway, will retry periodically")
        # 启动重试任务
        asyncio.create_task(_retry_openclaw_connection())
    
    yield  # 应用运行中
    
    # 关闭时
    logger.info("Shutting down OpenClaw GUI Proxy...")
    if openclaw_client.ws:
        await openclaw_client.ws.close()

# 更新FastAPI应用以使用lifespan
app = FastAPI(
    title="OpenClaw GUI Proxy", 
    version="1.0.0",
    lifespan=lifespan
)

async def _retry_openclaw_connection():
    """定期重试OpenClaw连接"""
    while True:
        await asyncio.sleep(10)  # 每10秒重试一次
        if not openclaw_client.connected:
            logger.info("Retrying OpenClaw Gateway connection...")
            await openclaw_client.connect()

# 添加更多API端点
@app.get("/api/workflows")
async def get_workflows():
    """获取工作流列表"""
    try:
        workflows = [
            {
                "id": "wf_001",
                "name": "日常健康检查",
                "description": "每日系统健康检查和报告生成",
                "status": "active",
                "steps": 5,
                "last_run": "2026-03-21T08:00:00Z",
                "next_run": "2026-03-22T08:00:00Z",
                "success_rate": 98,
                "schedule": "0 8 * * *",
                "created_at": "2026-03-15T10:00:00Z"
            },
            {
                "id": "wf_002",
                "name": "数据备份流程",
                "description": "自动备份重要数据到TOS存储",
                "status": "active",
                "steps": 3,
                "last_run": "2026-03-21T02:00:00Z",
                "next_run": "2026-03-22T02:00:00Z",
                "success_rate": 100,
                "schedule": "0 2 * * *",
                "created_at": "2026-03-10T14:30:00Z"
            },
            {
                "id": "wf_003",
                "name": "飞书同步工作流",
                "description": "同步飞书日历、任务和文档",
                "status": "paused",
                "steps": 4,
                "last_run": "2026-03-20T12:00:00Z",
                "next_run": None,
                "success_rate": 95,
                "schedule": "*/30 * * * *",
                "created_at": "2026-03-05T09:15:00Z"
            },
            {
                "id": "wf_004",
                "name": "记忆系统清理",
                "description": "定期清理低重要性的记忆条目",
                "status": "active",
                "steps": 2,
                "last_run": "2026-03-21T04:00:00Z",
                "next_run": "2026-03-28T04:00:00Z",
                "success_rate": 100,
                "schedule": "0 4 * * 0",
                "created_at": "2026-03-01T11:20:00Z"
            }
        ]
        
        return {
            "workflows": workflows,
            "total": len(workflows),
            "active": len([w for w in workflows if w["status"] == "active"])
        }
    except Exception as e:
        logger.error(f"Error fetching workflows: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch workflows")

@app.post("/api/workflows")
async def create_workflow(request: WorkflowCreateRequest):
    """创建工作流"""
    try:
        # 模拟创建工作流
        new_workflow = {
            "id": f"wf_{int(asyncio.get_event_loop().time() * 1000)}",
            "name": request.name,
            "description": request.description,
            "status": "active" if request.enabled else "draft",
            "steps": request.steps,
            "schedule": request.schedule,
            "created_at": datetime.now().isoformat(),
            "last_run": None,
            "next_run": None,
            "success_rate": 0
        }
        
        return {
            "success": True,
            "message": "Workflow created successfully",
            "workflow": new_workflow
        }
    except Exception as e:
        logger.error(f"Error creating workflow: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create workflow: {str(e)}")

@app.get("/api/feishu/events")
async def get_feishu_events(
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    calendar_id: Optional[str] = "primary",
    limit: int = 20
):
    """获取飞书日程"""
    try:
        # 模拟飞书日程数据
        events = [
            {
                "id": "event_001",
                "summary": "团队周会",
                "description": "每周团队同步会议，讨论项目进展和问题",
                "start_time": "2026-03-21T10:00:00+08:00",
                "end_time": "2026-03-21T11:00:00+08:00",
                "calendar_id": "work",
                "calendar_name": "工作日历",
                "attendees": [
                    {"id": "ou_001", "name": "张三", "type": "user", "status": "accepted"},
                    {"id": "ou_002", "name": "李四", "type": "user", "status": "accepted"},
                    {"id": "ou_003", "name": "王五", "type": "user", "status": "tentative"}
                ],
                "location": "会议室A",
                "status": "confirmed",
                "visibility": "default",
                "is_all_day": False,
                "recurrence": None,
                "created_at": "2026-03-14T09:00:00Z",
                "updated_at": "2026-03-20T14:30:00Z"
            },
            {
                "id": "event_002",
                "summary": "产品功能评审",
                "description": "新产品功能设计评审会议",
                "start_time": "2026-03-21T14:00:00+08:00",
                "end_time": "2026-03-21T15:30:00+08:00",
                "calendar_id": "work",
                "calendar_name": "工作日历",
                "attendees": [
                    {"id": "ou_003", "name": "王五", "type": "user", "status": "accepted"},
                    {"id": "ou_004", "name": "赵六", "type": "user", "status": "accepted"}
                ],
                "location": "线上会议（飞书视频）",
                "status": "confirmed",
                "visibility": "private",
                "is_all_day": False,
                "recurrence": None,
                "created_at": "2026-03-18T11:20:00Z",
                "updated_at": "2026-03-20T16:45:00Z"
            },
            {
                "id": "event_003",
                "summary": "个人健身时间",
                "description": "健身房锻炼，有氧+力量训练",
                "start_time": "2026-03-21T18:00:00+08:00",
                "end_time": "2026-03-21T19:30:00+08:00",
                "calendar_id": "primary",
                "calendar_name": "主日历",
                "attendees": [],
                "location": "XX健身房",
                "status": "tentative",
                "visibility": "private",
                "is_all_day": False,
                "recurrence": "FREQ=WEEKLY;BYDAY=MO,WE,FR",
                "created_at": "2026-03-01T08:00:00Z",
                "updated_at": "2026-03-15T10:30:00Z"
            },
            {
                "id": "event_004",
                "summary": "OpenClaw项目开发",
                "description": "GUI界面开发和功能测试",
                "start_time": "2026-03-22T09:00:00+08:00",
                "end_time": "2026-03-22T12:00:00+08:00",
                "calendar_id": "work",
                "calendar_name": "工作日历",
                "attendees": [
                    {"id": "ou_001", "name": "张三", "type": "user", "status": "accepted"}
                ],
                "location": "远程办公",
                "status": "confirmed",
                "visibility": "default",
                "is_all_day": False,
                "recurrence": None,
                "created_at": "2026-03-20T15:00:00Z",
                "updated_at": "2026-03-21T10:15:00Z"
            },
            {
                "id": "event_005",
                "summary": "技术分享会",
                "description": "团队内部技术分享：AI Agent开发实践",
                "start_time": "2026-03-22T15:00:00+08:00",
                "end_time": "2026-03-22T16:30:00+08:00",
                "calendar_id": "team",
                "calendar_name": "团队日历",
                "attendees": [
                    {"id": "ou_001", "name": "张三", "type": "user", "status": "accepted"},
                    {"id": "ou_002", "name": "李四", "type": "user", "status": "accepted"},
                    {"id": "ou_003", "name": "王五", "type": "user", "status": "accepted"},
                    {"id": "ou_004", "name": "赵六", "type": "user", "status": "accepted"}
                ],
                "location": "大会议室",
                "status": "confirmed",
                "visibility": "public",
                "is_all_day": False,
                "recurrence": None,
                "created_at": "2026-03-10T14:00:00Z",
                "updated_at": "2026-03-19T11:30:00Z"
            }
        ]
        
        # 过滤条件
        filtered_events = []
        for event in events:
            if calendar_id and event["calendar_id"] != calendar_id:
                continue
                
            if start_time and event["start_time"] < start_time:
                continue
                
            if end_time and event["end_time"] > end_time:
                continue
                
            filtered_events.append(event)
        
        # 按开始时间排序
        filtered_events.sort(key=lambda x: x["start_time"])
        
        # 限制数量
        filtered_events = filtered_events[:limit]
        
        return {
            "events": filtered_events,
            "total": len(filtered_events),
            "calendar_id": calendar_id,
            "time_range": {
                "start": start_time,
                "end": end_time
            }
        }
    except Exception as e:
        logger.error(f"Error fetching Feishu events: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch Feishu events")

@app.post("/api/feishu/events")
async def create_feishu_event(request: FeishuEventCreateRequest):
    """创建飞书日程"""
    try:
        if not openclaw_client.connected:
            raise HTTPException(status_code=503, detail="Not connected to OpenClaw Gateway")
        
        # 构建日程创建消息
        message = {
            "type": "feishu-calendar-create",
            "summary": request.summary,
            "start_time": request.start_time,
            "end_time": request.end_time,
            "description": request.description,
            "calendar_id": request.calendar_id,
            "attendees": request.attendees or [],
            "location": request.location,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        # 发送到OpenClaw
        await openclaw_client.send(message)
        
        # 返回创建的日程
        new_event = {
            "id": f"event_{int(asyncio.get_event_loop().time() * 1000)}",
            "summary": request.summary,
            "description": request.description,
            "start_time": request.start_time,
            "end_time": request.end_time,
            "calendar_id": request.calendar_id,
            "attendees": request.attendees or [],
            "location": request.location,
            "status": "confirmed",
            "created_at": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "message": "Feishu event created successfully",
            "event": new_event
        }
    except Exception as e:
        logger.error(f"Error creating Feishu event: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create Feishu event: {str(e)}")

@app.get("/api/stats/system")
async def get_system_stats():
    """获取系统统计信息"""
    try:
        import psutil
        import platform
        
        # 获取系统信息
        cpu_percent = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        boot_time = datetime.fromtimestamp(psutil.boot_time())
        
        stats = {
            "system": {
                "platform": platform.system(),
                "platform_version": platform.version(),
                "architecture": platform.machine(),
                "processor": platform.processor(),
                "hostname": platform.node(),
                "python_version": platform.python_version()
            },
            "cpu": {
                "percent": cpu_percent,
                "cores": psutil.cpu_count(logical=False),
                "logical_cores": psutil.cpu_count(logical=True),
                "frequency": psutil.cpu_freq().current if psutil.cpu_freq() else None
            },
            "memory": {
                "total_gb": round(memory.total / (1024**3), 2),
                "available_gb": round(memory.available / (1024**3), 2),
                "used_gb": round(memory.used / (1024**3), 2),
                "percent": memory.percent,
                "free_gb": round(memory.free / (1024**3), 2)
            },
            "disk": {
                "total_gb": round(disk.total / (1024**3), 2),
                "used_gb": round(disk.used / (1024**3), 2),
                "free_gb": round(disk.free / (1024**3), 2),
                "percent": disk.percent
            },
            "uptime": {
                "boot_time": boot_time.isoformat(),
                "uptime_seconds": int((datetime.now() - boot_time).total_seconds()),
                "uptime_days": round((datetime.now() - boot_time).total_seconds() / 86400, 2)
            },
            "network": {
                "connections": len(psutil.net_connections()),
                "io_counters": {k: v for k, v in psutil.net_io_counters()._asdict().items()}
            }
        }
        
        return stats
        
    except ImportError:
        # 如果psutil不可用，返回模拟数据
        return {
            "system": {
                "platform": "Linux",
                "platform_version": "6.8.0-55-generic",
                "architecture": "x86_64",
                "processor": "Intel(R) Xeon(R) CPU",
                "hostname": "arkclaw",
                "python_version": "3.11.0"
            },
            "cpu": {
                "percent": 24.5,
                "cores": 4,
                "logical_cores": 8,
                "frequency": 3200
            },
            "memory": {
                "total_gb": 16.0,
                "available_gb": 8.2,
                "used_gb": 7.8,
                "percent": 48.8,
                "free_gb": 8.2
            },
            "disk": {
                "total_gb": 256.0,
                "used_gb": 128.5,
                "free_gb": 127.5,
                "percent": 50.2
            },
            "uptime": {
                "boot_time": "2026-03-16T08:00:00",
                "uptime_seconds": 432000,
                "uptime_days": 5.0
            },
            "network": {
                "connections": 42,
                "io_counters": {
                    "bytes_sent": 1250000000,
                    "bytes_recv": 2500000000,
                    "packets_sent": 8500000,
                    "packets_recv": 12000000,
                    "errin": 0,
                    "errout": 0,
                    "dropin": 0,
                    "dropout": 0
                }
            }
        }
    except Exception as e:
        logger.error(f"Error fetching system stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch system stats")

@app.get("/api/stats/usage")
async def get_usage_stats():
    """获取使用统计"""
    try:
        # 模拟使用统计数据
        usage_stats = {
            "daily_summary": {
                "date": datetime.now().strftime("%Y-%m-%d"),
                "total_tool_calls": 142,
                "total_sessions": 8,
                "total_memory_operations": 56,
                "total_commands": 89
            },
            "tool_usage_by_category": [
                {"category": "file", "count": 58, "percentage": 40.8},
                {"category": "system", "count": 32, "percentage": 22.5},
                {"category": "feishu", "count": 24, "percentage": 16.9},
                {"category": "memory", "count": 18, "percentage": 12.7},
                {"category": "communication", "count": 10, "percentage": 7.0}
            ],
            "top_tools": [
                {"tool": "read", "count": 35, "category": "file"},
                {"tool": "exec", "count": 28, "category": "system"},
                {"tool": "feishu_calendar_event", "count": 22, "category": "feishu"},
                {"tool": "memory_recall", "count": 16, "category": "memory"},
                {"tool": "write", "count": 15, "category": "file"}
            ],
            "session_activity": [
                {"hour": "00:00", "active_sessions": 1},
                {"hour": "04:00", "active_sessions": 0},
                {"hour": "08:00", "active_sessions": 3},
                {"hour": "12:00", "active_sessions": 5},
                {"hour": "16:00", "active_sessions": 4},
                {"hour": "20:00", "active_sessions": 2}
            ],
            "response_times": {
                "average": 128,
                "p50": 95,
                "p90": 210,
                "p95": 280,
                "p99": 450,
                "max": 1200,
                "min": 45
            }
        }
        
        return usage_stats
    except Exception as e:
        logger.error(f"Error fetching usage stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch usage stats")

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True
    )