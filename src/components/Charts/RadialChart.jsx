import React from "react";
import ReactECharts from "echarts-for-react";
import getChartTheme from "./ChartTheme";

export default function RadialChart({
  title,
  data,
  colorPalette = [],
  innerRadius = "40%",
  outerRadius = "60%",
  isDark = false,
}) {
  const total = data.reduce((acc, item) => acc + Number(item.value || 0), 0);
  const theme = getChartTheme(isDark);

  const option = {
    title: {
      text: title,
      left: "left",
      textStyle: {
        color: theme.textColor
      }
    },

    tooltip: {
      backgroundColor: theme.tooltipBg,
      textStyle: {
        color: theme.textColor
      },
      trigger: "item",
      formatter: (params) => {
        const percentage = ((params.value / total) * 100).toFixed(1);
        return `
          <strong>${params.name}</strong><br/>
          Value: ${params.value}<br/>
          Share: ${percentage}%
        `;
      },
    },

    legend: {
      bottom: 0,
      type: "scroll",
      textStyle: {
        color: theme.textColor
      }
    },

    color: colorPalette.length ? colorPalette : undefined,

    series: [
      {
        type: "pie",
        radius: [innerRadius, outerRadius], // donut style
        center: ["50%", "50%"],
        data,
        avoidLabelOverlap: true,

        itemStyle: {
          borderRadius: 10,
          borderColor: theme.borderColor,
          borderWidth: 2,
        },

        label: {
          show: true,
          formatter: "{b}\n{d}%",
          fontWeight: 500,
          color: theme.textColor,
        },

        emphasis: {
          scale: true,
          scaleSize: 8,
        },
      },
    ],
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