import React from "react";
import ReactECharts from "echarts-for-react";

export default function LineChart({
  title,
  xLabels,
  series,
  colorPalette = [],
  smooth = true,
  showArea = false,
}) {
  // Same label logic as your bar chart
  let rotate = 0;
  let labelFormatter = (val) => val;

  if (xLabels.length > 20) {
    rotate = 60;
    labelFormatter = (val) => val.split(" ")[1];
  } else if (xLabels.length > 10) {
    rotate = 30;
    labelFormatter = (val) => val.split(" ")[0];
  }

  const option = {
    title: { text: title, left: "left" },

    tooltip: {
      trigger: "axis",
      formatter: (params) =>
        params
          .map((p) => `${p.seriesName}<br>${p.axisValue}: ${p.data}`)
          .join("<br>"),
    },

    legend: { bottom: 0 },

    color: colorPalette.length ? colorPalette : 'blue',

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
      name: title,
      type: "line",
      data: s.data,
      smooth,
      symbol: "circle",
      symbolSize: 6,
      lineStyle: { width: 3 },
      areaStyle: showArea ? {} : undefined, // 👈 optional area fill
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