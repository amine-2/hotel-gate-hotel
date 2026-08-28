import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'




import LoaderPage from './components/loading.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/Signup.jsx'
import ManagerDashboard from './pages/manager/ManagerDashboard.jsx'
import ManagerLayout from './pages/manager/ManagerLayout.jsx'
import Hotel from './pages/manager/Hotel.jsx'
import Staff from './pages/manager/Staff.jsx'
import Settings from './pages/manager/Settings.jsx'
import Issues from './pages/manager/Issues.jsx'
import Bookings from './pages/manager/Bookings.jsx'

import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import IssuesPage from './pages/admin/IssuesPage.jsx'
import SettingsPage from './pages/admin/SettingsPage.jsx'

import HrLayout from './pages/hr/HrLayout.jsx'
import HrDashboard from './pages/hr/HrDashboard.jsx'
import HrIssues from './pages/hr/HrIssues.jsx'
import HrSettings from './pages/hr/HrSettings.jsx'
import Candidates from './pages/hr/Candidates.jsx'
import HrStaff from './pages/hr/HrStaff.jsx'

import ReceptionLayout from './pages/reception/ReceptionLayout.jsx'
import ReceptionDashboard from './pages/reception/ReceptionDashboard.jsx'


import UpdateManager from "./components/updater/UpdateManager";



function App() {
  const [showLoader, setShowLoader] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // ✅ Show loader first
  if (showLoader) {
    return <LoaderPage />
  }

  // ✅ After loader, enable routing
  return (
    <>
    <Routes  >
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard/manager" element={<ManagerLayout />}>
        <Route path="overview" element={<ManagerDashboard />} />
        <Route path="hotel/*" element={<Hotel />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="staff/*" element={<Staff />} />
        <Route path="issues" element={<Issues />} />
        <Route path="settings" element={<Settings />} />
      </Route> 
      
      <Route path="/dashboard/admin" element={<AdminLayout />}>
        <Route path="overview" element={<AdminDashboard />} />
        <Route path="issues" element={<IssuesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/dashboard/hr" element={<HrLayout />}>
        <Route path="overview" element={<HrDashboard />} />
        <Route path="issues" element={<HrIssues />} />
        <Route path="settings" element={<HrSettings />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="staff/*" element={<HrStaff />} />
      </Route>
      
      <Route path="/dashboard/reception" element={<ReceptionLayout />}>
        <Route path="overview" element={<ReceptionDashboard />} />
      </Route>
    </Routes>
    <UpdateManager />
    </>
  )
}

export default App
