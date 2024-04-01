<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="楼控设备参数" prop="baName">
            <el-input
              v-model="queryParams.baName"
              placeholder="请输入楼控设备参数"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="楼控设备属性名" prop="baTargetName">
            <el-input
              v-model="queryParams.baTargetName"
              placeholder="请输入楼控设备属性名"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="楼控协议名称" prop="baObjectName">
            <el-input
              v-model="queryParams.baObjectName"
              placeholder="请输入楼控协议名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="楼控设备允许状态" prop="baInstNum">
            <el-input
              v-model="queryParams.baInstNum"
              placeholder="请输入楼控设备允许状态"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="关联建筑ID" prop="buildingId">
            <el-input
              v-model="queryParams.buildingId"
              placeholder="请输入关联建筑ID"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="备注信息" prop="baRemark">
            <el-input
              v-model="queryParams.baRemark"
              placeholder="请输入备注信息"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建时间" prop="timeEnd">
            <el-date-picker
              clearable
              v-model="queryParams.timeEnd"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择创建时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ibms:ba:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['ibms:ba:edit']"
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
              v-hasPermi="['ibms:ba:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ibms:ba:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="baList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="楼控表ID" align="center" prop="id" v-if="true" />
        <el-table-column label="楼控设备参数" align="center" prop="baName" />
        <el-table-column label="楼控设备属性名" align="center" prop="baTargetName" />
        <el-table-column label="楼控协议名称" align="center" prop="baObjectName" />
        <el-table-column label="楼控协议类型" align="center" prop="baObjectType" />
        <el-table-column label="楼控设备允许状态" align="center" prop="baInstNum" />
        <el-table-column label="关联建筑ID" align="center" prop="buildingId" />
        <el-table-column label="备注信息" align="center" prop="baRemark" />
        <el-table-column label="创建时间" align="center" prop="timeEnd" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.timeEnd, "{y}-{m}-{d}") }}</span>
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
                v-hasPermi="['ibms:ba:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['ibms:ba:remove']"
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
    <!-- 添加或修改BA设备表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="baFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="楼控设备参数" prop="baName">
          <el-input v-model="form.baName" placeholder="请输入楼控设备参数" />
        </el-form-item>
        <el-form-item label="楼控设备属性名" prop="baTargetName">
          <el-input v-model="form.baTargetName" placeholder="请输入楼控设备属性名" />
        </el-form-item>
        <el-form-item label="楼控协议名称" prop="baObjectName">
          <el-input v-model="form.baObjectName" placeholder="请输入楼控协议名称" />
        </el-form-item>
        <el-form-item label="楼控设备允许状态" prop="baInstNum">
          <el-input v-model="form.baInstNum" placeholder="请输入楼控设备允许状态" />
        </el-form-item>
        <el-form-item label="关联建筑ID" prop="buildingId">
          <el-input v-model="form.buildingId" placeholder="请输入关联建筑ID" />
        </el-form-item>
        <el-form-item label="备注信息" prop="baRemark">
          <el-input v-model="form.baRemark" placeholder="请输入备注信息" />
        </el-form-item>
        <el-form-item label="创建时间" prop="timeEnd">
          <el-date-picker
            clearable
            v-model="form.timeEnd"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择创建时间"
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

<script setup name="Ba" lang="ts">
import { listBa, getBa, delBa, addBa, updateBa } from "@/api/ibms/sys-BA/BA";
import { BaVO, BaQuery, BaForm } from "@/api/ibms/sys-BA/BA/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const baList = ref<BaVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const baFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: BaForm = {
  id: undefined,
  baName: undefined,
  baTargetName: undefined,
  baObjectName: undefined,
  baObjectType: undefined,
  baInstNum: undefined,
  buildingId: undefined,
  baRemark: undefined,
  timeEnd: undefined,
};
const data = reactive<PageData<BaForm, BaQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    baName: undefined,
    baTargetName: undefined,
    baObjectName: undefined,
    baObjectType: undefined,
    baInstNum: undefined,
    buildingId: undefined,
    baRemark: undefined,
    timeEnd: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "楼控表ID不能为空", trigger: "blur" }],
    baName: [{ required: true, message: "楼控设备参数不能为空", trigger: "blur" }],
    baTargetName: [{ required: true, message: "楼控设备属性名不能为空", trigger: "blur" }],
    baObjectName: [{ required: true, message: "楼控协议名称不能为空", trigger: "blur" }],
    baObjectType: [{ required: true, message: "楼控协议类型不能为空", trigger: "change" }],
    baInstNum: [{ required: true, message: "楼控设备允许状态不能为空", trigger: "blur" }],
    buildingId: [{ required: true, message: "关联建筑ID不能为空", trigger: "blur" }],
    baRemark: [{ required: true, message: "备注信息不能为空", trigger: "blur" }],
    timeEnd: [{ required: true, message: "创建时间不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询BA设备表列表 */
const getList = async () => {
  loading.value = true;
  const res = await listBa(queryParams.value);
  baList.value = res.rows;
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
  baFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: BaVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加BA设备表";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: BaVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getBa(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改BA设备表";
};

/** 提交按钮 */
const submitForm = () => {
  baFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateBa(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addBa(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: BaVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除BA设备表编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delBa(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "ibms/ba/export",
    {
      ...queryParams.value,
    },
    `ba_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
