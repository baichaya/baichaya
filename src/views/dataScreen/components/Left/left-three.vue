<template>
  <ScreenCard title="立方门禁" :card-class="['item-3']">
    <template #content>
      <dv-scroll-board :config="config" style="width: 100%; height: 98%" />
    </template>
  </ScreenCard>
</template>

<script setup lang="ts">
const config = ref({
  header: ["车牌号", "所属部门", "人员名称", "时间"],
  data: [
    ["1701", "工程部", "张", "10:30"],
    ["1706", "智慧交通", "陈", "14:00"],
    ["2104", "智慧楼宇", "赵", "15:00"],
    ["2603", "BIM项目", "李", "16:30"],
    ["2201", "项目技术", "王", "09:30"],
    ["1708", "工程部", "刘", "10:30"],
  ],
  align: ["center", "center", "center", "center"],
  headerBGC: "#092b5d",
  oddRowBGC: "#062249",
  evenRowBGC: "#062249",
});
</script>

<style scoped></style>
