import { $http } from './request.js'

//点餐模块接口
export default  {
  //获取菜单列表数据
  getOrderListData(){
    return $http.get('/api/ordering/')
  }
}