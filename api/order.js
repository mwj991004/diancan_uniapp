import { $http } from './request.js'

//订单模块接口
export default  {
 //创建订单接口
 async  createOrder(orderInfo){
   const { data: res } = await $http.post('/miniprogram/me/order/createorder', orderInfo)
  // 3.2 请求失败
   if (res.meta.status !== 200) {
     uni.$showMsg(res.meta.msg)
     return
   }
   // 3.3 请求成功，返回状态
   return res
 },
  //订单预支付接口
  async  reqUnifiedorder(order_numb){
    const { data: res } = await $http.post('/miniprogram/me/order/req_unifiedorder', order_numb)
   // 3.2 请求失败
    if (res.meta.status !== 200) {
      uni.$showMsg(res.meta.msg)
      return
    }
    // 3.3 请求成功，返回状态
    return res
  },
   //订单支付状态查询接口
  async  orderPayStatus(order_numb){
    const { data: res } = await $http.post('/miniprogram/me/order/paystatus', order_numb)
   // 3.2 请求失败
    if (res.meta.status !== 200) {
      uni.$showMsg(res.meta.msg)
      return
    }
    // 3.3 请求成功，返回状态
    return res
  },
//历史订单查询接口
  async  orderAll(){
    const { data: res } = await $http.get('/miniprogram/me/order/all')
   // 3.2 请求失败
    if (res.meta.status !== 200) {
        
      if(res.meta.msg = '身份认证失败!'){
        uni.$showMsg('身份认证失败!即将跳转到登录页')
        setTimeout(()=>{
            uni.reLaunch({
              url:"../../pages/me/me"
            }
        )},2000)
      }else{
        uni.$showMsg(res.meta.msg)
      }
      return
    }
    // 3.3 请求成功，返回状态
    return res.message
  },
}