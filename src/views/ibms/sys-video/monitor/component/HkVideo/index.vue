<template>
  <el-row class="w-100% h-100%" :gutter="5">
    <el-col
      v-for="i in slipt"
      :key="i"
      :span="sapn"
      class="mb-5px"
      :style="{ height }"
      :class="{ redborder: playerIdx == i - 1 }"
      @click="playerIdx = i - 1"
    >
      <VideoPlayer />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
interface Props {
  slipt: number;
}

const props = withDefaults(defineProps<Props>(), {
  slipt: 1,
});

//激活播放器
const playerIdx = ref(0);

// 组件高度
const height = computed(() => {
  let h: string;
  props.slipt == 1
    ? (h = `100%`)
    : (h = `calc(100% / ${Math.sqrt(props.slipt)})`);
  return h;
});
// 分屏
const sapn = computed(() => {
  let s: number;
  props.slipt == 1 ? (s = 24) : (s = 24 / Math.sqrt(props.slipt));
  return s;
});
</script>

<style lang="scss" scoped>
.redborder {
  border: 2px solid red !important;
}
</style>
