<template>
  <div class="w-100% p-2 flex">
    <!-- 楼栋树 -->
    <div class="floor">
      <el-card shadow="hover">
        <el-input placeholder="请输入楼栋名称" prefix-icon="Search" clearable />
        <el-tree
          class="mt-2"
          ref="deptTreeRef"
          node-key="id"
          :data="buildingTree"
          :props="{ label: 'label', children: 'children' }"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          highlight-current
          default-expand-all
          @node-click="handleNodeClick"
        />
      </el-card>
    </div>

    <div class="card">
      <el-card class="h-60px mb20px" shadow="never">
        <div class="flex justify-between">
          <div>
            <el-select v-model="deviceType" placeholder="请选择设备类型" style="width: 240px">
              <el-option v-for="item in deviceTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="float-right">
            <el-button type="primary" :icon="Plus" plain @click="addPoints">新增点位</el-button>
            <el-button type="success" :icon="FolderAdd" plain>保存点位</el-button>
            <el-button type="warning" :icon="Close" plain>取消</el-button>
          </div>
        </div>
      </el-card>

      <div class="cad">
        <!-- 拖拽 -->
        <Vue3DraggableResizable
          v-if="isAdd"
          :initW="30"
          :initH="30"
          v-model:active="active"
          :draggable="true"
          :resizable="false"
          :parent="true"
          classNameActive="active"
          @drag-end="dragEnd"
        >
          <svg-icon :icon-class="iconType" size="30" color="#409EFF" />
        </Vue3DraggableResizable>

        <!-- 点位 -->
        <div class="icon" :style="{ left: 680 + 'px', top: 290 + 'px' }">
          <svg-icon :icon-class="iconType" size="30" color="#409EFF" />
        </div>
        <img :src="getFloorImg" style="object-fit: fill" />
      </div>
    </div>
  </div>
</template>

<script setup name="SetPoint" lang="ts">
import { BuildingForm, DeviceForm } from "@/api/ibms/pointSetting/types";
import { ElTree } from "element-plus";
import { Plus, FolderAdd, Close } from "@element-plus/icons-vue";
import { IconTypeEnum } from "@/enums/IBMSEnum";
import { selectAreaTree } from "@/api/ibms/common/device/area";

interface Tree {
  [key: string]: any;
}

interface Payload {
  x: number;
  y: number;
}

const route = useRoute();

const height = computed(() => 7 * 40 + "px");
// 楼层平面图
const getFloorImg = computed(() => new URL(`../../../../assets/images/ibms/floor/all.png`, import.meta.url).href);

const buildingInitForm: BuildingForm = {
  buildingTree: [],
  floorList: [],
  floor: "",
};

const deviceInitForm: DeviceForm = {
  deviceTypeList: [],
  iconType: "",
  deviceType: "",
};

const buttonIndex = ref(0);
const active = ref(true);
const isAdd = ref(false);

const buildingData = reactive<BuildingForm>({
  buildingTree: [],
  floorList: [],
  floor: "one",
});
const deviceData = reactive<DeviceForm>({
  deviceType: "",
  deviceTypeList: [],
  iconType: IconTypeEnum.M,
});

const { buildingTree, floorList, floor } = toRefs(buildingData);
const { deviceType, deviceTypeList, iconType } = toRefs(deviceData);

const getAreaTree = async () => {
  let res = await selectAreaTree();
};

// 选择区域楼栋
const handleNodeClick = () => {
  initFloorList();
};

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

// 选择楼层
const choose = (i: any) => {
  buttonIndex.value = i;
};

// 加载楼层
const load = () => {};

// 获取楼层列表
const initFloorList = async () => {};

// 增加点位
const addPoints = () => {
  isAdd.value = true;
};

// 拖动结束获取坐标
const dragEnd = (payload: Payload) => {};

getAreaTree();

// 路由传参
watch(
  () => route.query,
  (val) => {},
  { deep: true }
);
</script>

<style lang="scss" scoped>
.floor {
  width: calc(15% - 10px);
  margin-right: 10px;
  .btn-list {
    display: flex;
    align-items: center;
    flex-direction: column;
    min-height: 280px;
    .btn {
      height: v-bind(height);
      overflow: auto;
    }
  }
}
.card {
  width: calc(85%);
}
.cad {
  width: 100%;
  position: relative;
  .icon {
    position: absolute;
  }
  img {
    width: 100%;
    min-height: 800px;
    z-index: -99;
  }
}
.active {
  border: 0;
  z-index: 1000;
  cursor: pointer;
}
::-webkit-scrollbar {
  display: none;
}
</style>
