<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="ip" prop="stationIp">
            <el-input
              v-model="queryParams.stationIp"
              placeholder="请输入ip"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备名称" prop="stationName">
            <el-input
              v-model="queryParams.stationName"
              placeholder="请输入设备名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备编号" prop="stationNo">
            <el-input
              v-model="queryParams.stationNo"
              placeholder="请输入设备编号"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['ibms:accessDevice:add']"
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
              v-hasPermi="['ibms:accessDevice:edit']"
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
              v-hasPermi="['ibms:accessDevice:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['ibms:accessDevice:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getList"
          />
        </el-row>
      </template>

      <el-table
        v-loading="loading"
        :data="accessDeviceList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="设备id" align="center" prop="deviceSysId" />
        <el-table-column label="端口" align="center" prop="port" />
        <el-table-column label="ip" align="center" prop="stationIp" />
        <el-table-column label="设备名称" align="center" prop="stationName" />
        <el-table-column label="设备编号" align="center" prop="stationNo" />
        <el-table-column label="设备类型" align="center" prop="stationType" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['ibms:accessDevice:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['ibms:accessDevice:remove']"
              />
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
    <!-- 添加或修改门禁设备信息对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form
        ref="accessDeviceFormRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="设备id" prop="deviceSysId">
          <el-input v-model="form.deviceSysId" placeholder="请输入设备id" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口" />
        </el-form-item>
        <el-form-item label="ip" prop="stationIp">
          <el-input v-model="form.stationIp" placeholder="请输入ip" />
        </el-form-item>
        <el-form-item label="设备名称" prop="stationName">
          <el-input v-model="form.stationName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备编号" prop="stationNo">
          <el-input v-model="form.stationNo" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="设备类型" prop="stationType">
          <el-input v-model="form.stationType" placeholder="请输入设备类型" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm"
            >确 定</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="AccessDevice" lang="ts">
import {
  listAccessDevice,
  getAccessDevice,
  delAccessDevice,
  addAccessDevice,
  updateAccessDevice,
} from "@/api/ibms/sys-entranceGuard/accessDevice";
import {
  AccessDeviceVO,
  AccessDeviceQuery,
  AccessDeviceForm,
} from "@/api/ibms/sys-entranceGuard/accessDevice/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const accessDeviceList = ref<AccessDeviceVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const accessDeviceFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: AccessDeviceForm = {
  id: undefined,
  deviceSysId: undefined,
  port: undefined,
  stationIp: undefined,
  stationName: undefined,
  stationNo: undefined,
  stationType: undefined,
};
const data = reactive<PageData<AccessDeviceForm, AccessDeviceQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    stationIp: undefined,
    stationName: undefined,
    stationNo: undefined,
    stationType: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "主键不能为空", trigger: "blur" }],
    deviceSysId: [
      { required: true, message: "设备id不能为空", trigger: "blur" },
    ],
    port: [{ required: true, message: "端口不能为空", trigger: "blur" }],
    stationIp: [{ required: true, message: "ip不能为空", trigger: "blur" }],
    stationName: [
      { required: true, message: "设备名称不能为空", trigger: "blur" },
    ],
    stationNo: [
      { required: true, message: "设备编号不能为空", trigger: "blur" },
    ],
    stationType: [
      { required: true, message: "设备类型不能为空", trigger: "change" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询门禁设备信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAccessDevice(queryParams.value);
  accessDeviceList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  accessDeviceFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: AccessDeviceVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加门禁设备信息";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: AccessDeviceVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getAccessDevice(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改门禁设备信息";
};

/** 提交按钮 */
const submitForm = () => {
  accessDeviceFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateAccessDevice(form.value).finally(
          () => (buttonLoading.value = false)
        );
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addAccessDevice(form.value).finally(
          () => (buttonLoading.value = false)
        );
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: AccessDeviceVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除门禁设备信息编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delAccessDevice(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "ibms/accessDevice/export",
    {
      ...queryParams.value,
    },
    `accessDevice_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
