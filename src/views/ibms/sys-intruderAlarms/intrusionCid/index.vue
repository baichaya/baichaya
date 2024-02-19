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
          <el-form-item label="CID码" prop="alarmCode">
            <el-input
              v-model="queryParams.alarmCode"
              placeholder="请输入CID码"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="等级" prop="level">
            <el-input
              v-model="queryParams.level"
              placeholder="请输入等级"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="报警语音" prop="voice">
            <el-input
              v-model="queryParams.voice"
              placeholder="请输入报警语音"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="消息推送" prop="messagePush">
            <el-input
              v-model="queryParams.messagePush"
              placeholder="请输入消息推送"
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
              v-hasPermi="['intrusionAlarm:intrusionCid:add']"
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
              v-hasPermi="['intrusionAlarm:intrusionCid:edit']"
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
              v-hasPermi="['intrusionAlarm:intrusionCid:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['intrusionAlarm:intrusionCid:export']"
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
        :data="intrusionCidList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="CID码" align="center" prop="alarmCode" />
        <el-table-column label="等级" align="center" prop="level" />
        <el-table-column label="报警类型" align="center" prop="alarmType" />
        <el-table-column label="报警内容" align="center" prop="alarmContent" />
        <el-table-column label="报警语音" align="center" prop="voice" />
        <el-table-column label="消息推送" align="center" prop="messagePush" />
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
                v-hasPermi="['intrusionAlarm:intrusionCid:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['intrusionAlarm:intrusionCid:remove']"
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
    <!-- 添加或修改入侵报警_CID码对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form
        ref="intrusionCidFormRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="CID码" prop="alarmCode">
          <el-input v-model="form.alarmCode" placeholder="请输入CID码" />
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input v-model="form.level" placeholder="请输入等级" />
        </el-form-item>
        <el-form-item label="报警内容">
          <editor v-model="form.alarmContent" :min-height="192" />
        </el-form-item>
        <el-form-item label="报警语音" prop="voice">
          <el-input v-model="form.voice" placeholder="请输入报警语音" />
        </el-form-item>
        <el-form-item label="消息推送" prop="messagePush">
          <el-input v-model="form.messagePush" placeholder="请输入消息推送" />
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

<script setup name="IntrusionCid" lang="ts">
import {
  listIntrusionCid,
  getIntrusionCid,
  delIntrusionCid,
  addIntrusionCid,
  updateIntrusionCid,
} from "@/api/ibms/sys-intruderAlarms/intrusionCid";
import {
  IntrusionCidVO,
  IntrusionCidQuery,
  IntrusionCidForm,
} from "@/api/ibms/sys-intruderAlarms/intrusionCid/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const intrusionCidList = ref<IntrusionCidVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const intrusionCidFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: IntrusionCidForm = {
  alarmCode: undefined,
  level: undefined,
  alarmType: undefined,
  alarmContent: undefined,
  voice: undefined,
  messagePush: undefined,
};
const data = reactive<PageData<IntrusionCidForm, IntrusionCidQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    alarmCode: undefined,
    level: undefined,
    alarmType: undefined,
    alarmContent: undefined,
    voice: undefined,
    messagePush: undefined,
    params: {},
  },
  rules: {
    alarmCode: [{ required: true, message: "CID码不能为空", trigger: "blur" }],
    level: [{ required: true, message: "等级不能为空", trigger: "blur" }],
    alarmType: [
      { required: true, message: "报警类型不能为空", trigger: "change" },
    ],
    alarmContent: [
      { required: true, message: "报警内容不能为空", trigger: "blur" },
    ],
    voice: [{ required: true, message: "报警语音不能为空", trigger: "blur" }],
    messagePush: [
      { required: true, message: "消息推送不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询入侵报警_CID码列表 */
const getList = async () => {
  loading.value = true;
  const res = await listIntrusionCid(queryParams.value);
  intrusionCidList.value = res.rows;
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
  intrusionCidFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: IntrusionCidVO[]) => {
  ids.value = selection.map((item) => item.alarmCode);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加入侵报警_CID码";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: IntrusionCidVO) => {
  reset();
  const _alarmCode = row?.alarmCode || ids.value[0];
  const res = await getIntrusionCid(_alarmCode);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改入侵报警_CID码";
};

/** 提交按钮 */
const submitForm = () => {
  intrusionCidFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.alarmCode) {
        const res = await updateIntrusionCid(form.value).finally(
          () => (buttonLoading.value = false)
        );
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addIntrusionCid(form.value).finally(
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
const handleDelete = async (row?: IntrusionCidVO) => {
  const _alarmCodes = row?.alarmCode || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除入侵报警_CID码编号为"' + _alarmCodes + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delIntrusionCid(_alarmCodes);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "intrusionAlarm/intrusionCid/export",
    {
      ...queryParams.value,
    },
    `intrusionCid_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
