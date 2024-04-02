<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="分组名" prop="groupName">
            <el-input
              v-model="queryParams.groupName"
              placeholder="请输入分组名"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['deviceConfig:deviceType:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['deviceConfig:deviceType:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              v-hasPermi="['deviceConfig:deviceType:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['deviceConfig:deviceType:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="deviceTypeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="分组名" align="center" prop="groupName" />
        <el-table-column label="设备类型" align="center" prop="deviceType" />
        <!-- <el-table-column label="分组id" align="center" prop="groupId" /> -->

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['deviceConfig:deviceType:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['deviceConfig:deviceType:remove']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改设备分类对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="deviceTypeFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分组" prop="groupId">
          <el-select v-model="form.groupId" filterable placeholder="请选择分组" style="width: 240px">
            <el-option v-for="item in deviceGroupList" :key="item.id" :label="item.groupName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型名" prop="deviceType">
          <el-input v-model="form.deviceType" placeholder="请输入类型名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DeviceType" lang="ts">
import {
  listDeviceType,
  getDeviceType,
  delDeviceType,
  addDeviceType,
  updateDeviceType,
} from "@/api/ibms/common/devOps/deviceConfig/deviceType";
import { DeviceTypeVO, DeviceTypeQuery, DeviceTypeForm } from "@/api/ibms/common/devOps/deviceConfig/deviceType/types";
import {
  listDeviceGroup,
  getDeviceGroup,
  delDeviceGroup,
  addDeviceGroup,
  updateDeviceGroup,
} from "@/api/ibms/common/devOps/deviceConfig/deviceGroup";
import {
  DeviceGroupVO,
  DeviceGroupQuery,
  DeviceGroupForm,
} from "@/api/ibms/common/devOps/deviceConfig/deviceGroup/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const deviceGroupList = ref<DeviceGroupVO[]>([]);
const deviceTypeList = ref<DeviceTypeVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const deviceTypeFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: DeviceTypeForm = {
  id: undefined,
  deviceType: undefined,
  groupId: undefined,
  groupName: undefined,
};
const data = reactive<PageData<DeviceTypeForm, DeviceTypeQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceType: undefined,
    groupId: undefined,
    groupName: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "id不能为空", trigger: "blur" }],
    deviceType: [{ required: true, message: "设备类型不能为空", trigger: "change" }],
    groupId: [{ required: true, message: "分组id不能为空", trigger: "change" }],
    groupName: [{ required: true, message: "分组名不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备分类列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDeviceType(queryParams.value);
  deviceTypeList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 查询设备分组列表 */
const getGroupList = async () => {
  // loading.value = true;
  const res = await listDeviceGroup();
  deviceGroupList.value = res.rows;
  // total.value = res.total;
  // loading.value = false;
  // console.log(deviceGroupList.value);
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  deviceTypeFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: DeviceTypeVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加设备分类";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: DeviceTypeVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getDeviceType(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改设备分类";
};

/** 提交按钮 */
const submitForm = () => {
  deviceTypeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateDeviceType(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addDeviceType(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: DeviceTypeVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除设备分类编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delDeviceType(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "deviceConfig/deviceType/export",
    {
      ...queryParams.value,
    },
    `deviceType_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
  getGroupList();
});
</script>
