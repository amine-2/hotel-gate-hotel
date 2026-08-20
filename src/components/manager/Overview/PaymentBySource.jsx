import { useState, useEffect } from "react";
import RadialChart from "../../Charts/RadialChart";
import RadialBarChart from "../../Charts/RadialBarChart";
import FilterDropdown from "../../FilterDropdown";
import { useAggregatedData } from "../../../hooks/useAggregatedData";
import { getRevenueByPaymentMethodData } from "../../../lib/statistics/revenueByPaymentSourceData";
import LazyRender from "../../../hooks/LazyRender";
import { useTranslation } from "react-i18next";
import { useHotel } from "../../../auth/HotelContext" ;

export default function PaymentSource() {

  const { t } = useTranslation(["common", "dashboard" ]);
  const [paymentData, setPaymentData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const { hotelId } = useHotel();

  useEffect(() => {
    async function fetchData() {
      const res = await getRevenueByPaymentMethodData(hotelId);
      setPaymentData(res || [hotelId]);
    }

    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);

    fetchData();
  }, []);

  const filterOptions = [
    { label: t("today", { ns: "common" }), value: "today" },
    { label: t("last_7_days", { ns: "common" }), value: "week" },
    { label: t("last_30_days", { ns: "common" }), value: "month" },
    { label: t("last_6_months", { ns: "common" }), value: "6months" },
    { label: t("last_year", { ns: "common" }), value: "year" },
  ];

  const { filter, setFilter, aggregatedData } = useAggregatedData(
    paymentData,
    {
      dateKey: "date",
      groupByKey: "payment_method", 
      valueKey: "revenue",        
      initialFilter: "today",
    }
  );

  const colorsLight = [
    "rgba(245, 135, 0, 0.7)",
    "rgba(38, 104, 103, 0.7)",
    "rgba(26, 70, 69 , 0.7)",
    "rgba(248, 188, 36, 0.7)",
  ];

  const colorsDark = [
    "rgba(131, 56, 236, 0.7)",
    "rgba(58, 134, 255, 0.7)",
    "rgba(251, 86, 7, 0.7)",
    "rgba(255, 0, 110, 0.7)",
  ];


  return (
    <LazyRender className="w-full relative pt-16 min-h-105 t" >
      <FilterDropdown
        value={filter}
        onChange={setFilter}
        options={filterOptions}
      />

      <RadialChart
        title={t("revenueDistribution", { ns: "dashboard" })}
        data={aggregatedData}
        colorPalette={darkMode ? colorsDark : colorsLight}
        isDark={darkMode}
      />

      {/* <RadialBarChart
        title="Revenue Distribution"
        data={aggregatedData}
        colorPalette={darkMode ? colorsDark : colorsLight}
        isDark={darkMode}
      /> */}
    </LazyRender>
  );
}