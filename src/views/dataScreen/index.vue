<template>
  <div class="dataSreen">
    <div class="content_wrap">
      <Header />
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts" name="DataScreen">
import Header from "./components/Header.vue";
import Main from "./components/Main.vue";

const loading = ref(true);
const loadingTimer = ref<any>(null);

const cancelLoading = () => {
  loadingTimer.value = setTimeout(() => {
    loading.value = false;
  }, 500);
};

onMounted(() => {
  cancelLoading();
});

onBeforeUnmount(() => {
  clearInterval(loadingTimer.value);
});
</script>

<style lang="scss" scoped>
.content_wrap {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-image: url("@/assets/images/pageBg.png");
  background-size: cover;
  background-position: center center;
}
</style>
