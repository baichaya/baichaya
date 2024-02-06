<template>
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
    <el-form ref="addFormRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="设备" prop="deviceId">
        <el-select v-model="form.deviceId" placeholder="请选择或搜索设备" clearable filterable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select v-model="form.xfType" placeholder="请选择或搜索设备类型" clearable filterable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { PointSetting } from '@/api/ibms/pointSetting/types';

const dialog = reactive<DialogOption>({
  visible: false,
  title: '新增设备点位'
});

const addFormRef = ref<ElFormInstance>();
const buttonLoading = ref(false);

const initFormData: PointSetting = {
  deviceId:undefined,
  deviceName:'',
  devicesType:'',
  xfType:''
}
const data = reactive<FormDatas<PointSetting,PointSetting>>({
form: { ...initFormData },
rules:{
  deviceId:[ {
      required: true,
      message: '请选择设备',
      trigger: 'change',
    },]
}
});

const { form, rules } = toRefs(data);

const emit = defineEmits(['reset'])

const open = ()=>{
  reset();
  dialog.visible = true
}

// 保存
const submitForm = ()=>{
  addFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
    }
  });
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  emit('reset')
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  addFormRef.value?.resetFields();
}

defineExpose({
  open
})
</script>

<style scoped></style>
