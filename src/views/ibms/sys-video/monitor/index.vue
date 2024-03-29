<template>
  <div class="p-2">
    <el-card style="width: 91vw; height: 91vh">
      <el-container>
        <el-aside width="250px">
          <el-tree ref="ref1" :data="data" :props="defaultProps" @node-click="handleNodeClick" />
        </el-aside>
        <el-main>
          <div style="font-size: 17px; line-height: 17px; margin-bottom: 5px">
            分屏:
            <el-space>
              <i-ep-full-screen class="btn" :class="{ active: slipt == 1 }" @click="slipt = 1" />
              <i-ep-menu class="btn" :class="{ active: slipt == 4 }" @click="slipt = 4" />
              <i-ep-grid class="btn" :class="{ active: slipt == 9 }" @click="slipt = 9" />
            </el-space>
          </div>
          <div ref="ref2" style="height: 84vh">
            <HkVideo :slipt="slipt" />
          </div>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script setup name="VideoPlay" lang="ts">
import HkVideo from "./component/HkVideo/index.vue";

interface Tree {
  label: string;
  children?: Tree[];
}

const handleNodeClick = (data: Tree) => {
  console.log(data);
};

const data: Tree[] = [
  {
    label: "Level one 1",
    children: [
      {
        label: "Level two 1-1",
        children: [
          {
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  {
    label: "Level one 2",
    children: [
      {
        label: "Level two 2-1",
        children: [
          {
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        label: "Level two 2-2",
        children: [
          {
            label: "Level three 2-2-1",
          },
        ],
      },
    ],
  },
  {
    label: "Level one 3",
    children: [
      {
        label: "Level two 3-1",
        children: [
          {
            label: "Level three 3-1-1",
          },
        ],
      },
      {
        label: "Level two 3-2",
        children: [
          {
            label: "Level three 3-2-1",
          },
        ],
      },
    ],
  },
];

const defaultProps = {
  children: "children",
  label: "label",
};

const slipt = ref(1);
</script>

<style lang="scss" scoped>
.btn:hover {
  color: #409eff;
  cursor: pointer;
}
.btn.active {
  color: #409eff;
}
</style>
