<template>
	<view class="pay-container">
    <!-- 收货地址区域 -->
    <view class="address-box cell">
      
      <my-address  v-if="consumptionMethod === 'waimai'"></my-address>
    </view>
    
    <!-- 下单商品列表 -->
    <view class="pay-goods-box cell">
      <view class="pay-goods-item" v-for="(goods, i) in checkedGoods" :key="i" >
        <my-small-goods :goods="goods"></my-small-goods>
      </view>
      
    </view>
    <van-empty description="空空如也~" v-if = "checkedGoods.length === 0" />
    <!-- 结算区域 -->
    <my-settle></my-settle>

	</view>
</template>

<script>
  import { mapState, mapMutations,mapGetters} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
    computed:{
      ...mapState('m_home', ['consumptionMethod']),
      // ...mapState('m_cart', ['cart']),
      ...mapGetters('m_cart', ['checkedGoods']),

      
    },
		methods: {
			
		}
	}
</script>

<style lang="scss">
  page{
    background-color: #f0f0f0;
  }
  .pay-container{
    padding-bottom: 80px;
    
    .cell{
      background-color: #FFFFFF;
      border-radius: 10px;
      margin: 10px;
    }
    
    .address-box{
      padding: 0px 10px;
    }
  }
  
</style>
