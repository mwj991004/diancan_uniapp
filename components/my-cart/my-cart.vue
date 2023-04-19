<template>
	<view>
		<!-- 购物车模块 -->
		  <view class="goods-cart">
		    <!-- 单元格行 -->
		    <van-cell custom-class="goods-cart-cell" value-class="cart-cell-right" v-if="total">
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
		        <!-- 商品左侧图片区域 -->
		          <view class="cart-goods-left">
		            <radio class="cart-goods-select" :checked="goods.goods_state" color="#4a90e2"  @click="radioChangeHandler(goods)"></radio>
		            <image :src="goods.goods_img || defaultPic" class="cart-goods-img"></image>
		          </view>
		        
		          <!-- 商品右侧描述信息区域 -->
		          <view class="cart-goods-right">
		            <view class="">
		              <!-- 商品标题  和商品的规格-->
		              <view class="cart-goods-name" >{{goods.goods_name}} 【 {{goods.goods_spec}} 】
		              </view>
		              <view class="cart-goods-price-box">
		                <view class="cart-goods-price">
		                  <text class="price-icon">￥</text>
		                  <text class="price-text">{{goods.goods_price}}</text>
		                </view>
		                <!-- 商品数量 -->
		                <!-- <uni-number-box class="cart-goods-sum" :value="String(goods.goods_count)" @change="cartNumberChangeHandler($event,goods)"  @click.native.stop=""></uni-number-box> -->
		              </view>
		              
		            </view>
		            <view class="cart-goods-sum">
		              X{{goods.goods_count}}
		            </view>
		          </view>
		          
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
				goodsCartShow:false
			};
		},
    computed:{
      ...mapState('m_home', ['consumptionMethod']),
      ...mapState('m_cart', ['cart']),
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
      //购物车弹出层展示和关闭的函数
      showPopupCart() {
          this.goodsCartShow= !this.goodsCartShow
      },
      closePopupCart() {
          this.goodsCartShow= false
      },
      //结算按钮点击事件处理函数
      clickGotoPay(){
        uni.navigateTo({
          url:'../../subpkg/pay/pay'
        })
      },
      //购物车模块商品的数量发生了变化的处理函数
      cartNumberChangeHandler(val,goods){
      
          goods.goods_count = +val
          
          this.addToCart(goods)
        
        // 设置数字徽标
        this.setBadge()
      },
      // 商品的勾选状态发生了变化的处理函数
      radioChangeHandler(goods) {
        goods.goods_state = !goods.goods_state
        this.updateGoodsState(goods)
      },
      // 全选按钮 的点击事件处理函数
        changeAllState() {
          // 修改购物车中所有商品的选中状态
          // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
          this.updateAllGoodsState(!this.isFullCheck)
        }
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
        .cart-goods-item{
          margin: 0 20px;
          padding: 8px 0;
          display: flex;
          align-items: center;
        .cart-goods-left{
          display: flex;
          justify-content: space-between;
          align-items: center;
            .cart-goods-select{
              
            }
            .cart-goods-img{
              
              width: 60px;
              height: 60px;
              border-radius: 10px;
            }
          }
        }
        .cart-goods-right{
          align-self: stretch;
          flex: 1;
          margin:0 15px 5px;
          display: flex;
          // flex-direction: column;
          justify-content: space-between;
          // align-items: flex-start;
          align-items: center;
          .cart-goods-name{
            font-size: 16px;
          }
          .cart-goods-price-box{
            margin-top: 10px;
            align-self: stretch;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .cart-goods-price{
              font-weight: 700;
              color: red;
              .price-text{
                font-size: 20px;
              }
              .price-icon{
                font-size:18px;
              }
            }
           
          }
          .cart-goods-sum{
            margin-right: 15px;
            font-size: 20px;
            color: #000000;
            font-style: italic;
          } 
        }
      }
    }
  }

</style>
