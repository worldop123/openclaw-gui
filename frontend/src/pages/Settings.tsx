import React, { useState } from 'react'
import { 
  Settings,
  Save,
  RefreshCw,
  Database,
  Bell,
  Shield,
  Globe,
  Palette,
  Terminal,
  Download,
  Upload,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { cn } from '../lib/utils'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // OpenClaw配置
    gatewayHost: 'localhost',
    gatewayPort: '18789',
    authToken: 'ef7adab7d41a68c9a33b050395e0edcc4b34e80edf65353c',
    
    // 外观
    theme: 'dark',
    accentColor: '#3b82f6',
    fontSize: '14px',
    
    // 通知设置
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: false,
    
    // 安全设置
    autoLock: true,
    lockTimeout: '5分钟',
    twoFactorAuth: false,
    
    // 数据设置
    autoBackup: true,
    backupInterval: '每天',
    dataRetention: '30天',
    
    // 集成设置
    feishuEnabled: true,
    wechatEnabled: false,
    dingtalkEnabled: false,
  })
  
  const [showToken, setShowToken] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSave = () => {
    setSaving(true)
    setSaveStatus('idle')
    
    // 模拟保存过程
    setTimeout(() => {
      setSaving(false)
      setSaveStatus('success')
      
      // 3秒后重置状态
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    }, 1000)
  }

  const handleReset = () => {
    if (confirm('确定要重置所有设置为默认值吗？')) {
      setSettings({
        gatewayHost: 'localhost',
        gatewayPort: '18789',
        authToken: 'ef7adab7d41a68c9a33b050395e0edcc4b34e80edf65353c',
        theme: 'dark',
        accentColor: '#3b82f6',
        fontSize: '14px',
        emailNotifications: true,
        pushNotifications: true,
        soundNotifications: false,
        autoLock: true,
        lockTimeout: '5分钟',
        twoFactorAuth: false,
        autoBackup: true,
        backupInterval: '每天',
        dataRetention: '30天',
        feishuEnabled: true,
        wechatEnabled: false,
        dingtalkEnabled: false,
      })
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
        <p className="text-muted-foreground mt-2">
          配置OpenClaw GUI系统参数，个性化您的使用体验
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - OpenClaw配置 */}
        <div className="lg:col-span-2 space-y-6">
          {/* OpenClaw Gateway配置 */}
          <div className="rounded-lg border">
            <div className="border-b p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                OpenClaw Gateway配置
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gateway主机
                  </label>
                  <input
                    type="text"
                    value={settings.gatewayHost}
                    onChange={(e) => updateSetting('gatewayHost', e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gateway端口
                  </label>
                  <input
                    type="text"
                    value={settings.gatewayPort}
                    onChange={(e) => updateSetting('gatewayPort', e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  认证令牌
                </label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={settings.authToken}
                    onChange={(e) => updateSetting('authToken', e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showToken ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 外观设置 */}
          <div className="rounded-lg border">
            <div className="border-b p-4">
              <h3 className="font-semibold flex items gap-2">
                <Palette className="h-5 w-5" />
                外观设置
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  主题

                </label>
                <div className="flex gap-2">
                  {['dark', 'light', 'auto'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateSetting('theme', theme)}
                      className={cn(
                        "flex-1 py-2 rounded-lg border text-sm",
                        settings.theme === theme
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-accent"
                      )}
                    >
                      {theme === 'dark' ? '深色' :
                       theme === 'light' ? '浅色' : '自动'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  主色调

                </label>
                <div className="flex gap-2">
                  {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSetting('accentColor', color)}
                      className={cn(
                        "h-10 w-10 rounded-lg border",
                        settings.accentColor === color && "ring-2 ring-primary"
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 通知设置 */}

          <div className="rounded-lg border">
            <div className="border-b p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />

                通知设置
              </h3>

            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">邮件通知

                  </span>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer relative h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-primary" />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">推送通知

</span>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer relative h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-primary" />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">声音提示</span>
                  <input
                    type="checkbox"
                    checked={settings.soundNotifications}
                    onChange={(e) => updateSetting('soundNotifications', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer relative h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-primary" />
                </label>
              </div>
            </div>
          </div>

          {/* 安全设置 */}
          <div className="rounded-lg border">
            <div className="border-b p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                安全设置
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">自动锁定</span>
                  <input
                    type="checkbox"
                    checked={settings.autoLock}
                    onChange={(e) => updateSetting('autoLock', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer relative h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-primary" />
                </label>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    锁定超时
                  </label>
                  <select
                    value={settings.lockTimeout}
                    onChange={(e) => updateSetting('lockTimeout', e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="1分钟">1分钟</option>
                    <option value="3分钟">3分钟</option>
                    <option value="5分钟">5分钟</option>
                    <option value="10分钟">10分钟</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 快速操作 */}
        <div className="space-y-6">
          {/* 保存状态 */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-4">保存状态</h3>
            <div className="space-y-3">
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>保存成功</span>
                </div>
              )}
              
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>保存失败</span>
                </div>
              )}
            </div>
          </div>

          {/* 快速操作 */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-4">快速操作</h3>
            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? '保存中...' : '保存设置'}
              </button>
              
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent"
              >
                <RefreshCw className="h-4 w-4" />
                重置为默认值

              </button>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent">
                <Download className="h-4 w-4" />
                导出配置

              </button>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent">
                <Upload className="h-4 w-4" />
                导入配置

              </button>
            </div>
          </div>
          
          {/* 系统信息 */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-4">系统信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">版本</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">构建时间</span>
                <span>2026-03-21</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">上次保存</span>
                <span>今天 02:09</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">配置状态</span>
                <span className="text-green-600">已同步</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="fixed bottom-6 right-6">
        <div className="flex items-center gap-3">
          {saveStatus === 'success' && (
            <div className="rounded-lg bg-green-500/10 text-green-600 px-3 py-2 text-sm animate-in fade-in">
              设置已保存
            </div>
          )}
          
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg transition-all",
              saving
                ? "bg-blue-500 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Save className="h-5 w-5" />
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  )
}