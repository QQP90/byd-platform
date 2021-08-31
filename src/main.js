import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/global.less";
import {
  ConfigProvider,
  Layout,
  Menu,
  Button,
  Icon,
  Tabs,
  Select,
  DatePicker,
  Table,
  Checkbox,
  Pagination,
  Spin,
  Input,
  message,
  Modal,
  Radio,
  Skeleton,
} from "ant-design-vue";

const echarts = require("echarts");

Vue.use(ConfigProvider);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Tabs);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(Table);
Vue.use(Checkbox);
Vue.use(Pagination);
Vue.use(Spin);
Vue.use(Input);
Vue.use(Modal);
Vue.use(Radio);
Vue.use(Skeleton);
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$message = message;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
