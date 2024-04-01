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
          :data="AreaTreeData"
          :props="{ label: 'treeViewNameTemp', children: 'children' }"
          :default-expanded-keys="[-99]"
          :default-checked-keys="[-99]"
          :expand-on-click-node="true"
          :filter-node-method="filterNode"
          highlight-current
          @node-click="handleNodeClick"
        />
      </el-card>
    </div>

    <div class="card">
      <el-card class="h-3.75rem mb1.25rem" shadow="never">
        <div class="flex justify-between">
          <div>
            <el-select v-model="selectedDeviceType" placeholder="请选择设备类型" style="width: 15rem">
              <el-option v-for="item in deviceTypeData" :key="item.id" :label="item.deviceType" :value="item.id" />
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
        <div class="icon" :style="{ left: 680 + 'px', top: 290 + 'px', position: 'absolute' }">
          <svg-icon :icon-class="iconType" size="30" color="#409EFF" />
        </div>
        <img :src="selectedFloorImageUrl" style="object-fit: fill" />
      </div>
    </div>
  </div>
</template>

<script setup name="SetPoint" lang="ts">
interface Tree {
  [key: string]: any;
}

interface Payload {
  x: number;
  y: number;
}

import { ElTree } from "element-plus";
import { Plus, FolderAdd, Close } from "@element-plus/icons-vue";
import { IconTypeEnum } from "@/enums/IBMSEnum";
//引用区域表-楼层树结构
import { getAreaTree } from "@/api/ibms/common/device/area";
//引用设备类型表
import { listDeviceType } from "@/api/ibms/common/devOps/deviceConfig/deviceType";

const route = useRoute();

const deviceData = reactive({
  iconType: IconTypeEnum.M,
});

const { iconType } = toRefs(deviceData);

const selectedFloorCadUrl = ref("zp"); //选中楼层的cad_url
const AreaTreeData = ref(); // 楼层数结构
const deviceTypeData = ref(); // 设备类型数据
const selectedDeviceType = ref(); // 初始化设备选择下拉框选中值为 null
const active = ref(true);
const isAdd = ref(false);

//实时获取选中节点楼层对应的CAD地址
const selectedFloorImageUrl = computed(() => {
  // 根据选中节点的cadUrl拼接完整的图片地址
  return new URL(`../../../../assets/images/ibms/floor/${selectedFloorCadUrl.value}.jpg`, import.meta.url).href;
});

// 增加点位
const addPoints = () => {
  isAdd.value = true;
};

// 拖动结束获取坐标
const dragEnd = (position: Payload) => {};

// 获取区域树结构，包含楼栋楼层
const getAreaTreeList = async () => {
  let res = (await getAreaTree()).data;
  AreaTreeData.value = res;
};

// 获取设备具体类型
const getDeviceType = async (id: any) => {
  const res = await listDeviceType({
    pageNum: 1,
    pageSize: 99,
    groupId: id,
  });
  deviceTypeData.value = res.rows;
};

//节点点击事件，点击后获取选中节点的cad_url值。
const handleNodeClick = (selectedNode: { cadUrl: string; id: number; treeViewNameTemp: string }) => {
  // 在这里处理获取到的 cadUrl
  switch (selectedNode.treeViewNameTemp) {
    case "总平":
    case "默认区域":
      selectedFloorCadUrl.value = "zp";
      break;
    case "地下室":
      selectedFloorCadUrl.value = "dxs";
      break;
    default:
      selectedFloorCadUrl.value = selectedNode.cadUrl;
  }
};

getAreaTreeList();

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

getAreaTreeList();

//路由传参  获取index页面传过来的设备分组对象deviceGroup
watch(
  () => route.query,
  (val) => {
    getDeviceType(val.id);
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.card {
  width: calc(85%);
  margin-left: 0.625rem;
}

.cad {
  position: relative;
  width: 100%;

  img {
    z-index: -99;
    width: 100%;
    min-height: 3.125rem;
  }
}

.active {
  z-index: 1000;
  cursor: pointer;
  border: 0;
}

::-webkit-scrollbar {
  display: none;
}
</style>
