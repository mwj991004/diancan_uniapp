<template>
	<view class="order-box">
		<view class="title-box">
		  <view class="title-left">
		    顶呱呱(学院路店)&nbsp;>
		  </view>
		  <view class="title-right">
		    <view class="order-status" v-if="order.order_status === 0">
		      制作中
		    </view>
		    <view class="order-status" style="color: #4CD964;" v-else>
		      已完成
		    </view>
		  </view>
		</view>
		<view class="body-box">
		  <view class="body-top">
		    <image class="goods-img" :src="goodslist[1].goods_img" mode=""></image>
		  </view>
		  <view class="body-buttom">
		    <view class="order-time">{{orderTime}}</view>
		    <view class="order-price">￥ {{order.order_price}}</view>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
    props:{
      order:{
        type: Object,
        defaul: {},
      }
    },
    computed:{
      orderTime:function(){
       let tiemstr = this.order.order_number.slice(4,-6)
       let timearr = tiemstr.split('').map((item,i) => {
         if(i === 3) return item + '-'
         if(i === 5) return item + '-'
         if(i === 7) return item + ' '
         if(i === 9) return item + ':'
         if(i === 11) return item + ':'
         return item
       })
       return timearr.join('')
      },
      goodslist:function(){
        return JSON.parse(this.order.order_goods)
      },  
    }, 
    mounted() {
     console.log(this.goodslist)
   }
	}
</script>

<style lang="scss">
.order-box{
  background-color: #FFFFFF;
  margin: 15px 10px;
  padding: 8px 15px;
  border-radius: 10px;
  height: 100px;
  .title-box{
    display: flex;
    justify-content: space-between;
    height: 30px;
    
  }
  .body-box{
    display: flex;
    flex-direction: column;
    .body-top{
      .goods-img{
        width: 40px;
        height: 40px;
        background-color: #CCCCCC;
      }
    }
    .body-buttom{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
