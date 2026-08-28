import avatarplaceholder from "../../../../assets/avatar-placeholder.png";

export default function EmployeeCard({ employee, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl flex flex-col justify-around items-center  shadow bg-white hover:bg-zinc-100 w-1/4 cursor-pointer transition dark:bg-zinc-800 dark:hover:bg-zinc-700"
    >
      <div className="font-medium">
        {employee.full_name} 
      </div>

      <div className="">
        <img src={employee.avatar_url || avatarplaceholder} alt="Avatar" className="w-16 h-16 rounded-full mt-2 object-cover" />
      </div>

      <div className="text-sm text-zinc-400">
        {employee.roleData?.name}
      </div>
      <div
        className={`text-xs mt-2 ${
          employee.status === "active"
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {employee.status}
      </div>
    </div>
  );
}