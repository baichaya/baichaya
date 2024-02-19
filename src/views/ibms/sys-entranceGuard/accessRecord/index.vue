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
          <el-form-item label="门区名称" prop="areaName">
            <el-input
              v-model="queryParams.areaName"
              placeholder="请输入门区名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="房门名称" prop="doorName">
            <el-input
              v-model="queryParams.doorName"
              placeholder="请输入房门名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="刷卡人员姓名" prop="employeeName">
            <el-input
              v-model="queryParams.employeeName"
              placeholder="请输入刷卡人员姓名"
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
          <el-form-item label="卡类型" prop="typedescribe">
            <el-input
              v-model="queryParams.typedescribe"
              placeholder="请输入卡类型"
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
              v-hasPermi="['ibms:accessRecord:add']"
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
              v-hasPermi="['ibms:accessRecord:edit']"
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
              v-hasPermi="['ibms:accessRecord:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['ibms:accessRecord:export']"
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
        :data="accessRecordList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="门区名称" align="center" prop="areaName" />
        <!--        <el-table-column label="刷卡类型" align="center" prop="cardType" />-->
        <el-table-column label="房门名称" align="center" prop="doorName" />
        <!--        <el-table-column label="门状态" align="center" prop="doorStatus" />-->
        <el-table-column label="证件号" align="center" prop="employeeId" />
        <el-table-column label="姓名" align="center" prop="employeeName" />
        <el-table-column label="编号" align="center" prop="employeeSysNo" />
        <el-table-column
          label="刷卡时间"
          align="center"
          prop="eventDate"
          width="180"
        >
          <template #default="scope">
            <span>{{
              parseTime(scope.row.eventDate, "{y}-{m}-{d} {H}:{m}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在部门" align="center" prop="name" />
        <el-table-column label="刷卡卡号" align="center" prop="serial" />
        <el-table-column label="设备名称" align="center" prop="stationName" />
        <el-table-column label="卡类型" align="center" prop="typedescribe" />
        <el-table-column label="typename" align="center" prop="typename" />
        <el-table-column label="体温" align="center" prop="temperature" />
        <el-table-column label="是否带口罩" align="center" prop="mask" />
        <el-table-column label="人员图片" align="center" prop="employeePhoto" />
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
                v-hasPermi="['ibms:accessRecord:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['ibms:accessRecord:remove']"
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
    <!-- 添加或修改门禁记录对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form
        ref="accessRecordFormRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="门区名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入门区名称" />
        </el-form-item>
        <el-form-item label="设备id" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备id" />
        </el-form-item>
        <el-form-item label="门id" prop="doorId">
          <el-input v-model="form.doorId" placeholder="请输入门id" />
        </el-form-item>
        <el-form-item label="房门名称" prop="doorName">
          <el-input v-model="form.doorName" placeholder="请输入房门名称" />
        </el-form-item>
        <el-form-item label="刷卡人员证件号" prop="employeeId">
          <el-input
            v-model="form.employeeId"
            placeholder="请输入刷卡人员证件号"
          />
        </el-form-item>
        <el-form-item label="刷卡人员姓名" prop="employeeName">
          <el-input
            v-model="form.employeeName"
            placeholder="请输入刷卡人员姓名"
          />
        </el-form-item>
        <el-form-item label="刷卡人员编号" prop="employeeSysNo">
          <el-input
            v-model="form.employeeSysNo"
            placeholder="请输入刷卡人员编号"
          />
        </el-form-item>
        <el-form-item label="刷卡时间" prop="eventDate">
          <el-date-picker
            clearable
            v-model="form.eventDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择刷卡时间"
          />
        </el-form-item>
        <el-form-item label="刷卡人员部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入刷卡人员部门名称" />
        </el-form-item>
        <el-form-item label="刷卡卡号" prop="serial">
          <el-input v-model="form.serial" placeholder="请输入刷卡卡号" />
        </el-form-item>
        <el-form-item label="设备名称" prop="stationName">
          <el-input v-model="form.stationName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="卡类型" prop="typedescribe">
          <el-input v-model="form.typedescribe" placeholder="请输入卡类型" />
        </el-form-item>
        <el-form-item label="" prop="typename">
          <el-input v-model="form.typename" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="体温" prop="temperature">
          <el-input v-model="form.temperature" placeholder="请输入体温" />
        </el-form-item>
        <el-form-item label="1带口罩，2未戴，0未知" prop="mask">
          <el-input
            v-model="form.mask"
            placeholder="请输入1带口罩，2未戴，0未知"
          />
        </el-form-item>
        <el-form-item label="人员图片" prop="employeePhoto">
          <el-input v-model="form.employeePhoto" placeholder="请输入人员图片" />
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

<script setup name="AccessRecord" lang="ts">
import {
  listAccessRecord,
  getAccessRecord,
  delAccessRecord,
  addAccessRecord,
  updateAccessRecord,
} from "@/api/ibms/sys-entranceGuard/accessRecord";
import {
  AccessRecordVO,
  AccessRecordQuery,
  AccessRecordForm,
} from "@/api/ibms/sys-entranceGuard/accessRecord/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const accessRecordList = ref<AccessRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const accessRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: AccessRecordForm = {
  id: undefined,
  areaName: undefined,
  cardType: undefined,
  deviceId: undefined,
  doorId: undefined,
  doorName: undefined,
  doorStatus: undefined,
  employeeId: undefined,
  employeeName: undefined,
  employeeSysNo: undefined,
  eventDate: undefined,
  name: undefined,
  serial: undefined,
  stationName: undefined,
  typedescribe: undefined,
  typename: undefined,
  temperature: undefined,
  mask: undefined,
  employeePhoto: undefined,
};
const data = reactive<PageData<AccessRecordForm, AccessRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    areaName: undefined,
    doorName: undefined,
    employeeName: undefined,
    stationName: undefined,
    typedescribe: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "主键不能为空", trigger: "blur" }],
    areaName: [
      { required: true, message: "门区名称不能为空", trigger: "blur" },
    ],
    doorName: [
      { required: true, message: "房门名称不能为空", trigger: "blur" },
    ],
    employeeId: [
      { required: true, message: "刷卡人员证件号不能为空", trigger: "blur" },
    ],
    employeeName: [
      { required: true, message: "刷卡人员姓名不能为空", trigger: "blur" },
    ],
    employeeSysNo: [
      { required: true, message: "刷卡人员编号不能为空", trigger: "blur" },
    ],
    eventDate: [
      { required: true, message: "刷卡时间不能为空", trigger: "blur" },
    ],
    name: [
      { required: true, message: "刷卡人员部门名称不能为空", trigger: "blur" },
    ],
    serial: [{ required: true, message: "刷卡卡号不能为空", trigger: "blur" }],
    stationName: [
      { required: true, message: "设备名称不能为空", trigger: "blur" },
    ],
    typedescribe: [
      { required: true, message: "卡类型不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询门禁记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAccessRecord(queryParams.value);
  accessRecordList.value = res.rows;
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
  accessRecordFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: AccessRecordVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加门禁记录";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: AccessRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getAccessRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改门禁记录";
};

/** 提交按钮 */
const submitForm = () => {
  accessRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateAccessRecord(form.value).finally(
          () => (buttonLoading.value = false)
        );
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addAccessRecord(form.value).finally(
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
const handleDelete = async (row?: AccessRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除门禁记录编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delAccessRecord(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "ibms/accessRecord/export",
    {
      ...queryParams.value,
    },
    `accessRecord_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
