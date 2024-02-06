<template>
  <el-row class="main">
    <el-col :span="6">
      <div class="h-100%">
        <Left />
      </div>
    </el-col>
    <el-col :span="12">
      <div class="h-100%">
        <Center />
      </div>
    </el-col>
    <el-col :span="6">
      <div class="h-100%">
        <Right />
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts" name="Main">
import Left from "./Left/index.vue";
import Right from "./Right/index.vue";
import Center from "./Center/index.vue";
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  min-height: calc(100% - 64px);
}
</style>
