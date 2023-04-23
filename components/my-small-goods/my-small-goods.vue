<template>
	<view class="goods-item">
		<!-- 商品左侧图片区域 -->
		<view class="goods-left">
		  <radio class="goods-select" v-if="showRadio" :checked="goods.goods_state" color="#4a90e2"  @click="radioChangeHandler(goods)"></radio>
		  <image :src="goods.goods_img || defaultPic" class="goods-img"></image>
		</view>
		
		<!-- 商品右侧描述信息区域 -->
		<view class="goods-right">
		  <view class="">
		    <!-- 商品标题  和商品的规格-->
		    <view class="goods-name" >{{goods.goods_name}} 【 {{goods.goods_spec}} 】
		    </view>
		    <view class="goods-price-box">
		      <view class="goods-price">
		        <text class="price-icon">￥</text>
		        <text class="price-text">{{goods.goods_price}}</text>
		      </view>
		      <!-- 商品数量 -->
		      <!-- <uni-number-box class="goods-sum" :value="String(goods.goods_count)" @change="cartNumberChangeHandler($event,goods)"  @click.native.stop=""></uni-number-box> -->
		    </view>
		    
		  </view>
		  <view class="goods-sum">
		    X{{goods.goods_count}}
		  </view>
		</view>
		
	</view>
</template>

<script>
  import { mapState, mapMutations,mapGetters} from 'vuex'
	export default {
    // 定义 props 属性，用来接收外界传递到当前组件的数据
    props: {
      // 商品的信息对象
      goods: {
        type: Object,
        defaul: {},
      },
      // 是否展示图片左侧的 radio
      showRadio: {
        type: Boolean,
        // 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
        default: false,
      },
    },
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
			};
		},
    computed:{
      
    },
    methods:{
      ...mapMutations('m_cart',['updateGoodsState']),
      // 商品的勾选状态发生了变化的处理函数
      radioChangeHandler(goods) {
        goods.goods_state = !goods.goods_state
        this.updateGoodsState(goods)
      },
    }
	}
</script>

<style lang="scss">
.goods-item{
  margin: 0 20px;
  padding: 8px 0;
  display: flex;
  align-items: center;
  .goods-left{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .goods-select{
      
    }
    .goods-img{
      
      width: 60px;
      height: 60px;
      border-radius: 10px;
    }
  }
  .goods-right{
    align-self: stretch;
    flex: 1;
    margin:0 15px 5px;
    display: flex;
    // flex-direction: column;
    justify-content: space-between;
    // align-items: flex-start;
    align-items: center;
    .goods-name{
      font-size: 16px;
    }
    .goods-price-box{
      margin-top: 10px;
      align-self: stretch;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods-price{
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
    .goods-sum{
      margin-right: 15px;
      font-size: 20px;
      color: #000000;
      font-style: italic;
    } 
  }
  
}
</style>
