<template>
  <ScreenCard title="立方停车" :card-class="['item-4']">
    <template #content>
      <div id="park" class="h-100%"></div>
    </template>
  </ScreenCard>
</template>

<script setup lang="ts">
import * as echarts from "echarts";

const options = {
  color: ["#4c89ef", "#f49130"],
  tooltip: {},
  legend: {
    data: ["进", "出"],
    textStyle: {
      color: "#fff",
    },
  },
  xAxis: {
    type: "category",
    data: ["00h", "02h", "04h", "06h", "08h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"],
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
      },
    },
    axisLine: {
      lineStyle: {
        color: "#fff",
      },
    },
  },
  grid: {
    top: "13%",
    left: "8%",
    right: "3%",
    bottom: "10%",
    // containLabel: true
  },
  yAxis: {
    type: "value",
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
      },
    },
    axisLine: {
      lineStyle: {
        color: "#fff",
      },
    },
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 150, 230, 224, 218, 135, 230, 224],
      type: "line",
      name: "进",
    },
    {
      data: [120, 132, 101, 134, 90, 120, 132, 101, 134, 90, 132, 101],
      type: "line",
      name: "出",
    },
  ],
};

onMounted(() => {
  const chart = echarts.init(document.getElementById("park") as HTMLDivElement);
  chart.setOption(options);

  window.addEventListener("resize", () => {
    chart.resize();
  });
});
</script>

<style scoped></style>
