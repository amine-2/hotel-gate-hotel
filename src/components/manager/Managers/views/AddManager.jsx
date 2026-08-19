import StaffForm from "../../Users-ui/StaffForm";

const AddManager = () => {
  return (
    <div className="py-10 px-14">
         <h1 className="text-2xl font-bold text-zinc-800 mb-6 text-left dark:text-zinc-300">Add Manager</h1>
        <StaffForm defaultRole="hotel_manager" hidden={true} />
    </div>
  )
}

export default AddManager