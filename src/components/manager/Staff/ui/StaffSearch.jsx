export default function StaffSearch({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search by name or ID..."
      className="rounded border border-gray-700 p-2 "
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}