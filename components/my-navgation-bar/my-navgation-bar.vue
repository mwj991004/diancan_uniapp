<template>
	<view>
		<!-- 自定义顶部栏 -->
		<view class="nav-bar" :style="{height:navBarHeight +'px'}">
      <!-- 内容 -->
      <view class="navbar-content" :style="{height:menuHeight + 'px', minHeight:menuHeight + 'px',  lineHeight:menuHeight+ 'px', left:menuRight+ 'px', top:menuTop + 'px'}">
        
        <!-- 按钮区域 -->
        <view class="btn-box" :style="{'--btnBoxShadow':btnBoxShadow}" v-if="showButton">
          <van-button  :custom-class="[consumptionMethod === 'tangsi' ?'van-btn active' : 'van-btn']"  class="van-button"  type="primary"  size="small" @click="activeItem('tangsi')"  round >堂食</van-button>
          <van-button  :custom-class="[consumptionMethod === 'waimai' ?'van-btn active' : 'van-btn']" class="van-button"  type="primary" size="small" @click="activeItem('waimai')" round >外卖</van-button>
        </view>
        <!-- 标题文本区域 -->
        <view class="title-box" v-if="showTitle">
          <text :style="{'color':defaultData.color,'fontSize':defaultData.fontSize+'px','fontWeight':defaultData.fontWeight}">{{defaultData.title}}</text>
        </view>
        <!-- 搜索图标 -->
        <uni-icons type="search" class="search" size="24" @click="searchHandler" v-if="showSearch"></uni-icons>
      </view>
      
		</view>
		
		<!-- 内容区域：自定义顶部栏用的fixed定位，会遮盖到下面内容，注意设置好间距 -->
		<view class="content" :style="{ marginTop:navBarHeight + 'px'}">
    </view>
	</view>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  const app = getApp()
	export default {
    //组件配置，解除组件的样式隔离
    options: { styleIsolation: 'shared' },  
    computed: {
      //导入store中的consumptionMethod数据
        ...mapState('m_home', ['consumptionMethod'])
    },
    methods:{
      //导入store中修改consumptionMethod数据的方法
      ...mapMutations('m_home', ['updateConsumptionMethod']),
      //按钮选择项切换时的处理函数，堂食或外卖
      activeItem(str){
         this.updateConsumptionMethod(str)
      },
      //搜索盒子的点击事件处理函数
      searchHandler(){
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    },
    props: {
     // defaultData（父页面传递的数据-就是引用组件的页面）
      defaultData: {
        type: Object,
        default: {
          title: "我是默认标题",
          color:'#000000',
          fontSize:'16px',
          fontWeight:'400'
        }, 
      },
      //是否显示切换按钮
      showButton:{
        type: Boolean,
        default:false,
      },
      //是否显示搜索按钮
      showSearch:{
        type: Boolean,
        default:false,
      },
      //是否显示标题
      showTitle:{
        type: Boolean,
        default:false,
      }
    },
		data() {
			return {
				navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuTop: app.globalData.menuTop,
        menuHeight: app.globalData.menuHeight,
        //用来控制按钮盒子里的css变量的值，默认为0
        btnBoxShadow:'0'
			};
		},
    attached: function() {
      
    },
    watch: {
      // 如果 `consumptionMethod` 发生改变，这个函数就会运行
      consumptionMethod:{
        handler(newStr, oldStr) {
          if(newStr === 'waimai'){
            this.btnBoxShadow ='50%'
          }
          else{
            this.btnBoxShadow ='0'
          }
        },
        // 可以控制侦听器自动触发一次 ,默认为false
        immediate: true
      }  
    }
	}
</script>

<style lang="scss">
  //vant预留了些外部样式类，可用来修改样式，按钮预留样式类通过custom-class指定类名,
  .van-btn {
    box-sizing: border-box;
    position: relative;
    top: -2px;
    left: 0;
    height: 100%;
    background-color: transparent;
    border:none;
    color:#bbbb;
    font-size: 36rpx;
    font-weight: 700;
    &::before{
      background-color: transparent;
    }
    &.active{
      color:#FFFFFF;
    }
  }
  //自定义头部导航栏样式
  .nav-bar{ 
    position: fixed; 
    width: 100%; 
    top: 0; 
    color: #fff; 
    background: transparent;
    // 主体区域
    .navbar-content{
      position: absolute; 
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 70%;
      // 按钮区域样式
      .btn-box {
        position: relative; 
        box-sizing: border-box;
        background-color: #F0F0F0;
        border-radius: 30rpx;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &::before{
          content: '';
          display: block;
          height: 100%;
          width: 50%;
          position: absolute;
          top:0;
          //--btn-box-shadow是css变量，试图动态控制按钮盒子 的 蓝色伪元素 的左偏移量，通过JS修改
          left:var(--btn-box-shadow,0);
          background-color:#4a90e2 ;
          border-radius: 30rpx;
          transition: all .5s ;
        }
        .van-button {
          border: none;
          height: 100%;
        }
      }
      //标题区域样式
      .title-box{
        color: #000000;
        font-size: 16px;
        font-weight: 400;
      }
      //搜索区域样式
      .search{
        display: block;
        width: 30px;
        height: 30px;
        border: 1px solid #666666;
        border-radius: 50%;
        text-align: center;
      }
    }
  }
</style>
