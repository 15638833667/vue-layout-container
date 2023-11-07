import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import './styles/index.scss' // global css

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import MsUI from 'ms-ui'
Vue.use(MsUI)

// 自定义指令
import Directives from '@/directive/index'
Vue.use(Directives)


new Vue({
  render: h => h(App)
}).$mount('#app')
