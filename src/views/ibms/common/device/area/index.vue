<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="区域名称" prop="areaName">
            <el-input
              v-model="queryParams.areaName"
              placeholder="请输入区域名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="区域地址" prop="areaAddress">
            <el-input
              v-model="queryParams.areaAddress"
              placeholder="请输入区域地址"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ibms:area:add']"
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
              v-hasPermi="['ibms:area:edit']"
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
              v-hasPermi="['ibms:area:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ibms:area:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="areaList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="区域名称" align="center" prop="areaName" />
        <!--        <el-table-column label="上级区域id" align="center" prop="parentAreaId" />-->
        <el-table-column label="区域地址" align="center" prop="areaAddress" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['ibms:area:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['ibms:area:remove']"
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
    <!-- 添加或修改区域对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="areaFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="上级区域" prop="parentAreaId">
          <el-tree-select
            v-model="form.parentAreaId"
            :data="areaOptions"
            :props="{ value: 'id', label: 'areaName', children: 'children1' }"
            value-key="id"
            placeholder="选择上级区域"
            check-strictly
          />
        </el-form-item>
        <!--        <el-form-item label="上级区域" prop="parentAreaId">
          <el-cascader
            v-model="form.parentAreaId"
            placeholder="请选择上级区域"
            :options="areaOptions"
            :props="{ value: 'id', label: 'areaName', children: 'children1' }"
            filterable
          />
        </el-form-item>-->
        <el-form-item label="区域地址" prop="areaAddress">
          <el-input v-model="form.areaAddress" type="textarea" placeholder="请输入内容" />
        </el-form-item>
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

<script setup name="Area" lang="ts">
import { listArea, getArea, delArea, addArea, updateArea, selectAreaTree } from "@/api/ibms/common/device/area";
import { AreaVO, AreaQuery, AreaForm } from "@/api/ibms/common/device/area/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const areaList = ref<AreaVO[]>([]);
const areaOptions = ref<AreaVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const areaFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: AreaForm = {
  id: undefined,
  areaName: undefined,
  parentAreaId: undefined,
  areaAddress: undefined,
  remark: undefined,
};
const data = reactive<PageData<AreaForm, AreaQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    areaName: undefined,
    parentAreaId: undefined,
    areaAddress: undefined,
    params: {},
  },
  rules: {
    areaName: [{ required: true, message: "区域名称不能为空", trigger: "blur" }],
    parentAreaId: [{ required: true, message: "上级区域id不能为空", trigger: "change" }],
  },
});
const { queryParams, form, rules } = toRefs(data);

/** 查询区域列表 */
const getList = async () => {
  loading.value = true;
  const res = await listArea(queryParams.value);
  areaList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 查询区域下拉树结构 */
const getTreeList = async () => {
  const res = await selectAreaTree();
  areaOptions.value = res.data;
};
/** 无限级树 */
/*const getTreeList = async () => {
  loading.value = true;
  const res = await selectAreaTree(queryParams.value);
  console.log(res.data);
  areaList.value = res.data;
  total.value = res.total;
  loading.value = false;
  }*/

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  areaFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: AreaVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  getTreeList();
  reset();
  dialog.visible = true;
  dialog.title = "添加区域";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: AreaVO) => {
  getTreeList();
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getArea(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改区域";
};

/** 提交按钮 */
const submitForm = () => {
  areaFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateArea(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addArea(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess(res.msg);
      }
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: AreaVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除区域编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  const res = await delArea(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "ibms/area/export",
    {
      ...queryParams.value,
    },
    `area_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
