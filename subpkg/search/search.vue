<template>
	<view>
    <view class="search-box">
      <!-- 使用uni-ui提供的搜索组件 -->
      <uni-search-bar  @input="input" :radius="100" cancelButton= "none" ></uni-search-bar>
      <van-button  custom-class="van-btn"  class="van-button"  type="primary"  size="small" @click="searchBtnClick"  round >搜索</van-button>
    </view>
		
    <!-- 搜索建议类表 -->
     <view class="sugg-list" v-if="searchResults.length !== 0 && kw">
       <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoOrdering(item.id)">      <!-- <image class="goods-img" :src="item.img" mode=""></image>
         <view class="goods-name">{{item.name}}</view>
         <view class="goods-price">
           <text>￥</text>
           {{item.price}}
         </view> -->
         <my-goods class="my-goods" :goods="item"  @num-change="numberChangeHandler"></my-goods>
       </view>
       
     </view>
    
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in histories" :key="i" @click="gotoSearch(item)"></uni-tag>
      </view>
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
				// 延时器的 timerId
				timer: null,
				// 搜索关键词
				kw: '',
        //搜索的结果列表
        searchResults:[],
        // 搜索关键词的历史记录
        historyList: []
			};
		},
    computed: {
        // 调用 mapState 方法，把 m_home 模块中的 consumptionMethod映射到当前页面中，作为计算属性来使用
        // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
        ...mapState('m_home', ['consumptionMethod']),
        ...mapState('m_cart', ['cart']),
        ...mapGetters('m_cart', ['total']),
      
      histories(){
        return [...this.historyList].reverse()
      }
    },
    onLoad(){
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods:{
       // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      ...mapMutations('m_cart', ['addToCart','removeGoods']),
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
      //点击搜索按钮搜索的函数
      searchBtnClick(){
        this.getSearchList()
      },
      //点历史标签搜索的函数
      gotoSearch(kw){
        this.getSearchList(kw)
      },
      //搜索框input输入事件
      input(e){
        //节流阀
        clearTimeout(this.timer)
        this.timer =  setTimeout(()=>{
          this.kw = e.value
          if(this.kw.length === 0 ){
            this.searchResults = []
          }
        },500)
      },
      //获取搜索商品信息的函数
      getSearchList(e){
        if(e){
          this.kw = e
        }
        //判断搜索关键词是否为空
        if(this.kw.length === 0 ){
          this.searchResults = []
          return
        }
        // 调用获取搜索数据的方法
        uni.$api.ordering.getSearchListData(this.kw).then(res => {
          this.searchResults = res 
          //查询到搜索建议之后，调用savaSearchHistory方法保存搜索关键字
          this.savaSearchHistory()
        })
        
      },
      //点商品列表跳转到点餐页的函数
      gotoOrdering(goods_id){
       uni.reLaunch({
          //跳转到详情页面，并传递gonds_id参数
          url:'/pages/ordering/ordering?goods_id=' + goods_id
          // url:'/pages/ordering/ordering'
        })
      },
      savaSearchHistory() {
        const set  = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList= Array.from(set)
       //对搜索历史数据，进行持久化的存储
       uni.setStorageSync('kw',JSON.stringify(this.historyList))
      },
      clean(){
        this.historyList = []
        uni.setStorageSync('kw','[]')
      }
    }
	}
</script>

<style lang="scss">
  
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
    .van-btn{
      // display: none;
      position: absolute!important;
      top: -10px;
      right: -22px;
      height: 36px !important;
      transform: translate(-50%,50%);
      background-color: #4a90e2;
      border:none;
      color:#000000;
      font-size: 30rpx;
    }
  }
  .sugg-list{
    padding: 0 5px;
    .sugg-item{
      width: 100%;
      display: flex;
      justify-content:space-between ;
      align-items: center;
      font-size: 12px;
      padding: 13px 20px;
      border-bottom: 1px solid #efefef;
      .my-goods{
        width: 90%;
      }
    }
  }
  .history-box{
    .history-title {
      padding: 0 5px;
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }
    .history-list {
      display: flex;
      flex-wrap: wrap;
      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
