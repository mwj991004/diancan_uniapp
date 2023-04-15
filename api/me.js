import { $http } from './request.js'

//我的模块接口
export default  {
  //个人信息数据
  getMyInfoData(){
    return $http.get('/api/my/')
  }
}