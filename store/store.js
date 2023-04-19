// 页面路径：store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

// 1. 导入主页的 vuex 模块
import moduleHome from './modules/hmoe.js'
// 1. 导入点单页购物车的 vuex 模块
import moduleCart from './modules/cart.js'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
  // TODO：挂载 store 模块
  modules: {
    m_home:moduleHome,
    m_cart: moduleCart,
  },
  
})

export default store