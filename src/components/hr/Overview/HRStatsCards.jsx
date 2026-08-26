import { useHotel } from "../../../auth/HotelContext";
import { useHRStats } from "../../../hooks/useHRStats";
import HRStatCard from "./HRStatCard";

export default function HRStatsCards() {
  const { hotelId } = useHotel();

  const { stats, loading } = useHRStats(hotelId);

  const cards = [
    {
      label: "Total Staff",
      value: stats.totalStaff,
    },
    {
      label: "Active",
      value: stats.active,
    },
    {
      label: "On Leave",
      value: stats.onLeave,
    },
    {
      label: "Candidates",
      value: stats.candidates,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <HRStatCard
          key={card.label}
          label={card.label}
          value={card.value}
          loading={loading}
        />
      ))}
    </div>
  );
}