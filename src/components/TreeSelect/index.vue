<template>
  <div class="el-tree-select">
    <el-select
      style="width: 100%"
      v-model="valueId"
      ref="treeSelect"
      :filterable="true"
      :clearable="true"
      @clear="clearHandle"
      :filter-method="selectFilterData"
      :placeholder="placeholder"
    >
      <el-option :value="valueId" :label="valueTitle">
        <el-tree
          id="tree-option"
          ref="selectTree"
          :accordion="accordion"
          :data="options"
          :props="objMap"
          :node-key="objMap.value"
          :expand-on-click-node="false"
          :default-expanded-keys="defaultExpandedKey"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        />
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  /* 配置项 */
  objMap: {
    type: Object,
    default: () => {
      return {
        value: "id", // ID字段名
        label: "label", // 显示名称
        children: "children", // 子级字段名
      };
    },
  },
  /* 自动收起 */
  accordion: {
    type: Boolean,
    default: () => {
      return false;
    },
  },
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
    default: "",
  },
  /**当前的数据 */
  options: {
    type: Array,
    default: () => [],
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: "",
  },
});

const selectTree = ref<ElTreeSelectInstance>();

const emit = defineEmits(["update:value"]);

const valueId = computed({
  get: () => props.value,
  set: (val) => {
    emit("update:value", val);
  },
});
const valueTitle = ref("");
const defaultExpandedKey = ref<any[]>([]);

const initHandle = () => {
  nextTick(() => {
    const selectedValue = valueId.value;
    if (selectedValue !== null && typeof selectedValue !== "undefined") {
      const node = selectTree.value?.getNode(selectedValue);
      if (node) {
        valueTitle.value = node.data[props.objMap.label];
        selectTree.value?.setCurrentKey(selectedValue); // 设置默认选中
        defaultExpandedKey.value = [selectedValue]; // 设置默认展开
      }
    } else {
      clearHandle();
    }
  });
};
const handleNodeClick = (node: any) => {
  valueTitle.value = node[props.objMap.label];
  valueId.value = node[props.objMap.value];
  defaultExpandedKey.value = [];
  selectTree.value?.blur();
  selectFilterData("");
};
const selectFilterData = (val: any) => {
  selectTree.value?.filter(val);
};
const filterNode = (value: any, data: any) => {
  if (!value) return true;
  return data[props.objMap["label"]].indexOf(value) !== -1;
};
const clearHandle = () => {
  valueTitle.value = "";
  valueId.value = "";
  defaultExpandedKey.value = [];
  clearSelected();
};
const clearSelected = () => {
  const allNode = document.querySelectorAll("#tree-option .el-tree-node");
  allNode.forEach((element) => element.classList.remove("is-current"));
};

onMounted(() => {
  initHandle();
});

watch(valueId, () => {
  initHandle();
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.module";

.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  padding: 0;
  background-color: #fff;
}

.el-select-dropdown__item.selected {
  font-weight: normal;
}

ul li .el-tree .el-tree-node__content {
  box-sizing: border-box;
  height: auto;
  padding: 0 20px;
}

:deep(.el-tree-node__content:hover),
:deep(.el-tree-node__content:active),
:deep(.is-current > div:first-child),
:deep(.el-tree-node__content:focus) {
  color: $--color-primary;
  background-color: color.mix(#fff, $--color-primary, 90%);
}
</style>
