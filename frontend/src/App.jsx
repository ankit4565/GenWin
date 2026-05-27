import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/public/HomePage'
import MapPage from './pages/public/MapPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App