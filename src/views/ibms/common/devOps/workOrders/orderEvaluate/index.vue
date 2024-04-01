<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="评价人姓名" prop="evaluateUserName">
            <el-input
              v-model="queryParams.evaluateUserName"
              placeholder="请输入评价人姓名"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="评价人id" prop="evaluateUserId">
            <el-input
              v-model="queryParams.evaluateUserId"
              placeholder="请输入评价人id"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="评价等级" prop="evaluateLv">
            <el-select v-model="queryParams.evaluateLv" placeholder="请选择评价等级" clearable>
              <el-option v-for="dict in evaluate_lv" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="评价描述" prop="evaluateDes">
            <el-input
              v-model="queryParams.evaluateDes"
              placeholder="请输入评价描述"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="改进建议" prop="evaluateRecommendation">
            <el-input
              v-model="queryParams.evaluateRecommendation"
              placeholder="请输入改进建议"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="工单编号" prop="workOrderSn">
            <el-input
              v-model="queryParams.workOrderSn"
              placeholder=""
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['workOrders:orderEvaluate:add']"
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
              v-hasPermi="['workOrders:orderEvaluate:edit']"
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
              v-hasPermi="['workOrders:orderEvaluate:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['workOrders:orderEvaluate:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
        </el-row>
      </template>

      <el-table v-loading="loading" :data="orderEvaluateList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="工单评价id" align="center" prop="id" v-if="true" />
        <el-table-column label="工单编号" align="center" prop="workOrderSn" />
        <el-table-column label="评价人姓名" align="center" prop="evaluateUserName" />
        <el-table-column label="评价人id" align="center" prop="evaluateUserId" />
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
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['workOrders:orderEvaluate:edit']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['workOrders:orderEvaluate:remove']"
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
    <!-- 添加或修改评价对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="orderEvaluateFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="评价等级" prop="evaluateLv">
          <el-select v-model="form.evaluateLv" placeholder="请选择评价等级">
            <el-option
              v-for="dict in evaluate_lv"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评价描述" prop="evaluateDes">
          <el-input v-model="form.evaluateDes" placeholder="请输入评价描述" />
        </el-form-item>
        <el-form-item label="改进建议" prop="evaluateRecommendation">
          <el-input v-model="form.evaluateRecommendation" placeholder="请输入改进建议" />
        </el-form-item>
        <el-form-item label="图片" prop="annexUrl">
          <image-upload v-model="form.annexUrl" />
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

<script setup name="OrderEvaluate" lang="ts">
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

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { evaluate_lv } = toRefs<any>(proxy?.useDict("evaluate_lv"));

const orderEvaluateList = ref<OrderEvaluateVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const orderEvaluateFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: OrderEvaluateForm = {
  evaluateLv: undefined,
  evaluateDes: undefined,
  evaluateRecommendation: undefined,
  annexUrl: undefined,
};
const data = reactive<PageData<OrderEvaluateForm, OrderEvaluateQuery>>({
  form: { ...initFormData },
  queryParams: {
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
  rules: {
    evaluateLv: [{ required: true, message: "评价等级不能为空", trigger: "change" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询评价列表 */
const getList = async () => {
  loading.value = true;
  const res = await listOrderEvaluate(queryParams.value);
  orderEvaluateList.value = res.rows;
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
const handleSelectionChange = (selection: OrderEvaluateVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加评价";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: OrderEvaluateVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getOrderEvaluate(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改评价";
};

/** 提交按钮 */
const submitForm = () => {
  orderEvaluateFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateOrderEvaluate(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addOrderEvaluate(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: OrderEvaluateVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除评价编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delOrderEvaluate(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "workOrders/orderEvaluate/export",
    {
      ...queryParams.value,
    },
    `orderEvaluate_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
