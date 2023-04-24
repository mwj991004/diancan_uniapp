<template>
	<view>
		<van-tabs active="a" sticky animated color="#4a90e2" :border="true" :swipeable="true" nav-class="nav-style">
      <van-tab title="全部" name="a" class="content">

         <view class="orderAll" v-for="(itme, i) in order" :key="i">
           <my-order :order="itme"></my-order>
         </view>
        
      </van-tab>
		  <van-tab class="orderTangsi content" title="堂食" name="b" >
        <view class="orderAll" v-for="(itme, i) in tangsiOrder" :key="i">
          <my-order :order="itme"></my-order>
        </view>
      </van-tab>
		  <van-tab class="orderWaimai content" title="外卖" name="c" >
        <view class="orderAll" v-for="(itme, i) in waimaiOrder" :key="i">
          <my-order :order="itme"></my-order>
        </view>
      </van-tab>
		</van-tabs>
	</view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  import { mapState, mapMutations,mapGetters} from 'vuex'
	export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
		data() {
			return {
        order:[]
			}
		},
    computed:{
      tangsiOrder:function(){
        return this.order.filter(x => x.order_cate === 0)
      },
      waimaiOrder:function(){
        return this.order.filter(x => x.order_cate === 1)
      }
    },
    methods:{
      onChange(event) {
        wx.showToast({
          title: `切换到标签 ${event.detail.name}`,
          icon: 'none',
        });
      },
    },
    onLoad() {
      //调取订单列表的数据
      uni.$api.order.orderAll().then(res => {
        
        this.order = res.reverse()
      })
    }
	}
</script>

<style lang="scss">
 page{
  background-color: #F1F1F1; 
 }
.nav-style{
  // background-color: #f0f0f0;
}
  
.content{
  background-color: #F1F1F1;
}
</style>
