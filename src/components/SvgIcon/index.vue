<template>
  <svg :class="svgClass" aria-hidden="true" :style="'width:' + size + ';height:' + size">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { propTypes } from "@/utils/propTypes";

const props = defineProps({
  iconClass: propTypes.string.isRequired,
  className: propTypes.string.def(""),
  color: propTypes.string.def(""),
  size: {
    type: String,
    default: "1em",
  },
});
const iconName = computed(() => `#icon-${props.iconClass}`);
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`;
  }
  return "svg-icon";
});
</script>

<style scope lang="scss">
.sub-el-icon,
.nav-icon {
  position: relative;
  display: inline-block;
  margin-right: 12px;
  font-size: 15px;
}

.svg-icon {
  position: relative;
  width: 1em;
  height: 1em;
  vertical-align: -2px;
  fill: currentcolor;
}

svg {
  pointer-events: none; /* 禁用拖放事件，防止出现默认的蓝色遮罩层 */
  user-select: none; /* Chrome/Safari */
  user-select: none; /* Firefox */
  user-select: none; /* IE10+ */
  user-select: none; /* Standard syntax */
}

svg:active {
  outline: none; /* 移除默认的蓝色边框 */
}
</style>
