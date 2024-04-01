<template>
  <el-dialog v-model="dialogVisible" title="角色分配" width="56%" append-to-body draggable>
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="6" :xs="24" style="">
        <el-card shadow="hover">
          <el-input v-model="deptName" placeholder="请输入部门名称" prefix-icon="Search" clearable />
          <el-tree
            class="mt-2"
            ref="deptTreeRef"
            node-key="id"
            :data="deptOptions"
            :props="{ label: 'label', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <el-col :lg="18" :xs="24">
        <transition
          :enter-active-class="proxy?.animate.searchAnimate.enter"
          :leave-active-class="proxy?.animate.searchAnimate.leave"
        >
          <div class="mb-[10px]" v-show="showSearch">
            <el-card shadow="hover">
              <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
                <el-form-item label="用户名称" prop="userName">
                  <el-input
                    v-model="queryParams.userName"
                    placeholder="请输入用户名称"
                    clearable
                    style="width: 240px"
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="手机号码" prop="phonenumber">
                  <el-input
                    v-model="queryParams.phonenumber"
                    placeholder="请输入手机号码"
                    clearable
                    style="width: 240px"
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>

                <el-form-item label="状态" prop="status">
                  <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 240px">
                    <el-option
                      v-for="dict in sys_normal_disable"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="创建时间" style="width: 308px">
                  <el-date-picker
                    v-model="dateRange"
                    value-format="YYYY-MM-DD"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleQuery" icon="Search">搜索</el-button>
                  <el-button @click="resetQuery" icon="Refresh">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </transition>

        <el-card shadow="hover">
          <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
            <el-table-column
              label="用户名称"
              align="center"
              key="userName"
              prop="userName"
              v-if="columns[1].visible"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="用户昵称"
              align="center"
              key="nickName"
              prop="nickName"
              v-if="columns[2].visible"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="部门"
              align="center"
              key="deptName"
              prop="dept.deptName"
              v-if="columns[3].visible"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="手机号码"
              align="center"
              key="phonenumber"
              prop="phonenumber"
              v-if="columns[4].visible"
              width="120"
            />
            <el-table-column label="状态" align="center" prop="status" v-if="columns[5].visible" />
            <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
              <template #default="scope">
                <span>{{ scope.row.createTime }}</span>
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
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="cancel"> 取消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="User" lang="ts">
import api from "@/api/system/user";
import { UserForm, UserQuery, UserVO } from "@/api/system/user/types";
import { DeptVO } from "@/api/system/dept/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict("sys_normal_disable"));

const userList = ref<UserVO[]>();
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<any[]>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref<[DateModelType, DateModelType]>(["", ""]);
const deptName = ref("");
const deptOptions = ref<DeptVO[]>([]);
const dialogVisible = ref(false);

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

const deptTreeRef = ref<ElTreeInstance>();
const queryFormRef = ref<ElFormInstance>();

const initFormData: UserForm = {
  userId: undefined,
  deptId: undefined,
  userName: "",
  nickName: undefined,
  password: "",
  phonenumber: undefined,
  email: undefined,
  sex: undefined,
  status: "0",
  remark: "",
  postIds: [],
  roleIds: [],
};
const data = reactive<PageData<UserForm, UserQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: "",
    phonenumber: "",
    status: "",
    deptId: "",
  },
  rules: {
    userName: [
      { required: true, message: "用户名称不能为空", trigger: "blur" },
      {
        min: 2,
        max: 20,
        message: "用户名称长度必须介于 2 和 20 之间",
        trigger: "blur",
      },
    ],
    nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
    password: [
      { required: true, message: "用户密码不能为空", trigger: "blur" },
      {
        min: 5,
        max: 20,
        message: "用户密码长度必须介于 5 和 20 之间",
        trigger: "blur",
      },
    ],
    email: [
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: ["blur", "change"],
      },
    ],
    phonenumber: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: "请输入正确的手机号码",
        trigger: "blur",
      },
    ],
  },
});

const { queryParams } = toRefs<PageData<UserForm, UserQuery>>(data);

const emit = defineEmits(["getData"]);

/** 通过条件过滤节点  */
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watchEffect(
  () => {
    deptTreeRef.value?.filter(deptName.value);
  },
  {
    flush: "post", // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
  }
);

/** 查询部门下拉树结构 */
const getTreeSelect = async () => {
  const res = await api.deptTreeSelect();
  deptOptions.value = res.data;
};

/** 查询用户列表 */
const getList = async () => {
  loading.value = true;
  const res = await api.listUser(proxy?.addDateRange(queryParams.value, dateRange.value));
  loading.value = false;
  userList.value = res.rows;
  total.value = res.total;
};

/** 节点单击事件 */
const handleNodeClick = (data: DeptVO) => {
  queryParams.value.deptId = data.id;
  handleQuery();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = ["", ""];
  queryFormRef.value?.resetFields();
  queryParams.value.pageNum = 1;
  queryParams.value.deptId = undefined;
  deptTreeRef.value?.setCurrentKey(undefined);
  handleQuery();
};

/** 选择条数  */
const handleSelectionChange = (selection: UserVO[]) => {
  ids.value = selection.map((item) => {
    const { userName, userId } = item;
    const value = {
      userName,
      userId,
    };
    return value;
  });
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

const submit = () => {
  if (ids.value.length == 0) {
    proxy?.$modal.msgError("请选择角色");
    return;
  }
  emit("getData", ids.value);
};

const open = () => {
  dialogVisible.value = true;
  resetQuery();
  getTreeSelect();
};

const cancel = () => {
  dialogVisible.value = false;
  resetQuery();
};

defineExpose({
  open,
});
</script>
