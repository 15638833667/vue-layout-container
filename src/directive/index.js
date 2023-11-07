import { drag, drop, resize } from './hmi'

// 自定义指令
const directives = {
  drag,
  drop,
  resize
}
// 批量注册指令
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
