<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="appStore.sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!settingsStore.topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="settingsStore.topNav" />

    <div class="right-menu flex align-center">
      <template v-if="appStore.device !== 'mobile'">
        <el-select
          v-model="companyName"
          clearable
          filterable
          reserve-keyword
          :placeholder="$t('navbar.selectTenant')"
          v-if="userId === 1 && tenantEnabled"
          @change="dynamicTenantEvent"
          @clear="dynamicClearEvent"
        >
          <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId" />
          <template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>
        </el-select>

        <!-- <header-search id="header-search" class="right-menu-item" /> -->
        <search-menu ref="searchMenuRef" />

        <el-tooltip content="大屏" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect" @click="openDataScreen">
            <svg-icon size="25" icon-class="dataScreen" />
          </div>
        </el-tooltip>

        <el-tooltip content="搜索" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect" @click="openSearchMenu">
            <svg-icon class-name="search-icon" icon-class="search" />
          </div>
        </el-tooltip>
        <!-- 消息 -->
        <el-tooltip :content="$t('navbar.message')" effect="dark" placement="bottom">
          <div>
            <el-popover placement="bottom" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false">
              <template #reference>
                <el-badge :value="newNotice > 0 ? newNotice : ''" :max="99">
                  <svg-icon icon-class="message" />
                </el-badge>
              </template>
              <template #default>
                <notice />
              </template>
            </el-popover>
          </div>
        </el-tooltip>
        <!-- <el-tooltip content="Github" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <el-tooltip :content="$t('navbar.document')" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <el-tooltip :content="$t('navbar.full')" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <!-- <el-tooltip :content="$t('navbar.language')" effect="dark" placement="bottom">
          <lang-select id="lang-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <el-tooltip :content="$t('navbar.layoutSize')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile" v-if="!dynamic">
                <el-dropdown-item>{{ $t("navbar.personalCenter") }}</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout" v-if="settingsStore.showSettings">
                <span>{{ $t("navbar.layoutSetting") }}</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>{{ $t("navbar.logout") }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchMenu from "./TopBar/search.vue";
import useAppStore from "@/store/modules/app";
import useUserStore from "@/store/modules/user";
import useSettingsStore from "@/store/modules/settings";
import { getTenantList } from "@/api/login";
import { dynamicClear, dynamicTenant } from "@/api/system/tenant";
import { ComponentInternalInstance } from "vue";
import { TenantVO } from "@/api/types";
import notice from "./notice/index.vue";
import useNoticeStore from "@/store/modules/notice";

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const noticeStore = storeToRefs(useNoticeStore());
const newNotice = ref(<number>0);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userId = ref(userStore.userId);
const companyName = ref(undefined);
const tenantList = ref<TenantVO[]>([]);
// 是否切换了租户
const dynamic = ref(false);
// 租户开关
const tenantEnabled = ref(true);
// 搜索菜单
const searchMenuRef = ref<InstanceType<typeof SearchMenu>>();

const openSearchMenu = () => {
  searchMenuRef.value?.openSearch();
};

// 动态切换
const dynamicTenantEvent = async (tenantId: string) => {
  if (companyName.value != null && companyName.value !== "") {
    await dynamicTenant(tenantId);
    dynamic.value = true;
    proxy?.$tab.closeAllPage();
    proxy?.$router.push("/");
  }
};

const dynamicClearEvent = async () => {
  await dynamicClear();
  dynamic.value = false;
  proxy?.$tab.closeAllPage();
  proxy?.$router.push("/");
};

/** 租户列表 */
const initTenantList = async () => {
  const { data } = await getTenantList();
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
  }
};

defineExpose({
  initTenantList,
});

const toggleSideBar = () => {
  appStore.toggleSideBar(false);
};

// 大屏跳转
const openDataScreen = () => {
  proxy?.$router.push("/dataScreen");
};

const logout = async () => {
  await ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  await userStore.logout();
  location.href = import.meta.env.VITE_APP_CONTEXT_PATH + "index";
};

const emits = defineEmits(["setLayout"]);
const setLayout = () => {
  emits("setLayout");
};
// 定义Command方法对象 通过key直接调用方法
const commandMap: { [key: string]: any } = {
  setLayout,
  logout,
};
const handleCommand = (command: string) => {
  // 判断是否存在该方法
  if (commandMap[command]) {
    commandMap[command]();
  }
};

//用深度监听 消息
watch(
  () => noticeStore.state.value.notices,
  (newVal, oldVal) => {
    newNotice.value = newVal.filter((item: any) => !item.read).length;
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
:deep(.el-select .el-input__wrapper) {
  height: 30px;
}

:deep(.el-badge__content.is-fixed) {
  top: 12px;
}

.flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.navbar {
  position: relative;
  height: 50px;
  overflow: hidden;
  //background: #fff;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 46px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgb(0 0 0 / 2.5%);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgb(0 0 0 / 2.5%);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        position: relative;
        margin-top: 5px;

        .user-avatar {
          width: 40px;
          height: 40px;
          margin-top: 10px;
          cursor: pointer;
          border-radius: 10px;
        }

        i {
          position: absolute;
          top: 25px;
          right: -20px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
