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
          <el-form-item label="楼栋名称" prop="buildingName">
            <el-input
              v-model="queryParams.buildingName"
              placeholder="请输入楼栋名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <!--          <el-form-item label="楼层总数" prop="floorCount">
            <el-input v-model="queryParams.floorCount" placeholder="请输入楼层总数" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>-->
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
              v-hasPermi="['ibms:building:add']"
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
              v-hasPermi="['ibms:building:edit']"
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
              v-hasPermi="['ibms:building:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['ibms:building:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>
      </template>

      <el-table
        v-loading="loading"
        :data="buildingList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="楼栋名称" align="center" prop="buildingName" />
        <el-table-column label="楼栋所在区域" align="center" prop="areaName" />
        <el-table-column label="楼层总数" align="center" prop="floorCount" />
        <el-table-column label="备注" align="center" prop="remark" />
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
                v-hasPermi="['ibms:building:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['ibms:building:remove']"
              ></el-button>
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
    <!-- 添加或修改楼栋
对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form
        ref="buildingFormRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="楼栋名称" prop="buildingName">
          <el-input v-model="form.buildingName" placeholder="请输入楼栋名称" />
        </el-form-item>
        <el-form-item label="区域" prop="areaId">
          <el-tree-select
            v-model="form.areaId"
            :data="areaOptions"
            :props="{ value: 'id', label: 'areaName', children: 'children1' }"
            value-key="id"
            placeholder="选择区域"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="楼层总数" prop="floorCount">
          <!--          <el-input v-model="form.floorCount" placeholder="请输入楼层总数" />-->
          <el-input-number
            v-model="form.floorCount"
            :min="1"
            :max="300"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">
            确 定
          </el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Building" lang="ts">
import {
  listBuilding,
  getBuilding,
  delBuilding,
  addBuilding,
  updateBuilding,
} from "@/api/ibms/common/device/building";
import {
  BuildingVO,
  BuildingQuery,
  BuildingForm,
} from "@/api/ibms/common/device/building/types";
import { selectAreaTree } from "@/api/ibms/common/device/area";
import { AreaVO } from "@/api/ibms/common/device/area/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const areaOptions = ref<AreaVO[]>([]);
const buildingList = ref<BuildingVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const buildingFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: BuildingForm = {
  id: undefined,
  buildingName: undefined,
  areaId: undefined,
  floorCount: 1,
  remark: undefined,
};
const data = reactive<PageData<BuildingForm, BuildingQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    buildingName: undefined,
    areaId: undefined,
    floorCount: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "主键不能为空", trigger: "blur" }],
    buildingName: [
      { required: true, message: "楼栋名称不能为空", trigger: "blur" },
    ],
    areaId: [
      { required: true, message: "楼栋所在区域id不能为空", trigger: "change" },
    ],
    floorCount: [
      { required: true, message: "楼层总数不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询楼栋
列表 */
const getList = async () => {
  loading.value = true;
  const res = await listBuilding(queryParams.value);
  buildingList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};
/** 查询区域下拉树结构 */
const getTreeList = async () => {
  const res = await selectAreaTree();
  areaOptions.value = res.data;
  //console.log(res.data)
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  buildingFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: BuildingVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  getTreeList();
  reset();
  dialog.visible = true;
  dialog.title = "添加楼栋";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: BuildingVO) => {
  getTreeList();
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getBuilding(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
};

/** 提交按钮 */
const submitForm = () => {
  buildingFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateBuilding(form.value).finally(
          () => (buttonLoading.value = false)
        );
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addBuilding(form.value).finally(
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
const handleDelete = async (row?: BuildingVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除楼栋编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delBuilding(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "ibms/building/export",
    {
      ...queryParams.value,
    },
    `building_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
