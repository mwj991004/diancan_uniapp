import { $http } from './request.js'

//点餐模块接口
export default  {
  //获取商品分类数据
  async  getGoodsCateList(){
    const { data: res } = await $http.get('/miniprogram/api/ordering/goodscatedata')
     // 3.2 请求失败
      if (res.meta.status !== 200) {
        uni.$showMsg()
        return
      }
      // 3.3 请求成功，返回数据
      return res.message
    }, 
  async  getGoodsInfoList(){
    const { data: res } = await $http.get('/miniprogram/api/ordering/goodsinfodata')
   // 3.2 请求失败
    if (res.meta.status !== 200) {
      uni.$showMsg()
      return
    }
    // 3.3 请求成功，返回数据
    return res.message
  },
}