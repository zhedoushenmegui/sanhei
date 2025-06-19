import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import {ElMessage} from 'element-plus'
import {ElNotification} from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css';
import './style.css'


import utils from "@/utils/utils";
import time_util from "@/utils/time_util";

const app = createApp(App)

app.config.globalProperties.$timeutil = time_util;
app.config.globalProperties.$cdt = time_util.convertDt;
app.config.globalProperties.$utils = utils;
app.config.globalProperties.$post = utils.post;
app.config.globalProperties.$get = utils.get;
///
app.config.globalProperties.$noterr = (s,) => {
  ElNotification({
    message: s,
    type: 'error',
    showClose: false,
  })
};
app.config.globalProperties.$notinfo = (s,) => {
  ElNotification({
    message: s,
    type: 'info',
    showClose: false,
  })
};
app.config.globalProperties.$notsuc = (s,) => {
  ElNotification({
    title: 'Success',
    message: s,
    type: 'success',
    showClose: false,
  })
};


app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(ElMessage)
app.use(ElNotification)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')

String.prototype.format = function () {
  if (arguments.length === 0) {
    return this;
  }
  for (var s = this, i = 0; i < arguments.length; i++) {
    s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
  }
  return s;
};
