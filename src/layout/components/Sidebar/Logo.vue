<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
    :style="{
      backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground,
    }"
  >
    <transition :enter-active-class="proxy?.animate.logoAnimate.enter" mode="out-in">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1
          v-else
          class="sidebar-title"
          :style="{
            color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor,
          }"
        >
          {{ title }}
        </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1
          class="sidebar-title"
          :style="{
            color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor,
          }"
        >
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts">
import variables from "@/assets/styles/variables.module.scss";
import logo from "@/assets/logo/logo.png";
import useSettingsStore from "@/store/modules/settings";
import { ComponentInternalInstance } from "vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const title = ref("IBMS管理平台");
const settingsStore = useSettingsStore();
const sideTheme = computed(() => settingsStore.sideTheme);

console.log(title);
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  overflow: hidden;
  line-height: 50px;
  text-align: center;
  background: #2b2f3a;

  & .sidebar-logo-link {
    display: flex;
    width: 100%;
    height: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
      font-size: 16px;
      font-weight: 600;
      line-height: 50px;
      color: #fff;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
