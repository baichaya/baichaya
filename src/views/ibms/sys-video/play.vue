<template>
  <div class="p-2">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="ip">
        <el-input v-model="formInline.ip" placeholder="ip" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="open"> 登录 </el-button>
      </el-form-item>
    </el-form>

    <el-dialog v-model="dialogVisible" title="Tips" width="830px" :append-to-body="true" :before-close="close">
      <!--视频窗口展示-->
      <div id="playWnd" class="playWnd" ref="playWnd"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
const formInline = reactive({
  ip: "",
});

const g_iWndIndex = 0;

const dialogVisible = ref(false);
const isLogin = ref(false);
const videoOpen = ref(false);
const playWnd = ref();

const videoPlugins = reactive({
  szDeviceIdentify: "",
  ip: "",
  port: "80",
  username: "admin",
  password: "a1234567",
});

// 打开监控
const open = () => {
  dialogVisible.value = true;
  if (formInline.ip) {
    videoPlugins.ip = formInline.ip;
  }
  initPlugin();
};

const close = () => {
  videoPlugins.ip = "";
  videoPlugins.szDeviceIdentify = "";
  videoPlugins.port = "80";
  videoPlugins.username = "admin";
  videoPlugins.password = "a1234567";
  dialogVisible.value = false;
  formInline.ip = "";
  videoClose();
};

// 创建播放实例
const initPlugin = () => {
  // 初始化插件参数及插入插件
  window.WebVideoCtrl.I_InitPlugin(800, 600, {
    bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
    iPackageType: 2,
    //szColorProperty:"plugin-background:0000ff; sub-background:0000ff; sub-border:00ffff; sub-border-select:0000ff",   //2:PS 11:MP4
    iWndowType: 1,
    bNoPlugin: true,
    // 窗口选中事件回调
    cbSelWnd: (xmlDoc: any) => {
      var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
      console.log(szInfo);
    },
    // 窗口双击事件回调
    cbDoubleClickWnd: (iWndIndex: string, bFullScreen: any) => {
      var szInfo = "当前放大的窗口编号：" + iWndIndex;
      if (!bFullScreen) {
        szInfo = "当前还原的窗口编号：" + iWndIndex;
      }
      console.log(szInfo);
    },
    cbRemoteConfig: () => {
      console.log("关闭远程配置库！");
    },
    // 插件初始化完成回调
    cbInitPluginComplete: () => {
      nextTick(() => {
        console.log("窗口", playWnd.value);
        let isInit = window.WebVideoCtrl.I_InsertOBJECTPlugin("playWnd");
        console.log("isInit", isInit);

        clickLogin();
      });
    },
  });
};

// 登录
const clickLogin = () => {
  let { ip, port, username, password } = videoPlugins;

  if ("" == ip || "" == port) {
    return;
  }

  videoPlugins.szDeviceIdentify = ip + "_" + port;

  let iRet = window.WebVideoCtrl.I_Login(ip, 1, port, username, password, {
    success: (xmlDoc: any) => {
      setTimeout(() => {
        getChannelInfo();
        getDevicePort();
      }, 10);
    },
    error: (status: any, xmlDoc: any) => {
      console.log(" 登录失败！", status, xmlDoc);
    },
  });

  if (-1 == iRet) {
    clickStartRealPlay();
  }
};

// 获取通道
const getChannelInfo = () => {
  if (null == videoPlugins.szDeviceIdentify) {
    return;
  }
  // 数字通道
  window.WebVideoCtrl.I_GetDigitalChannelInfo(videoPlugins.szDeviceIdentify, {
    async: false,
    success: (xmlDoc: any) => {
      //  nvr需要选择通道
      clickStartRealPlay();
    },
    error: (status: any, xmlDoc: any) => {
      console.log(" 获取数字通道失败！");
    },
  });
  // 零通道
};

// 获取端口
const getDevicePort = () => {
  if (null == videoPlugins.szDeviceIdentify) {
    return;
  }

  videoPlugins.port = window.WebVideoCtrl.I_GetDevicePort(videoPlugins.szDeviceIdentify);
  if (videoPlugins.port != null) {
    clickStartRealPlay();
    return true;
  } else {
    console.log(" 获取端口失败！");
    return false;
  }
};

// 开始预览
const clickStartRealPlay = (iStreamType?: number) => {
  let wndInfo = window.WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

  let iChannelID = "1"; // 通道列表
  let bZeroChannel = false; // 是否播放零通道(下拉框)
  let szInfo = "";

  if ("undefined" === typeof iStreamType) {
    iStreamType = 2; // 1主码流 2子码流 3第三码流 4转码码流
  }

  if (null == videoPlugins.szDeviceIdentify) {
    return;
  }
  let startRealPlay = () => {
    window.WebVideoCtrl.I_StartRealPlay(videoPlugins.szDeviceIdentify, {
      iRtspPort: 554,
      iStreamType: iStreamType,
      iChannelID: iChannelID,
      bZeroChannel: bZeroChannel,
      success: () => {
        szInfo = "开始预览成功！";
        console.log(szInfo);
      },
      error: (status: number, xmlDoc: any) => {
        if (403 === status) {
          szInfo = "设备不支持Websocket取流！";
        } else {
          szInfo = "开始预览失败！";
        }
        ElMessage.error(szInfo);
      },
    });
  };

  if (wndInfo != null) {
    // 已经在播放了，先停止
    window.WebVideoCtrl.I_Stop({
      success: () => {
        startRealPlay();
      },
    });
  } else {
    startRealPlay();
  }
};

// 停止预览
const clickStopRealPlay = () => {
  let oWndInfo = window.WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
    szInfo = "";

  if (oWndInfo != null) {
    window.WebVideoCtrl.I_Stop({
      success: () => {
        szInfo = "停止预览成功！";
        console.log(szInfo);
      },
      error: () => {
        szInfo = "停止预览失败！";
        console.log(szInfo);
      },
    });
  }
};

// 全屏
const clickFullScreen = () => {
  window.WebVideoCtrl.I_FullScreen(true);
};

// 停止录像
const clickStopRecord = (szType: string, iWndIndex: number) => {
  if ("undefined" === typeof iWndIndex) {
    iWndIndex = g_iWndIndex;
  }
  var oWndInfo = window.WebVideoCtrl.I_GetWindowStatus(iWndIndex),
    szInfo = "";

  if (oWndInfo != null) {
    window.WebVideoCtrl.I_StopRecord({
      success: () => {
        if ("realplay" === szType) {
          szInfo = "停止录像成功！";
        } else if ("playback" === szType) {
          szInfo = "停止剪辑成功！";
        }
        showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
      },
      error: () => {
        if ("realplay" === szType) {
          szInfo = "停止录像失败！";
        } else if ("playback" === szType) {
          szInfo = "停止剪辑失败！";
        }
        showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
      },
    });
  }
};

// 查看摄像
const videoChange = () => {
  videoOpen.value = true;
  nextTick(() => {
    if (!isLogin.value) {
      isLogin.value = true;
      initPlugin();
    } else {
      clickStartRealPlay();
    }
  });
};

// 关闭摄像头弹窗
const videoClose = () => {
  isLogin.value = false;
  clickStopRealPlay();
};
</script>

<style lang="scss" scoped>
.video_box {
  width: 100%;
  height: 100%;

  :deep(.el-dialog__body) {
    padding: 0 !important;
  }
}

.plugin {
  width: 100%;
  height: 100%;
}

.playWnd {
  width: 800px;
  height: 600px;
  margin: 5;
}
</style>
