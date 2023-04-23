<template>
	<view>
    <!-- 自定义的navgation导航栏 -->
    <my-navgation-bar  :default-data="defaultData" :showButton="true" :showSearch="true"></my-navgation-bar>
    <!-- 门店信息区域 -->
    
    
    <!-- 商品区域 -->
    <view class="scroll-view-container">
      <!-- 左侧的商品分类区域 -->
      <scroll-view  class="left-scroll-view" 	:show-scrollbar="false" 	:enhanced="true" :scroll-y="true" scroll-with-animation :style="{height: wh + 'px'}"  :scroll-into-view="leftScroll">   
        <block v-for="(item,i) in goodsCateList" :key="item.id">
          <view  :class="['left-scroll-view-item', {'active':item.id === active} ]" :id="'leftScroll-' + item.id" @click="activeChanged(item.id)" >{{item.title}}</view>
        </block>
        <!-- 空白盒子，让最后一个分类盒子也能往上滚 -->
        <view class="left-scroll-view-item">
          
        </view>
      </scroll-view >
      <!-- 右侧的商品列表区域 -->
      <scroll-view class="right-scroll-view " :show-scrollbar="false" 	:enhanced="true" :scroll-y="true" :style="{height: wh + 'px'}" scroll-with-animation :scroll-into-view="rightScroll" @scroll="scrollLink" >
        <!-- 分类商品盒子 -->
        <view class="cate-box" v-for="(item2, i2) in goodsCateList" :id="'rightScroll-' + item2.id"  :key="item2.id">
          <!-- 商品分类 -->
          <view class="cate-box-title">{{item2.title}}</view>
          <!-- 商品列表内容-->
          <view class="goods-list" >
            <!-- 商品item项 -->
            <view v-for="(item3,i3) in goodsInfoList " :key="item2.id" :id="'scroll-' + item2.id + '-' + i3"   v-if="item3.cate_id === item2.id ? true : false ">
              <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
              <my-goods  :goods="item3"  @num-change="numberChangeHandler"></my-goods>
            </view>
          </view>
        </view>
        <!-- 空白盒子，让最后一个分类盒子也能往上滚 -->
        <view class="right-scroll-view-item" style="height: 200px;">
          
        </view>
      </scroll-view> 
    </view>
    
    
    <!-- 购物车区域 -->
    <my-cart></my-cart>
    
  </view>
</template>

<script>

  import { mapState, mapMutations,mapGetters} from 'vuex'
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  
	export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    watch: {
       
    },
		data() {
			return {
				// 自定义导航栏组件参数设置，传递到组件，设置标题
				defaultData: {
				  title: "点单", // 导航栏标题
          color:"#4a90e2",
          fontSize:'16'
				},
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0, 
        // 当前选中项的索引，默认让第一项被选中
        active: 1,
        rightCur: 1, // 用于实现左边联动右边
        //分类栏滚动位置
        cateScrollTops:0,
        //商品分类数据
        goodsCateList: [],
        //商品列表数据
        goodsInfoList:[],

      } 
    },
    computed: {
        // 调用 mapState 方法，把 m_home 模块中的 consumptionMethod映射到当前页面中，作为计算属性来使用
        // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
        ...mapState('m_home', ['consumptionMethod']),
        ...mapState('m_cart', ['cart']),
        ...mapGetters('m_cart', ['total']),
        leftScroll:function(){
          return 'leftScroll-' + this.active
        },
        rightScroll:function(){
          return 'rightScroll-' + this.rightCur
        },
      
    },
    methods:{
      
      ...mapMutations('m_home', ['updateConsumptionMethod']),
      
       // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      ...mapMutations('m_cart', ['addToCart','removeGoods']),
      // 分类栏click事件处理函数
      activeChanged(i) {
          this.active = i
          this.rightCur = i
      },
     /* // 点击商品跳转到商品详情页面
      gotoGoodsDetail(item3) {
        uni.navigateTo({
           url: '/subpkg/goods_detail/goods_detail?goods_id=' + item3.id
        })
      }, */
      //右侧滚动函数，根据滚动的距离，算出左侧active项
      scrollLink(e) {
        let that = this
        let list = this.goodsCateList
        let itemHeight = 0;
        list.forEach((item,i) => {
          //拿到每个元素
          let els = wx.createSelectorQuery().select("#rightScroll-" + item.id);
          els.fields({size: true }, function (res) {
            list[i].top = itemHeight;
            itemHeight += res.height;
            list[i].bottom = itemHeight
          }).exec()
        })
        // 拿到滚动的高度
        let scrollTop = e.detail.scrollTop;
        list.some((item,i) => {
          if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
            this.active = item.id
            return true
          }
        })
      },
      // 点单页商品的数量发生了变化的处理函数
      numberChangeHandler(e){
        // 判断一下商品数量信息
        if(!e.goods_count){
          //数量为0，删除购物车对应商品
          this.removeGoods(e)
        }else{
          //数量不为0，添加商品进购物车
          // 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
          this.addToCart(e)
        }
        // 设置数字徽标
        this.setBadge()
      },
      
    },
    onLoad(options) {
      this.active = options.cate_id
      this.rightCur = options.cate_id
         
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      //获取胶囊布局信息
      const buttonInfo = wx.getMenuButtonBoundingClientRect()
      //算出导航栏高度
      let navBarHeight = (buttonInfo.top - sysInfo.statusBarHeight) * 2 + buttonInfo.height
      // 为 wh 窗口可用高度动态赋值
      this.wh = sysInfo.windowHeight-sysInfo.statusBarHeight-44
      // 调用获取分类列表数据的方法
      uni.$api.ordering.getGoodsCateList().then(res => {
        this.goodsCateList = res
      })
      // 调用获取商品列表数据的方法
      uni.$api.ordering.getGoodsInfoList().then(res => {
        this.goodsInfoList = res
        console.log(res)
      })
      // 在页面刚展示的时候，设置数字徽标
      this.setBadge()
    }
	}
</script>

<style lang="scss">
  // ::-webkit-scrollbar {
  //     width: 0;
  //     height: 0;
  //     color: transparent;   
  // }
  // 商品列表区域的样式
  .scroll-view-container {
    display: flex;
  
    .left-scroll-view {
      width: 120px;
      background-color: #F0F0F0;

  
      .left-scroll-view-item {
        line-height: 50px;
        background-color: #F0F0F0;
        text-align: center;
        font-size: 12px;
        &:last-child{
          padding-bottom: 200px;
        }
        // 激活项的样式
        &.active {
          background-color: #ffffff;
          position: relative;
          border-radius: 0;
          // // 渲染激活项左侧的红色指示边线
          // &::before {
          //   content: ' ';
          //   display: block;
          //   width: 3px;
          //   height: 30px;
          //   background-color: #c00000;
          //   position: absolute;
          //   left: 0;
          //   top: 50%;
          //   transform: translateY(-50%);
          // } 
          &::before,&::after {
            content: '';
            display: block;
            position: absolute;
            width: 26rpx;
            height: 26rpx;
            
          }
          &::before{
            top: -26rpx;
            right: 0;
            background: radial-gradient(circle at 0% 0%,transparent 26rpx,#ffffff 0)
          }
          &::after{
            bottom: -26rpx;
            right: 0;
            background: radial-gradient(circle at 0% 100%,transparent 26rpx,#ffffff 0)
          }
        }
      }
    }
    .right-scroll-view{
      .cate-box {
        .cate-box-title{
          //隐藏了商品分类标题
          display: none;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          padding: 15px 0;
        }

      }
    }
  }
  
 </style>
