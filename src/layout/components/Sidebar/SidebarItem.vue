<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item, item.children) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <svg-icon
            :icon-class="
              onlyOneChild.meta.icon || (item.meta && item.meta.icon)
            "
          />
          <template #title>
            <span
              class="menu-title"
              :title="hasTitle(onlyOneChild.meta.title)"
              >{{ onlyOneChild.meta.title }}</span
            >
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      teleported
    >
      <template v-if="item.meta" #title>
        <svg-icon :icon-class="item.meta ? item.meta.icon : ''" />
        <span class="menu-title" :title="hasTitle(item.meta?.title)">{{
          item.meta?.title
        }}</span>
      </template>

      <sidebar-item
        v-for="(child, index) in item.children"
        :key="child.path + index"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import { isExternal } from "@/utils/validate";
import AppLink from "./Link.vue";
import { getNormalPath } from "@/utils/ruoyi";
import { RouteOption } from "vue-router";
import path from "path-browserify";

const props = defineProps({
  // route object
  item: {
    type: Object as PropType<RouteOption>,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: "",
  },
});

const onlyOneChild = ref<any>({});

/**
 * 判断当前路由是否只有一个子路由
 *
 * 1：如果只有一个子路由： 返回 true
 * 2：如果无子路由 ：返回 true
 *
 * @param children 子路由数组
 * @param parent 当前路由
 */
function hasOneShowingChild(parent: RouteOption, children?: RouteOption[]) {
  if (!children) {
    children = [];
  }
  // 子路由集合
  const showingChildren = children.filter((item: any) => {
    if (item.hidden) {
      // 过滤不显示的子路由
      return false;
    } else {
      // 临时变量（多个子路由 onlyOneChild 变量是用不上的）
      onlyOneChild.value = item;
      return true;
    }
  });

  // 如果只有一个子路由, 返回 true
  if (showingChildren.length === 1) {
    return true;
  }

  // 如果没有子路由，显示父级路由
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
}

/**
 *  解析路由路径(相对路径 → 绝对路径)
 *
 * @param routePath 路由路径
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }

  // 完整路径(/system/user) = 父级路径(/system) + 路由路径(user)
  const fullPath = path.resolve(props.basePath, routePath);
  return fullPath;
}

const hasTitle = (title: string | undefined): string => {
  if (!title || title.length <= 5) {
    return "";
  }
  return title;
};
</script>
