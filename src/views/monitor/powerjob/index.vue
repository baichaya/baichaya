<template>
  <div>
    <i-frame v-model:src="url" />
  </div>
</template>

<script setup lang="ts">
const url = ref(import.meta.env.VITE_APP_POWERJOB_ADMIN);
</script>
