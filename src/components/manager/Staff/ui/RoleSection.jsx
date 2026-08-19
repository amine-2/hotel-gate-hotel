export default function RoleSection({ title, children }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className=" w-full flex flex-wrap justify-start gap-4 p-6">
        {children}
      </div>
    </div>
  );
}