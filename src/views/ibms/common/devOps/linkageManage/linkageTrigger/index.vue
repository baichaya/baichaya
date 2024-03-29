<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="json对象数组" prop="actionData">
            <el-input
              v-model="queryParams.actionData"
              placeholder="请输入json对象数组"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="触发类型" prop="triggerType">
            <el-select v-model="queryParams.triggerType" placeholder="请选择触发类型" clearable>
              <el-option v-for="dict in trigger_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              clearable
              v-model="queryParams.startTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择开始时间"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              clearable
              v-model="queryParams.endTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择结束时间"
            />
          </el-form-item>
          <el-form-item label="是否连续触发" prop="isContinuousTrigger">
            <el-select v-model="queryParams.isContinuousTrigger" placeholder="请选择是否连续触发" clearable>
              <el-option
                v-for="dict in is_continuous_trigger"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="连续触发时间间隔" prop="continuousTriggerTimeInterval">
            <el-input
              v-model="queryParams.continuousTriggerTimeInterval"
              placeholder="请输入连续触发时间间隔"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="上次触发时间" prop="lastTriggeredTime">
            <el-date-picker
              clearable
              v-model="queryParams.lastTriggeredTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择上次触发时间"
            />
          </el-form-item>
          <el-form-item label="触发器状态" prop="trggerStatus">
            <el-select v-model="queryParams.trggerStatus" placeholder="请选择触发器状态" clearable>
              <el-option v-for="dict in trgger_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="触发条件" prop="triggerConditions">
            <el-select v-model="queryParams.triggerConditions" placeholder="请选择触发条件" clearable>
              <el-option v-for="dict in trigger_conditions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
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
              v-hasPermi="['linkageManage:linkageTrigger:add']"
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
              v-hasPermi="['linkageManage:linkageTrigger:edit']"
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
              v-hasPermi="['linkageManage:linkageTrigger:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['linkageManage:linkageTrigger:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="linkageTriggerList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="json对象数组" align="center" prop="actionData" />
        <el-table-column label="触发类型" align="center" prop="triggerType">
          <template #default="scope">
            <dict-tag :options="trigger_type" :value="scope.row.triggerType" />
          </template>
        </el-table-column>
        <el-table-column label="星期" align="center" prop="weeks">
          <template #default="scope">
            <dict-tag :options="weeks" :value="scope.row.weeks ? scope.row.weeks.split(',') : []" />
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" prop="startTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.endTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否连续触发" align="center" prop="isContinuousTrigger">
          <template #default="scope">
            <dict-tag :options="is_continuous_trigger" :value="scope.row.isContinuousTrigger" />
          </template>
        </el-table-column>
        <el-table-column label="连续触发时间间隔" align="center" prop="continuousTriggerTimeInterval" />
        <el-table-column label="上次触发时间" align="center" prop="lastTriggeredTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastTriggeredTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="触发器状态" align="center" prop="trggerStatus">
          <template #default="scope">
            <dict-tag :options="trgger_status" :value="scope.row.trggerStatus" />
          </template>
        </el-table-column>
        <el-table-column label="触发条件" align="center" prop="triggerConditions">
          <template #default="scope">
            <dict-tag :options="trigger_conditions" :value="scope.row.triggerConditions" />
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
                v-hasPermi="['linkageManage:linkageTrigger:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['linkageManage:linkageTrigger:remove']"
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
    <!-- 添加或修改触发器对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="linkageTriggerFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="json对象数组" prop="actionData">
          <el-input v-model="form.actionData" placeholder="请输入json对象数组" />
        </el-form-item>
        <el-form-item label="触发类型" prop="triggerType">
          <el-select v-model="form.triggerType" placeholder="请选择触发类型">
            <el-option v-for="dict in trigger_type" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="星期" prop="weeks">
          <el-checkbox-group v-model="form.weeks">
            <el-checkbox v-for="dict in weeks" :key="dict.value" :label="dict.value">
              {{ dict.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            clearable
            v-model="form.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            clearable
            v-model="form.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择结束时间"
          />
        </el-form-item>
        <el-form-item label="是否连续触发" prop="isContinuousTrigger">
          <el-select v-model="form.isContinuousTrigger" placeholder="请选择是否连续触发">
            <el-option
              v-for="dict in is_continuous_trigger"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="连续触发时间间隔" prop="continuousTriggerTimeInterval">
          <el-input v-model="form.continuousTriggerTimeInterval" placeholder="请输入连续触发时间间隔" />
        </el-form-item>
        <el-form-item label="上次触发时间" prop="lastTriggeredTime">
          <el-date-picker
            clearable
            v-model="form.lastTriggeredTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择上次触发时间"
          />
        </el-form-item>
        <el-form-item label="触发器状态" prop="trggerStatus">
          <el-select v-model="form.trggerStatus" placeholder="请选择触发器状态">
            <el-option v-for="dict in trgger_status" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="触发条件" prop="triggerConditions">
          <el-select v-model="form.triggerConditions" placeholder="请选择触发条件">
            <el-option v-for="dict in trigger_conditions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
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

<script setup name="LinkageTrigger" lang="ts">
import {
  listLinkageTrigger,
  getLinkageTrigger,
  delLinkageTrigger,
  addLinkageTrigger,
  updateLinkageTrigger,
} from "@/api/ibms/common/devOps/linkageManage/linkageTrigger";
import {
  LinkageTriggerVO,
  LinkageTriggerQuery,
  LinkageTriggerForm,
} from "@/api/ibms/common/devOps/linkageManage/linkageTrigger/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { trigger_type, trgger_status, is_continuous_trigger, weeks, trigger_conditions } = toRefs<any>(
  proxy?.useDict("trigger_type", "trgger_status", "is_continuous_trigger", "weeks", "trigger_conditions")
);

const linkageTriggerList = ref<LinkageTriggerVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const linkageTriggerFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: LinkageTriggerForm = {
  id: undefined,
  actionData: undefined,
  triggerType: undefined,
  weeks: [],
  startTime: undefined,
  endTime: undefined,
  isContinuousTrigger: undefined,
  continuousTriggerTimeInterval: undefined,
  lastTriggeredTime: undefined,
  trggerStatus: undefined,
  triggerConditions: undefined,
};
const data = reactive<PageData<LinkageTriggerForm, LinkageTriggerQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    actionData: undefined,
    triggerType: undefined,
    weeks: undefined,
    startTime: undefined,
    endTime: undefined,
    isContinuousTrigger: undefined,
    continuousTriggerTimeInterval: undefined,
    lastTriggeredTime: undefined,
    trggerStatus: undefined,
    triggerConditions: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "id不能为空", trigger: "blur" }],
    actionData: [{ required: true, message: "json对象数组不能为空", trigger: "blur" }],
    triggerType: [{ required: true, message: "触发类型不能为空", trigger: "change" }],
    weeks: [{ required: true, message: "星期不能为空", trigger: "blur" }],
    startTime: [{ required: true, message: "开始时间不能为空", trigger: "blur" }],
    endTime: [{ required: true, message: "结束时间不能为空", trigger: "blur" }],
    isContinuousTrigger: [{ required: true, message: "是否连续触发不能为空", trigger: "change" }],
    continuousTriggerTimeInterval: [{ required: true, message: "连续触发时间间隔不能为空", trigger: "blur" }],
    lastTriggeredTime: [{ required: true, message: "上次触发时间不能为空", trigger: "blur" }],
    trggerStatus: [{ required: true, message: "触发器状态不能为空", trigger: "change" }],
    triggerConditions: [{ required: true, message: "触发条件不能为空", trigger: "change" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询触发器列表 */
const getList = async () => {
  loading.value = true;
  const res = await listLinkageTrigger(queryParams.value);
  linkageTriggerList.value = res.rows;
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
  linkageTriggerFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: LinkageTriggerVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加触发器";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: LinkageTriggerVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getLinkageTrigger(_id);
  Object.assign(form.value, res.data);
  form.value.weeks = form.value.weeks.split(",");
  dialog.visible = true;
  dialog.title = "修改触发器";
};

/** 提交按钮 */
const submitForm = () => {
  linkageTriggerFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.weeks = form.value.weeks.join(",");
      if (form.value.id) {
        const res = await updateLinkageTrigger(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addLinkageTrigger(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: LinkageTriggerVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除触发器编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delLinkageTrigger(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "linkageManage/linkageTrigger/export",
    {
      ...queryParams.value,
    },
    `linkageTrigger_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
