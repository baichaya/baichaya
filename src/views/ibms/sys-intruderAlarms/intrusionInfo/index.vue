<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="报警主机的Id号" prop="deviceId">
            <el-input
              v-model="queryParams.deviceId"
              placeholder="请输入报警主机的Id号"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="报警发生时间" prop="alarmTime">
            <el-input
              v-model="queryParams.alarmTime"
              placeholder="请输入报警发生时间"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="报警发生通道" prop="channel">
            <el-input
              v-model="queryParams.channel"
              placeholder="请输入报警发生通道"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="报警发生的子通道，如果子通道为0，这个空缺" prop="subChannel">
            <el-input
              v-model="queryParams.subChannel"
              placeholder="请输入报警发生的子通道，如果子通道为0，这个空缺"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="发生报警事件的CID代码" prop="CID">
            <el-input
              v-model="queryParams.CID"
              placeholder="请输入发生报警事件的CID代码"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="添加时间" prop="addTime">
            <el-date-picker
              clearable
              v-model="queryParams.addTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择添加时间"
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
              v-hasPermi="['intrusionAlarm:intrusionInfo:add']"
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
              v-hasPermi="['intrusionAlarm:intrusionInfo:edit']"
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
              v-hasPermi="['intrusionAlarm:intrusionInfo:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['intrusionAlarm:intrusionInfo:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="intrusionInfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="报警主机的Id号" align="center" prop="deviceId" />
        <el-table-column label="报警发生时间" align="center" prop="alarmTime" />
        <el-table-column label="报警发生通道" align="center" prop="channel" />
        <el-table-column label="报警发生的子通道，如果子通道为0，这个空缺" align="center" prop="subChannel" />
        <el-table-column label="发生报警事件的CID代码" align="center" prop="CID" />
        <el-table-column label="添加时间" align="center" prop="addTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.addTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['intrusionAlarm:intrusionInfo:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['intrusionAlarm:intrusionInfo:remove']"
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
    <!-- 添加或修改入侵报警-报警日志对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="intrusionInfoFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="报警主机的Id号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入报警主机的Id号" />
        </el-form-item>
        <el-form-item label="报警发生时间" prop="alarmTime">
          <el-input v-model="form.alarmTime" placeholder="请输入报警发生时间" />
        </el-form-item>
        <el-form-item label="报警发生通道" prop="channel">
          <el-input v-model="form.channel" placeholder="请输入报警发生通道" />
        </el-form-item>
        <el-form-item label="报警发生的子通道，如果子通道为0，这个空缺" prop="subChannel">
          <el-input v-model="form.subChannel" placeholder="请输入报警发生的子通道，如果子通道为0，这个空缺" />
        </el-form-item>
        <el-form-item label="发生报警事件的CID代码" prop="CID">
          <el-input v-model="form.CID" placeholder="请输入发生报警事件的CID代码" />
        </el-form-item>
        <el-form-item label="添加时间" prop="addTime">
          <el-date-picker
            clearable
            v-model="form.addTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择添加时间"
          />
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

<script setup name="IntrusionInfo" lang="ts">
import {
  listIntrusionInfo,
  getIntrusionInfo,
  delIntrusionInfo,
  addIntrusionInfo,
  updateIntrusionInfo,
} from "@/api/ibms/sys-intruderAlarms/intrusionInfo";
import {
  IntrusionInfoVO,
  IntrusionInfoQuery,
  IntrusionInfoForm,
} from "@/api/ibms/sys-intruderAlarms/intrusionInfo/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const intrusionInfoList = ref<IntrusionInfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const intrusionInfoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: IntrusionInfoForm = {
  id: undefined,
  deviceId: undefined,
  alarmTime: undefined,
  channel: undefined,
  subChannel: undefined,
  CID: undefined,
  addTime: undefined,
};
const data = reactive<PageData<IntrusionInfoForm, IntrusionInfoQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: undefined,
    alarmTime: undefined,
    channel: undefined,
    subChannel: undefined,
    CID: undefined,
    addTime: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "id不能为空", trigger: "blur" }],
    deviceId: [{ required: true, message: "报警主机的Id号不能为空", trigger: "blur" }],
    alarmTime: [{ required: true, message: "报警发生时间不能为空", trigger: "blur" }],
    channel: [{ required: true, message: "报警发生通道不能为空", trigger: "blur" }],
    subChannel: [
      {
        required: true,
        message: "报警发生的子通道，如果子通道为0，这个空缺不能为空",
        trigger: "blur",
      },
    ],
    CID: [
      {
        required: true,
        message: "发生报警事件的CID代码不能为空",
        trigger: "blur",
      },
    ],
    addTime: [{ required: true, message: "添加时间不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询入侵报警-报警日志列表 */
const getList = async () => {
  loading.value = true;
  const res = await listIntrusionInfo(queryParams.value);
  intrusionInfoList.value = res.rows;
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
  intrusionInfoFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: IntrusionInfoVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加入侵报警-报警日志";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: IntrusionInfoVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getIntrusionInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改入侵报警-报警日志";
};

/** 提交按钮 */
const submitForm = () => {
  intrusionInfoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateIntrusionInfo(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addIntrusionInfo(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: IntrusionInfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除入侵报警-报警日志编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delIntrusionInfo(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "intrusionAlarm/intrusionInfo/export",
    {
      ...queryParams.value,
    },
    `intrusionInfo_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
