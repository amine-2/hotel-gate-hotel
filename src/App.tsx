import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import LoaderPage from "./components/loading.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/Signup.jsx";
import ManagerDashboard from "./pages/manager/ManagerDashboard.jsx";
import ManagerLayout from "./pages/manager/ManagerLayout.jsx";
import Hotel from "./pages/manager/Hotel.jsx";
import Staff from "./pages/manager/Staff.jsx";
import Settings from "./pages/manager/Settings.jsx";
import Issues from "./pages/manager/Issues.jsx";
import Bookings from "./pages/manager/Bookings.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import HotelPage from "./pages/admin/HotelPage.jsx";
import IssuesPage from "./pages/admin/IssuesPage.jsx";
import SettingsPage from "./pages/admin/SettingsPage.jsx";
import FloorsPage from "./pages/admin/FloorsPage.jsx";
import RoomsPage from "./pages/admin/RoomsPage.jsx";

import HrLayout from "./pages/hr/HrLayout.jsx";
import HrDashboard from "./pages/hr/HrDashboard.jsx";
import HrIssues from "./pages/hr/HrIssues.jsx";
import HrSettings from "./pages/hr/HrSettings.jsx";
import Candidates from "./pages/hr/Candidates.jsx";
import HrStaff from "./pages/hr/HrStaff.jsx";

import ReceptionLayout from "./pages/reception/ReceptionLayout.jsx";
import ReceptionDashboard from "./pages/reception/ReceptionDashboard.jsx";
import FrontDesk from "./pages/reception/FrontDesk.jsx";
import ShiftHandover from "./pages/reception/ShiftHandover.jsx";
import Reservations from "./pages/reception/Reservations.jsx";
import ReceptionRooms from "./pages/reception/ReceptionRooms.jsx";
import ReceptionSettings from "./pages/reception/ReceptionSettings.jsx";
import ReceptionIssues from "./pages/reception/ReceptionIssues.jsx";
import StayHistory from "./pages/reception/StayHistory.jsx";
import NewReservation from "./pages/reception/NewReservation.jsx";
import BookingDetails from "./pages/reception/BookingDetails.jsx";
import StayDetails from "./pages/reception/StayDetails.jsx";
import RoomDetails from "./pages/reception/RoomDetails.jsx";

import UpdateManager from "./components/updater/UpdateManager";

function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Show loader first
  if (showLoader) {
    return <LoaderPage />;
  }

  // ✅ After loader, enable routing
  return (
    <>
      <Routes>
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
          <Route path="hotel" element={<HotelPage />} />
          <Route path="issues" element={<IssuesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="floors" element={<FloorsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
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
          <Route path="issues" element={<ReceptionIssues />} />
          <Route path="settings" element={<ReceptionSettings />} />
          <Route path="stay-history" element={<StayHistory />} />
          <Route path="stay-history/:stayId" element={<StayDetails />} />
          <Route path="rooms" element={<ReceptionRooms />} />
          <Route path="rooms/:roomId" element={<RoomDetails />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="reservations/new" element={<NewReservation />} />
          <Route path="reservations/:bookingId" element={<BookingDetails />} />
          <Route path="frontdesk" element={<FrontDesk />} />
          <Route path="frontdesk/shift-handover" element={<ShiftHandover />} />
        </Route>
      </Routes>
      <UpdateManager />
    </>
  );
}

export default App;
