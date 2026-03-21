import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Layout
import Layout from './components/Layout'

// Pages
import TeamDashboard from './pages/TeamDashboard'

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<TeamDashboard />} />
            <Route path="/dashboard" element={<TeamDashboard />} />
            <Route path="/team" element={<TeamDashboard />} />
            <Route path="/sessions" element={<div className="p-8"><h1 className="text-2xl font-bold">会话管理</h1><p className="text-slate-500 mt-2">功能开发中...</p></div>} />
            <Route path="/tools" element={<div className="p-8"><h1 className="text-2xl font-bold">工具管理</h1><p className="text-slate-500 mt-2">功能开发中...</p></div>} />
            <Route path="/workflow" element={<div className="p-8"><h1 className="text-2xl font-bold">工作流</h1><p className="text-slate-500 mt-2">功能开发中...</p></div>} />
            <Route path="/memory" element={<div className="p-8"><h1 className="text-2xl font-bold">记忆系统</h1><p className="text-slate-500 mt-2">功能开发中...</p></div>} />
            <Route path="/feishu" element={<div className="p-8"><h1 className="text-2xl font-bold">飞书集成</h1><p className="text-slate-500 mt-2">功能开发中...</p></div>} />
            <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">设置</h1><p className="text-slate-500 mt-2">功能开发中...</p></div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App
