import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import SyllabusList from './pages/SyllabusList'
import SyllabusDetail from './pages/SyllabusDetail'
import UploadSyllabus from './pages/UploadSyllabus'
import CalendarPage from './pages/Calendar'
import { SyllabusProvider } from './context/SyllabusContext'

function App() {
  return (
    <SyllabusProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/syllabi" element={<SyllabusList />} />
              <Route path="/syllabi/:id" element={<SyllabusDetail />} />
              <Route path="/upload" element={<UploadSyllabus />} />
              <Route path="/calendar" element={<CalendarPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SyllabusProvider>
  )
}

export default App 