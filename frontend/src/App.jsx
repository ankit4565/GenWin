import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/public/HomePage'
import MapPage from './pages/public/MapPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import TrafficPage from './pages/public/TrafficPage'
import AlertPage from './pages/public/AlertsPage'
import ChatbotPage from './pages/public/ChatbotPage'
import DrainagePage from './pages/public/DrainagePage'
import GrievancesPage from './pages/citizen/GrievancesPage'
import GrievanceDetailPage from './pages/citizen/GrievanceDetailPage'
import ProfilePage from './pages/citizen/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/traffic" element={<TrafficPage />} />
        <Route path="/alerts" element={<AlertPage/>}/>
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/drainage" element={<DrainagePage />} />
        <Route path="/grievances" element={<GrievancesPage />} />
        <Route path="/grievances/:id" element={<GrievanceDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App