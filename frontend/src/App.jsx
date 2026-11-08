import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'

import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'

import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import PlaceholderPage from './pages/PlaceholderPage'
import Tasks from './pages/Tasks'
import Kanban from './pages/Kanban'
import Calendar from './pages/Calendar'
import Notes from './pages/Notes'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Help from './pages/Help'
function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex min-h-screen bg-background text-text-primary">
            <Sidebar />

            <div className="min-w-0 flex-1">
              <Header />

              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
