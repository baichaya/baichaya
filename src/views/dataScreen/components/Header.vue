<script setup lang="ts" name="Header">
const formatted = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
const title = ref("智能数据可视化信息平台");
</script>

<template>
  <div class="d-flex jc-center title_wrap">
    <div class="zuojuxing"></div>
    <div class="youjuxing"></div>
    <div class="guang"></div>
    <div class="d-flex jc-center">
      <div class="title">
        <span class="title-text">{{ title }}</span>
      </div>
    </div>
    <div class="home">
      <dv-button @click="$router.push('/')" border="Border5" color="#10e5fa"> 首页 </dv-button>
    </div>
    <div class="timers">
      {{ formatted }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.title_wrap {
  position: relative;
  height: 60px;
  margin-bottom: 4px;
  background-image: url("@/assets/images/top.png");
  background-position: center center;
  background-size: cover;

  .guang {
    position: absolute;
    bottom: -26px;
    width: 100%;
    height: 56px;
    background-image: url("@/assets/images/guang.png");
    background-position: 80px center;
  }

  .zuojuxing,
  .youjuxing {
    position: absolute;
    top: -2px;
    width: 140px;
    height: 6px;
    background-image: url("@/assets/images/headers/juxing1.png");
  }

  .zuojuxing {
    left: 11%;
  }

  .youjuxing {
    right: 11%;
    transform: rotate(180deg);
  }

  .home {
    position: absolute;
    top: 15px;
    left: 0;
    font-size: 18px;
  }

  .timers {
    position: absolute;
    top: 30px;
    right: 0;
    display: flex;
    align-items: center;
    font-size: 22px;
    font-weight: 600;
    color: #fff;
  }
}

.title {
  position: relative;
  height: 60px;
  line-height: 46px;
  color: transparent;
  // width: 500px;
  text-align: center;
  background-size: cover;

  .title-text {
    width: 100%;
    font-size: 38px;
    font-weight: 900;
    letter-spacing: 6px;
    background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525%, #01aaff 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
