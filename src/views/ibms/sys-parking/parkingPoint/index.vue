<template>
  <div>
    <DeviceCadPoint v-bind="{ ...data }" :isParking="true">
      <template #option>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="区域">
            <el-select v-model="formInline.region" placeholder="请选择区域" clearable filterable>
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="formInline.region" placeholder="请选择设备类型" clearable filterable>
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <template #info>
        <div class="h-100px">111</div>
      </template>

      <template #right>
        <el-space direction="vertical" :size="20">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>进出场照片</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-image style="width: 200px; height: 170px" :src="cardData.url" fit="fill" />
              </el-col>
              <el-col :span="12">
                <el-form label-width="100px" :model="formLabelAlign">
                  <el-form-item label="车牌号" />
                  <el-form-item label="出场口" />
                  <el-form-item label="出场时间" />
                </el-form>
              </el-col>
            </el-row>
          </el-card>

          <el-card class="box-card">
            <el-table :data="cardData.tableData" style="width: 100%" height="250">
              <el-table-column prop="address" label="车牌号" />
              <el-table-column prop="info" label="事项" />
              <el-table-column prop="name" label="进场时间" />
              <el-table-column prop="date" label="出场时间" />
            </el-table>
          </el-card>

          <el-card class="box-card">
            <div></div>
          </el-card>
        </el-space>
      </template>
    </DeviceCadPoint>
  </div>
</template>

<script setup name="PowerSupplyCad" lang="ts">
const formInline = reactive({
  region: "",
});
const formLabelAlign = reactive({
  name: "",
  region: "",
  type: "",
});
/** 停车场信息 */
const cardData = reactive({
  url: "",
  tableData: [
    {
      date: "2016-05-03",
      name: "2016-05-04",
      info: "11",
      address: "11",
    },
    {
      date: "2016-05-02",
      name: "2016-05-04",
      info: "111",
      address: "11",
    },
    {
      date: "2016-05-04",
      name: "2016-05-04",
      info: "111",
      address: "111",
    },
    {
      date: "2016-05-01",
      info: "111",
      name: "2016-05-04",
      address: "111",
    },
  ],
});
const data = reactive<CadData>({
  infoList: [],
  icon: "",
  title: "立方停车",
});
</script>

<style lang="scss" scoped>
.el-space {
  width: calc(100% - 1200px);
  height: 100%;
  .el-card {
    width: 480px;
    height: 250px;
  }
}
</style>
