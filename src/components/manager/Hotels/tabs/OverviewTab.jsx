import HotelSummarySection from "../ui/HotelSummarySection";
import HotelChartSection from "../ui/HotelChartSection";
import HotelDailyStatsTable from "../ui/HotelDailyStatsTable";

export default function OverviewTab() {
  return (
    <div className="space-y-10">
      <HotelSummarySection />
      <HotelChartSection />
      <HotelDailyStatsTable />
    </div>
  );
}
    

