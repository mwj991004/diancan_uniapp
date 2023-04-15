import { $http } from './request.js'

//订单模块接口
export default  {
  //获取订单数据
  getOrderListData(){
    return $http.get('/api/order/')
  }
}