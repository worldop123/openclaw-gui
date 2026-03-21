import { useState } from 'react'
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Lock, 
  Database,
  Globe,
  Server,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  const [settings, setSettings] = useState({
    general: {
      theme: 'light',
      language: 'zh-CN',
      autoSave: true,
      autoUpdate: true,
      notifications: true
    },
    gateway: {
      url: 'ws://localhost:18789',
      autoConnect: true,
      reconnect: true,
      reconnectInterval: 5,
      maxReconnectAttempts: 10
    },
    appearance: {
      fontSize: 'medium',
      density: 'comfortable',
      sidebar: true,
      animations: true,
      reducedMotion: false
    },
    security: {
      dataEncryption: true,
      screenPrivacy: false,
      lockOnIdle: false,
      idleTimeout: 30,
      clearHistory: false
    },
    data: {
      autoBackup: true,
      backupInterval: 24,
      maxBackups: 10,
      compression: true,
      location: '/root/.openclaw/backups'
    }
  })

  const handleSave = async () => {
    setSaveStatus('saving')
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaveStatus('success')
    setTimeout(() => setSaveStatus('idle'), 2000)
  }

  const handleReset = () => {
    if (confirm('确定要重置所有设置为默认值吗？')) {
      // 重置逻辑
    }
  }

  const tabs = [
    { id: 'general', label: '常规', icon: Settings },
    { id: 'gateway', label: 'Gateway', icon: Server },
    { id: 'appearance', label: '外观', icon: Palette },
    { id: 'security', label: '安全', icon: Lock },
    { id: 'data', label: '数据', icon: Database }
  ]

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* 侧边栏 */}
      <div className="w-64 bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-3 mb-6 px-2">
          <Settings className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-800">设置</h2>
        </div>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* 内容区 */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 overflow-y-auto">
        {/* 保存状态 */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800">
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && (
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <RefreshCw className="h-4 w-4 animate-spin" />
                保存中...
              </span>
            )}
            {saveStatus === 'success' && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                ✓ 已保存
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              保存
            </button>
          </div>
        </div>

        {/* 常规设置 */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid gap-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">主题</label>
                <select
                  value={settings.general.theme}
                  onChange={(e) => setSettings({...settings, general: {...settings.general, theme: e.target.value}})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                  <option value="system">跟随系统</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">语言</label>
                <select
                  value={settings.general.language}
                  onChange={(e) => setSettings({...settings, general: {...settings.general, language: e.target.value}})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">功能</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.general.autoSave}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, autoSave: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">自动保存</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.general.autoUpdate}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, autoUpdate: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">自动检查更新</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.general.notifications}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, notifications: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">启用通知</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gateway 设置 */}
        {activeTab === 'gateway' && (
          <div className="space-y-6">
            <div className="grid gap-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gateway URL</label>
                <input
                  type="text"
                  value={settings.gateway.url}
                  onChange={(e) => setSettings({...settings, gateway: {...settings.gateway, url: e.target.value}})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">连接设置</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.gateway.autoConnect}
                      onChange={(e) => setSettings({...settings, gateway: {...settings.gateway, autoConnect: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">启动时自动连接</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.gateway.reconnect}
                      onChange={(e) => setSettings({...settings, gateway: {...settings.gateway, reconnect: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">断线自动重连</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">重连间隔 (秒)</label>
                  <input
                    type="number"
                    value={settings.gateway.reconnectInterval}
                    onChange={(e) => setSettings({...settings, gateway: {...settings.gateway, reconnectInterval: parseInt(e.target.value)}})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">最大重连次数</label>
                  <input
                    type="number"
                    value={settings.gateway.maxReconnectAttempts}
                    onChange={(e) => setSettings({...settings, gateway: {...settings.gateway, maxReconnectAttempts: parseInt(e.target.value)}})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 外观设置 */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="grid gap-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">字体大小</label>
                <select
                  value={settings.appearance.fontSize}
                  onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, fontSize: e.target.value}})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">小</option>
                  <option value="medium">中</option>
                  <option value="large">大</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">界面密度</label>
                <select
                  value={settings.appearance.density}
                  onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, density: e.target.value}})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="compact">紧凑</option>
                  <option value="comfortable">舒适</option>
                  <option value="spacious">宽松</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">界面选项</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.appearance.sidebar}
                      onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, sidebar: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">显示侧边栏</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.appearance.animations}
                      onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, animations: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">启用动画</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.appearance.reducedMotion}
                      onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, reducedMotion: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">减少动画</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 安全设置 */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid gap-6 max-w-2xl">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">数据安全</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.security.dataEncryption}
                      onChange={(e) => setSettings({...settings, security: {...settings.security, dataEncryption: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">数据加密</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.security.screenPrivacy}
                      onChange={(e) => setSettings({...settings, security: {...settings.security, screenPrivacy: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">屏幕隐私保护</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">自动锁定</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.security.lockOnIdle}
                      onChange={(e) => setSettings({...settings, security: {...settings.security, lockOnIdle: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">空闲时自动锁定</span>
                  </label>
                  {settings.security.lockOnIdle && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">空闲超时 (分钟)</label>
                      <input
                        type="number"
                        value={settings.security.idleTimeout}
                        onChange={(e) => setSettings({...settings, security: {...settings.security, idleTimeout: parseInt(e.target.value)}})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <label className="block text-sm font-medium text-slate-700">危险操作</label>
                <button className="px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  清除历史记录
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 数据设置 */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="grid gap-6 max-w-2xl">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">备份</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.data.autoBackup}
                      onChange={(e) => setSettings({...settings, data: {...settings.data, autoBackup: e.target.checked}})}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">自动备份</span>
                  </label>
                  {settings.data.autoBackup && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">备份间隔 (小时)</label>
                        <input
                          type="number"
                          value={settings.data.backupInterval}
                          onChange={(e) => setSettings({...settings, data: {...settings.data, backupInterval: parseInt(e.target.value)}})}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">最大备份数</label>
                        <input
                          type="number"
                          value={settings.data.maxBackups}
                          onChange={(e) => setSettings({...settings, data: {...settings.data, maxBackups: parseInt(e.target.value)}})}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">备份位置</label>
                <input
                  type="text"
                  value={settings.data.location}
                  onChange={(e) => setSettings({...settings, data: {...settings.data, location: e.target.value}})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.data.compression}
                    onChange={(e) => setSettings({...settings, data: {...settings.data, compression: e.target.checked}})}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">压缩备份</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  导出备份
                </button>
                <button className="px-4 py-2 rounded-lg bg-green-50 text-green-600 font-medium hover:bg-green-100 transition-colors flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  导入备份
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 底部操作 */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            重置为默认
          </button>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && (
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <RefreshCw className="h-4 w-4 animate-spin" />
                保存中...
              </span>
            )}
            {saveStatus === 'success' && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                ✓ 已保存
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
