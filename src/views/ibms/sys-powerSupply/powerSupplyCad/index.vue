<template>
  <div>
    <DeviceCadPoint v-bind="{ ...data }">
      <template #option>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="区域">
            <el-select
              v-model="formInline.region"
              placeholder="请选择区域"
              clearable
              filterable
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
              filterable
            >
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </DeviceCadPoint>
  </div>
</template>

<script setup name="PowerSupplyCad" lang="ts">
import { IconTypeEnum } from "@/enums/IBMSEnum";

const formInline = reactive({
  region: "",
});

const data = reactive<CadData>({
  infoList: [
    {
      id: 1,
      label: "设备数量",
      value: 16,
      color: "#409EFF",
    },
    {
      id: 1,
      label: "在线设备",
      value: 16,
      color: "#67C23A",
    },
    {
      id: 1,
      label: "离线设备",
      value: 16,
      color: "#909399",
    },
    {
      id: 1,
      label: "故障设备",
      value: 16,
      color: "#F56C6C",
    },
  ],
  icon: IconTypeEnum.M,
  title: "变配电",
});
</script>

<style scoped></style>
