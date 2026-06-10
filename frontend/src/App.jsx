import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PageLoader from './components/organisms/PageLoader';
import ProtectedRoute from './routes/ProtectedRoute';


// Public layouts
import PublicLayout from './components/layouts/PublicLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';
//import AdminLayout from './components/layouts/AdminLayout';

// Pages (lazy loaded)
const HomePage = lazy(() => import('./pages/public/HomePage'));
const MapPage = lazy(() => import('./pages/public/MapPage'));
// const DigitalTwinPage = lazy(() => import('./pages/public/DigitalTwinPage'));
const TrafficPage = lazy(() => import('./pages/public/TrafficPage'));
const DrainagePage = lazy(() => import('./pages/public/DrainagePage'));
const AlertsPage = lazy(() => import('./pages/public/AlertsPage'));
const ChatbotPage = lazy(() => import('./pages/public/ChatbotPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const GrievancesPage = lazy(() => import('./pages/citizen/GrievancesPage'));
const GrievanceDetailPage = lazy(() => import('./pages/citizen/GrievanceDetailPage'));
const ProfilePage = lazy(() => import('./pages/citizen/ProfilePage'));
// const TrafficDash = lazy(() => import('./pages/dashboard/TrafficDashboard'));
// const DrainageDash = lazy(() => import('./pages/dashboard/DrainageDashboard'));
// const WasteDash = lazy(() => import('./pages/dashboard/WasteDashboard'));
// const DisasterDash = lazy(() => import('./pages/dashboard/DisasterDashboard'));
// const GrievanceMgmt = lazy(() => import('./pages/dashboard/GrievanceMgmtPage'));
// const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'));
// const SimulationPage = lazy(() => import('./pages/dashboard/SimulationPage'));
// const AlertsMgmt = lazy(() => import('./pages/dashboard/AlertsMgmtPage'));
// const UserMgmt = lazy(() => import('./pages/admin/UserMgmtPage'));
// const SystemSettings = lazy(() => import('./pages/admin/SystemSettings'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<PageLoader />}>


     <Routes>

    
      {/* ■■ GROUP 1: PUBLIC ■■ */}
      <Route element={<PublicLayout />}>
      <Route path='/' element={<HomePage />} />
      <Route path='/map' element={<MapPage />} />
      <Route path='/traffic' element={<TrafficPage />} />
      <Route path='/drainage' element={<DrainagePage />} />
      <Route path='/alerts' element={<AlertsPage />} />
      <Route path='/chatbot' element={<ChatbotPage />} />
      <Route path='/unauthorized' element={<Unauthorized />} />
     </Route>

     {/* ■■ GROUP 2: AUTH (redirect away if logged in) ■■ */}
      <Route element={<AuthLayout />}>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      </Route>

      {/* ■■ GROUP 3: CITIZEN (login required) ■■ */}
      <Route element={<PublicLayout />}>
     <Route path='/grievances' element={
     <ProtectedRoute><GrievancesPage /></ProtectedRoute>} />
     <Route path='/grievances/:id' element={
     <ProtectedRoute><GrievanceDetailPage /></ProtectedRoute>} />
    <Route path='/profile' element={
    <ProtectedRoute><ProfilePage /></ProtectedRoute>} />
     </Route>
     </Routes>

    </Suspense>
    </BrowserRouter>
  )
}

export default App