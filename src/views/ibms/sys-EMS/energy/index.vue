<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="能耗仪表编号" prop="energyCode">
            <el-input
              v-model="queryParams.energyCode"
              placeholder="请输入能耗仪表编号"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="能耗仪表名称" prop="energyName">
            <el-input
              v-model="queryParams.energyName"
              placeholder="请输入能耗仪表名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="能耗仪表状态 4-开启；5-关闭" prop="energyFlag">
            <el-input
              v-model="queryParams.energyFlag"
              placeholder="请输入能耗仪表状态 4-开启；5-关闭"
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
          <el-form-item label="创建时间" prop="timeEnd">
            <el-input
              v-model="queryParams.timeEnd"
              placeholder="请输入创建时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ibms:energy:add']"
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
              v-hasPermi="['ibms:energy:edit']"
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
              v-hasPermi="['ibms:energy:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ibms:energy:export']">
              导出
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="energyList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="能耗仪表表ID" align="center" prop="id" v-if="true" />
        <el-table-column label="能耗仪表编号" align="center" prop="energyCode" />
        <el-table-column label="能耗仪表名称" align="center" prop="energyName" />
        <el-table-column label="能耗仪表类型 1-电表；2-水表；3-空调表" align="center" prop="energyDeviceType" />
        <el-table-column label="能耗仪表状态 4-开启；5-关闭" align="center" prop="energyFlag" />
        <el-table-column label="关联建筑ID" align="center" prop="buildingId" />
        <el-table-column label="创建时间" align="center" prop="timeEnd" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['ibms:energy:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['ibms:energy:remove']"
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
    <!-- 添加或修改能耗设备信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="energyFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="能耗仪表编号" prop="energyCode">
          <el-input v-model="form.energyCode" placeholder="请输入能耗仪表编号" />
        </el-form-item>
        <el-form-item label="能耗仪表名称" prop="energyName">
          <el-input v-model="form.energyName" placeholder="请输入能耗仪表名称" />
        </el-form-item>
        <el-form-item label="能耗仪表状态 4-开启；5-关闭" prop="energyFlag">
          <el-input v-model="form.energyFlag" placeholder="请输入能耗仪表状态 4-开启；5-关闭" />
        </el-form-item>
        <el-form-item label="关联建筑ID" prop="buildingId">
          <el-input v-model="form.buildingId" placeholder="请输入关联建筑ID" />
        </el-form-item>
        <el-form-item label="创建时间" prop="timeEnd">
          <el-input v-model="form.timeEnd" placeholder="请输入创建时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm"> 确 定 </el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Energy" lang="ts">
import { listEnergy, getEnergy, delEnergy, addEnergy, updateEnergy } from "@/api/ibms/sys-EMS/energy";
import { EnergyVO, EnergyQuery, EnergyForm } from "@/api/ibms/sys-EMS/energy/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const energyList = ref<EnergyVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const energyFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: EnergyForm = {
  id: undefined,
  energyCode: undefined,
  energyName: undefined,
  energyDeviceType: undefined,
  energyFlag: undefined,
  buildingId: undefined,
  timeEnd: undefined,
};
const data = reactive<PageData<EnergyForm, EnergyQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    energyCode: undefined,
    energyName: undefined,
    energyDeviceType: undefined,
    energyFlag: undefined,
    buildingId: undefined,
    timeEnd: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "能耗仪表表ID不能为空", trigger: "blur" }],
    energyCode: [{ required: true, message: "能耗仪表编号不能为空", trigger: "blur" }],
    energyName: [{ required: true, message: "能耗仪表名称不能为空", trigger: "blur" }],
    energyDeviceType: [
      {
        required: true,
        message: "能耗仪表类型 1-电表；2-水表；3-空调表不能为空",
        trigger: "change",
      },
    ],
    energyFlag: [
      {
        required: true,
        message: "能耗仪表状态 4-开启；5-关闭不能为空",
        trigger: "blur",
      },
    ],
    buildingId: [{ required: true, message: "关联建筑ID不能为空", trigger: "blur" }],
    timeEnd: [{ required: true, message: "创建时间不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询能耗设备信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listEnergy(queryParams.value);
  energyList.value = res.rows;
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
  energyFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: EnergyVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加能耗设备信息";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: EnergyVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getEnergy(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改能耗设备信息";
};

/** 提交按钮 */
const submitForm = () => {
  energyFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateEnergy(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addEnergy(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: EnergyVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除能耗设备信息编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delEnergy(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "ibms/energy/export",
    {
      ...queryParams.value,
    },
    `energy_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
