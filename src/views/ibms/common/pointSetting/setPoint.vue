<template>
  <el-row class="p-2" :gutter="20">
    <el-col :span="4">
      <!-- 楼栋树 -->
      <div class="floor">
        <el-card shadow="hover">
          <el-input v-model="positionName" placeholder="请输入楼栋名称" prefix-icon="Search" clearable />
          <el-tree
            class="mt-2"
            ref="treeRef"
            node-key="id"
            :data="AreaTreeData"
            :props="{ label: 'positionName', children: 'children' }"
            :default-expanded-keys="[0, 1]"
            :expand-on-click-node="true"
            :filter-node-method="filterNode"
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-card>
      </div>
    </el-col>
    <el-col :span="20">
      <div class="w-100%">
        <!-- 图标 -->
        <div class="options">
          <div>
            <el-radio-group
              v-model="form.deviceType"
              class="ml-4"
              size="small"
              @click="addPoints"
              @change="typeChange"
              :disabled="disabled"
            >
              <el-radio-button v-for="item in deviceTypeData" :key="item.id" :label="item.deviceType">
                <el-space>
                  <svg-icon :icon-class="item.icon" size="30" />
                  <span class="text-16px font-600">{{ item.deviceType }}</span>
                </el-space>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="float-right">
            <el-button @click="resetMap" plain class="mr-10px"><i-ep-refresh />重置</el-button>
          </div>
        </div>

        <el-empty v-if="!selectedFloorCadUrl" class="cad" description="请选择楼层" />

        <!-- cad图纸 -->
        <v3-drag-zoom-container
          v-else
          :loading="isLoading"
          ref="dragRef"
          align="contain"
          :min-zoom="0.8"
          :max-zoom="8"
          style="min-height: 900px"
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
            <el-popover
              ref="popover"
              title="绑定设备"
              :width="200"
              trigger="contextmenu"
              content="this is content, this is content, this is content"
              placement="right"
              @show="getDeviceList"
            >
              <div style="margin: 0; text-align: right">
                <el-button size="small" text>cancel</el-button>
                <el-button size="small" type="primary">confirm</el-button>
              </div>
              <template #reference>
                <el-button link>
                  <svg-icon :icon-class="iconType" size="30" color="#409EFF" />
                </el-button>
              </template>
            </el-popover>
          </v3-drag-zoom-item>
        </v3-drag-zoom-container>
      </div>
    </el-col>
  </el-row>
</template>

<script setup name="SetPoint" lang="ts">
import { ElTree } from "element-plus";
import { listDeviceType } from "@/api/ibms/common/devOps/deviceConfig/deviceType";
import { Position } from "v3-drag-zoom";
import { DeviceTypeVO } from "@/api/ibms/common/devOps/deviceConfig/deviceType/types";
import { findValue } from "@/utils";
import { PointForm, PointQuery } from "@/api/ibms/common/device/point/types";
import { listParentIdList } from "@/api/ibms/common/device/buildingFloor";
import { BuildingFloorVO } from "@/api/ibms/common/device/buildingFloor/types";
import { listDeviceAll } from "@/api/ibms/common/device/deviceAll";

const route = useRoute();

const pointForm: PointForm = {
  deviceId: "",
  deviceGroup: "",
  deviceType: "",
  floorId: "",
  xaxis: undefined,
  yaxis: undefined,
};

const selectedFloorCadUrl = ref("总平.jpg"); //选中楼层的cad_url
const AreaTreeData = ref<any[]>(); // 楼层树
const deviceTypeData = ref<DeviceTypeVO[]>(); // 设备数据
const iconType = ref(""); //图标类型
const positionName = ref(""); //楼层名
const dragRef = ref();
const isAdd = ref(false);
const isLoading = ref(false);
const treeRef = ref<InstanceType<typeof ElTree>>();
const disabled = ref(false);

const data = reactive<PageData<PointForm, PointQuery>>({
  form: { ...pointForm },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ...pointForm,
  },
  rules: {},
});

const { form, queryParams } = toRefs(data);

//实时获取选中节点楼层对应的CAD地址
const selectedFloorImageUrl = computed(() => {
  // 根据选中节点的cadUrl拼接完整的图片地址
  return new URL(`../../../../assets/images/ibms/floor/${selectedFloorCadUrl.value}`, import.meta.url).href;
});

// 增加点位
const addPoints = () => {
  isAdd.value = true;
  disabled.value = true;
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
  form.value.xaxis = x;
  form.value.yaxis = y;
};

// 获取区域树结构，包含楼栋楼层
const getAreaTreeList = async () => {
  let res = await listParentIdList();

  AreaTreeData.value = res.data;

  let key = findValue(res.data[0].children, "总平", "positionName", "id");
  form.value.floorId = key;
  nextTick(() => {
    treeRef.value?.setCurrentKey(key);
  });
};

// 获取设备具体类型
const getDeviceType = async (id: any) => {
  const res = await listDeviceType({
    pageNum: 1,
    pageSize: 99,
    groupId: id,
  });
  deviceTypeData.value = res.rows;
  form.value.deviceType = res.rows[0].deviceType as string;
  typeChange(form.value.deviceType);
};

//节点点击事件，点击后获取选中节点的cad_url值。
const handleNodeClick = (selectedNode: BuildingFloorVO) => {
  // 在这里处理获取到的 cadUrl
  selectedFloorCadUrl.value = selectedNode.cadUrl;
  // 选择楼层后添加点位
  if (!selectedFloorCadUrl.value) {
    disabled.value = true;
  } else {
    disabled.value = false;
  }

  getAreaInfo(selectedNode);
};

//获取区域楼层信息
const getAreaInfo = (selectedNode: BuildingFloorVO) => {
  if (disabled.value) form.value.floorId = selectedNode.id;
};

// 选择设备类型
const typeChange = (val: any) => {
  iconType.value = findValue(deviceTypeData.value!, val, "deviceType", "icon");
};

// 获取设备列表
const getDeviceList = async () => {
  const deviceTypeId = findValue(deviceTypeData.value!, form.value.deviceType, "deviceType", "id");
  await listDeviceAll({ deviceTypeId, pageNum: 1, pageSize: 10000 });
};

// 保存点位
const handleSavePoint = () => {};

const filterNode = (value: string, data: BuildingFloorVO) => {
  if (!value) return true;
  return data.positionName.includes(value);
};

getAreaTreeList();

watch(positionName, (val) => {
  treeRef.value!.filter(val);
});
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
    if (val) resetMap();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #dcdfe6;
}

.icon {
  width: 30px;
  height: 30px;
}
</style>
