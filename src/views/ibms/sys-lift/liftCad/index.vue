<template>
  <div>
    <DeviceCadPoint v-bind="{...data}" />
  </div>
</template>

<script setup name="LiftCad" lang="ts">
import { IconTypeEnum } from '@/enums/IBMSEnum';

const data = reactive<CadData>({
  infoList:[
    {
      id:1,
      label:'电梯数量',
      value:16,
      color:'#409EFF'
    },
    {
      id:1,
      label:'在线设备',
      value:16,
      color:'#67C23A'
    },
    {
      id:1,
      label:'离线设备',
      value:16,
      color:'#909399'
    },
    {
      id:1,
      label:'故障设备',
      value:16,
      color:'#F56C6C'
    }
  ],
  icon:IconTypeEnum.M,
  title:'电梯'
})
</script>

<style scoped></style>
