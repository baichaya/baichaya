<template>
  <el-dialog v-model="innerVisible" width="800" title="设备列表" append-to-body>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="设备名称">
        <el-input v-model="form.user" placeholder="请输入设备名称" clearable />
      </el-form-item>
      <el-form-item label="设备编号">
        <el-input v-model="form.user" placeholder="请输入设备编号" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="multipleTableRef" :data="tableData" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" />
      <el-table-column label="设备名称" width="120">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column property="name" label="设备编号" width="120" />
      <el-table-column property="address" label="设备状态" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
interface User {
  date: string;
  name: string;
  address: string;
}

const innerVisible = ref(false);
const form = ref({
  user: "",
});

const tableData: User[] = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-08",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-06",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-07",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];

const open = () => {
  innerVisible.value = true;
};

const handleQuery = () => {};

const handleSelectionChange = () => {};

defineExpose({
  open,
});
</script>

<style scoped></style>
