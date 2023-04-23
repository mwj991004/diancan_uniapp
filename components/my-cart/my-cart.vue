<template >
	<view v-if="total">
		<!-- 购物车模块 -->
		  <view class="goods-cart">
		    <!-- 单元格行 -->
		    <van-cell custom-class="goods-cart-cell" value-class="cart-cell-right" >
		      <!-- 左侧购物车盒子 -->
		      <view class="cart-cell-left" slot="title">
		        <!-- 购物车图标 -->
		        <van-icon custom-class="cart-show-icon" class="cart-show-icon" size="50" name="/static/ordering_icons/cart.png"  @click="showPopupCart"  />
		
		        <!-- 商品总价盒子-->
		        <view class="goodsSum-box">
		          <text class="goodsSum-icon">￥</text>
		          <tex class="goodsSum">{{checkedGoodsAmount}}</tex>
		        </view>
		      </view>
		      <!-- 右侧结算区域盒子 -->
		      <view class="cart-cell-right">
		        <!-- 结算按钮 -->
		        <van-button custom-class="shop-btn" slot="right-icon" round type="primary" @click="clickGotoPay()">结算<text class="shop-sum">({{checkedCount}})</text></van-button>
		      </view>
		    </van-cell>
		    
		    <!-- 点击购物车图标，弹出的购物车页面 -->
		    <van-popup  custom-class="goods-cart-popup" closeable close-icon="close" :show="goodsCartShow" @close="closePopupCart" round position="bottom" custom-style="height: 40%">
		      <!-- 购物车商品列表的标题区域 -->
		      <view class="cart-title">
            <!-- 全选区域 -->
            <label class="radio">
              <radio color="#4a90e2" :checked="isFullCheck" @click="changeAllState"/>
              <!-- 描述文本 -->
              <text class="cart-title-text">已勾选商品数量（{{checkedCount}}）</text>
            </label>
		        
		      </view>
		      
		      
		      
		      <!-- 渲染数购物车商品列表 -->
		      <scroll-view scroll-y="true" class="cart-body" >
		        <view class="cart-goods-item" v-for="(goods, i) in cart" :key="i">
              <my-small-goods  :showRadio="true" :goods="goods" @num-change="cartNumberChangeHandler($event,goods)"></my-small-goods>
		        </view>
		      </scroll-view>
		    
		      </van-popup>
		  </view>
		
	</view>
</template>

<script>
  import { mapState, mapMutations,mapGetters} from 'vuex'
  
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
		data() {
			return {
				
				//购物车展示与隐藏
				goodsCartShow:false,
        
        // 未登录时，倒计时跳转到登录的秒数
        seconds: 3,
        // 定时器的 Id
        timer: null
			};
		},
    computed:{
      ...mapState('m_home', ['consumptionMethod']),
      ...mapState('m_cart', ['cart']),
      ...mapState('m_user', ['token']),
      ...mapGetters('m_cart', ['total','checkedCount','checkedGoodsAmount']), 
      // 2. 是否全选
      isFullCheck() {
        return this.total === this.checkedCount
      },
    },
    methods:{
      ...mapMutations('m_home', ['updateConsumptionMethod']),
      
       // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      ...mapMutations('m_cart', ['addToCart','updateGoodsState','updateAllGoodsState']),
      // 把 m_user 模块中的 updateRedirectInfo 方法映射到当前页面中使用
      ...mapMutations('m_user', ['updateRedirectInfo']),
      //购物车弹出层展示和关闭的函数
      showPopupCart() {
          this.goodsCartShow= !this.goodsCartShow
      },
      closePopupCart() {
          this.goodsCartShow= false
      },
      //结算按钮点击事件处理函数
      clickGotoPay(){
        // 先判断是否勾选了要结算的商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
        // 判断用户是否登录了，如果没有登录，则调用 delayNavigate() 进行倒计时的导航跳转
        if (!this.token) return this.delayNavigate()
        uni.navigateTo({
          url:'../../subpkg/pay/pay', 
        })
      },
      //购物车模块商品的数量发生了变化的处理函数
      cartNumberChangeHandler(val,goods){
      
        goods.goods_count = +val
        // 判断一下商品数量信息
        if(!goods.goods_count){
          //数量为0，删除购物车对应商品
          this.removeGoods(goods)
        }else{
          //数量不为0，添加商品进购物车
          // 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
          this.addToCart(e)
        }
        // 设置数字徽标
        this.setBadge()
      },
     
      // 全选按钮 的点击事件处理函数
      changeAllState() {
        // 修改购物车中所有商品的选中状态
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 展示倒计时的提示消息
      showTips(n) {
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          // 不展示任何图标
          icon: 'none',
          // 提示的消息
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
      },
      // 延迟导航到 my 页面
      delayNavigate() {
        // 把 data 中的秒数重置成 3 秒
        this.seconds = 3
        this.showTips(this.seconds)  
        // 1. 将定时器的 Id 存储到 timer 中
        this.timer = setInterval(() => {
          this.seconds--   
          // 2. 判断秒数是否 <= 0
          if (this.seconds <= 0) {
            // 2.1 清除定时器
            clearInterval(this.timer)
            // 2.2 跳转到 my 页面
            uni.switchTab({
              url: '/pages/me/me',
              // 页面跳转成功之后的回调函数
              success: () => {
                // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
                this.updateRedirectInfo({
                  // 跳转的方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/ordering/ordering'
                })
              }            
            })
            // 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
    }
	}
</script>

<style lang="scss">
 //购物车样式
  .goods-cart{
    box-sizing: border-box; 
    border-top: 1px solid #f0f0f0;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    .goods-cart-cell{
      border-top: 1px solid #F1F1F1;
      z-index: 9999;
      padding: 5px ;
      width: 100%;
      height: 100%;
      .cart-cell-left{
        height: 100%;
        width: 150px;
        display: flex;
        justify-content: space-around;
        align-items: stretch;

        .cart-show-icon{
          margin-top: -10px;

        }
        .goodsSum-box{

          width: 50%;
          text-align: center;
          align-self: center;
          font-weight: 700px;
          .goodsSum-icon{
            font-size: 20px;
          }
          .goodsSum{
            font-size: 26px;
          }
        }
      }
      .cart-cell-right{
        height: 100%;
        .shop-btn{
          width: 70%;
          height: 100%;
          background-color: #4a90e2;
          border-color: #4a90e2;
          color: #FFFFFF;
          font-weight: 500;
          font-size: 20px;
          text-align: center;
          .shop-sum{
            font-size:18px
          }
        }
      }
    }
    .goods-cart-popup{
      overflow: hidden;
      margin-bottom: 48px;
      .cart-title {
        
        height: 40px;
        display: flex;
        align-items: center;
        font-size: 14px;
        padding-left: 5px;
        border-bottom: 1px solid #efefef;
        
        .radio {
          margin-left: 15px;
        }
      }
      .cart-body{
        padding: 5px 0;
        max-height: 400rpx;
      }
    }
  }

</style>
