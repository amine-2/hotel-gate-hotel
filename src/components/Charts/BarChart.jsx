import React from "react";
import ReactECharts from "echarts-for-react";
import getChartTheme from "./ChartTheme";

export default function BarChart({
  title,
  xLabels,
  series,
  colorPalette = [],
  isDark = false,
}) {
  const theme = getChartTheme(isDark);

  // Decide rotation & label formatting based on number of points
  let rotate = 0;
  let labelFormatter = (val) => val;

  if (xLabels.length > 20) {
    rotate = 60;
    labelFormatter = (val) => val.split(" ")[1]; // show only day number
  } else if (xLabels.length > 10) {
    rotate = 30;
    labelFormatter = (val) => val.split(" ")[0]; // optional
  }

  const option = {
    title: {
      text: title,
      left: "left",
      textStyle: { color: theme.textColor },
    },

    tooltip: {
      backgroundColor: theme.tooltipBg,
      textStyle: {
        color: theme.textColor,
      },
      trigger: "axis",
      formatter: (params) =>
        params
          .map((p) => `${p.seriesName}<br>${p.axisValue}: ${p.data}`)
          .join("<br>"),
    },
    legend: { bottom: 0, textStyle: { color: theme.textColor } },

    color: colorPalette.length ? colorPalette : undefined,
    grid: { top: 80, left: 60, right: 30, bottom: 60 },
    xAxis: {
      type: "category",
      data: xLabels,
      axisLabel: {
        interval: 0,
        rotate,
        formatter: labelFormatter,
      },
      splitLine: { show: true, lineStyle: { type: "dotted" } },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dotted" } },
      axisLabel: {
        formatter: (val) =>
          val >= 1_000_000
            ? val / 1_000_000 + "M"
            : val >= 1_000
              ? val / 1_000 + "K"
              : val,
      },
    },
    series: series.map((s) => ({
      name: s.name,
      type: "bar",
      data: s.data,
      barMaxWidth: 30,
      itemStyle: { borderRadius: [8, 8, 0, 0] },
    })),
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 400, width: "100%" }}
      notMerge
      lazyUpdate
    />
  );
}
