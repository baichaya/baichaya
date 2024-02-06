<template>
  <dv-border-box-13 :class="props.cardClass">
    <div class="box">
      <dv-decoration-7 style="height: 45px; width: 130px">
        <span class="cad-title">{{ props.title }}</span>
      </dv-decoration-7>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </dv-border-box-13>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  bgColor: {
    type: String,
    default: "rgba(8, 40, 72, 0.384)",
  }, //t头部背景
  height: {
    type: String,
    default: "45px",
  },
  cardClass: {
    type: Array<string>,
    default: () => ["item"],
  }, //默认高度25%
  textCenter: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "18px",
  },
});
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  display: flex;
  justify-content: center;
}
.cad-title {
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 6px;
  background: linear-gradient(
    92deg,
    #0072ff 0%,
    #00eaff 48.8525390625%,
    #01aaff 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.content {
  height: calc(100% - 45px);
  // background-color: rgba(#e9e6e6, 0.4);
}
</style>
