import StaffForm from "../../Users-ui/StaffForm";

const AddStaff = () => {
  return (
    <div className="py-10 px-14">
         <h1 className="text-2xl font-bold text-zinc-800 mb-6 text-left">Add Staff</h1>
        <StaffForm defaultRole="hotel_manager" />
    </div>
  )
}

export default AddStaff