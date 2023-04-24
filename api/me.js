import { $http } from './request.js'

//我的模块接口
export default  {
  //用户登录
  async  login(query){
    const { data: res } = await $http.post('/miniprogram/me/api/login', query)
   // 3.2 请求失败
    if (res.meta.status !== 200) {
      uni.$showMsg(res.meta.msg)
      return
    }
    // 3.3 请求成功，返回数据
    return res.message
  },
  //获取用户信息
  async  getUserInfo(){
    const { data: res } = await $http.get('/miniprogram/me/getuserinfo')
   // 3.2 请求失败
    if (res.meta.status !== 200) {
      uni.$showMsg(res.meta.msg)
      return
    }
    // 3.3 请求成功，返回数据
    return res.message
  },
  
  //用户提交个人信息
  async  postUserInfo(userinfo){
    const { data: res } = await $http.post('/miniprogram/me/postuserinfo', userinfo)
   // 3.2 请求失败
    if (res.meta.status !== 200) {
      uni.$showMsg(res.meta.msg)
      return
    }
    // 3.3 请求成功，返回状态
    return res
  },

  
}