<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="描述" prop="des">
            <el-input
              v-model="queryParams.des"
              placeholder="请输入描述"
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
              v-hasPermi="['intrusionAlarm:intrusionStatusCode:add']"
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
              v-hasPermi="['intrusionAlarm:intrusionStatusCode:edit']"
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
              v-hasPermi="['intrusionAlarm:intrusionStatusCode:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['intrusionAlarm:intrusionStatusCode:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="intrusionStatusCodeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="状态码" align="center" prop="statusCode" v-if="true" />
        <el-table-column label="描述" align="center" prop="des" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['intrusionAlarm:intrusionStatusCode:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['intrusionAlarm:intrusionStatusCode:remove']"
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
    <!-- 添加或修改设备或通道的状态变化码对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="intrusionStatusCodeFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="描述" prop="des">
          <el-input v-model="form.des" placeholder="请输入描述" />
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

<script setup name="IntrusionStatusCode" lang="ts">
import {
  listIntrusionStatusCode,
  getIntrusionStatusCode,
  delIntrusionStatusCode,
  addIntrusionStatusCode,
  updateIntrusionStatusCode,
} from "@/api/ibms/sys-intruderAlarms/intrusionStatusCode";
import {
  IntrusionStatusCodeVO,
  IntrusionStatusCodeQuery,
  IntrusionStatusCodeForm,
} from "@/api/ibms/sys-intruderAlarms/intrusionStatusCode/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const intrusionStatusCodeList = ref<IntrusionStatusCodeVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const intrusionStatusCodeFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: IntrusionStatusCodeForm = {
  statusCode: undefined,
  des: undefined,
};
const data = reactive<PageData<IntrusionStatusCodeForm, IntrusionStatusCodeQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    des: undefined,
    params: {},
  },
  rules: {
    statusCode: [{ required: true, message: "状态码不能为空", trigger: "blur" }],
    des: [{ required: true, message: "描述不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备或通道的状态变化码列表 */
const getList = async () => {
  loading.value = true;
  const res = await listIntrusionStatusCode(queryParams.value);
  intrusionStatusCodeList.value = res.rows;
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
  intrusionStatusCodeFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: IntrusionStatusCodeVO[]) => {
  ids.value = selection.map((item) => item.statusCode);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加设备或通道的状态变化码";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: IntrusionStatusCodeVO) => {
  reset();
  const _statusCode = row?.statusCode || ids.value[0];
  const res = await getIntrusionStatusCode(_statusCode);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改设备或通道的状态变化码";
};

/** 提交按钮 */
const submitForm = () => {
  intrusionStatusCodeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.statusCode) {
        const res = await updateIntrusionStatusCode(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addIntrusionStatusCode(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: IntrusionStatusCodeVO) => {
  const _statusCodes = row?.statusCode || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除设备或通道的状态变化码编号为"' + _statusCodes + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delIntrusionStatusCode(_statusCodes);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "intrusionAlarm/intrusionStatusCode/export",
    {
      ...queryParams.value,
    },
    `intrusionStatusCode_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
