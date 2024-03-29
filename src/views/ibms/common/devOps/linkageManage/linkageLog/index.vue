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
          <el-form-item label="联动配置名" prop="linkageName">
            <el-input
              v-model="queryParams.linkageName"
              placeholder="请输入联动配置名"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="执行状态" prop="actionStatus">
            <el-select
              v-model="queryParams.actionStatus"
              placeholder="请选择执行状态"
              clearable
            >
              <el-option
                v-for="dict in action_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="执行时间" prop="actionTime">
            <el-date-picker
              clearable
              v-model="queryParams.actionTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择执行时间"
            />
          </el-form-item>
          <el-form-item label="执行详情" prop="adtionDetails">
            <el-input
              v-model="queryParams.adtionDetails"
              placeholder="请输入执行详情"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input
              v-model="queryParams.note"
              placeholder="请输入备注"
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
              v-hasPermi="['linkageManage:linkageLog:add']"
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
              v-hasPermi="['linkageManage:linkageLog:edit']"
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
              v-hasPermi="['linkageManage:linkageLog:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['linkageManage:linkageLog:export']"
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
        :data="linkageLogList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="联动配置名" align="center" prop="linkageName" />
        <el-table-column label="执行状态" align="center" prop="actionStatus">
          <template #default="scope">
            <dict-tag
              :options="action_status"
              :value="scope.row.actionStatus"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="执行时间"
          align="center"
          prop="actionTime"
          width="180"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.actionTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行详情" align="center" prop="adtionDetails" />
        <el-table-column label="备注" align="center" prop="note" />
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
                v-hasPermi="['linkageManage:linkageLog:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['linkageManage:linkageLog:remove']"
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
    <!-- 添加或修改联动执行日志对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form
        ref="linkageLogFormRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="联动配置名" prop="linkageName">
          <el-input v-model="form.linkageName" placeholder="请输入联动配置名" />
        </el-form-item>
        <el-form-item label="执行状态" prop="actionStatus">
          <el-select v-model="form.actionStatus" placeholder="请选择执行状态">
            <el-option
              v-for="dict in action_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间" prop="actionTime">
          <el-date-picker
            clearable
            v-model="form.actionTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择执行时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行详情" prop="adtionDetails">
          <el-input v-model="form.adtionDetails" placeholder="请输入执行详情" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" placeholder="请输入备注" />
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

<script setup name="LinkageLog" lang="ts">
import {
  listLinkageLog,
  getLinkageLog,
  delLinkageLog,
  addLinkageLog,
  updateLinkageLog,
} from "@/api/ibms/common/devOps/linkageManage/linkageLog";
import {
  LinkageLogVO,
  LinkageLogQuery,
  LinkageLogForm,
} from "@/api/ibms/common/devOps/linkageManage/linkageLog/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { action_status } = toRefs<any>(proxy?.useDict("action_status"));

const linkageLogList = ref<LinkageLogVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const linkageLogFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: LinkageLogForm = {
  id: undefined,
  linkageName: undefined,
  actionStatus: undefined,
  actionTime: undefined,
  adtionDetails: undefined,
  note: undefined,
};
const data = reactive<PageData<LinkageLogForm, LinkageLogQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    linkageName: undefined,
    actionStatus: undefined,
    actionTime: undefined,
    adtionDetails: undefined,
    note: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "id不能为空", trigger: "blur" }],
    linkageName: [
      { required: true, message: "联动配置名不能为空", trigger: "blur" },
    ],
    actionStatus: [
      { required: true, message: "执行状态不能为空", trigger: "change" },
    ],
    actionTime: [
      { required: true, message: "执行时间不能为空", trigger: "blur" },
    ],
    adtionDetails: [
      { required: true, message: "执行详情不能为空", trigger: "blur" },
    ],
    note: [{ required: true, message: "备注不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询联动执行日志列表 */
const getList = async () => {
  loading.value = true;
  const res = await listLinkageLog(queryParams.value);
  linkageLogList.value = res.rows;
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
  linkageLogFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: LinkageLogVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加联动执行日志";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: LinkageLogVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getLinkageLog(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改联动执行日志";
};

/** 提交按钮 */
const submitForm = () => {
  linkageLogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        const res = await updateLinkageLog(form.value).finally(
          () => (buttonLoading.value = false)
        );
        proxy?.$modal.msgSuccess(res.msg);
      } else {
        const res = await addLinkageLog(form.value).finally(
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
const handleDelete = async (row?: LinkageLogVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除联动执行日志编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  const res = await delLinkageLog(_ids);
  proxy?.$modal.msgSuccess(res.msg);
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "linkageManage/linkageLog/export",
    {
      ...queryParams.value,
    },
    `linkageLog_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
