<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="设备id(DevId)" prop="deviceId">
            <el-input
              v-model="queryParams.deviceId"
              placeholder="请输入设备id(DevId)"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="防区号(Sector)" prop="sector">
            <el-input
              v-model="queryParams.sector"
              placeholder="请输入防区号(Sector)"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="位置(Position)" prop="position">
            <el-input
              v-model="queryParams.position"
              placeholder="请输入位置(Position)"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备名称(DevName)" prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入设备名称(DevName)"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="(SubSect)" prop="subSector">
            <el-input
              v-model="queryParams.subSector"
              placeholder="请输入(SubSect)"
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
              v-hasPermi="['intrusionAlarm:intrusionSectorInfo:add']"
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
              v-hasPermi="['intrusionAlarm:intrusionSectorInfo:edit']"
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
              v-hasPermi="['intrusionAlarm:intrusionSectorInfo:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['intrusionAlarm:intrusionSectorInfo:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="intrusionSectorInfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" align="center" prop="id" v-if="true" />
        <el-table-column label="设备id(DevId)" align="center" prop="deviceId" />
        <el-table-column label="防区号(Sector)" align="center" prop="sector" />
        <el-table-column label="位置(Position)" align="center" prop="position" />
        <el-table-column label="设备名称(DevName)" align="center" prop="deviceName" />
        <el-table-column label="(SubSect)" align="center" prop="subSector" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['intrusionAlarm:intrusionSectorInfo:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['intrusionAlarm:intrusionSectorInfo:remove']"
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
    <!-- 添加或修改入侵报警_防区资料对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="intrusionSectorInfoFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备id(DevId)" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备id(DevId)" />
        </el-form-item>
        <el-form-item label="防区号(Sector)" prop="sector">
          <el-input v-model="form.sector" placeholder="请输入防区号(Sector)" />
        </el-form-item>
        <el-form-item label="位置(Position)" prop="position">
          <el-input v-model="form.position" placeholder="请输入位置(Position)" />
        </el-form-item>
        <el-form-item label="设备名称(DevName)" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称(DevName)" />
        </el-form-item>
        <el-form-item label="(SubSect)" prop="subSector">
          <el-input v-model="form.subSector" placeholder="请输入(SubSect)" />
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

<script setup name="IntrusionSectorInfo" lang="ts">
import {
  listIntrusionSectorInfo,
  getIntrusionSectorInfo,
  delIntrusionSectorInfo,
  addIntrusionSectorInfo,
  updateIntrusionSectorInfo,
} from "@/api/ibms/sys-intruderAlarms/intrusionSectorInfo";
import {
  IntrusionSectorInfoVO,
  IntrusionSectorInfoQuery,
  IntrusionSectorInfoForm,
} from "@/api/ibms/sys-intruderAlarms/intrusionSectorInfo/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const intrusionSectorInfoList = ref<IntrusionSectorInfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const intrusionSectorInfoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: IntrusionSectorInfoForm = {
  id: undefined,
  deviceId: undefined,
  sector: undefined,
  position: undefined,
  deviceName: undefined,
  subSector: undefined,
};
const data = reactive<PageData<IntrusionSectorInfoForm, IntrusionSectorInfoQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: undefined,
    sector: undefined,
    position: undefined,
    deviceName: undefined,
    subSector: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "序号不能为空", trigger: "blur" }],
    deviceId: [{ required: true, message: "设备id(DevId)不能为空", trigger: "blur" }],
    sector: [{ required: true, message: "防区号(Sector)不能为空", trigger: "blur" }],
    position: [{ required: true, message: "位置(Position)不能为空", trigger: "blur" }],
    deviceName: [{ required: true, message: "设备名称(DevName)不能为空", trigger: "blur" }],
    subSector: [{ required: true, message: "(SubSect)不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询入侵报警_防区资料列表 */
const getList = async () => {
  loading.value = true;
  const res = await listIntrusionSectorInfo(queryParams.value);
  intrusionSectorInfoList.value = res.rows;
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
  intrusionSectorInfoFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: IntrusionSectorInfoVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加入侵报警_防区资料";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: IntrusionSectorInfoVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getIntrusionSectorInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改入侵报警_防区资料";
};

/** 提交按钮 */
const submitForm = () => {
  intrusionSectorInfoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateIntrusionSectorInfo(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addIntrusionSectorInfo(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: IntrusionSectorInfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除入侵报警_防区资料编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delIntrusionSectorInfo(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "intrusionAlarm/intrusionSectorInfo/export",
    {
      ...queryParams.value,
    },
    `intrusionSectorInfo_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
