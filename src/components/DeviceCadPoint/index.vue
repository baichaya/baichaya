<template>
  <div class="h-100% w-100% p-2">
    <el-row class="title">
      <el-col :span="6">
        <span>{{ props.title }}</span>
      </el-col>
      <el-col :span="18">
        <div class="float-right">
          <slot name="option"></slot>
        </div>
      </el-col>
    </el-row>
    <el-row class="mb20px" :gutter="20" justify="center">
      <el-col v-for="info in props.infoList" :key="info.id" :span="5">
        <el-card>
          <el-space :size="26">
            <svg-icon :icon-class="props.icon" size="45" :color="info.color" />
            <el-space direction="vertical">
              <div>{{ info.label }}</div>
              <div class="font-600">{{ info.value }}</div>
            </el-space>
          </el-space>
        </el-card>
      </el-col>
    </el-row>

    <div class="box">
      <div class="cad">
        <div class="icon" :style="{ left: 680 + 'px', top: 290 + 'px' }">
          <svg-icon :icon-class="props.icon" size="30" color="#409EFF" />
        </div>
        <el-image fit="fill" :src="getFloorImg" />
      </div>
      <div class="btn-list">
        <el-space v-infinite-scroll="load" class="btn" direction="vertical">
          <el-button
            v-for="i in floorList"
            :key="i.id"
            type="primary"
            plain
            style="width: 90px"
          >
            {{ i.name }}
          </el-button>
        </el-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  foolValue?: number; //展示楼层数
  infoList: any[]; //设备信息
  icon: string; //设备图标
  title: string; //标题
}

const props = withDefaults(defineProps<Props>(), {
  foolValue: 7,
});

const height = computed(() => props.foolValue * 40 + "px");
// 楼层平面图
const getFloorImg = computed(() => `/src/assets/images/${floorName.value}.png`);

// 楼层列表
const floorList = ref<any[]>([]);
// 楼层
const floorName = ref("one");

// 加载楼层
const load = () => {
  console.log(111);
};

// 获取楼层列表
const initFloorList = () => {
  for (let i = 0; i < 21; i++) {
    floorList.value.push({
      id: i,
      name: `${i + 1}F`,
      status: 0,
    });
  }
};

onMounted(() => {
  initFloorList();
});
</script>

<style lang="scss" scoped>
.title {
  height: 35px;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 600;
}
.el-card {
  height: 85px;
  width: 220px;
}
.box {
  display: flex;
  width: 100%;
}
.cad {
  width: 1600px;
  min-height: 800px;
  position: relative;
  .icon {
    position: absolute;
  }
  .el-image {
    height: 100%;
    width: 100%;
    z-index: -1;
  }
}
.btn-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 10%;
  min-height: 800px;
  .el-button {
    width: 100%;
  }
  .btn {
    height: v-bind(height);
    overflow: auto;
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
