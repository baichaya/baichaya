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
          <el-form-item label="工单编号" prop="workOrderId">
            <el-input
              v-model="queryParams.workOrderId"
              placeholder="请输入工单编号"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="操作员id" prop="userId">
            <el-input v-model="queryParams.userId" placeholder="请输入操作员id" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item> -->
          <el-form-item label="备注" prop="operationComment">
            <el-input
              v-model="queryParams.operationComment"
              placeholder="请输入操作注释"
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
          <!-- <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['workOrders:orderHistory:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['workOrders:orderHistory:edit']">修改</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              v-hasPermi="['workOrders:orderHistory:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['workOrders:orderHistory:export']"
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
        :data="orderHistoryList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="工单编号" align="center" prop="workOrderId" />
        <el-table-column label="操作员" align="center" prop="operatorName" />
        <el-table-column
          label="图片"
          align="center"
          prop="pictureUrl"
          width="100"
        >
          <template #default="scope">
            <image-preview
              :src="scope.row.pictureUrl"
              :width="50"
              :height="50"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作日期"
          align="center"
          prop="createTime"
          width="180"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center" prop="operationComment" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <!-- <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['workOrders:orderHistory:edit']"></el-button>
            </el-tooltip> -->

            <el-tooltip content="工单详情" placement="top">
              <el-button
                link
                type="primary"
                icon="View"
                @click="handleGetWorkOrder(scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['workOrders:orderHistory:remove']"
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
    <!-- 添加或修改处理历史对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form
        ref="orderHistoryFormRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="操作注释" prop="operationComment">
          <el-input
            v-model="form.operationComment"
            placeholder="请输入操作注释"
          />
        </el-form-item>
        <el-form-item label="图片" prop="pictureUrl">
          <image-upload v-model="form.pictureUrl" />
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

    <!-- 工单详情对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible1"
      width="500px"
      append-to-body
    >
      <el-form
        ref="workOrderFormRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="工单名称">
          <el-input
            disabled="true"
            v-model="form.workOrderName"
            placeholder="请输入工单名称"
          />
        </el-form-item>

        <el-form-item label="创建人">
          <el-input
            disabled="true"
            v-model="form.workOrderCreateName"
            placeholder="创建人"
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select
            disabled="true"
            v-model="form.workOrderPriority"
            placeholder="请选择优先级"
          >
            <el-option
              v-for="dict in work_order_priority"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工单类型">
          <el-select
            disabled="true"
            v-model="form.workOrderDetailType"
            placeholder="请选择工单类型"
          >
            <el-option
              v-for="dict in work_order_detail_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            disabled="true"
            v-model="form.workOrderStatus"
            placeholder="请选择状态"
          >
            <el-option
              v-for="dict in work_order_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工单描述">
          <el-input
            disabled="true"
            v-model="form.workOrderDescription"
            placeholder="请输入工单描述"
          />
        </el-form-item>

        <el-form-item label="处理人">
          <el-select
            v-model="userIds"
            multiple
            placeholder="处理人"
            style="width: 240px"
            disabled="true"
          >
            <el-option
              v-for="item in userNames"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup name="OrderHistory" lang="ts">
import {
  listOrderHistory,
  getOrderHistory,
  delOrderHistory,
  addOrderHistory,
  updateOrderHistory,
} from "@/api/ibms/common/devOps/workOrders/orderHistory";
import {
  OrderHistoryVO,
  OrderHistoryQuery,
  OrderHistoryForm,
} from "@/api/ibms/common/devOps/workOrders/orderHistory/types";
import {
  listWorkOrder,
  getWorkOrder,
  delWorkOrder,
  addWorkOrder,
  updateWorkOrder,
} from "@/api/ibms/common/devOps/workOrders/workOrder";
import {
  WorkOrderVO,
  WorkOrderQuery,
  WorkOrderForm,
} from "@/api/ibms/common/devOps/workOrders/workOrder/types";

interface FormDialog extends DialogOption {
  visible1: boolean;
}

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { work_order_priority, work_order_status } = toRefs<any>(
  proxy?.useDict("work_order_priority", "work_order_status")
);
const { work_order_detail_type } = toRefs<any>(
  proxy?.useDict("work_order_detail_type")
);
const orderHistoryList = ref<OrderHistoryVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const userNames = ref<any>([]);
const userIds = ref<any>([]);

const workOrderFormRef = ref<ElFormInstance>();

const queryFormRef = ref<ElFormInstance>();
const orderHistoryFormRef = ref<ElFormInstance>();

const dialog = reactive<FormDialog>({
  visible: false,
  visible1: false,
  title: "",
});

const initFormData: OrderHistoryForm = {
  operationComment: undefined,
  pictureUrl: undefined,
};
const data = reactive<PageData<OrderHistoryForm, OrderHistoryQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    workOrderId: undefined,
    userId: undefined,
    operationComment: undefined,
    pictureUrl: undefined,
    params: {},
  },
  rules: {
    operationComment: [
      { required: true, message: "操作注释不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询处理历史列表 */
const getList = async () => {
  loading.value = true;
  const res = await listOrderHistory(queryParams.value);
  orderHistoryList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  dialog.visible1 = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  orderHistoryFormRef.value?.resetFields();
  workOrderFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: OrderHistoryVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/**获取工单信息按钮handleGetWorkOrder */
const handleGetWorkOrder = async (row?: OrderHistoryVO) => {
  reset();
  const workOrderId = row?.workOrderId || ids.value[0];
  const res = await getWorkOrder(workOrderId);
  userNames.value = res.data.users;
  userIds.value = res.data.workOrderAssignedTo.split(",").map(Number);
  console.log("----------------------");

  console.log(userIds.value);
  console.log(userNames.value);

  Object.assign(form.value, res.data);
  dialog.visible1 = true;
  dialog.title = "工单详情";
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加处理历史";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: OrderHistoryVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getOrderHistory(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改处理历史";
};

/** 提交按钮 */
const submitForm = () => {
  orderHistoryFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateOrderHistory(form.value).finally(
          () => (buttonLoading.value = false)
        );
      } else {
        await addOrderHistory(form.value).finally(
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
const handleDelete = async (row?: OrderHistoryVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除处理历史编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  await delOrderHistory(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "workOrders/orderHistory/export",
    {
      ...queryParams.value,
    },
    `orderHistory_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
