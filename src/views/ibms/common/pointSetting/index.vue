<template>
  <div class="h-100% w-100% p-2">
    <div class="buttons">
      <span class="title">设备点位</span>
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="区域">
            <el-select
              v-model="formInline.user"
              placeholder="请选择区域"
              clearable
            >
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="楼栋">
            <el-select
              v-model="formInline.region"
              placeholder="请选择楼栋"
              clearable
            >
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select
              v-model="formInline.region"
              placeholder="请选择设备类型"
              clearable
            >
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="消防设备类型">
            <el-select
              v-model="formInline.region"
              placeholder="请选择消防设备类型"
              clearable
            >
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addPoint" :disabled="!isAdd"
              >新增点位</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="save" :disabled="isAdd"
              >保存点位</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="box">
      <div class="cad" ref="cadRef">
        <Vue3DraggableResizable
          v-if="iconShow"
          style="border: 0; cursor: pointer"
          :draggable="true"
          :resizable="false"
          :parent="true"
          @drag-end="dragEndHandle"
        >
          <svg-icon :icon-class="IconTypeEnum.M" size="30" color="#409EFF" />
        </Vue3DraggableResizable>

        <div class="icon" :style="{ left: 680 + 'px', top: 290 + 'px' }">
          <svg-icon :icon-class="IconTypeEnum.M" size="30" color="#409EFF" />
        </div>

        <el-image fit="fill" :src="getFloorImg" :preview-teleported="true" />
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

    <AddPoint ref="addPointRef" @reset="reset" />
  </div>
</template>

<script setup name="PointSetting" lang="ts">
import AddPoint from "./components/addPoint.vue";
import { IconTypeEnum } from "@/enums/IBMSEnum";

interface Position {
  x: number;
  y: number;
}

const getFloorImg = computed(() => `/src/assets/images/${floorName.value}.png`); // 楼层平面图

const floorList = ref<any[]>([]); // 楼层列表
const floorName = ref("one"); // 楼层
const isAdd = ref(true);
const addPointRef = ref<InstanceType<typeof AddPoint>>();
const cadRef = ref<HTMLElement>();
// 设备图标
const iconShow = ref(false);

const formInline = reactive({
  user: "",
  region: "",
  date: "",
});

const dragEndHandle = (position: Position) => {
  console.log(position);
};

// 新增
const addPoint = () => {
  isAdd.value = false;
  addPointRef.value?.open();
};

// 保存
const save = () => {
  reset();
};

const getData = () => {
  iconShow.value = true;
};

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

//重置
const reset = () => {
  isAdd.value = true;
  iconShow.value = false;
};

onMounted(() => {
  initFloorList();
});
</script>

<style lang="scss" scoped>
.buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  height: 130px;
  .title {
    font-size: 28px;
    font-weight: 600;
  }
}
.box {
  display: flex;
  width: 100%;
}
.dra {
  z-index: 100;
}
.cad {
  width: 1600px;
  min-height: 800px;
  z-index: 1;
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
    height: 280px;
    overflow: auto;
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
