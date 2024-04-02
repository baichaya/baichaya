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
      <div class="options">
        <div>
          <el-radio-group v-model="deviceType" class="ml-4" size="small" @change="typeChange">
            <el-radio-button v-for="item in deviceTypeData" :key="item.id" :label="item.id">
              <el-space>
                <svg-icon :icon-class="item.icon" size="30" />
                <span class="text-16px font-600">{{ item.deviceType }}</span>
              </el-space>
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="float-right">
          <el-button @click="resetMap" plain class="mr-10px"><i-ep-refresh />重置</el-button>
          <el-button type="primary" :icon="Plus" plain @click="addPoints">新增点位</el-button>
          <el-button type="success" :icon="FolderAdd" plain>保存点位</el-button>
          <el-button type="warning" :icon="Close" plain>取消</el-button>
        </div>
      </div>

      <v3-drag-zoom-container
        :loading="isLoading"
        class="cad"
        ref="dragRef"
        align="contain"
        :min-zoom="0.8"
        :max-zoom="10"
      >
        <img :src="selectedFloorImageUrl" alt="" />
        <v3-drag-zoom-item
          v-if="isAdd"
          :position="{ x: 0, y: 2 }"
          :draggable="true"
          :fixed-size="true"
          class="icon"
          @on-move-finished="dragEnd"
        >
          <svg-icon :icon-class="iconType" size="30" color="#409EFF" />
        </v3-drag-zoom-item>
      </v3-drag-zoom-container>
    </div>
  </div>
</template>

<script setup name="Test" lang="ts">
interface Tree {
  [key: string]: any;
}

import { ElTree } from "element-plus";
import { Plus, FolderAdd, Close } from "@element-plus/icons-vue";
//引用区域表-楼层树结构
import { getAreaTree } from "@/api/ibms/common/device/area";
//引用设备类型表
import { listDeviceType } from "@/api/ibms/common/devOps/deviceConfig/deviceType";
import { Position } from "v3-drag-zoom";
import { DeviceTypeVO } from "@/api/ibms/common/devOps/deviceConfig/deviceType/types";
import { findValue } from "@/utils";
import { AreaBuildingFloorVo } from "@/api/ibms/common/device/area/types";

const route = useRoute();

const selectedFloorCadUrl = ref("zp"); //选中楼层的cad_url
const AreaTreeData = ref(); // 楼层数结构
const deviceTypeData = ref<DeviceTypeVO[]>(); // 设备类型数据
const deviceType = ref(); // 初始化设备选择下拉框选中值为 null
const iconType = ref();
const dragRef = ref();
const isAdd = ref(false);
const isLoading = ref(false);

//实时获取选中节点楼层对应的CAD地址
const selectedFloorImageUrl = computed(() => {
  // 根据选中节点的cadUrl拼接完整的图片地址
  return new URL(`../../../../assets/images/ibms/floor/${selectedFloorCadUrl.value}.jpg`, import.meta.url).href;
});

// 增加点位
const addPoints = () => {
  isAdd.value = true;
};

// 地图重置
const resetMap = () => {
  isLoading.value = true;
  setTimeout(() => {
    dragRef.value.reset();
    isAdd.value = false;
    isLoading.value = false;
  }, 1000);
};

// 拖动结束获取坐标
const dragEnd = (position: Position) => {
  const { x, y } = position;
};

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
  deviceType.value = res.rows[0].id;
  typeChange(deviceType.value);
};

//节点点击事件，点击后获取选中节点的cad_url值。
const handleNodeClick = (selectedNode: AreaBuildingFloorVo) => {
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

// 选择设备类型
const typeChange = (val: any) => {
  iconType.value = findValue(deviceTypeData.value!, val, "id", "icon");
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

// 图片重置
watch(
  selectedFloorCadUrl,
  (val) => {
    resetMap();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.card {
  width: calc(85%);
  margin-left: 0.625rem;
}

.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #dcdfe6;
}

.cad {
  width: 100%;
  min-height: 900px;
  background-color: #ffff;

  img {
    pointer-events: none !important;
  }
}

.icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
