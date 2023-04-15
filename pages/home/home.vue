<template>
	<view>
		<!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <!-- 循环渲染轮播图的 item 项 -->
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src" mode="scaleToFill"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 点单按钮区域 -->
    <view class="btn-box">
      <view class="btn-item first" @click="btnClickHandler('tangsi')">
        <image class="icon-img" src="../../static/home_icons/dianpu-copy.png" mode=""></image>
        <view class="text">
          <text class="text-h">堂食</text>
          <text class="text-b">即刻点单</text>
        </view>
      </view>
      <view class="btn-item" @click="btnClickHandler('waimai')">
        <image class="icon-img" src="../../static/home_icons/icon-waimai.png" mode=""></image>
        <view class="text">
          <text class="text-h">外卖</text>
          <text class="text-b">无接触送</text>
        </view>
      </view>
    </view>
    <!-- 会员信息区域 -->
    
    <!-- 推荐列表区域 -->
    <view class="banner-box">
      <!-- 标题 -->
      <view class="banner-title">
        <view class="banner-title-h1">
          美食人气榜
        </view>
        <view class="banner-title-btn">
          更多
          <uni-icons type="forward" size="20"></uni-icons>
        </view>
      </view>
      <!-- 内容 -->
      <view class="banner-list">
        <view class="banner-item" v-for="(item,index) in bannerList" :key="item.goods_id">
          <navigator class="banner-nav" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
            <view  class="iconfont icon-first" style="color:#ffd700;" v-if="index === 0"></view>
            <view  class="iconfont icon-second" style="color:#E6E8FA;" v-else-if="index === 1"></view>
            <view  class="iconfont icon-third" style="color:#b87333;" v-else="index === 2"></view>
            <!-- 动态绑定图片的 src 属性 -->
            <image class="banner-img" :src="item.image_src" mode="scaleToFill"></image>
          </navigator>
        </view>
      </view>
      <text class="tips">到底啦~</text>
    </view>
  </view>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  
	export default {
		data() {
			return {
				// 1. 轮播图的数据列表，默认为空数组
				swiperList: [],
        bannerList:[]
			};
		},
    computed: {
        // 调用 mapState 方法，把 m_home 模块中的 consumptionMethod映射到当前页面中，作为计算属性来使用
        // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
        ...mapState('m_home', ['consumptionMethod']),
    },
    onLoad() {
       // 2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
       uni.$api.home.getSwiperData().then(res => {
         this.swiperList = res
       })
       //调取推荐列表的数据
       uni.$api.home.getbannerData().then(res => {
         this.bannerList = res
       })
     },
    methods: {
      /* // 3. 获取轮播图数据的方法
      async getSwiperList() {
        // 3.1 发起请求
        const { data: res } = await uni.$api.home.getSwiperData()
        // 3.2 请求失败
        if (res.meta.status !== 200) {
          return uni.showToast({
            title: '数据请求失败！',
            duration: 1500,
            icon: 'none',
          })
        }
         // 3.3 请求成功，为 data 中的数据赋值
         this.swiperList = res.message
       },*/
        ...mapMutations('m_home', ['updateConsumptionMethod']),
        // btn-item被点击时候的事件处理函数
        btnClickHandler(str) {
           this.updateConsumptionMethod(str)
          uni.switchTab({
            url: '/pages/ordering/ordering'
          })
        }
     }, 
	}
</script>

<style lang="scss">
  @import "@/static/icons/iconfont.css";
  page{
    background-color: #F5F5F5;
  }
  
  // 轮播图样式
  swiper {
     height: 900rpx;
    .swiper-item,
    image{
     width: 100%;
     height: 100%;
     
   }
  }
  
  // 按钮区域样式
  .btn-box {
    box-sizing: border-box;
    height: 200rpx;
    background-color: #FFFFFF;
    margin: 0 20rpx;
    
    border-radius: 20rpx;
    box-shadow: 1px 1px 1px #F1F1F1;
    transform: translateY(-20rpx);
    display: flex;
    justify-content: center;
    align-items: center;
    .first{
      position: relative;
      &::after {
        content: '';
        display: block;
        background-color: #CCCCCC;
        width: 4rpx;
        height: 140rpx;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
    .btn-item{
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40rpx;
      width: 100%;
      height: 100%;
      
      .icon-img{
        width: 120rpx;
        height: 120rpx;
      }
      
      .text {
        margin-left: 20rpx;
        height: 120rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .text-h {
          color: #4a90e2;
          font-weight: 900;
          font-size: 40rpx;
          letter-spacing: 16rpx;
          text-align: center;
          
        }
        .text-b {
          text-align: center;
          font-size: 30rpx;
         color: #000000;
        }
      }
    }   
  }

  // 推荐列表样式
  .banner-box {
    box-sizing: border-box;
    margin: 10rpx 20rpx ;
    .banner-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      .banner-title-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
      }
    }
    .banner-list {
      padding-bottom: 20rpx;
      .banner-item {
        position: relative;
        margin-top: 40rpx;
        width: 100%;
        height: 400rpx;
        .banner-nav{
          display: block;
          width: 100%;
          height: 100%;
          .iconfont {
            display: block;
            font-size: 40px;
            position: absolute;
            top: -10px;
            left: -10px;
            transform: rotate(-25deg);
          }
          .banner-img{
            border-radius: 30rpx;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .tips {
      display: block;
      text-align: center;
      padding-bottom: 10rpx;
    }
  }

</style>
