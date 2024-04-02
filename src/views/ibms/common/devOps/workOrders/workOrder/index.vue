<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="优先级" prop="workOrderPriority">
            <el-select v-model="queryParams.workOrderPriority" placeholder="请选择优先级" clearable>
              <el-option
                v-for="dict in work_order_priority"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工单名称" prop="workOrderName">
            <el-input
              v-model="queryParams.workOrderName"
              placeholder="请输入工单名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="workOrderStatus">
            <el-select v-model="queryParams.workOrderStatus" placeholder="请选择状态" clearable>
              <el-option v-for="dict in work_order_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="工单描述" prop="workOrderDescription">
            <el-input
              v-model="queryParams.workOrderDescription"
              placeholder="请输入工单描述"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="工单备注" prop="workOrderComments">
            <el-input
              v-model="queryParams.workOrderComments"
              placeholder="请输入工单备注"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="被分配人名称" prop="workOrderAssignedTo">
            <el-input
              v-model="queryParams.workOrderAssignedTo"
              placeholder="请输入被分配人名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建人" prop="workOrderCreateId">
            <el-input
              v-model="queryParams.workOrderCreateId"
              placeholder="请输入创建人"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['workOrders:workOrder:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-if="loginUser"
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['workOrders:workOrder:edit']"
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
              v-hasPermi="['workOrders:workOrder:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['workOrders:workOrder:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="workOrderList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <!-- <el-table-column label="工单编号" align="center" prop="workOrderSn" v-if="true" /> -->
        <el-table-column label="工单名称" align="center" prop="workOrderName" />
        <el-table-column label="优先级" align="center" prop="workOrderPriority">
          <template #default="scope">
            <dict-tag :options="work_order_priority" :value="scope.row.workOrderPriority" />
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="workOrderDetailType">
          <template #default="scope">
            <dict-tag :options="work_order_detail_type" :value="scope.row.workOrderDetailType" />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="workOrderStatus">
          <template #default="scope">
            <dict-tag :options="work_order_status" :value="scope.row.workOrderStatus" />
          </template>
        </el-table-column>
        <el-table-column label="工单描述" align="center" prop="workOrderDescription" />
        <el-table-column label="工单备注" align="center" prop="workOrderComments" />
        <!-- <el-table-column label="被分配人名称" align="center" prop="workOrderAssignedTo" /> -->
        <el-table-column label="创建人" align="center" prop="workOrderCreateName" />
        <el-table-column label="创建日期" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top" v-if="loginUser && scope.row.workOrderStatus != 4">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['workOrders:workOrder:edit']"
              />
            </el-tooltip>
            <!-- <el-tooltip content="详情" placement="top">
              <el-button link type="success" icon="Edit" @click="handleDetail(scope.row)" v-hasPermi="['workOrders:workOrder:edit']"></el-button>
            </el-tooltip> -->
            <el-tooltip content="分配" placement="top">
              <el-button
                link
                type="danger"
                icon="User"
                @click="handleAllocation(scope.row)"
                v-hasPermi="['workOrders:workOrder:edit']"
              />
            </el-tooltip>
            <el-tooltip content="处理" placement="top" v-if="scope.row.workOrderStatus != 4">
              <el-button
                link
                type="info"
                icon="Finished"
                @click="handleButton(scope.row)"
                v-hasPermi="['workOrders:workOrder:edit']"
              />
            </el-tooltip>
            <el-tooltip content="评价" placement="top" v-if="scope.row.workOrderStatus == 4">
              <el-button
                link
                type="warning"
                icon="Star"
                @click="handleEvaluate(scope.row)"
                v-hasPermi="['workOrders:orderEvaluate:add']"
              />
            </el-tooltip>

            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['workOrders:workOrder:remove']"
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
    <!-- 添加或修改工单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="workOrderFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工单名称" prop="workOrderName">
          <el-input v-model="form.workOrderName" placeholder="请输入工单名称" />
        </el-form-item>
        <el-form-item label="优先级" prop="workOrderPriority">
          <el-select v-model="form.workOrderPriority" placeholder="请选择优先级">
            <el-option
              v-for="dict in work_order_priority"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工单类型" prop="workOrderDetailType">
          <el-select v-model="form.workOrderDetailType" placeholder="请选择工单类型">
            <el-option
              v-for="dict in work_order_detail_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="状态" prop="workOrderStatus">
          <el-select v-model="form.workOrderStatus" placeholder="请选择状态">
            <el-option
                v-for="dict in work_order_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="工单描述" prop="workOrderDescription">
          <el-input v-model="form.workOrderDescription" placeholder="请输入工单描述" />
        </el-form-item>
        <!-- <el-form-item label="详细信息" prop="workOrderDetailValue">
          <el-input v-model="form.workOrderDetailValue" placeholder="请输入详细信息" />
        </el-form-item> -->
        <el-form-item label="分配给" prop="workOrderAssignedTo">
          <el-select v-model="userIds" multiple placeholder="分配人" style="width: 240px">
            <el-option v-for="item in userNames" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
          <el-button :loading="buttonLoading" type="primary" @click="selectBotton">选择</el-button>
          <!-- 选择人员对话框 -->
          <users-option ref="usersOptionRef" @get-data="getData" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 工单详情对话框
        <el-dialog :title="dialog.title" v-model="dialog.visible4" width="500px" append-to-body>
          <el-form ref="orderDetailsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工单类型" prop="workOrderDetailType">
          <el-select v-model="form.workOrderDetailType" disabled="true" placeholder="请选择工单类型">
            <el-option
                v-for="dict in work_order_detail_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细信息" prop="workOrderDetailValue">
          <el-input v-model="form.workOrderDetailValue" disabled="true" placeholder="请输入工单详细信息值" />
        </el-form-item>
      </el-form>
    </el-dialog> -->

    <!-- 分配人员对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible2" width="500px" append-to-body>
      <el-form ref="workOrderFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分配给" prop="workOrderAssignedTo">
          <el-select v-model="userIds" multiple placeholder="分配人" style="width: 240px">
            <el-option v-for="item in userNames" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
          <el-button :loading="buttonLoading" type="primary" @click="selectBotton">选择</el-button>
          <!-- 选择人员对话框 -->
          <users-option ref="usersOptionRef" @get-data="getData" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="loginUser" :loading="buttonLoading" type="primary" @click="submitFormTo">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 工单处理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible3" width="500px" append-to-body>
      <el-form ref="workOrderFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="处理状态" prop="workOrderStatus">
          <el-select v-model="form.workOrderStatus" placeholder="请选择处理状态">
            <el-option
              v-for="dict in work_order_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :disabled="form.workOrderStatus == 2" label="图片" prop="pictureUrl">
          <image-upload v-model="form.pictureUrl" />
        </el-form-item>
        <el-form-item label="工单备注" prop="workOrderComments">
          <el-input v-model="form.workOrderComments" placeholder="请输入工单备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitFormHandle">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 工单评价列表 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible7" width="950px" append-to-body>
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAddEvluate"
              v-hasPermi="['workOrders:orderEvaluate:add']"
              >新增</el-button
            >
          </el-col>
        </el-row>
      </template>
      <el-table v-loading="loading" :data="orderEvaluateList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="工单评价id" align="center" prop="id" v-if="true" />
        <el-table-column label="工单编号" align="center" prop="workOrderSn" />
        <el-table-column label="评价人姓名" align="center" prop="evaluateUserName" />
        <!-- <el-table-column label="评价人id" align="center" prop="evaluateUserId" /> -->
        <el-table-column label="评价等级" align="center" prop="evaluateLv">
          <template #default="scope">
            <dict-tag :options="evaluate_lv" :value="scope.row.evaluateLv" />
          </template>
        </el-table-column>
        <el-table-column label="评价描述" align="center" prop="evaluateDes" />
        <el-table-column label="改进建议" align="center" prop="evaluateRecommendation" />
        <el-table-column label="图片" align="center" prop="annexUrl" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.annexUrl" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column label="评价时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalE > 0"
        :total="totalE"
        v-model:pageE="queryParamsE.pageNumE"
        v-model:limitE="queryParamsE.pageSizeE"
        @pagination="getEvluateList"
      />
    </el-dialog>
    <!-- 工单新增评价对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible6" width="500" append-to-body>
      <el-form ref="orderEvaluateFormRef" :model="evaluateData" :rules="rules" label-width="80px">
        <el-form-item label="评价等级" prop="evaluateLv">
          <el-select v-model="evaluateData.evaluateLv" placeholder="请选择评价等级">
            <el-option
              v-for="dict in evaluate_lv"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评价描述" prop="evaluateDes">
          <el-input v-model="evaluateData.evaluateDes" placeholder="请输入评价描述" />
        </el-form-item>
        <el-form-item label="改进建议" prop="evaluateRecommendation">
          <el-input v-model="evaluateData.evaluateRecommendation" placeholder="请输入改进建议" />
        </el-form-item>
        <el-form-item label="图片" prop="annexUrl">
          <image-upload v-model="evaluateData.annexUrl" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitEvalueteForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="WorkOrder" lang="ts">
import {
  listWorkOrder,
  getWorkOrder,
  delWorkOrder,
  addWorkOrder,
  updateWorkOrder,
} from "@/api/ibms/common/devOps/workOrders/workOrder";
import { WorkOrderVO, WorkOrderQuery, WorkOrderForm } from "@/api/ibms/common/devOps/workOrders/workOrder/types";
import {
  listOrderDetails,
  getOrderDetails,
  delOrderDetails,
  addOrderDetails,
  updateOrderDetails,
  getOrderDetailsByOrderSn,
} from "@/api/ibms/common/devOps/workOrders/orderDetails";
import {
  OrderDetailsVO,
  OrderDetailsQuery,
  OrderDetailsForm,
} from "@/api/ibms/common/devOps/workOrders/orderDetails/types";
import {
  listOrderEvaluate,
  getOrderEvaluate,
  delOrderEvaluate,
  addOrderEvaluate,
  updateOrderEvaluate,
} from "@/api/ibms/common/devOps/workOrders/orderEvaluate";
import {
  OrderEvaluateVO,
  OrderEvaluateQuery,
  OrderEvaluateForm,
} from "@/api/ibms/common/devOps/workOrders/orderEvaluate/types";

import api from "@/api/system/user";
import { UserForm, UserQuery, UserVO } from "@/api/system/user/types";
import { treeselect } from "@/api/system/dept";
import { DeptVO } from "@/api/system/dept/types";
import { RoleVO } from "@/api/system/role/types";
import { PostVO } from "@/api/system/post/types";
import { to } from "await-to-js";
import { globalHeaders } from "@/utils/request";
import UsersOption from "@/components/UsersOption/index.vue";
import { number } from "vue-types";
import useUserStore from "@/store/modules/user";

interface DataEvluate<T, D> {
  formE: T;
  queryParamsE: D;
  rulesE: ElFormRules;
}

interface FormDialog extends DialogOption {
  visible2: boolean;
  visible3: boolean;
  visible4: boolean;
  visible5: boolean;
  visible6: boolean;
  visible7: boolean;
}

const userNames = ref<any>([]);
const userIds = ref<any>([]);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { work_order_priority, work_order_status } = toRefs<any>(
  proxy?.useDict("work_order_priority", "work_order_status")
);
const { work_order_detail_type } = toRefs<any>(proxy?.useDict("work_order_detail_type"));
const { evaluate_lv } = toRefs<any>(proxy?.useDict("evaluate_lv"));

const workOrderList = ref<WorkOrderVO[]>([]);
const orderEvaluateList = ref<OrderEvaluateVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const totalE = ref(0);

const loginUser = ref<boolean>();
const userStore = useUserStore();

const queryFormRef = ref<ElFormInstance>();
const workOrderFormRef = ref<ElFormInstance>();
const orderDetailsFormRef = ref<ElFormInstance>();
const orderEvaluateFormRef = ref<ElFormInstance>();
const usersOptionRef = ref<InstanceType<typeof UsersOption>>();

const deptTreeRef = ref<ElTreeInstance>();

const userFormRef = ref<ElFormInstance>();
const uploadRef = ref<ElUploadInstance>();
const formDialogRef = ref<ElDialogInstance>();

const router = useRouter();
const { sys_normal_disable, sys_user_sex } = toRefs<any>(proxy?.useDict("sys_normal_disable", "sys_user_sex"));

const userList = ref<UserVO[]>();

const dateRange = ref<[DateModelType, DateModelType]>(["", ""]);
const deptName = ref("");
const deptOptions = ref<DeptVO[]>([]);
const initPassword = ref<String>("");
const postOptions = ref<PostVO[]>([]);
const roleOptions = ref<RoleVO[]>([]);

// 列显隐信息
const columns = ref<FieldOption[]>([
  { key: 0, label: `用户编号`, visible: false, children: [] },
  { key: 1, label: `用户名称`, visible: true, children: [] },
  { key: 2, label: `用户昵称`, visible: true, children: [] },
  { key: 3, label: `部门`, visible: true, children: [] },
  { key: 4, label: `手机号码`, visible: true, children: [] },
  { key: 5, label: `状态`, visible: true, children: [] },
  { key: 6, label: `创建时间`, visible: true, children: [] },
]);

const dialog = reactive<FormDialog>({
  visible: false,
  visible2: false,
  visible3: false,
  visible4: false,
  visible5: false,
  visible6: false,
  visible7: false,
  title: "",
});

const initFormData: WorkOrderForm = {
  id: undefined,
  workOrderPriority: undefined,
  workOrderName: undefined,
  workOrderStatus: undefined,
  workOrderDescription: undefined,
  workOrderComments: undefined,
  workOrderAssignedTo: undefined,
  workOrderDetailType: undefined,
  pictureUrl: undefined,
  // workOrderDetailValue: undefined,
};

const evaluateData = reactive({
  evaluateLv: undefined,
  evaluateDes: undefined,
  evaluateRecommendation: undefined,
  annexUrl: undefined,
  workOrderSn: "",
});

const queryParamsEvaluate = reactive({
  pageNumE: 1,
  pageSizeE: 10,
  workOrderSn: undefined,
});

const initFormDataEvaluate: OrderEvaluateForm = {
  evaluateLv: undefined,
  evaluateDes: undefined,
  evaluateRecommendation: undefined,
  annexUrl: undefined,
};

const dataEvluate = reactive<DataEvluate<OrderEvaluateForm, OrderEvaluateQuery>>({
  formE: { ...initFormDataEvaluate },
  queryParamsE: {
    pageNum: 1,
    pageSize: 10,
    evaluateUserName: undefined,
    evaluateUserId: undefined,
    evaluateLv: undefined,
    evaluateDes: undefined,
    evaluateRecommendation: undefined,
    annexUrl: undefined,
    workOrderSn: undefined,
    params: {},
  },
  rulesE: {
    evaluateLv: [{ required: true, message: "评价等级不能为空", trigger: "change" }],
  },
});

const data = reactive<PageData<WorkOrderForm, WorkOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    workOrderPriority: undefined,
    workOrderName: undefined,
    workOrderStatus: undefined,
    workOrderDescription: undefined,
    workOrderComments: undefined,
    workOrderAssignedTo: undefined,
    workOrderCreateId: undefined,
    workOrderSn: undefined,
    params: {},
  },
  rules: {
    workOrderPriority: [{ required: true, message: "优先级不能为空", trigger: "change" }],
    workOrderName: [{ required: true, message: "工单名称不能为空", trigger: "blur" }],
    workOrderStatus: [{ required: true, message: "状态不能为空", trigger: "change" }],
    workOrderDescription: [{ required: true, message: "工单描述不能为空", trigger: "blur" }],
    // workOrderAssignedTo: [
    //   { required: true, message: "分配人不能为空", trigger: "blur" }
    // ],
    workOrderDetailType: [{ required: true, message: "工单类型不能为空", trigger: "blur" }],
    evaluateLv: [{ required: true, message: "评价等级不能为空", trigger: "change" }],
  },
});

const { queryParams, form, rules } = toRefs(data);
const { queryParamsE, formE, rulesE } = toRefs(dataEvluate);

/** 查询工单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listWorkOrder(queryParams.value);
  workOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 选择人员按钮 */
const selectBotton = () => {
  usersOptionRef.value?.open();
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  dialog.visible2 = false;
  dialog.visible3 = false;
  dialog.visible4 = false;
  dialog.visible5 = false;
  dialog.visible6 = false;
  dialog.visible7 = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  workOrderFormRef.value?.resetFields();
  orderDetailsFormRef.value?.resetFields();
  userFormRef.value?.resetFields();
  orderEvaluateFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: WorkOrderVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  userNames.value = "";
  userIds.value = "";
  dialog.title = "添加工单";
};

/** 评价按钮操作 */
const handleEvaluate = async (row?: WorkOrderVO) => {
  reset();
  const _workOrderSn = row?.workOrderSn || (ids.value[0] as string);
  // evaluateData.workOrderSn=_workOrderSn;
  queryParamsE.value.pageNum = 1;
  queryParamsE.value.workOrderSn = _workOrderSn;
  evaluateData.workOrderSn = _workOrderSn;
  // getEvluateList();
  const res = await listOrderEvaluate(queryParamsE.value);
  orderEvaluateList.value = res.rows;
  totalE.value = res.total;
  dialog.visible7 = true;
  dialog.title = "评价";
};

/**新增评价按钮操作 handleAddEvluate*/
const handleAddEvluate = () => {
  reset();
  queryParamsE.value.workOrderSn = evaluateData.workOrderSn;
  dialog.visible6 = true;
  dialog.title = "新增评价";
};

/** 查询评价列表 */
const getEvluateList = async () => {
  loading.value = true;
  const res = await listOrderEvaluate(queryParamsE.value);
  orderEvaluateList.value = res.rows;
  totalE.value = res.total;
  loading.value = false;
};

/** 评价提交按钮 */
const submitEvalueteForm = () => {
  orderEvaluateFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      evaluateData;
      await addOrderEvaluate(evaluateData).finally(() => (buttonLoading.value = false));

      proxy?.$modal.msgSuccess("评价成功");
      dialog.visible6 = false;
      dialog.visible7 = false;
      // await handleEvaluate();
    }
  });
};

/** 修改按钮操作 */
const handleUpdate = async (row?: WorkOrderVO) => {
  reset();
  const id = row?.id || ids.value[0];
  const res = await getWorkOrder(id);
  userNames.value = res.data.users;
  if (res.data.workOrderAssignedTo != null) {
    userIds.value = res.data.workOrderAssignedTo.split(",").map(Number);
  }

  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改工单";
};

/** 分配按钮操作 */
const handleAllocation = async (row?: WorkOrderVO) => {
  reset();
  const id = row?.id || ids.value[0];
  const res = await getWorkOrder(id);

  userNames.value = res.data.users;
  if (res.data.workOrderAssignedTo != null) {
    userIds.value = res.data.workOrderAssignedTo.split(",").map(Number);
  }

  Object.assign(form.value, res.data);
  dialog.visible2 = true;
  dialog.title = "分配人员";
};

/** 处理按钮操作 */
const handleButton = async (row?: WorkOrderVO) => {
  reset();
  const id = row?.id || ids.value[0];
  const res = await getWorkOrder(id);
  Object.assign(form.value, res.data);
  dialog.visible3 = true;
  dialog.title = "处理进度";
};

// /** 详情按钮操作 */
// const handleDetail = async (row?: WorkOrderVO) => {
//   reset();
//   const id = row?.id || ids.value[0]
//   const res = await getOrderDetailsByOrderSn(id);
//   Object.assign(form.value, res.data);
//   dialog.visible4 = true;
//   dialog.title = "工单详情";
// }

/** 提交按钮 */
const submitForm = () => {
  form.value.workOrderAssignedTo = userIds.value.join(",");
  workOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;

      if (form.value.id) {
        await updateWorkOrder(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addWorkOrder(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      dialog.visible2 = false;
      dialog.visible3 = false;
      dialog.visible4 = false;
      dialog.visible5 = false;
      dialog.visible6 = false;
      dialog.visible7 = false;
      await getList();
    }
  });
};

/** 分配人员提交按钮 */
const submitFormTo = () => {
  workOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.workOrderAssignedTo = userIds.value.join(",");

      await updateWorkOrder(form.value).finally(() => (buttonLoading.value = false));
      proxy?.$modal.msgSuccess("分配成功");
      buttonLoading.value = false;
      dialog.visible2 = false;
      await getList();
    }
  });
};

/** 处理提交按钮 */
const submitFormHandle = () => {
  workOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      await updateWorkOrder(form.value).finally(() => (buttonLoading.value = false));
      proxy?.$modal.msgSuccess("处理成功");
      dialog.visible3 = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: WorkOrderVO) => {
  const id = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除工单编号为"' + id + '"的数据项？').finally(() => (loading.value = false));
  await delWorkOrder(id);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "workOrders/workOrder/export",
    {
      ...queryParams.value,
    },
    `workOrder_${new Date().getTime()}.xlsx`
  );
};

// 获取用户
const getData = (ids: any[]) => {
  userNames.value = ids;
  userIds.value = ids.map((item) => item.userId);
};

// /**
//  *
//  * 用户选择界面相关方法
//  *
//  * * */

// // const { queryParams, form, rules } = toRefs<PageData<UserForm, UserQuery>>(data)

// /** 通过条件过滤节点  */
// const filterNode = (value: string, data: any) => {
//   if (!value) return true
//   return data.label.indexOf(value) !== -1
// }
// /** 根据名称筛选部门树 */
// watchEffect(
//   () => { deptTreeRef.value?.filter(deptName.value); },
//   {
//     flush: 'post' // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
//   }
// );

// /** 查询部门下拉树结构 */
// const getTreeSelect = async () => {
//   const res = await api.deptTreeSelect();
//   deptOptions.value = res.data;
// };

// /** 查询用户列表 */
// const getUserList = async () => {
//   loading.value = true;
//   const res = await api.listUser(proxy?.addDateRange(queryParams.value, dateRange.value));
//   loading.value = false;
//   userList.value = res.rows;
//   total.value = res.total;
// }

// /** 节点单击事件 */
// const handleNodeClick = (data: DeptVO) => {
//   queryParams.value.deptId = data.id;
//   handleQueryUser()
// }

// /** 搜索按钮操作 */
// const handleQueryUser = () => {
//   queryParams.value.pageNum = 1
//   getUserList()
// }
// /** 重置按钮操作 */
// const resetUserQuery = () => {
//   dateRange.value = ['', '']
//   queryFormRef.value?.resetFields();
//   queryParams.value.pageNum = 1;
//   queryParams.value.deptId = undefined;
//   deptTreeRef.value?.setCurrentKey(undefined);
//   handleQueryUser();
// }

// /** 初始化部门数据 */
// const initTreeData = async () => {
//   // 判断部门的数据是否存在，存在不获取，不存在则获取
//   if (deptOptions.value === undefined) {
//     const { data } = await treeselect();
//     deptOptions.value = data;
//   }
// }

onMounted(() => {
  getList();
  // getTreeSelect() // 初始化部门数据
  // getUserList() // 初始化列表数据
  proxy?.getConfigKey("sys.user.initPassword").then((response) => {
    initPassword.value = response.data;
  });

  loginUser.value = userStore.userId == 1;
});
</script>
