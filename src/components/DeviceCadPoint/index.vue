<template>
  <div class="w-100% p-2">
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

    <div class="mb20px">
      <el-row :gutter="20" justify="center" v-if="!isParking">
        <el-col v-for="info in props.infoList" :key="info.id" :span="5">
          <el-card class="info-card">
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
      <slot name="info" v-else></slot>
    </div>

    <div class="box">
      <div class="btn-list" v-if="!isParking">
        <el-card shadow="hover">
          <el-input placeholder="请输入楼栋名称" prefix-icon="Search" clearable />
          <el-tree
            ref="deptTreeRef"
            node-key="id"
            :data="buildingTree"
            :props="{ label: 'areaName', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </el-card>
      </div>

      <div :class="isParking ? 'parking-cad ' : 'cad'">
        <template v-if="!isParking">
          <div ref="iconRef" class="icon" :style="{ left: 680 + 'px', top: 290 + 'px' }" @click="checkPoint">
            <svg-icon :icon-class="props.icon" size="30" color="#409EFF" />
          </div>
          <el-popover
            v-if="!isVideo"
            ref="popoverRef"
            :virtual-ref="iconRef"
            trigger="click"
            title="With title"
            virtual-triggering
            placement="top"
          >
            <span> Some content </span>
          </el-popover>
        </template>
        <el-image fit="fill" :src="getFloorImg" />
      </div>

      <slot name="right" v-if="isParking"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { selectAreaTree } from "@/api/ibms/common/device/area";

interface Props {
  infoList: any[]; //设备信息
  icon: string; //设备图标
  title: string; //标题
  isParking?: boolean; //停车场
  isVideo?: boolean; //监控
}

interface Tree {
  areaName: string;
  children?: Tree[];
}

const props = withDefaults(defineProps<Props>(), {
  foolValue: 7,
  isParking: false,
  isVideo: false,
});

const emit = defineEmits(["checkPoint"]);

// 楼层平面图
const getFloorImg = computed(() => new URL(`../../assets/images/ibms/floor/all.png`, import.meta.url).href);

// 楼层
const floorName = ref("one");
const buildingTree = ref<Tree[]>([]);
const iconRef = ref();

const handleNodeClick = (data: Tree) => {
  console.log(data);
};

const getAreaTree = async () => {
  let res = await selectAreaTree();
  buildingTree.value = res.data;
};

// 查看点位
const checkPoint = () => {
  emit("checkPoint");
};

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.areaName.includes(value);
};

getAreaTree();
</script>

<style lang="scss" scoped>
.title {
  height: 35px;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 600;
}

.info-card {
  width: 220px;
  height: 85px;
}

.box {
  display: flex;
  width: 100%;
}

.cad {
  position: relative;
  width: calc(85%);
  min-height: 800px;

  .icon {
    position: absolute;
    cursor: pointer;
  }

  .el-image {
    z-index: -99;
    width: 100%;
    height: 100%;
  }
}

.parking-cad {
  position: relative;
  width: calc(80%);
  min-height: 800px;

  .icon {
    position: absolute;
  }

  .el-image {
    z-index: -1;
    width: 100%;
    height: 100%;
  }
}

.btn-list {
  width: calc(15% - 10px);
  min-height: 800px;
  margin-right: 10px;
}

::-webkit-scrollbar {
  display: none;
}
</style>
