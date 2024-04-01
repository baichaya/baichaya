<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <!--          <el-form-item label="车场id" prop="parkId">
            <el-input v-model="queryParams.parkId" placeholder="请输入车场id" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>-->
          <el-form-item label="通道编号" prop="channelId">
            <el-input
              v-model="queryParams.channelId"
              placeholder="请输入通道编号"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="通道名称" prop="channelName">
            <el-input
              v-model="queryParams.channelName"
              placeholder="请输入通道名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="车牌号码" prop="carCode">
            <el-input
              v-model="queryParams.carCode"
              placeholder="请输入车牌号码"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <!--          <el-form-item label="车辆本次进场出场标识" prop="GUID">
            <el-input v-model="queryParams.GUID" placeholder="请输入车辆本次进场出场标识" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>-->
          <!--          <el-form-item label="进出标志" prop="inOrOut">
            <el-input v-model="queryParams.inOrOut" placeholder="请输入进出标志" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>-->
          <el-form-item label="进场时间" prop="inTime">
            <el-date-picker
              clearable
              v-model="queryParams.inTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择进场时间"
            />
          </el-form-item>
          <el-form-item label="出场时间" prop="outTime">
            <el-date-picker
              clearable
              v-model="queryParams.outTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择出场时间"
            />
          </el-form-item>
          <!--          <el-form-item label="图片路径地址" prop="imagePath">
            <el-input v-model="queryParams.imagePath" placeholder="请输入图片路径地址" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ibms:carInOutRecord:add']"
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
              v-hasPermi="['ibms:carInOutRecord:edit']"
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
              v-hasPermi="['ibms:carInOutRecord:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['ibms:carInOutRecord:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="carInOutRecordList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="车场id" align="center" prop="parkId" />
        <el-table-column label="通道编号" align="center" prop="channelId" />
        <el-table-column label="通道名称" align="center" prop="channelName" />
        <el-table-column label="车牌号码" align="center" prop="carCode" />
        <el-table-column label="进出场标识" align="center" prop="GUID" />
        <el-table-column label="进出标志" align="center" prop="inOrOut" />
        <el-table-column label="进场时间" align="center" prop="inTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.inTime, "{y}-{m}-{d} {h}:{m}:{s}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出场时间" align="center" prop="outTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.outTime, "{y}-{m}-{d} {h}:{m}:{s}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片路径地址" align="center" prop="imagePath" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['ibms:carInOutRecord:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['ibms:carInOutRecord:remove']"
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
    <!-- 添加或修改停车进出记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="carInOutRecordFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车场id" prop="parkId">
          <el-input v-model="form.parkId" placeholder="请输入车场id" />
        </el-form-item>
        <el-form-item label="通道编号" prop="channelId">
          <el-input v-model="form.channelId" placeholder="请输入通道编号" />
        </el-form-item>
        <el-form-item label="通道名称" prop="channelName">
          <el-input v-model="form.channelName" placeholder="请输入通道名称" />
        </el-form-item>
        <el-form-item label="车牌号码" prop="carCode">
          <el-input v-model="form.carCode" placeholder="请输入车牌号码" />
        </el-form-item>
        <el-form-item label="进出场标识" prop="GUID">
          <el-input v-model="form.GUID" placeholder="进出场标识" />
        </el-form-item>
        <el-form-item label="进出标志" prop="inOrOut">
          <el-input v-model="form.inOrOut" placeholder="请输入进出标志" />
        </el-form-item>
        <el-form-item label="进场时间" prop="inTime">
          <el-date-picker
            clearable
            v-model="form.inTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择进场时间"
          />
        </el-form-item>
        <el-form-item label="出场时间" prop="outTime">
          <el-date-picker
            clearable
            v-model="form.outTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择出场时间"
          />
        </el-form-item>
        <el-form-item label="图片路径地址" prop="imagePath">
          <el-input v-model="form.imagePath" placeholder="请输入图片路径地址" />
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

<script setup name="CarInOutRecord" lang="ts">
import {
  listCarInOutRecord,
  getCarInOutRecord,
  delCarInOutRecord,
  addCarInOutRecord,
  updateCarInOutRecord,
} from "@/api/ibms/sys-parking/carInOutRecord";
import { CarInOutRecordVO, CarInOutRecordQuery, CarInOutRecordForm } from "@/api/ibms/sys-parking/carInOutRecord/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const carInOutRecordList = ref<CarInOutRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const carInOutRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: CarInOutRecordForm = {
  id: undefined,
  parkId: undefined,
  channelId: undefined,
  channelName: undefined,
  carCode: undefined,
  GUID: undefined,
  inOrOut: undefined,
  inTime: undefined,
  outTime: undefined,
  imagePath: undefined,
};
const data = reactive<PageData<CarInOutRecordForm, CarInOutRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    parkId: undefined,
    channelId: undefined,
    channelName: undefined,
    carCode: undefined,
    GUID: undefined,
    inOrOut: undefined,
    inTime: undefined,
    outTime: undefined,
    imagePath: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "主键不能为空", trigger: "blur" }],
    parkId: [{ required: true, message: "车场id不能为空", trigger: "blur" }],
    channelId: [{ required: true, message: "通道编号不能为空", trigger: "blur" }],
    channelName: [{ required: true, message: "通道名称不能为空", trigger: "blur" }],
    carCode: [{ required: true, message: "车牌号码不能为空", trigger: "blur" }],
    /* GUID: [
      { required: true, message: "车辆本次进场出场标识不能为空", trigger: "blur" }
    ],*/
    inOrOut: [{ required: true, message: "进出标志不能为空", trigger: "blur" }],
    inTime: [{ required: true, message: "进场时间不能为空", trigger: "blur" }],
    outTime: [{ required: true, message: "出场时间不能为空", trigger: "blur" }],
    imagePath: [{ required: true, message: "图片路径地址不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询停车进出记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCarInOutRecord(queryParams.value);
  carInOutRecordList.value = res.rows;
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
  carInOutRecordFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CarInOutRecordVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加停车进出记录";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: CarInOutRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getCarInOutRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改停车进出记录";
};

/** 提交按钮 */
const submitForm = () => {
  carInOutRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateCarInOutRecord(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addCarInOutRecord(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: CarInOutRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除停车进出记录编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delCarInOutRecord(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "ibms/carInOutRecord/export",
    {
      ...queryParams.value,
    },
    `carInOutRecord_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
