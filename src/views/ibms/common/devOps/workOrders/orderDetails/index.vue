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
          <el-form-item label="工单编号" prop="workOrderSn">
            <el-input
              v-model="queryParams.workOrderSn"
              placeholder="请输入工单编号"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="工单类型" prop="workOrderDetailType">
            <el-select
              v-model="queryParams.workOrderDetailType"
              placeholder="请选择工单类型"
              clearable
            >
              <el-option
                v-for="dict in work_order_detail_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工单详细信息值" prop="workOrderDetailValue">
            <el-input
              v-model="queryParams.workOrderDetailValue"
              placeholder="请输入工单详细信息值"
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
              v-hasPermi="['workOrders:orderDetails:add']"
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
              v-hasPermi="['workOrders:orderDetails:edit']"
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
              v-hasPermi="['workOrders:orderDetails:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['workOrders:orderDetails:export']"
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
        :data="orderDetailsList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="工单详细编号"
          align="center"
          prop="workOrderDetailSn"
          v-if="true"
        />
        <el-table-column label="工单编号" align="center" prop="workOrderSn" />
        <el-table-column
          label="工单类型"
          align="center"
          prop="workOrderDetailType"
        >
          <template #default="scope">
            <dict-tag
              :options="work_order_detail_type"
              :value="scope.row.workOrderDetailType"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="工单详细信息值"
          align="center"
          prop="workOrderDetailValue"
        />
        <el-table-column
          label="创建日期"
          align="center"
          prop="createTime"
          width="180"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
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
                v-hasPermi="['workOrders:orderDetails:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['workOrders:orderDetails:remove']"
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
    <!-- 添加或修改工单管理-工单详细对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form
        ref="orderDetailsFormRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="工单类型" prop="workOrderDetailType">
          <el-select
            v-model="form.workOrderDetailType"
            placeholder="请选择工单类型"
          >
            <el-option
              v-for="dict in work_order_detail_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单详细信息值" prop="workOrderDetailValue">
          <el-input
            v-model="form.workOrderDetailValue"
            placeholder="请输入工单详细信息值"
          />
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

<script setup name="OrderDetails" lang="ts">
import {
  listOrderDetails,
  getOrderDetails,
  delOrderDetails,
  addOrderDetails,
  updateOrderDetails,
} from "@/api/ibms/common/devOps/workOrders/orderDetails";
import {
  OrderDetailsVO,
  OrderDetailsQuery,
  OrderDetailsForm,
} from "@/api/ibms/common/devOps/workOrders/orderDetails/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { work_order_detail_type } = toRefs<any>(
  proxy?.useDict("work_order_detail_type")
);

const orderDetailsList = ref<OrderDetailsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const orderDetailsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: OrderDetailsForm = {
  workOrderDetailType: undefined,
  workOrderDetailValue: undefined,
};
const data = reactive<PageData<OrderDetailsForm, OrderDetailsQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    workOrderSn: undefined,
    workOrderDetailType: undefined,
    workOrderDetailValue: undefined,
    params: {},
  },
  rules: {
    workOrderDetailType: [
      { required: true, message: "工单类型不能为空", trigger: "change" },
    ],
    workOrderDetailValue: [
      { required: true, message: "工单详细信息值不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询工单管理-工单详细列表 */
const getList = async () => {
  loading.value = true;
  const res = await listOrderDetails(queryParams.value);
  orderDetailsList.value = res.rows;
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
  orderDetailsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: OrderDetailsVO[]) => {
  ids.value = selection.map((item) => item.workOrderDetailSn);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加工单管理-工单详细";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: OrderDetailsVO) => {
  reset();
  const _workOrderDetailSn = row?.workOrderDetailSn || ids.value[0];
  const res = await getOrderDetails(_workOrderDetailSn);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改工单管理-工单详细";
};

/** 提交按钮 */
const submitForm = () => {
  orderDetailsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.workOrderDetailSn) {
        await updateOrderDetails(form.value).finally(
          () => (buttonLoading.value = false)
        );
      } else {
        await addOrderDetails(form.value).finally(
          () => (buttonLoading.value = false)
        );
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: OrderDetailsVO) => {
  const _workOrderDetailSns = row?.workOrderDetailSn || ids.value;
  await proxy?.$modal
    .confirm(
      '是否确认删除工单管理-工单详细编号为"' +
        _workOrderDetailSns +
        '"的数据项？'
    )
    .finally(() => (loading.value = false));
  await delOrderDetails(_workOrderDetailSns);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "workOrders/orderDetails/export",
    {
      ...queryParams.value,
    },
    `orderDetails_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
