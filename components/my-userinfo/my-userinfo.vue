<template>
  <view class="my-container">
    <view class="my-userinfo-container">
      <!-- 头像昵称区域 -->
      <view class="top-box">
        <image  :src="userinfo.avatarUrl" class="avatar"></image>
        <view class="nickname">{{userinfo.nickName}}</view>
      </view>
    </view>
    <!-- 面板的列表区域 -->
    <view class="panel-list">
      <!-- 第一个面板 -->
      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panel-list-item" @click="order">
          <text>我的订单</text>
          <uni-icons type="arrowright" size="15" ></uni-icons>
        </view>
        <view class="panel-list-item" @click="address">
          <text>收货地址</text>
          <uni-icons type="arrowright" size="15" ></uni-icons>
        </view>
        <view class="panel-list-item" @click="personal">
          <text>个人资料</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
<!--        <view class="panel-list-item" @click="phone">
          <text>联系商家</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view> -->
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  // 按需导入 mapState 辅助函数
  import { mapState, mapMutations } from 'vuex'
	export default {
    computed: {
    // 将 m_user 模块中的 userinfo 映射到当前页面中使用
    ...mapState('m_user', ['userinfo']),
    },
		data() {
			return {
				
			};
		},
    methods:{
      ...mapMutations('m_user', ['updateUserInfo','updateToken','updateAddress']),
      // 把 m_user 模块中的 updateRedirectInfo 方法映射到当前页面中使用
      ...mapMutations('m_user', ['updateRedirectInfo']),
      // 我的订单
      order(){
        uni.reLaunch({
          url:"../../pages/order/order"
        })
      },
      //收货地址
      address(){
        uni.navigateTo({
          url:"../../subpkg/address/address"
        })
      },
      //个人资料
      personal(){
        uni.navigateTo({
          url:"../../subpkg/personal/personal",
          // 页面跳转成功之后的回调函数
          success: () => {
            // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
            this.updateRedirectInfo({
              // 跳转的方式
              openType: 'switchTab',
              // 从哪个页面跳转过去的
              from: '/pages/me/me'
            })
          }
        })
      },
      //联系商家
      phone(){
        
      },
      // 退出登录
      async logout() {
        // 询问用户是否退出登录
        const [err, succ] = await uni.showModal({
          title: '提示',
          content: '确认退出登录吗？'
        }).catch(err => err)
        if (succ && succ.confirm) {
          // 用户确认了退出登录的操作
          // 需要清空 vuex 中的 userinfo、token 和 address
          this.updateUserInfo({})
          this.updateToken('')
          this.updateAddress({})
        }
      }
    },
    mounted() {
      //获取用户信息
      uni.$api.me.getUserInfo().then(res => {
          this.updateUserInfo({
          ...this.userinfo,
          ...res
          }) 
      }) 
    }
	}
</script>

<style lang="scss">
  page,
  .my-container {
  height: 100%;
  background-color: #efefef;
  }
  .my-userinfo-container {
    height: 100%;
    // 为整个组件的结构添加浅灰色的背景
    background-color: #f4f4f4;
    .top-box {
      height: 400rpx;
      background-color: #4a90e2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .avatar {
        box-sizing: border-box;
        display: block;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 5px black;
        background-color: #FFFFFF;
      }
      .nickname {
        color: white;
        font-weight: bold;
        font-size: 16px;
        margin-top: 10px;
      }
    }
  }
  .panel-list {
    padding: 0 10px;
    position: relative;
    top: -10px;
    .panel {
      background-color: white;
      border-radius: 3px;
      margin-bottom: 8px;
      .panel-title {
        line-height: 45px;
        padding-left: 10px;
        font-size: 15px;
        border-bottom: 1px solid #f4f4f4;
      }
      .panel-body {
        display: flex;
        justify-content: space-around;
        .panel-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          font-size: 13px;
          padding: 10px 0;
          .icon {
            width: 35px;
            height: 35px;
          }
        }
      }
    }
  } 
  .panel-list-item {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    padding: 0 10px;
  }
</style>
