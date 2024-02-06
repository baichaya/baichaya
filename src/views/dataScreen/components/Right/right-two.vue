<template>
  <ScreenCard title="监控系统" :card-class="['item-4']">
    <template #content>
      <dv-scroll-board :config="config" style="width: 100%; height: 98%" />
    </template>
  </ScreenCard>
</template>

<script setup lang="ts">
const config = ref({
  header: ["设备名称", "产品型号", "状态"],
  data: [
    ["1701", "D3", '<span style="color:#75d1e0;">在线</span>'],
    ["1706", "D2", '<span style="color:#f1b57a;">离线</span>'],
    ["2104", "D4", '<span style="color:#fd666d;">故障</span>'],
    ["2603", "D5", '<span style="color:#75d1e0;">在线</span>'],
    ["2201", "D6", '<span style="color:#f1b57a;">离线</span>'],
    ["1708", "D7", '<span style="color:#fd666d;">故障</span>'],
  ],
  align: ["center", "center", "center", "center"],
  headerBGC: "#092b5d",
  oddRowBGC: "#062249",
  evenRowBGC: "#062249",
});
</script>

<style scoped></style>
