<template>
  <div class="p2">
    <el-button @click="onChange">重置</el-button>

    <v3-drag-zoom-container
      ref="dragRef"
      :align="alignMode"
      :min-zoom="0.8"
      :max-zoom="10"
      style="width: 1200px; height: 900px"
    >
      <img :src="mg" alt="" />
      <v3-drag-zoom-item
        v-for="point in points"
        :key="point.label"
        :position="point.position"
        style="width: 30px; height: 30px; cursor: pointer"
        :style="{ 'background-color': point.color }"
        :draggable="false"
        :fixed-size="fixedSize"
      />
      <v3-drag-zoom-item
        :draggable="true"
        :fixed-size="fixedSize"
        :position="{ x: 1, y: 0 }"
        @on-move-finished="finished"
      >
        <svg-icon :icon-class="iconType" size="30" color="#409EFF" />
      </v3-drag-zoom-item>
    </v3-drag-zoom-container>
  </div>
</template>

<script setup lang="ts">
import mg from "@/assets/images/ibms/floor/zp.jpg";
import { IconTypeEnum } from "@/enums/IBMSEnum";
import { Position } from "v3-drag-zoom";

interface Payload {
  x: number;
  y: number;
}

const dragRef = ref();
const iconType = ref(IconTypeEnum.M);
const active = ref(true);
const alignMode = ref<any>("contain");

const size = ref(0);

const onChange = () => {
  setTimeout(() => {
    dragRef.value.reset();
  });
};

const points = ref([
  { label: 1, position: { x: 20, y: 20 }, color: "darkred" },
  { label: 1, position: { x: 50, y: 20 }, color: "darkblue" },
  { label: 1, position: { x: 80, y: 20 }, color: "darkgreen" },
]);

const textPoints = ref([
  { label: 1, position: { x: 20, y: 25 }, text: "哈哈" },
  { label: 1, position: { x: 50, y: 25 }, text: "吼吼" },
  { label: 1, position: { x: 80, y: 25 }, text: "嘿嘿" },
]);

const finished = (pos: Payload) => {
  console.log(pos);
};

const fixedSize = ref(true);
</script>

<style lang="scss" scoped>
.active {
  z-index: 1000;
  cursor: pointer;
  border: 0;
}
</style>
