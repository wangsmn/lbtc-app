import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import "amfe-flexible";
import "vant/lib/index.css";
import "@/styles/common.css";
import "@/styles/reset.css";
Vue.use(ElementUI);
Vue.use(Vant);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
