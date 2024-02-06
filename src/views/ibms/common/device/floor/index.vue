<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="楼层名称" prop="floorName">
            <el-input v-model="queryParams.floorName" placeholder="请输入楼层名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
<!--          <el-form-item label="电子地图url" prop="cadUrl">
            <el-input v-model="queryParams.cadUrl" placeholder="请输入电子地图url" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ibms:floor:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['ibms:floor:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['ibms:floor:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ibms:floor:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="floorList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="楼栋名称" align="center" prop="buildingName" />
        <el-table-column label="楼层名称" align="center" prop="floorName" />
        <el-table-column label="电子地图url" align="center" prop="cadUrl" />
        <el-table-column label="其他情况" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ibms:floor:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ibms:floor:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改楼层对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="floorFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="楼层名称" prop="floorName">
          <el-input v-model="form.floorName" placeholder="请输入楼层名称" />
        </el-form-item>
<!--        <el-form-item label="楼栋" prop="buildingId">
          <el-tree-select
            v-model="form.buildingId"
            :data="options"
            :props="{ value: 'id', label: 'floorName', children: 'children' }"
            value-key="id"
            placeholder="选择楼栋"
            check-strictly
          />
        </el-form-item> -->
        <el-form-item label="楼栋" prop="buildingId">
          <el-cascader
            v-model="form.buildingId"
            placeholder="请选择楼栋"
            :options="options"
            :props="{ value: 'id', label: 'floorName', children: 'children' }"
            filterable
          />
        </el-form-item>
        <el-form-item label="电子地图url" prop="cadUrl">
          <el-input v-model="form.cadUrl" placeholder="请输入电子地图url" />
        </el-form-item>
        <el-form-item label="其他情况" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入其他情况" />
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

<script setup name="Floor" lang="ts">
import {
  listFloor,
  getFloor,
  delFloor,
  addFloor,
  updateFloor,
  areaBuildingTree
} from '@/api/ibms/common/device/floor/index';
import { FloorVO, FloorQuery, FloorForm } from '@/api/ibms/common/device/floor/types';
import {AreaVO} from "@/api/ibms/common/device/area/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const floorList = ref<FloorVO[]>([]);
const options = ref<AreaVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const floorFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: FloorForm = {
  id: undefined,
  buildingId: undefined,
  floorName: undefined,
  cadUrl: undefined,
  remark: undefined,
}
const data = reactive<PageData<FloorForm, FloorQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    buildingId: undefined,
    floorName: undefined,
    cadUrl: undefined,
    params: {
    }
  },
  rules: {
    buildingId: [
      { required: true, message: "楼栋id不能为空", trigger: "change" }
    ],
    floorName: [
      { required: true, message: "楼层名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);


/** 查询楼层列表 */
const getList = async () => {
  loading.value = true;
  const res = await listFloor(queryParams.value);
  floorList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
/** 查询区域楼栋列表 */
const getAreaBuildingTree = async () => {
  const res = await areaBuildingTree();
  options.value = res.data;
  //console.log( res)
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  floorFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: FloorVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  getAreaBuildingTree();
  reset();
  dialog.visible = true;
  dialog.title = "添加楼层";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: FloorVO) => {
  getAreaBuildingTree();
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getFloor(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改楼层";
}

/** 提交按钮 */
const submitForm = () => {
  floorFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.buildingId = parseInt(form.value.buildingId.toString().split(",").pop())
      if (form.value.id) {
        await updateFloor(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addFloor(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: FloorVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除楼层编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delFloor(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('ibms/floor/export', {
    ...queryParams.value
  }, `floor_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
