import { createApp } from "vue";
// global css
import "uno.css";
import "@/assets/styles/index.scss";
import "element-plus/theme-chalk/dark/css-vars.css";

// App、router、store
import App from "./App.vue";
import store from "./store";
import router from "./router";

// 自定义指令
import directive from "./directive";

// 注册插件
import plugins from "./plugins/index"; // plugins
import { download } from "@/utils/request";

// 预设动画
import animate from "./animate";

// svg图标
import "virtual:svg-icons-register";
import ElementIcons from "@/plugins/svgicon";

// permission control
import "./permission";

import { useDict } from "@/utils/dict";
import { getConfigKey, updateConfigByKey } from "@/api/system/config";
import { parseTime, addDateRange, handleTree, selectDictLabel, selectDictLabels } from "@/utils/ruoyi";

// 国际化
import i18n from "@/lang/index";

// // 拖拽组件
// import Vue3DraggableResizable from "vue3-draggable-resizable";
// //需引入默认样式
// import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";

// datav
import DataVVue3 from "@kjgl77/datav-vue3";

// v3-drag-zoom 组件
import V3DragZoom from "v3-drag-zoom";
// v3-drag-zoom 全局样式（必须导入，否则无法正常使用）
import "v3-drag-zoom/dist/style.css";

const app = createApp(App);
// 全局方法挂载
app.config.globalProperties.useDict = useDict;
app.config.globalProperties.getConfigKey = getConfigKey;
app.config.globalProperties.updateConfigByKey = updateConfigByKey;
app.config.globalProperties.download = download;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;
app.config.globalProperties.animate = animate;

app.use(ElementIcons);
app.use(router);
app.use(store);
app.use(i18n);
app.use(plugins);
// app.use(Vue3DraggableResizable);
app.use(DataVVue3);
app.use(V3DragZoom);
// 自定义指令
directive(app);

app.mount("#app");
