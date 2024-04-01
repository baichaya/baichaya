<template>
  <ScreenCard title="BA系统" :card-class="['item-4']">
    <template #content>
      <div id="bachart" class="h-100%"></div>
    </template>
  </ScreenCard>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
const options = {
  grid: {
    left: "2%",
    right: "2%",
    bottom: "10%",
    containLabel: true,
  },
  legend: {
    x: "center",
    y: "bottom",
    data: ["能耗", "湿度", "温度"],
    textStyle: {
      color: "#999",
    },
  },
  radar: {
    // shape: 'circle',
    radius: "60%",
    indicator: [{ name: "新风" }, { name: "集水坑" }, { name: "气体检测" }, { name: "电梯" }],
  },
  series: [
    {
      name: "Budget vs spending",
      type: "radar",
      itemStyle: {
        borderRadius: 6,
        color: function (params: any) {
          //自定义颜色
          const colorList = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C"];
          return colorList[params.dataIndex];
        },
      },
      data: [
        {
          value: [400, 400, 400, 400],
          name: "能耗",
        },
        {
          value: [300, 300, 300, 300],
          name: "湿度",
        },
        {
          value: [200, 200, 200, 200],
          name: "温度",
        },
      ],
    },
  ],
};

onMounted(() => {
  const chart = echarts.init(document.getElementById("bachart") as HTMLDivElement);
  chart.setOption(options);

  window.addEventListener("resize", () => {
    chart.resize();
  });
});
</script>

<style scoped></style>
