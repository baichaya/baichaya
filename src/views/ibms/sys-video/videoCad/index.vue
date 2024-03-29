<template>
  <DeviceCadPoint @check-point="checkVideo" v-bind="{ ...data }" :isVideo="true" />
</template>

<script setup name="VideoCad" lang="ts">
import { IconTypeEnum } from "@/enums/IBMSEnum";

const router = useRouter();

const data = reactive<CadData>({
  infoList: [
    {
      id: 1,
      label: "摄像头数量",
      value: 16,
      color: "#409EFF",
    },
    {
      id: 1,
      label: "在线设备",
      value: 16,
      color: "#67C23A",
    },
    {
      id: 1,
      label: "离线设备",
      value: 16,
      color: "#909399",
    },
    {
      id: 1,
      label: "故障设备",
      value: 16,
      color: "#F56C6C",
    },
  ],
  icon: IconTypeEnum.M,
  title: "视频监控",
});

const checkVideo = () => {
  router.push({ name: "PlayVideo" });
};
</script>

<style scoped></style>
