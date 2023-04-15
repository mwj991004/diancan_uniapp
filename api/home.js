import { $http } from './request.js'

//首页模块接口
export default  {
  //获取轮播图数据的api
  async  getSwiperData(){
    const { data: res } = await $http.get('/miniprogram/api/home/swiperdata')
   // 3.2 请求失败
    if (res.meta.status !== 200) {
      uni.$showMsg()
      return
    }
    // 3.3 请求成功，返回数据
    return res.message
  },
  
  //获取推荐列表数据的api
  async  getbannerData(){
    const { data: res } = await $http.get('/miniprogram/api/home/bannerdata')
   // 3.2 请求失败
    if (res.meta.status !== 200) {
      uni.$showMsg()
      return
    }
    // 3.3 请求成功，返回数据
    return res.message
  }
}