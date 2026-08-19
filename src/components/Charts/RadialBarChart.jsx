import React from "react";
import ReactECharts from "echarts-for-react";

export default function RadialBarChart({ title, data, colorPalette = [] }) {
  if (!data || !data.length) return null;

  const formatNumber = (v) => {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
    if (v >= 1_000) return (v / 1_000).toFixed(1) + "K";
    return v;
  };

  const maxValue = Math.max(...data.map((d) => d.value)) * 1.1;

  const option = {
    title: {
      text: title,
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "item",
      formatter: ({ name, value }) => `${name}: ${value.toLocaleString()}`,
    },
    polar: {
      radius: ["10%", "60%"],
      startAngle: 90,
    },
    angleAxis: {
      type: "value",
      max: maxValue,
      startAngle: 100,
      axisLabel: { formatter: formatNumber, color: "#666" },
      splitLine: { show: true, lineStyle: { type: "dotted" } },
      endAngle:-220
    },
    radiusAxis: {
      type: "category",
      data: data.map((d) => d.name),
      axisLabel: { color: "#666" },
      
    },
    series: [
      {
        type: "bar",
        coordinateSystem: "polar",
        barWidth: 20,
        data: data.map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: colorPalette[i % colorPalette.length],
            borderRadius: 8,
          },
          // Only value label in the middle
          label: {
            show: true,
            position: "middle",
            fontSize: 10,
            formatter:  d.name +" "+formatNumber(d.value),
            color: "#fff",
          },
        })),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400, width: "100%" }} />;
}