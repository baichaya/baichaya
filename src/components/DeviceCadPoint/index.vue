<template>
  <el-row class="p-2" :gutter="20">
    <el-col :span="4">
      <!-- 楼栋树 -->
      <div class="floor">
        <el-card shadow="hover">
          <el-input v-model="treeViewNameTemp" placeholder="请输入楼栋名称" prefix-icon="Search" clearable />
          <el-tree
            class="mt-2"
            ref="treeRef"
            node-key="id"
            :data="AreaTreeData"
            :props="{ label: 'treeViewNameTemp', children: 'children' }"
            :default-expanded-keys="[-99]"
            :expand-on-click-node="true"
            :filter-node-method="filterNode"
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-card>
      </div>
    </el-col>
    <el-col :span="20">
      <div class="card">
        <!-- 图标 -->
        <div class="options">
          <div>
            <el-radio-group v-model="form.deviceId" class="ml-4" size="small" @change="typeChange" :disabled="disabled">
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
          </div>
        </div>

        <el-empty v-if="!selectedFloorCadUrl" class="cad" description="请选择楼层" />

        <!-- cad图纸 -->
        <v3-drag-zoom-container
          v-else
          :loading="isLoading"
          class="cad"
          ref="dragRef"
          align="contain"
          :min-zoom="0.8"
          :max-zoom="8"
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
    </el-col>
  </el-row>
</template>

<script setup name="SetPoint" lang="ts">
import { ElTree } from "element-plus";
//引用区域表-楼层树结构
import { getAreaTree } from "@/api/ibms/common/device/area";
//引用设备类型表
import { Position } from "v3-drag-zoom";
import { DeviceTypeVO } from "@/api/ibms/common/devOps/deviceConfig/deviceType/types";
import { findValue } from "@/utils";
import { AreaBuildingFloorVo } from "@/api/ibms/common/device/area/types";
import { PointForm, PointQuery } from "@/api/ibms/common/device/point/types";
import { listDeviceType } from "@/api/ibms/common/devOps/deviceConfig/deviceType";
import { DeviceGroupId } from "@/enums/IBMSEnum";

interface Props {
  isPark?: boolean; //停车场
}

const props = withDefaults(defineProps<Props>(), {
  isPark: false,
});

const pointForm: PointForm = {
  deviceGroup: "",
  deviceType: "",
  floorId: undefined,
  xaxis: undefined,
  yaxis: undefined,
};

const selectedFloorCadUrl = ref("zp"); //选中楼层的cad_url
const AreaTreeData = ref<any[]>(); // 楼层树
const deviceTypeData = ref<DeviceTypeVO[]>(); // 设备数据
const iconType = ref(""); //图标类型
const dragRef = ref();
const isAdd = ref(false);
const isLoading = ref(false);
const treeViewNameTemp = ref(""); //楼层名
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
  return new URL(`../../assets/images/ibms/floor/${selectedFloorCadUrl.value}.jpg`, import.meta.url).href;
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
  form.value.xaxis = x;
  form.value.yaxis = y;
};

// 获取区域树结构，包含楼栋楼层
const getAreaTreeList = async () => {
  let res = (await getAreaTree()).data;
  AreaTreeData.value = res[0].children.map((e: any) => {
    if (e.treeViewNameTemp.includes("栋")) e.cadUrl = null;
    return e;
  });
  let key = res.at(0)?.children[0]?.children[1].id;
  nextTick(() => {
    treeRef.value?.setCurrentKey(key);
    // console.log(treeRef.value?.getCurrentNode());
  });
};

// 获取设备具体类型
const getDeviceType = async () => {
  const res = await listDeviceType({
    pageNum: 1,
    pageSize: 99,
    groupId: DeviceGroupId.MJ,
  });
  deviceTypeData.value = res.rows;
  form.value.deviceId = res.rows[0].id as string;
  typeChange(form.value.deviceId);
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
  // 选择楼层后添加点位
  if (!selectedFloorCadUrl.value) {
    disabled.value = true;
  } else {
    disabled.value = false;
  }

  getAreaInfo(selectedNode);
};

//获取区域楼层信息
const getAreaInfo = (selectedNode: AreaBuildingFloorVo) => {
  // console.log(selectedNode);
};

// 选择设备类型
const typeChange = (val: any) => {
  iconType.value = findValue(deviceTypeData.value!, val, "id", "icon");
  form.value.deviceType = findValue(deviceTypeData.value!, val, "id", "deviceType");
};

// 保存点位
const handleSavePoint = () => {};

const filterNode = (value: string, data: AreaBuildingFloorVo) => {
  if (!value) return true;
  return data.treeViewNameTemp.includes(value);
};

getAreaTreeList();

getDeviceType();

watch(treeViewNameTemp, (val) => {
  treeRef.value!.filter(val);
});

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
