import OwnerSettingsPage from '../../components/manager/Settings/OwnerSettingsPage'
import BillPrintingSettings from "../../components/reception/settings/BillPrintingSettings";
import { useHotel } from "../../auth/HotelContext";

const Settings = () => {
 
  const { hotelId } = useHotel();
  console.log(hotelId);
  


  return (
    <div className="p-14">
      <OwnerSettingsPage />
      <BillPrintingSettings hotelId={hotelId} />
      
    </div>
  )
}

export default Settings