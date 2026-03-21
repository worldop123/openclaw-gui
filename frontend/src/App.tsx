import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CompanyTeamDashboard from './pages/CompanyTeamDashboard'
import TeamDashboard from './pages/TeamDashboard'
import Features from './pages/Features'
import Sessions from './pages/Sessions'
import Tools from './pages/Tools'
import Messages from './pages/Messages'
import Skills from './pages/Skills'
import Settings from './pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CompanyTeamDashboard />} />
        <Route path="/classic" element={<TeamDashboard />} />
        <Route path="/features" element={<Features />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
