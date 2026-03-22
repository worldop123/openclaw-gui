import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import OfficeDashboard from './pages/OfficeDashboard'
import AnimeDashboard from './pages/AnimeDashboard'
import GameTeamDashboard from './pages/GameTeamDashboard'
import CompanyTeamDashboard from './pages/CompanyTeamDashboard'
import TeamDashboard from './pages/TeamDashboard'
import Features from './pages/Features'
import Sessions from './pages/Sessions'
import Tools from './pages/Tools'
import Messages from './pages/Messages'
import Skills from './pages/Skills'
import Settings from './pages/Settings'
import AISupervisor from './pages/AISupervisor'
import Guardian from './pages/Guardian'

function App() {
  return (
    <Routes>
      <Route path="/" element={<OfficeDashboard />} />
      <Route path="/anime" element={<AnimeDashboard />} />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/game" element={<GameTeamDashboard />} />
            <Route path="/company" element={<CompanyTeamDashboard />} />
            <Route path="/classic" element={<TeamDashboard />} />
            <Route path="/features" element={<Features />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/supervisor" element={<AISupervisor />} />
            <Route path="/guardian" element={<Guardian />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default App
