import { Routes, Route } from "react-router-dom";
import HotelsList from "../../components/manager/Hotels/views/HotelsList";
import AddHotel from "../../components/manager/Hotels/views/AddHotel";
import HotelView from "../../components/manager/Hotels/views/HotelView";
import OverviewTab from "../../components/manager/Hotels/tabs/OverviewTab";
import DetailsTab from "../../components/manager/Hotels/tabs/DetailsTab";
import BookingsTab from "../../components/manager/Hotels/tabs/BookingsTab";
import SettingsTab from "../../components/manager/Hotels/tabs/SettingsTab";

export default function Hotel() {
  return (
    <Routes>
      <Route index element={<HotelsList />} />
      <Route path="add" element={<AddHotel />} />
      <Route path=":hotelId/*" element={<HotelView />}>
        <Route index element={<DetailsTab />} />
        <Route path="overview" element={<OverviewTab />} />
        <Route path="details" element={<DetailsTab />} />
        <Route path="bookings" element={<BookingsTab />} />
        <Route path="settings" element={<SettingsTab />} />
      </Route>
    </Routes>
  );
}
