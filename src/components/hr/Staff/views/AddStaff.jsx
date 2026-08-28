import StaffForm from "../../Users-ui/StaffForm";
import {useHotel} from "../../../../auth/HotelContext";

const AddStaff = () => {

  const { hotelId } = useHotel();
  return (
    <div className="py-10 px-14">
         <h1 className="text-2xl font-bold text-zinc-800 mb-6 text-left">Add Staff</h1>
        <StaffForm defaultRole="receptionist" hotel_id={hotelId}/>
    </div>
  )
}

export default AddStaff