export default function getChartTheme(isDark) {
  return {
    textColor: isDark ? "#e4e4e7" : "#18181b",
    gridColor: isDark ? "#3f3f46" : "#e4e4e7",
    axisColor: isDark ? "#a1a1aa" : "#52525b",
    tooltipBg: isDark ? "#222222" : "#ffffff",
    borderColor: isDark ? "#18181b" : "#e4e4e7",
  };
}