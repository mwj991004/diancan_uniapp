<template>
	<view>
		<view class="login-container">
      <!-- 提示登录的图标 -->
      <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
      <!-- 登录按钮 -->
      <!-- <button  @tap="getUserProfile"> 获取头像昵称 </button> -->
      <!-- <button  open-type="getUserInfo" @getuserinfo="getUserInfo"> 获取头像昵称 </button> -->
      <button type="primary" class="btn-login"  @tap="getUserProfile">一键登录</button>
      <!-- 登录提示 -->
      <view class="tips-text">登录后尽享更多权益</view>
		</view>
	</view>
</template>

<script>
  // 1. 按需导入 mapMutations 辅助函数
  import { mapMutations, mapState } from 'vuex'
	export default {
		data() {
			return {	
			};
		},
    computed: {
      // 调用 mapState 辅助方法，把 m_user 模块中的数据映射到当前用组件中使用
      ...mapState('m_user', ['redirectInfo']),
    },
    methods:{
      // 2. 调用 mapMutations 辅助方法，把 m_user 模块中的 updateUserInfo 映射到当前组件中使用
      ...mapMutations('m_user', ['updateUserInfo','updateToken','updateRedirectInfo']),
      // 获取微信用户的基本信息
      getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        uni.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          // 成功的回调函数
          success: (res) => {     
            // 将用户的基本信息存储到 vuex 中
            this.updateUserInfo(res.userInfo)
            // 获取登录成功后的 Token 字符串
            this.getToken(res) 
          },
          //失败的回调函数
          fail:(res)=>{
            if (res.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
            return uni.$showMsg('登录授权失败')
          },
          // 结束的回调函数，成功和失败都执行
          /* complete:(res)=>{
            console.log('结束')
            console.log(res)
          } */
        })

        
      },
        /* getUserInfo(e) {
          // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
          this.userInfo = e.detail.userInfo,
          this.hasUserInfo = true
        }, */
      //调用登录接口，换取永久的token
      async getToken(info) {
        const [err,res] = await uni.login().catch(err => err)
        // 判断是否 wx.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg()('登录失败！')
        
       // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // 换取 token
        const token = await uni.$api.me.login(query)
        this.updateToken(token)
        // 判断 vuex 中的 redirectInfo 是否为 null
        // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
        this.navigateBack()
      },
      // 返回登录之前的页面
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    },
    onLoad(){
    }
  }
</script>

<style lang="scss">
.login-container{
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #F8F8F8;
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #4a90e2;
  }
  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>
