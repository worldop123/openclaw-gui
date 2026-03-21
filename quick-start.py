#!/usr/bin/env python3
"""
OpenClaw GUI 快速启动脚本
简化版Python代理服务，用于测试
"""

import asyncio
import json
import logging
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI应用
app = FastAPI(title="OpenClaw GUI Proxy", version="1.0.0")

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 模拟数据
MOCK_SESSIONS = [
    {
        "id": "main",
        "type": "main",
        "status": "active",
        "model": "ark/deepseek-v3.2",
        "createdAt": "2026-03-21T01:13:00Z",
        "lastActivity": datetime.now().isoformat(),
        "messageCount": 42,
        "thinkingEnabled": False,
        "elevated": False
    },
    {
        "id": "sub_001",
        "type": "subagent",
        "status": "active",
        "model": "claude-3.5-sonnet",
        "createdAt": "2026-03-21T10:30:00Z",
        "lastActivity": datetime.now().isoformat(),
        "messageCount": 15,
        "thinkingEnabled": True,
        "elevated": True,
        "label": "代码审查"
    }
]

MOCK_TOOLS = [
    {"name": "read", "description": "读取文件内容", "category": "file", "icon": "📄"},
    {"name": "write", "description": "写入文件", "category": "file", "icon": "✏️"},
    {"name": "exec", "description": "执行命令", "category": "system", "icon": "💻"},
    {"name": "feishu_calendar_event", "description": "飞书日程管理", "category": "feishu", "icon": "📅"},
    {"name": "memory_recall", "description": "回忆记忆", "category": "memory", "icon": "🔍"}
]

MOCK_MEMORIES = [
    {
        "id": "mem_001",
        "text": "用户正在开发OpenClaw可视化界面项目",
        "importance": 0.9,
        "category": "project",
        "timestamp": "2026-03-21T01:13:00Z",
        "tags": ["openclaw", "gui", "development"]
    },
    {
        "id": "mem_002",
        "text": "用户使用飞书作为主要通信工具",
        "importance": 0.85,
        "category": "preference",
        "timestamp": "2026-03-20T02:22:00Z",
        "tags": ["feishu", "communication"]
    }
]

# API路由
@app.get("/")
async def root():
    return {
        "service": "OpenClaw GUI Proxy (Quick Start)",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "openclaw_connected": True,
        "version": "1.0.0"
    }

@app.get("/api/sessions")
async def get_sessions():
    """获取会话列表"""
    return {
        "sessions": MOCK_SESSIONS,
        "total": len(MOCK_SESSIONS),
        "active": len([s for s in MOCK_SESSIONS if s["status"] == "active"])
    }

@app.get("/api/tools")
async def get_tools():
    """获取工具列表"""
    return {
        "tools": MOCK_TOOLS,
        "total": len(MOCK_TOOLS),
        "categories": list(set(tool["category"] for tool in MOCK_TOOLS))
    }

@app.get("/api/memory/search")
async def search_memory(query: str = "", limit: int = 5):
    """搜索记忆"""
    results = []
    if query:
        query_lower = query.lower()
        for memory in MOCK_MEMORIES:
            if (query_lower in memory["text"].lower() or 
                any(query_lower in tag.lower() for tag in memory.get("tags", []))):
                results.append(memory)
    else:
        results = MOCK_MEMORIES
    
    results = results[:limit]
    
    return {
        "query": query,
        "results": results,
        "total": len(results)
    }

@app.get("/api/stats")
async def get_stats():
    """获取统计信息"""
    return {
        "totalSessions": len(MOCK_SESSIONS),
        "activeSessions": len([s for s in MOCK_SESSIONS if s["status"] == "active"]),
        "toolCallsToday": 42,
        "toolCallsThisWeek": 285,
        "memoryItems": len(MOCK_MEMORIES),
        "avgResponseTime": 128,
        "uptime": "5天12小时",
        "systemLoad": 0.45,
        "diskUsage": "78%",
        "memoryUsage": "65%"
    }

@app.get("/api/feishu/calendars")
async def get_feishu_calendars():
    """获取飞书日历"""
    return {
        "calendars": [
            {
                "id": "primary",
                "name": "主日历",
                "description": "个人主日历",
                "permission": "owner",
                "color": "#4285F4",
                "default": True
            },
            {
                "id": "work",
                "name": "工作日历",
                "description": "工作相关日程",
                "permission": "owner",
                "color": "#34A853",
                "default": False
            }
        ]
    }

@app.get("/api/feishu/events")
async def get_feishu_events():
    """获取飞书日程"""
    return {
        "events": [
            {
                "id": "event_001",
                "summary": "团队周会",
                "description": "每周团队同步会议",
                "start_time": "2026-03-21T10:00:00+08:00",
                "end_time": "2026-03-21T11:00:00+08:00",
                "calendar_id": "work",
                "attendees": [
                    {"id": "ou_001", "name": "张三", "type": "user", "status": "accepted"}
                ],
                "location": "会议室A",
                "status": "confirmed"
            }
        ],
        "total": 1
    }

@app.get("/api/workflows")
async def get_workflows():
    """获取工作流"""
    return {
        "workflows": [
            {
                "id": "wf_001",
                "name": "日常检查",
                "description": "每日系统健康检查",
                "status": "active",
                "steps": 5,
                "last_run": "2026-03-21T08:00:00Z",
                "next_run": "2026-03-22T08:00:00Z",
                "success_rate": 98
            }
        ],
        "total": 1
    }

if __name__ == "__main__":
    logger.info("启动 OpenClaw GUI 快速启动服务...")
    logger.info("服务地址: http://localhost:8000")
    logger.info("API文档: http://localhost:8000/docs")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )