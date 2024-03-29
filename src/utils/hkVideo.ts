import mitt from "mitt";
import X2JS from "x2js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emitter = mitt();
const ERROR_CODE_LOGIN_REPEATLOGIN = 2001; //设备已登录，重复登录

interface LoginInfo {
  /**
   * 设备ip
   */
  ip: string;

  /**
   * 设备端口
   */
  port: string;

  /**
   * http 协议，1 表示 http 协议 2 表示 https 协议
   */
  iPrototocol: number;

  /**
   * 登录用户名称
   */
  userName: string;

  /**
   * 用户密码
   */
  pwd: string;
}

export class HkCamera {
  // 登录参数
  private loginInfo: LoginInfo = {
    ip: "",
    port: "80",
    iPrototocol: 1,
    userName: "admin",
    pwd: "a1234567",
  };
  private iWndowType: number; //默认分屏类型
  private elId: string; //绑定元素ID
  private autoRealPlay: boolean; //是否自动预览
  private isLogin!: boolean; //是否登录
  private iChannelID: number; //播放通道号
  private channelCallback: any; //获取播放通道
  private wndIndexCallback: any;
  private g_bPTZAuto: boolean; //云台自动
  private iPTZSpeed: number; //云台速度
  private g_iWndIndex: number; //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
  private g_iSearchTimes: number; //录像搜索次数
  private searchRecordsList: never[]; //搜索的录像列表
  private szStartTime: any; //录像搜索开始时间
  private szEndTime: any; //录像搜索结束时间
  private isStartRealPlay: boolean; //是否已开始预览
  static instance: HkCamera | null;

  constructor({ elId, ip, iChannelID, iWndowType = 1, autoRealPlay = true, channelCallback, wndIndexCallback }) {
    this.elId = elId;
    this.loginInfo.ip = ip;
    this.iChannelID = iChannelID;
    this.iWndowType = iWndowType;
    this.autoRealPlay = autoRealPlay;
    this.channelCallback = channelCallback;
    this.wndIndexCallback = wndIndexCallback;

    this.g_bPTZAuto = false;
    this.iPTZSpeed = 2;
    this.g_iWndIndex = 0;
    this.g_iSearchTimes = 0;
    this.searchRecordsList = [];
    this.szStartTime;
    this.szEndTime;
    this.isLogin = false;
    this.isStartRealPlay = false;
  }

  static getInstance({ elId, ip, iChannelID, iWndowType, autoRealPlay, channelCallback, wndIndexCallback }) {
    if (!HkCamera.instance) {
      // 将创建的实例对象保存下来
      HkCamera.instance = new HkCamera({
        elId,
        ip,
        iChannelID,
        iWndowType,
        autoRealPlay,
        channelCallback,
        wndIndexCallback,
      });
    }
    HkCamera.instance?.initPlugin();
    return HkCamera.instance;
  }

  // 初始化插件
  initPlugin() {
    //TODO 1. 初始化插件参数及插入插件
    WebVideoCtrl.I_InitPlugin({
      bWndFull: false, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
      iWndowType: this.iWndowType, //分屏类型
      // 选中窗口
      cbSelWnd: (xmlDoc: any) => {
        const index = this.xmlToJson(xmlDoc)["RealPlayInfo"]["SelectWnd"];
        this.wndIndexCallback(index);
      },
      cbDoubleClickWnd: (iWndIndex: string, bFullScreen: any) => {
        let szInfo = "当前放大的窗口编号：" + iWndIndex;
        if (!bFullScreen) {
          szInfo = "当前还原的窗口编号：" + iWndIndex;
        }
        this.showCBInfo(szInfo);
      },
      cbEvent: (iEventType: number, iParam1: string, iParam2: any) => {
        if (2 == iEventType) {
          // 回放正常结束
          this.showCBInfo("窗口" + iParam1 + "回放结束！");
        } else if (-1 == iEventType) {
          this.showCBInfo("设备" + iParam1 + "网络错误！");
        } else if (3001 == iEventType) {
          // clickStopRecord(g_szRecordType, iParam1);
        }
      },
      cbInitPluginComplete: () => {
        // TODO 3.嵌入插件
        WebVideoCtrl.I_InsertOBJECTPlugin(this.elId).then(
          () => {
            if (!this.autoRealPlay) {
              WebVideoCtrl.I_Resize(1, 1); //不使用海康威视播放器，大小为肉眼看不见
            }
            console.log("hkCamera 调试组件注册成功");
            //TODO 2. 检查插件是否最新
            WebVideoCtrl.I_CheckPluginVersion().then((bFlag: any) => {
              if (bFlag) {
                ElMessage.warning("检测到新的插件版本，双击开发包目录里的HCWebSDKPlugin.exe升级");
              }
            });

            this.login();
          },
          () => {
            ElMessageBox.confirm("插件初始化失败,确认是否安装插件?", "Warning", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                const basUrl = import.meta.env.VITE_APP_BASE_URL;
                const link = document.createElement("a");
                link.href = basUrl + "/hk/HCWebSDKPlugin.exe"; // 文件路径
                link.download = "HCWebSDKPlugin.exe"; // 下载后的文件名
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              })
              .catch(() => {});
          }
        );
      },
    });
    console.log("------------width--------", $(`#${this.elId}`).width());

    if (this.autoRealPlay) {
      // 窗口事件绑定
      $(window).bind({
        resize: () => {
          WebVideoCtrl.I_Resize($(`#${this.elId}`).width(), $(`#${this.elId}`).height());
        },
      });
    }
  }

  //TODO 4. 登录
  login() {
    const szDeviceIdentify = this.loginInfo.ip + "_" + this.loginInfo.port;
    WebVideoCtrl.I_Login(this.loginInfo.ip, 1, this.loginInfo.port, this.loginInfo.userName, this.loginInfo.pwd, {
      timeout: 3000,
      success: (xmlDoc: any) => {
        console.log(szDeviceIdentify);
        this.isLogin = true;
        setTimeout(() => {
          setTimeout(() => {
            if (this.autoRealPlay) this.clickStartRealPlay(this.iChannelID);
            this.getChannelInfo();
          }, 1000);
          this.getDevicePort();
        }, 10);
      },
      error: (oError: { errorCode: any; errorMsg: any }) => {
        if (ERROR_CODE_LOGIN_REPEATLOGIN) {
          this.isLogin = true;
          this.showOPInfo(szDeviceIdentify + " 已登录过！");
        } else {
          this.isLogin = false;
          this.showOPInfo(szDeviceIdentify + " 登录失败！", oError.errorCode, oError.errorMsg);
        }
      },
    });
  }

  // 退出
  logout(cb: { (): void; (): void }) {
    const szDeviceIdentify = this.loginInfo.ip + "_" + this.loginInfo.port;

    if (null == szDeviceIdentify) {
      return;
    }

    WebVideoCtrl.I_Logout(szDeviceIdentify).then(
      () => {
        this.isLogin = false;
        console.log("hkCamera 调试 ---退出成功");
        if (cb) cb();
      },
      () => {
        console.log("hkCamera 调试 ---退出失败！");
      }
    );
  }

  destroy() {
    if (this.isLogin) {
      if (this.isStartRealPlay) {
        // 若销毁的时候当前正在播放，需要暂定预览
        this.stopRealPlay();
      }
      // 销毁时，先退出登录
      this.logout(() => {
        HkCamera.instance = null;
        this.autoRealPlay = false;
        WebVideoCtrl.I_DestroyPlugin().then(
          () => {
            console.log("hkCamera 调试 ---组件销毁成功");
          },
          (err: any) => {
            console.log("hkCamera 调试 ---组件销毁失败", err);
          }
        );
      });
    } else {
      HkCamera.instance = null;
      WebVideoCtrl.I_DestroyPlugin();
      console.log("销毁成功");
    }
  }

  //TODO 5.获取通道
  getChannelInfo() {
    const szDeviceIdentify = this.loginInfo.ip;
    //     oSel = $("#channels").empty();

    if (null == szDeviceIdentify) {
      return;
    }

    // 模拟通道
    WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
      success: (xmlDoc: any) => {
        const oChannels = this.xmlToJson(xmlDoc)["VideoInputChannelList"];

        console.log("hkCamera 调试 ---xmlDoc---模拟通道", oChannels);
      },
      error: (oError: { errorCode: any; errorMsg: any }) => {
        console.log(szDeviceIdentify + " 获取模拟通道失败！", oError.errorCode, oError.errorMsg);
      },
    });
    // 数字通道
    WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
      success: (xmlDoc: any) => {
        const list = this.xmlToJson(xmlDoc)["InputProxyChannelStatusList"]["InputProxyChannelStatus"];

        console.log("hkCamera 调试 ---xmlDoc---数字通道", list, this.autoRealPlay);

        this.channelCallback(list);
      },
      error: (oError: { errorCode: any; errorMsg: any }) => {
        console.log(szDeviceIdentify + " 获取数字通道失败！", oError.errorCode, oError.errorMsg);
      },
    });
    // 零通道
    // WebVideoCtrl.I_GetZeroChannelInfo(szDeviceIdentify, {
    //   success: (xmlDoc) => {
    //     var ZeroVideoChannel =
    //       this.xmlToJson(xmlDoc)["ZeroVideoChannelList"][
    //         "ZeroVideoChannel"
    //       ];
    //     console.log(
    //       "hkCamera 调试 ---xmlDoc---零通道",
    //       ZeroVideoChannel
    //     );
    //     //   $.each(oChannels,  (i) {
    //     //     var id = $(this).find("id").eq(0).text(),
    //     //       name = $(this).find("name").eq(0).text();
    //     //     if ("" == name) {
    //     //       name =
    //     //         "Zero Channel " +
    //     //         (i < 9 ? "0" + (i + 1) : i + 1);
    //     //     }
    //     //     if (
    //     //       "true" == $(this).find("enabled").eq(0).text()
    //     //     ) {
    //     //       // 过滤禁用的零通道
    //     //       oSel.append(
    //     //         "<option value='" +
    //     //           id +
    //     //           "' bZero='true'>" +
    //     //           name +
    //     //           "</option>"
    //     //       );
    //     //     }
    //     //   });
    //     this.showOPInfo(
    //       szDeviceIdentify + " 获取零通道成功！"
    //     );
    //   },
    //   error: (oError) => {
    //     this.showOPInfo(
    //       szDeviceIdentify + " 获取零通道失败！",
    //       oError.errorCode,
    //       oError.errorMsg
    //     );
    //   },
    // });
  }

  //TODO 6. 获取端口
  getDevicePort() {
    const szDeviceIdentify = this.loginInfo.ip;

    if (null == szDeviceIdentify) {
      return;
    }

    WebVideoCtrl.I_GetDevicePort(szDeviceIdentify).then(
      (oPort: any) => {
        //   $("#deviceport").val(oPort.iDevicePort);
        //   $("#rtspport").val(oPort.iRtspPort);

        console.log(szDeviceIdentify + " 获取端口成功！");
      },
      (oError: { errorCode: any; errorMsg: any }) => {
        const szInfo = "获取端口失败！";
        console.log(szDeviceIdentify + szInfo, oError.errorCode, oError.errorMsg);
      }
    );
  }

  // 窗口分割数
  changeWndNum(iType: string | number) {
    iType = parseInt(iType, 10);
    WebVideoCtrl.I_ChangeWndNum(iType).then(
      () => {
        setTimeout(() => {
          this.clickStartRealPlay(1, 1, 1);
          this.clickStartRealPlay(2, 1, 2);
          this.clickStartRealPlay(3, 1, 3);
        }, 500);

        this.showOPInfo("窗口分割成功！");
      },
      (oError: { errorCode: any; errorMsg: any }) => {
        const szInfo = "窗口分割失败！";
        this.showOPInfo(szInfo, oError.errorCode, oError.errorMsg);
      }
    );
  }
  // ---------------------------------------------------------------------------控制云台
  // 1-上，2-下，3-左，4-右，5-左上，6-左下，7-右上，8-右下，9-自转，
  // 10-调焦+，11-调焦-，12-F 聚焦+，13-聚焦-，14-光圈+, 15-光圈-
  //TODO 9.PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
  ptzCtrl(iPTZIndex: number) {
    console.log("ctrlCamera----", iPTZIndex);

    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
      bZeroChannel = false,
      iPTZSpeed = 2;

    if (bZeroChannel) {
      ElMessage.error("零通道不支持云台");
      return;
    }

    if (oWndInfo != null) {
      if (9 == iPTZIndex && this.g_bPTZAuto) {
        // iPTZSpeed = 0; // 自动开启后，速度置为0可以关闭自动
      } else {
        this.g_bPTZAuto = false; // 点击其他方向，自动肯定会被关闭
      }

      WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
        iPTZSpeed: iPTZSpeed,
        success: (xmlDoc: any) => {
          console.log("xmlDoc----", xmlDoc);
          if (9 == iPTZIndex && this.g_bPTZAuto) {
            console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！");
          } else {
            console.log(oWndInfo.szDeviceIdentify + " 开启云台成功！");
          }
          if (9 == iPTZIndex) {
            this.g_bPTZAuto = !this.g_bPTZAuto;
          }
        },
        error: (oError: { errorCode: any; errorMsg: any }) => {
          console.log("error", oError);
          this.showOPInfo(oWndInfo.szDeviceIdentify + " 开启云台失败！", oError.errorCode, oError.errorMsg);
        },
      });
    }
  }
  // 云台停止
  ptzStop(iPTZIndex: any) {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
    if (oWndInfo != null) {
      WebVideoCtrl.I_PTZControl(iPTZIndex, true, {
        success: function (xmlDoc: any) {
          console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！");
        },
        error: function (oError: { errorCode: any; errorMsg: any }) {
          console.log(oWndInfo.szDeviceIdentify + " 停止云台失败！", oError.errorCode, oError.errorMsg);
        },
      });
    }
  }
  // ----------------------------------------------------------------------------播放、zantng
  //TODO 7.开始预览  iStreamType--码率
  clickStartRealPlay(iChannelID = 2, iStreamType = 1, gi = this.g_iWndIndex) {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(gi),
      szDeviceIdentify = this.loginInfo.ip + "_" + this.loginInfo.port;
    // iRtspPort = parseInt($("#rtspport").val(), 10),
    // iChannelID = parseInt($("#channels").val(), 10),
    // bZeroChannel =
    //   $("#channels option")
    //     .eq($("#channels").get(0).selectedIndex)
    //     .attr("bZero") == "true"
    //     ? true
    //     : false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const szInfo = "";

    // if ("undefined" === typeof iStreamType) {
    //   iStreamType = parseInt($("#streamtype").val(), 10);
    // }

    // if (null == szDeviceIdentify) {
    //   return;
    // }
    console.log(oWndInfo, iChannelID, gi, iStreamType, szDeviceIdentify);
    this.showOPInfo(szDeviceIdentify + " 正在连接监控...");
    const startRealPlay = function () {
      WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
        iWndIndex: gi,
        iStreamType: iStreamType,
        iChannelID: iChannelID,
        bZeroChannel: false,
        success: function () {
          this.isStartRealPlay = true;
          this.showOPInfo(szDeviceIdentify + " 开始预览成功！");
        },
        error: function (oError: { errorCode: any; errorMsg: any }) {
          this.showOPInfo(szDeviceIdentify + " 开始预览失败！", oError.errorCode, oError.errorMsg);
        },
      });
    };

    if (oWndInfo != null) {
      // 已经在播放了，先停止
      WebVideoCtrl.I_Stop({
        success: function () {
          startRealPlay();
        },
      });
    } else {
      startRealPlay();
    }
  }

  // 停止预览
  stopRealPlay() {
    // eslint-disable-next-line prefer-const
    let oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
      szInfo = "";
    const szDeviceIdentify = this.loginInfo.ip + "_" + this.loginInfo.port;

    if (oWndInfo != null) {
      WebVideoCtrl.I_Stop({
        success: function () {
          szInfo = "停止预览成功！";
          this.isStartRealPlay = false;
          console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
        },
        error: function (oError: { errorCode: any; errorMsg: any }) {
          console.log(szDeviceIdentify + " 停止预览失败！", oError.errorCode, oError.errorMsg);
        },
      });
    }
  }
  // -------------------------------------------------------------------------------搜索录像
  // // 分页查询录像
  // paginationQuery({ channelId, szStartTime, szEndTime, pageNum, pageSize, callback }) {
  //   console.log("paginationQuery----", channelId, szStartTime, szEndTime, pageNum, pageSize);
  //   let paging = () => {
  //     let len = this.searchRecordsList.length,
  //       s = pageSize * (pageNum - 1),
  //       e = pageSize * pageNum;
  //     // console.log('paging-----', s, e);
  //     let list = len > 0 ? this.searchRecordsList.slice(s, e) : [];
  //     let result = {
  //       data: list,
  //       total: len,
  //       pages: Math.ceil(len / pageSize),
  //       pageNum,
  //       pageSize,
  //     };
  //     callback(result);
  //   };

  //   if (
  //     (channelId == this.iChannelID && szStartTime == this.szStartTime && szEndTime == this.szEndTime) ||
  //     pageNum > 1
  //   ) {
  //     paging();
  //   } else {
  //     this.recordSearch(channelId, szStartTime, szEndTime, (success: any) => {
  //       paging();
  //     });
  //   }
  // }

  // // 搜索录像
  // recordSearch(iChannelId: any, szStartTime: any, szEndTime: any, cb: { (success: any): void; (arg0: string): void; }) {
  //   this.iChannelID = iChannelId;
  //   this.szStartTime = szStartTime;
  //   this.szEndTime = szEndTime;
  //   console.log("paginationQuery----222===", this.g_iSearchTimes, iChannelId, szStartTime, szEndTime);
  //   let this = this,
  //     szDeviceIdentify = this.ip + "_" + this.port,
  //     bZeroChannel = false,
  //     iStreamType = 1;
  //   if (Date.parse(this.szEndTime.replace(/-/g, "/")) - Date.parse(this.szStartTime.replace(/-/g, "/")) < 0) {
  //     alert("开始时间大于结束时间");
  //     return;
  //   }
  //   if (null == szDeviceIdentify) {
  //     return;
  //   }

  //   if (bZeroChannel) {
  //     // 零通道不支持录像搜索
  //     return;
  //   }

  //   let search = (iType: number) => {
  //     if (0 == iType) {
  //       // 首次搜索
  //       this.g_iSearchTimes = 0;
  //       this.searchRecordsList = [];
  //     }

  //     //如果是前端设备，需要将搜索时间转换为UTC时间
  //     WebVideoCtrl.I_RecordSearch(szDeviceIdentify, this.iChannelID, this.szStartTime, this.szEndTime, {
  //       iStreamType: iStreamType,
  //       iSearchPos: this.g_iSearchTimes,
  //       success: function (xmlDoc: any) {
  //         let CMSearchResult = this.xmlToJson(xmlDoc)["CMSearchResult"];
  //         console.log("搜索录像----", this.g_iSearchTimes, CMSearchResult);

  //         if (CMSearchResult.responseStatusStrg != "NO MATCHES")
  //           this.searchRecordsList = [...this.searchRecordsList, ...CMSearchResult.matchList.searchMatchItem];

  //         if (CMSearchResult.responseStatusStrg == "MORE") {
  //           //继续搜索
  //           this.g_iSearchTimes = this.searchRecordsList.length;
  //           search(this.g_iSearchTimes);
  //         }
  //         if (CMSearchResult.responseStatusStrg == "OK") {
  //           //搜索完成
  //           // this.searchRecordsList.reverse();
  //           cb("success");
  //         }
  //         if (CMSearchResult.responseStatusStrg == "NO MATCHES") {
  //           //未匹配录像文件
  //           cb("success");
  //         }
  //       },
  //       error: function (oError: any) {
  //         console.log("hkCamera 调试 ---oError---", oError);
  //         cb("error");
  //       },
  //     });
  //   };

  //   search(0);
  // }

  // // 设置预置点
  // clickSetPreset(iPresetID: any) {
  //   var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

  //   if (oWndInfo != null) {
  //     WebVideoCtrl.I_SetPreset(iPresetID, {
  //       success: function (xmlDoc: any) {
  //         console.log(oWndInfo.szDeviceIdentify + " 设置预置点成功！");
  //       },
  //       error: function (oError: { errorCode: any; errorMsg: any; }) {
  //         console.log(oWndInfo.szDeviceIdentify + " 设置预置点失败！", oError.errorCode, oError.errorMsg);
  //       },
  //     });
  //   }
  // }

  // // 调用预置点
  // clickGoPreset(iPresetID: any) {
  //   var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

  //   if (oWndInfo != null) {
  //     WebVideoCtrl.I_GoPreset(iPresetID, {
  //       success: function (xmlDoc: any) {
  //         console.log(oWndInfo.szDeviceIdentify + " 调用预置点成功！");
  //       },
  //       error: function (oError: { errorCode: any; errorMsg: any; }) {
  //         console.log(oWndInfo.szDeviceIdentify + " 调用预置点失败！", oError.errorCode, oError.errorMsg);
  //       },
  //     });
  //   }
  // }

  // //TODO 8.开始回放
  // clickStartPlayback() {
  //   let oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
  //     szDeviceIdentify = this.loginInfo.ip,
  //     iRtspPort: any,
  //     iStreamType = 1,
  //     bZeroChannel = false,
  //     iChannelID = 1,
  //     szStartTime = "2024-01-10 23:36:40",
  //     szEndTime = "2024-01-11 00:00:21",
  //     szInfo = "",
  //     bChecked = false,
  //     iRet = -1;

  //   if (null == szDeviceIdentify) {
  //     return;
  //   }

  //   if (bZeroChannel) {
  //     // 零通道不支持回放
  //     return;
  //   }

  //   let startPlayback = function () {
  //     if (bChecked) {
  //       // 启用转码回放
  //       var oTransCodeParam = {
  //         TransFrameRate: "14", // 0：全帧率，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
  //         TransResolution: "1", // 255：Auto，3：4CIF，2：QCIF，1：CIF
  //         TransBitrate: "19", // 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
  //       };
  //       WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
  //         iRtspPort: iRtspPort,
  //         iStreamType: iStreamType,
  //         iChannelID: iChannelID,
  //         szStartTime: szStartTime,
  //         szEndTime: szEndTime,
  //         oTransCodeParam: oTransCodeParam,
  //         success: function () {
  //           szInfo = "开始回放成功！";
  //           this.showOPInfo(szDeviceIdentify + " " + szInfo);
  //         },
  //         error: function (oError: { errorCode: any; errorMsg: any; }) {
  //           szInfo = "开始回放失败！";
  //           this.showOPInfo(szDeviceIdentify + szInfo, oError.errorCode, oError.errorMsg);
  //         },
  //       });
  //     } else {
  //       WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
  //         iRtspPort: iRtspPort,
  //         iStreamType: iStreamType,
  //         iChannelID: iChannelID,
  //         szStartTime: szStartTime,
  //         szEndTime: szEndTime,
  //         success: function () {
  //           szInfo = "开始回放成功！";
  //           this.showOPInfo(szDeviceIdentify + " " + szInfo);
  //         },
  //         error: function (oError: { errorCode: any; errorMsg: any; }) {
  //           szInfo = "开始回放失败！";
  //           this.showOPInfo(szDeviceIdentify + szInfo, oError.errorCode, oError.errorMsg);
  //         },
  //       });
  //     }
  //   };

  //   if (oWndInfo != null) {
  //     // 已经在播放了，先停止
  //     WebVideoCtrl.I_Stop({
  //       success: function () {
  //         startPlayback();
  //       },
  //     });
  //   } else {
  //     startPlayback();
  //   }
  // }
  // // 停止回放
  // clickStopPlayback() {
  //   var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
  //     szInfo = "";

  //   if (oWndInfo != null) {
  //     WebVideoCtrl.I_Stop({
  //       success: function () {
  //         szInfo = "停止回放成功！";
  //         this.showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
  //       },
  //       error: function (oError: { errorCode: any; errorMsg: any; }) {
  //         szInfo = "停止回放失败！";
  //         this.showOPInfo(szDeviceIdentify + szInfo, oError.errorCode, oError.errorMsg);
  //       },
  //     });
  //   }
  // }

  // 暂停
  clickPausePlayback() {
    // eslint-disable-next-line prefer-const
    let oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
      szInfo = "";

    if (oWndInfo != null) {
      WebVideoCtrl.I_Pause({
        success: function () {
          szInfo = "暂停成功！";
          this.showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
        },
        error: function (oError: { errorCode: any; errorMsg: any }) {
          szInfo = "暂停失败！";
          this.showOPInfo(oWndInfo.szDeviceIdentify + szInfo, oError.errorCode, oError.errorMsg);
        },
      });
    }
  }

  // 恢复
  clickResumePlayback() {
    // eslint-disable-next-line prefer-const
    let oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
      szInfo = "";

    if (oWndInfo != null) {
      WebVideoCtrl.I_Resume({
        success: function () {
          szInfo = "恢复成功！";
          this.showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
        },
        error: function (oError: { errorCode: any; errorMsg: any }) {
          szInfo = "恢复失败！";
          this.showOPInfo(oWndInfo.szDeviceIdentify + szInfo, oError.errorCode, oError.errorMsg);
        },
      });
    }
  }

  // -------------------------------------------------------------------------工具类
  // 格式化时间
  dateFormat(oDate: Date, fmt: string) {
    const o: any = {
      "M+": oDate.getMonth() + 1, //月份
      "d+": oDate.getDate(), //日
      "h+": oDate.getHours(), //小时
      "m+": oDate.getMinutes(), //分
      "s+": oDate.getSeconds(), //秒
      "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
      S: oDate.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substring(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return fmt;
  }
  //  格式化xml
  xmlToJson(str: Node) {
    const serializeToString = new XMLSerializer().serializeToString(str);
    const x2js = new X2JS();
    const result = x2js.xml2js(serializeToString);
    // console.log("hkCamera 调试 ---result--", result);
    // return result.CMSearchResult;
    return result;
  }
  // 显示回调信息
  showCBInfo(szInfo: string) {
    szInfo = "<div>" + this.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
    $(`#${this.elId}`).append(szInfo);
  }
  // 显示操作信息
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showOPInfo(szInfo: string, status?: undefined, xmlDoc?: undefined) {
    // let content = `${szInfo || ""}`; //${status || ""}
    // console.log('showOPInfo---',content,$("#sz_info"));
    // if ($("#sz_info").length > 0) {
    //   //有该元素
    //   $(`#sz_info`).html(content);
    // } else {
    //   //无该元素
    //   let szTip = `<div id='sz_info' style='width:100%;position: absolute;bottom: -1.3rem;left: 0;text-align:center;color:rgba(255,255,255,0.8)'>
    //     ${content}
    //   </div>`;
    //   $(`#${this.elId}`).css({
    //     position: "relative",
    //   });
    //   $(`#${this.elId}`).append(szTip);
    // }
    ElMessage.warning(szInfo);
  }
}
