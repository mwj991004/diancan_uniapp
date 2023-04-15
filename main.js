import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'

//导入封装的请求对象
import api from '@/api/index.js'
uni.$api = api

// 封装的展示消息提示的方法
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

// 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
const app = new Vue({
	...App,
  store
})
app.$mount()
