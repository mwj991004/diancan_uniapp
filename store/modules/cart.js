export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 8 个属性：
    // { goods_id, goods_cateId,goods_name, goods_price, goods_count, goods_img, goods_state,goods_spec}
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  // 模块的 mutations 方法
  mutations: {
    // 加入购物车
    addToCart(state, goods) {
      // 根据提交的商品的Id，查询购物车中是否存在这件商品
      const findResult = state.cart.find((x) => {
        return  x.goods_id === goods.goods_id && x.goods_spec ===goods.goods_spec
      })
      // 如果购物车中没有这件商品，则是添加操作
      if (!findResult ) {
        state.cart.push(goods)
      } else {
        // 如果购物车中有这件商品，则更新商品数量
        findResult.goods_count = goods.goods_count
      }
      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('m_cart/saveToStorage')
    },
    
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find((x) => {
        return  x.goods_id === goods.goods_id && x.goods_spec ===goods.goods_spec
      }) 
      if(findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count  
        //通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
        this.commit('m_cart/saveToStorage')
      }
    },
    //从购物车中删除对应的商品信息
    removeGoods(state, goods) {
      // 调用数组的 filter 方法进行过滤
      state.cart = state.cart.filter(x => {
        return x.goods_id !== goods.goods_id || x.goods_spec !== goods.goods_spec})
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find((x) => {
        return  x.goods_id === goods.goods_id && x.goods_spec ===goods.goods_spec
      })  
    
      // 有对应的商品信息对象
      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(x => x.goods_state = newState)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
       uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    delCart(state) {
      state.cart = [],
      uni.removeStorageSync('cart')
    }
  },
  
 
  // 模块的 getters 属性
  getters: {
    // 统计购物车中商品的总数量
    total(state) {
      let c = 0
      // 循环统计商品的数量，累加到变量 c 中
      state.cart.forEach(goods => c += goods.goods_count)
      return c
    },
    //勾选的商品
    checkedGoods(state){
      return state.cart.filter(x => x.goods_state)
    },
    // 勾选的商品的总数量
    checkedCount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选的商品的总价
    checkedGoodsAmount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
      // reduce() 的返回值就是已勾选的商品的总价
      // 最后调用 toFixed(2) 方法，保留两位小数
      return state.cart.filter(x => x.goods_state)
        .reduce((total, item) => total += item.goods_count * item.goods_price, 0).toFixed(2)
    },
  }
}