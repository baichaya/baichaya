<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="设备id" prop="deciveId">
            <el-input
              v-model="queryParams.deciveId"
              placeholder="请输入设备id"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备分组" prop="deviceGroup">
            <el-select v-model="queryParams.deviceGroup" placeholder="请选择设备分组" clearable>
              <el-option v-for="dict in device_group" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="报警类型" prop="alertType">
            <el-select v-model="queryParams.alertType" placeholder="请选择报警类型" clearable>
              <el-option v-for="dict in device_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="报警信息" prop="alertInformation">
            <el-input v-model="queryParams.alertInformation" placeholder="请输入报警信息" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="报警时间" prop="alertTime">
            <el-date-picker clearable
              v-model="queryParams.alertTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择报警时间"
            />
          </el-form-item>-->
          <el-form-item label="处理状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择处理状态" clearable>
              <el-option v-for="dict in device_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="处理时间" prop="handleTime">
            <el-date-picker clearable
              v-model="queryParams.handleTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择处理时间"
            />
          </el-form-item>-->
          <!--          <el-form-item label="处理人" prop="handleBy">
            <el-input v-model="queryParams.handleBy" placeholder="请输入处理人" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>-->
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ibms:alertRecord:add']"
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
              v-hasPermi="['ibms:alertRecord:edit']"
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
              v-hasPermi="['ibms:alertRecord:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['ibms:alertRecord:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="alertRecordList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="设备id" align="center" prop="deciveId" />
        <el-table-column label="设备分组" align="center" prop="deviceGroup">
          <template #default="scope">
            <dict-tag :options="device_group" :value="scope.row.deviceGroup" />
          </template>
        </el-table-column>
        <el-table-column label="报警类型" align="center" prop="alertType">
          <template #default="scope">
            <dict-tag :options="device_type" :value="scope.row.alertType" />
          </template>
        </el-table-column>
        <el-table-column label="报警信息" align="center" prop="alertInformation" />
        <el-table-column label="报警时间" align="center" prop="alertTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.alertTime, "{y}-{m}-{d} {h}:{m}:{s}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="alarm_state" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="处理时间" align="center" prop="handleTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.handleTime, "{y}-{m}-{d} {h}:{m}:{s}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理人" align="center" prop="handleBy" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['ibms:alertRecord:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['ibms:alertRecord:remove']"
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
    <!-- 添加或修改告警记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="alertRecordFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备id" prop="deciveId">
          <el-input v-model="form.deciveId" placeholder="请输入设备id" />
        </el-form-item>
        <el-form-item label="设备分组" prop="deviceGroup">
          <el-select v-model="form.deviceGroup" placeholder="请选择设备分组">
            <el-option v-for="dict in device_group" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="报警类型" prop="alertType">
          <el-select v-model="form.alertType" placeholder="请选择报警类型">
            <el-option v-for="dict in device_type" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="报警信息" prop="alertInformation">
          <el-input v-model="form.alertInformation" placeholder="请输入报警信息" />
        </el-form-item>
        <el-form-item label="报警时间" prop="alertTime">
          <el-date-picker
            clearable
            v-model="form.alertTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择报警时间"
          />
        </el-form-item>
        <!--        <el-form-item label="处理状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择处理状态">
            <el-option
                v-for="dict in alarm_state"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <!--        <el-form-item label="处理时间" prop="handleTime">
          <el-date-picker clearable
            v-model="form.handleTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择处理时间">
          </el-date-picker>
        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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

<script setup name="AlertRecord" lang="ts">
import {
  listAlertRecord,
  getAlertRecord,
  delAlertRecord,
  addAlertRecord,
  updateAlertRecord,
} from "@/api/ibms/common/alarm/alertRecord/index";
import { AlertRecordVO, AlertRecordQuery, AlertRecordForm } from "@/api/ibms/common/alarm/alertRecord/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { device_group, device_type, alarm_state } = toRefs<any>(
  proxy?.useDict("device_group", "device_type", "alarm_state")
);

const alertRecordList = ref<AlertRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const alertRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: AlertRecordForm = {
  id: undefined,
  deciveId: undefined,
  deviceGroup: undefined,
  alertType: undefined,
  alertInformation: undefined,
  alertTime: undefined,
  status: undefined,
  handleTime: undefined,
  handleBy: undefined,
  remark: undefined,
};
const data = reactive<PageData<AlertRecordForm, AlertRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deciveId: undefined,
    deviceGroup: undefined,
    alertType: undefined,
    alertInformation: undefined,
    alertTime: undefined,
    status: undefined,
    handleTime: undefined,
    handleBy: undefined,
    params: {},
  },
  rules: {
    /*deciveId: [
      { required: true, message: "设备id不能为空", trigger: "blur" }
    ],*/
    deviceGroup: [{ required: true, message: "设备分组不能为空", trigger: "change" }],
    alertType: [{ required: true, message: "报警类型不能为空", trigger: "change" }],
    alertInformation: [{ required: true, message: "报警信息不能为空", trigger: "blur" }],
    alertTime: [{ required: true, message: "报警时间不能为空", trigger: "blur" }],
    /* status: [
      { required: true, message: "处理状态不能为空", trigger: "change" }
    ],*/
    /* handleTime: [
      { required: true, message: "处理时间不能为空", trigger: "blur" }
    ],*/
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询告警记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAlertRecord(queryParams.value);
  alertRecordList.value = res.rows;
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
  alertRecordFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: AlertRecordVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加告警记录";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: AlertRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getAlertRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改告警记录";
};

/** 提交按钮 */
const submitForm = () => {
  alertRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateAlertRecord(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addAlertRecord(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: AlertRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除告警记录编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delAlertRecord(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "ibms/alertRecord/export",
    {
      ...queryParams.value,
    },
    `alertRecord_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
