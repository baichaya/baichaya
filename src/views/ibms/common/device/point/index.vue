<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="设备分组" prop="deviceGroup">
            <el-select v-model="queryParams.deviceGroup" placeholder="请选择设备分组" clearable>
              <el-option v-for="dict in device_group" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="queryParams.deviceType" placeholder="请选择设备类型" clearable>
              <el-option v-for="dict in device_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="X轴" prop="xaxis">
            <el-input v-model="queryParams.xaxis" placeholder="请输入X轴" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="Y轴" prop="yaxis">
            <el-input v-model="queryParams.yaxis" placeholder="请输入Y轴" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="z轴" prop="zaxis">
            <el-input v-model="queryParams.zaxis" placeholder="请输入z轴" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>-->
          <el-form-item label="是否已绑定设备" prop="isBinding">
            <el-select v-model="queryParams.isBinding" placeholder="请选择是否已绑定设备" clearable>
              <el-option v-for="dict in is_binding" :key="dict.value" :label="dict.label" :value="dict.value" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ibms:point:add']"
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
              v-hasPermi="['ibms:point:edit']"
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
              v-hasPermi="['ibms:point:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ibms:point:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="pointList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="设备id" align="center" prop="deviceId" />
        <el-table-column label="设备分组" align="center" prop="deviceGroup">
          <template #default="scope">
            <dict-tag :options="device_group" :value="scope.row.deviceGroup" />
          </template>
        </el-table-column>
        <el-table-column label="设备类型" align="center" prop="deviceType">
          <!--          <template #default="scope">
            <dict-tag :options="device_type" :value="scope.row.deviceType"/>
          </template>-->
        </el-table-column>
        <el-table-column label="安装位置" align="center" prop="position" />
        <el-table-column label="X轴" align="center" prop="xaxis" />
        <el-table-column label="Y轴" align="center" prop="yaxis" />
        <el-table-column label="z轴" align="center" prop="zaxis" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="是否已绑定设备" align="center" prop="isBinding">
          <template #default="scope">
            <dict-tag :options="is_binding" :value="scope.row.isBinding" />
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
                v-hasPermi="['ibms:point:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['ibms:point:remove']"
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
    <!-- 添加或修改设备点位对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="pointFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备分组" prop="deviceGroup">
          <el-select v-model="form.deviceGroup" placeholder="请选择设备分组">
            <el-option v-for="dict in device_group" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="form.deviceType" placeholder="请选择设备类型">
            <el-option
                v-for="dict in device_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="设备类型" prop="deviceType">
          <el-input v-model="form.deviceType" placeholder="请选择设备类型" />
        </el-form-item>
        <!--        <el-form-item label="安装位置" prop="floorId">
          <el-tree-select
            v-model="form.floorId"
            :data="options"
            :props="{ value: 'id', label: 'floorName', children: 'children' }"
            value-key="id"
            placeholder="选择楼层"
            check-strictly
          />
        </el-form-item>-->
        <el-form-item label="安装位置" prop="floorIds">
          <el-cascader
            v-model="form.floorIds"
            placeholder="请选择安装位置"
            :options="options"
            :props="{ value: 'id', label: 'floorName', children: 'children' }"
            filterable
            @change="getData"
          />
        </el-form-item>
        <el-form-item label="X轴" prop="xaxis">
          <el-input v-model="form.xaxis" placeholder="请输入X轴" />
        </el-form-item>
        <el-form-item label="Y轴" prop="yaxis">
          <el-input v-model="form.yaxis" placeholder="请输入Y轴" />
        </el-form-item>
        <el-form-item label="z轴" prop="zaxis">
          <el-input v-model="form.zaxis" placeholder="请输入z轴" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="是否已绑定设备" prop="isBinding">
          <el-select v-model="form.isBinding" placeholder="请选择是否已绑定设备">
            <el-option v-for="dict in is_binding" :key="dict.value" :label="dict.label" :value="dict.value" />
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

<script setup name="Point" lang="ts">
import { listPoint, getPoint, delPoint, addPoint, updatePoint, selectTree } from "@/api/ibms/common/device/point/index";
import { PointVO, PointQuery, PointForm } from "@/api/ibms/common/device/point/types";
import { AreaVO } from "@/api/ibms/common/device/area/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { device_group, device_type, is_binding } = toRefs<any>(
  proxy?.useDict("device_group", "device_type", "is_binding")
);

const options = ref<AreaVO[]>([]);
const pointList = ref<PointVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const pointFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: PointForm = {
  id: undefined,
  deviceId: undefined,
  deviceGroup: undefined,
  deviceType: undefined,
  floorId: undefined,
  xaxis: undefined,
  yaxis: undefined,
  zaxis: undefined,
  remark: undefined,
  isBinding: undefined,
  floorIds: undefined,
  areaBuildingFloorId: undefined,
};
const data = reactive<PageData<PointForm, PointQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: undefined,
    deviceGroup: undefined,
    deviceType: undefined,
    floorId: undefined,
    xaxis: undefined,
    yaxis: undefined,
    zaxis: undefined,
    isBinding: undefined,
    areaBuildingFloorId: undefined,
    floorIds: undefined,
    params: {},
  },
  rules: {
    /*deviceId: [
      { required: true, message: "设备id不能为空", trigger: "change" }
    ],*/
    deviceGroup: [{ required: true, message: "设备分组不能为空", trigger: "change" }],
    deviceType: [{ required: true, message: "设备类型不能为空", trigger: "change" }],
    floorIds: [{ required: true, message: "安装位置不能为空", trigger: "change" }],
    isBinding: [{ required: true, message: "是否已绑定设备不能为空", trigger: "change" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

const getData = (v) => {
  console.log(v);
};

/** 查询设备点位列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPoint(queryParams.value);
  pointList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 查询楼层下拉树结构 */
const getTreeList = async () => {
  const res = await selectTree();
  options.value = res.data;
  //console.log(res)
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  pointFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: PointVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  getTreeList();
  reset();
  dialog.visible = true;
  dialog.title = "添加设备点位";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: PointVO) => {
  getTreeList();
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getPoint(_id);
  Object.assign(form.value, res.data);
  form.value.floorIds = res.data.areaBuildingFloorId.split(",").map(Number);
  console.log(form.value.floorIds);
  dialog.visible = true;
  dialog.title = "修改设备点位";
};

/** 提交按钮 */
const submitForm = () => {
  pointFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;

      form.value.areaBuildingFloorId = form.value.floorIds.join(",");
      form.value.floorId = form.value.floorIds.pop();
      if (form.value.id) {
        await updatePoint(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPoint(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: PointVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除设备点位编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  await delPoint(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "ibms/point/export",
    {
      ...queryParams.value,
    },
    `point_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
