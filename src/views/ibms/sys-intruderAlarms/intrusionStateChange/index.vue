<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="设备id" prop="deviceId">
            <el-input
              v-model="queryParams.deviceId"
              placeholder="请输入设备id"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态变化时间" prop="statusTime">
            <el-input
              v-model="queryParams.statusTime"
              placeholder="请输入状态变化时间"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态改变发生的通道，如果是整机的状态改变，这个参数是空" prop="channel">
            <el-input
              v-model="queryParams.channel"
              placeholder="请输入状态改变发生的通道，如果是整机的状态改变，这个参数是空"
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
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['intrusionAlarm:intrusionStateChange:add']"
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
              v-hasPermi="['intrusionAlarm:intrusionStateChange:edit']"
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
              v-hasPermi="['intrusionAlarm:intrusionStateChange:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['intrusionAlarm:intrusionStateChange:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="intrusionStateChangeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="设备id" align="center" prop="deviceId" />
        <el-table-column label="状态变化时间" align="center" prop="statusTime" />
        <el-table-column label="状态改变发生的通道，如果是整机的状态改变，这个参数是空" align="center" prop="channel" />
        <el-table-column label="状态变化代码" align="center" prop="statusType" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['intrusionAlarm:intrusionStateChange:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['intrusionAlarm:intrusionStateChange:remove']"
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
    <!-- 添加或修改入侵报警-状态变化日志对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="intrusionStateChangeFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备id" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备id" />
        </el-form-item>
        <el-form-item label="状态变化时间" prop="statusTime">
          <el-input v-model="form.statusTime" placeholder="请输入状态变化时间" />
        </el-form-item>
        <el-form-item label="状态改变发生的通道，如果是整机的状态改变，这个参数是空" prop="channel">
          <el-input v-model="form.channel" placeholder="请输入状态改变发生的通道，如果是整机的状态改变，这个参数是空" />
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

<script setup name="IntrusionStateChange" lang="ts">
import {
  listIntrusionStateChange,
  getIntrusionStateChange,
  delIntrusionStateChange,
  addIntrusionStateChange,
  updateIntrusionStateChange,
} from "@/api/ibms/sys-intruderAlarms/intrusionStateChange";
import {
  IntrusionStateChangeVO,
  IntrusionStateChangeQuery,
  IntrusionStateChangeForm,
} from "@/api/ibms/sys-intruderAlarms/intrusionStateChange/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const intrusionStateChangeList = ref<IntrusionStateChangeVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const intrusionStateChangeFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: IntrusionStateChangeForm = {
  id: undefined,
  deviceId: undefined,
  statusTime: undefined,
  channel: undefined,
  statusType: undefined,
};
const data = reactive<PageData<IntrusionStateChangeForm, IntrusionStateChangeQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: undefined,
    statusTime: undefined,
    channel: undefined,
    statusType: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "id不能为空", trigger: "blur" }],
    deviceId: [{ required: true, message: "设备id不能为空", trigger: "blur" }],
    statusTime: [{ required: true, message: "状态变化时间不能为空", trigger: "blur" }],
    channel: [
      {
        required: true,
        message: "状态改变发生的通道，如果是整机的状态改变，这个参数是空不能为空",
        trigger: "blur",
      },
    ],
    statusType: [{ required: true, message: "状态变化代码不能为空", trigger: "change" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询入侵报警-状态变化日志列表 */
const getList = async () => {
  loading.value = true;
  const res = await listIntrusionStateChange(queryParams.value);
  intrusionStateChangeList.value = res.rows;
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
  intrusionStateChangeFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: IntrusionStateChangeVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加入侵报警-状态变化日志";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: IntrusionStateChangeVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getIntrusionStateChange(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改入侵报警-状态变化日志";
};

/** 提交按钮 */
const submitForm = () => {
  intrusionStateChangeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateIntrusionStateChange(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addIntrusionStateChange(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: IntrusionStateChangeVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除入侵报警-状态变化日志编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delIntrusionStateChange(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "intrusionAlarm/intrusionStateChange/export",
    {
      ...queryParams.value,
    },
    `intrusionStateChange_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
