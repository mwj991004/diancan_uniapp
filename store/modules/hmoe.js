export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    //订单方式，外卖或者堂食
    consumptionMethod:'tangsi',
  }),

  // 模块的 mutations 方法
  mutations: {
    updateConsumptionMethod(state, str){
      state.consumptionMethod = str
    }
  },

  // 模块的 getters 属性
  getters: {},
}
