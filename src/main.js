import Vue from "vue";
import ElementUI from "element-ui";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueAMap from "vue-amap";
import uploader from "vue-simple-uploader";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/reset.styl";
import "@/styles/font/css/font-awesome.min.css";
Vue.use(ElementUI);
Vue.use(VueAMap);
Vue.use(uploader);
Vue.config.productionTip = false;
window.$count = 0;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
