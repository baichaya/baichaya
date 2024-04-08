<template>
  <div class="p-2">
    <el-row :gutter="20" justify="center" class="row" align="middle">
      <el-col v-for="subSysList in deviceGroupList" :key="subSysList.id" :span="5" class="col">
        <el-card class="hvr-box-shadow-inset m10px" @click="toPointCad(subSysList)">
          <div class="text_container">
            <div class="text_content">
              {{ subSysList.groupName }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script name="PointSetting" setup lang="ts">
import { listDeviceGroup } from "@/api/ibms/common/devOps/deviceConfig/deviceGroup"; //从api中导入获取设备分组列表方法
import { DeviceGroupVO } from "@/api/ibms/common/devOps/deviceConfig/deviceGroup/types";

const router = useRouter();

/** ============================================== 定义变量 ==============================================*/
const deviceGroupList = ref<DeviceGroupVO[]>();

/** ============================================== 定义动态属性  ==============================================*/

/** ============================================== 定义函数及方法 ==============================================*/

//默认查询当前项目存在的子系统列表
const queryParams = reactive({
  pageNum: 1,
  pageSize: 99,
  isNowProject: "Y",
});

//通过设备分组获取当前项目内包含的子系统列表
const getProjectSubSys = async () => {
  const res = await listDeviceGroup(queryParams);
  deviceGroupList.value = res.rows;
};

// 跳转到点位配置页面
const toPointCad = (params: any) => {
  router.push({ name: "SetPoint", query: params });
};

/** ============================================== 方法调用  ==============================================*/
//钩子函数,它会在组件挂载完成后被调用
getProjectSubSys();
</script>
<style lang="scss" scoped>
.row {
  display: flex;
  height: 100vh; /* 设置行的高度为视口高度，使得 el-card 垂直居中 */
}

/* ============================= 美化el-card 样式 ============================= */

/* Box Shadow Inset */
.hvr-box-shadow-inset {
  cursor: pointer;
  background-color: #e1e1e1;
  border-radius: 10px;
  box-shadow: 0 0 1px rgb(0 0 0 / 0%);
  box-shadow: inset 0 0 0 rgb(0 0 0 / 60%), 0 0 1px rgb(0 0 0 / 0%);
  transition-duration: 0.3s;
  transition-property: box-shadow;
  transform: perspective(1px) translateZ(0);

  /* Hack to improve aliasing on mobile/tablet devices */
}

.hvr-box-shadow-inset:hover,
.hvr-box-shadow-inset:focus,
.hvr-box-shadow-inset:active {
  box-shadow: inset 2px 2px 2px rgb(0 0 0 / 60%), 0 0 1px rgb(0 0 0 / 0%);

  /* Hack to improve aliasing on mobile/tablet devices */
}

.text_container {
  display: flex;

  /* 垂直居中 */
  align-items: center;
  justify-content: center; /* 水平居中 */
  aspect-ratio: 1 / 1; /* 设置宽高比为1:1，可根据需要调整比例 */
}

.text_content {
  font-size: 25px;
  text-align: center; /* 水平居中 */
  letter-spacing: 5px; /* 字与字之间的间距，可根据需要调整 */
}
</style>
