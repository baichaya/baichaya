<template>
  <ScreenCard title="周界报警" :card-class="['item-2']">
    <template #content>
      <el-row :gutter="20" justify="space-around" align="middle">
        <el-col v-for="i in item" :key="i.title" :span="9" class="mb-10px">
          <el-space>
            <div>
              <dv-decoration-9
                class="relative"
                style="width: 75px; height: 75px"
              >
                <div class="icon">
                  <svg-icon
                    :icon-class="i.icon"
                    size="25px"
                    :color="i.config.style.fill"
                  />
                </div>
              </dv-decoration-9>
            </div>
            <div class="mt-20px w-80px">
              <div class="title">{{ i.title }}</div>
              <dv-digital-flop :config="i.config" />
            </div>
          </el-space>
        </el-col>
      </el-row>
    </template>
  </ScreenCard>
</template>

<script setup lang="ts">
const item = reactive([
  {
    icon: "warning",
    title: "当前报警数",
    config: {
      number: [900],
      style: {
        fontSize: 18,
        fill: "#55ebfd",
      },
    },
  },
  {
    icon: "warning",
    title: "新增报警数",
    config: {
      number: [600],
      style: {
        fontSize: 18,
        fill: "#fb452c",
      },
    },
  },
  {
    icon: "warning",
    title: "昨日报警数",
    config: {
      number: [150],
      style: {
        fontSize: 18,
        fill: "#f49c37",
      },
    },
  },
  {
    icon: "warning",
    title: "已处理报警",
    config: {
      number: [150],
      style: {
        fontSize: 18,
        fill: "#3fe194",
      },
    },
  },
]);
</script>

<style lang="scss" scoped>
.icon {
  position: absolute;
  left: 32%;
  top: 35%;
}
.title {
  font-size: 14px;
  color: #fff;
  text-align: center;
}
.value {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>
