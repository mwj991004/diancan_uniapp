<template>

  <!-- 最外层的容器 -->
  <view class="my-settle-container">
    <!-- 合计区域 -->
    <view class="amount-box">
      <text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    
    <!-- 结算按钮 -->
    <view class="btn-settle"  @click="settlement">支付</view>
  </view>		

</template>

<script>
  import { mapState, mapMutations,mapGetters} from 'vuex'
	export default {
		data() {
			return {
				...mapState('my_home',['consumptionMethod'])
			};
		},
    computed:{
      // addstr 是详细的收货地址
      ...mapGetters('m_user', ['addstr']),
      // token 是用户登录成功之后的 token 字符串
      ...mapState('m_user', ['token']),
      ...mapGetters('m_cart',['checkedGoodsAmount','checkedGoods'])
    },
    methods:{
      // 点击了结算按钮
      settlement() {
        /* // 1. 先判断是否勾选了要结算的商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！') */
      
        // 2. 先判断一下消费方式再判断是否需要选收货地址
        if (this.consumptionMethod === 'waimai' && !this.addstr) return uni.$showMsg('请选择收货地址！')
      
        // 3. 最后判断用户是否登录了
        if (!this.token) return uni.$showMsg('请先登录！')
      }   
    }
	}
</script>

<style lang="scss">

.my-settle-container {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%,-25%);
   width: 95%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding-left: 5px;
  font-size: 20px;
  border-radius: 10px;

  .amount-box {
    border-radius: 10px 0 0 10px ;
    flex: 1;
    color: red;
    font-weight: 700;
    background-color: #bbb;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-settle {
    border-radius: 0 10px  10px 0;
    height: 50px;
    min-width: 150px;
    background-color: #4a90e2;
    color: white;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
  }
}
</style>
