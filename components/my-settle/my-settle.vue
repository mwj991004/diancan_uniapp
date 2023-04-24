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
        //支付成功后，延迟2秒跳转页面
        seconds:2
			};
		},
    computed:{
      // addstr 是详细的收货地址
      ...mapGetters('m_user', ['addstr']),
      // token 是用户登录成功之后的 token 字符串
      ...mapState('m_user', ['token']),
      ...mapGetters('m_cart',['checkedGoodsAmount','checkedGoods']),
      ...mapState('m_cart',['cart']),
      ...mapState('m_home',['consumptionMethod'])
    },
    methods:{
      ...mapMutations('m_cart',['delCart']),
      // 点击了结算按钮
      settlement() {
        // 2. 先判断一下消费方式再判断是否需要选收货地址
        if (this.consumptionMethod === 'waimai' && !this.addstr) return uni.$showMsg('请选择收货地址！')    
        //  实现微信支付功能
        this.payOrder()
      },
      // 微信支付
      async payOrder() {
        // 1. 创建订单
        // 1.1 组织订单的信息对象
        let orderInfo = {
          // 开发期间，注释掉真实的订单价格，
          order_price: this.checkedGoodsAmount,
          // 写死订单总价为 1 分钱
          // order_price: 0.01,
          order_cate:0,
          goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price,goods_spec:x.goods_spec,goods_img:x.goods_img }))
        }
        if(this.consumptionMethod === 'waimai'){
          orderInfo.order_cate = 1,
          orderInfo.consignee_addr = this.addstr
        }
        console.log(orderInfo)
        // 1.2 发起请求创建订单
        const res  = await uni.$api.order.createOrder(orderInfo)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 1.3 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number
      
        //申请的小程序个人账号没有微信支付功能权限，无法调预支付和微信支付接口。数据库设计时默认把支付状态字段设置为1(已支付)      
        /* // 2. 订单预支付
        // 2.1 发起请求获取订单的支付信息
        const res2 = await uni.$api.order.reqUnifiedorder({ order_number: orderNumber })
        if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')    
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
        
        // 3. 发起微信支付
        // 3.1 调用 uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 未完成支付
        if (err) return uni.$showMsg('订单未支付！') */
        // 3.3 完成了支付，进一步查询支付的结果
        const res3 = await uni.$api.order.orderPayStatus({ order_number: orderNumber })
        // 3.4 检测到订单未支付
        if (!res3.message.pay_status) return uni.$showMsg('订单未支付！')
        // 3.5 检测到订单支付完成
        //跳转到订单页,延迟2秒跳
        this.delayNavigate()
      },
      // 展示倒计时的提示消息
      showTips(n) {
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          // 不展示任何图标
          icon: 'none',
          // 提示的消息
          title: '支付完成！' + n + ' 秒后自动跳转到订单页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
      },
      // 延迟导航到 order 页面
      delayNavigate() {
        // 把 data 中的秒数重置成 2 秒
        this.seconds = 2
        this.showTips(this.seconds)  
        // 1. 将定时器的 Id 存储到 timer 中
        this.timer = setInterval(() => {
          this.seconds--   
          // 2. 判断秒数是否 <= 0
          if (this.seconds <= 0) {
            // 2.1 清除定时器
            clearInterval(this.timer)
            // 2.2 跳转到 order 页面
            uni.switchTab({
              url: '../../pages/order/order',
              
            })
            //清空购物车和本地存储
            this.delCart()
            // 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
            return
          }
          this.showTips(this.seconds)
        }, 1000)
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
