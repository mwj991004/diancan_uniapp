<template>
	<view v-if="goods.price">
		<view class="goods-item" >
		  <!-- 商品左侧图片区域 -->
		  <view class="goods-item-left">
        <radio :checked="goodsState" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
		    <image :src="goods.img || defaultPic" class="good-img"></image>
		  </view>
		  
		  <!-- 商品右侧描述信息区域 -->
		  <view class="goods-item-right">
		    <!-- 商品标题-->
		    <view class="goods-name" >{{goods.name}}</view>
		    
        <!-- 商品规格 -->
        <view class="tag-box" >
          <uni-tag @click.native.stop="setInverted(item,i)" :inverted="(i === tag.activeTagIndex ? 'false':'true') " class="tag-item" :text="item" type="primary" size="small"  v-for="(item,i) in goods.tagList" :key="i"/>
        </view>
		    <!-- 商品价格区域-->
		    <view class="goods-price-box">
		      <!-- 价格 =规格*单价 -->
          <view class="price">
            <text class="price-icon">￥</text>
            <text class="price-text">{{price | tofixed }}</text>
          </view>
          <!-- 商品数量 -->
          <uni-number-box class="goods-sum" :value="tag.activeTagNum" @change="numberChangeHandler" @click.native.stop=""></uni-number-box>
		    </view>
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
      //默认是否选中
      checked:{
        type:Boolean,
        defaul:false
      }
    },
    filters: {
      // 把数字处理为带两位小数点的数字
      tofixed(num) {
        return Number(num).toFixed(2)
      },
    },
    computed:{
      ...mapState('m_cart', ['cart']),
      //不同规格下，选的商品件数
     /* sumdata:function(){
        return this.goods.tagList.reduce((pre,tag)=> {
          pre[tag] = 0 
          return pre
        },{}) 
      } */
    },
		data() {
			return {
        //转存自定义属性传过来的商品数据
        // good:this.goods,
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
        //商品选中状态
        goodsState:false,
        //激活的tag
        tag:{
            //默认选择的tag索引
            activeTagIndex:0,
            //默认选择的tag
            activeTag:'', 
            //激活的tag下商品的数量
            activeTagNum:0
        },
        
        //商品价格
        price:0,
        //不同规格下，选的商品件数
        sumdata:{
          
        }
			};
		},
    methods:{
      //点击uni-tag标签切换规格的处理函数
      setInverted(tags,i){
        //1.先把之前激活标签下的商品数量存起来
        let shuzi = this.tag.activeTagNum
        //2.更新激活标签的数量
        this.tag.activeTagNum = this.sumdata[tags] || 0
        //3.存旧标签对应的商品数量
        this.sumdata[this.tag.activeTag] = shuzi 
        //4.更新激活标签的索引
        this.tag.activeTagIndex = i
        //5.更新激活标签名称
        this.tag.activeTag = tags
        //调用更新价格的函数更新一下商品价格
        this.updatePrice()
      },
      //更新商品信息，设置tag值和价格
      updategoodsinfo(){
        // 查询购物车商品信息
        let findResult =  this.queryCart()
        if(findResult.length !== 0){
          this.tag.activeTag = findResult[findResult.length-1].goods_spec
          this.tag.activeTagIndex = String(this.goods.tagList).split(',').findIndex(item => item == this.tag.activeTag )
          this.tag.activeTagNum = findResult[findResult.length-1].goods_count
          this.sumdata = findResult.reduce((pre,x) => {
            pre[x.goods_spec] = x.goods_count 
            return pre
          },{})
          
        }else{
          this.tag.activeTagIndex =  0
          this.price = this.goods.price
          this.tag.activeTag = String(this.goods.tagList).split(',')[0]
          
        }
        this.updatePrice()  
      },
      // radio 组件的点击事件处理函数
      radioClickHandler() {
        this.goodsState = !this.goodsState
        // 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
        this.$emit('radio-change', {
          // 商品的 Id
          goods_id: this.goods.id,
          // 商品所属分类的ID
          goods_cateId:this.goods.cate_id,
          // 商品最新的勾选状态
          goods_state: !this.goodsState,
          //商品的图片
          goods_img:this.goods.img,
          //商品的价格
          goods_price:this.goods.price,
          //商品的名称
          goods_name:this.goods.name,
          //商品的规格
          goods_spec:this.tag.activeTag,
          // 商品的最新数量
          goods_count:this.tag.activeTagNum
        })
      },
      // 商品的数量发生了变化
      numberChangeHandler(val) {
        // 数量不为0,商品选中
        if(+val){
          this.goodsState = true
        }
        //存激活标签下商品数量
        this.tag.activeTagNum = +val
        // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
        this.$emit('num-change',{
          // 商品的 Id
          goods_id: this.goods.id,
          // 商品所属分类的ID
          goods_cateId:this.goods.cate_id,
          //商品选中状态
          goods_state:this.goodsState,
          //商品的图片
          goods_img:this.goods.img,
          //商品的价格
          goods_price:this.price,
          //商品的名称
          goods_name:this.goods.name,
          //商品的规格
          goods_spec:this.tag.activeTag,
          // 商品的最新数量
          goods_count: +val
        })
      },
      // 处理根据选中项修改商品单价的函数
      updatePrice(){
        if(this.tag.activeTag === '整份'){
          this.price = this.goods.price*2
        }
        else if(this.tag.activeTag === '半份'){
          this.price = this.goods.price
        }
      },
      //根据购物车中的cart数据，判断商品有没有添加，如果有，则返回cart中对应商品
      queryCart(){
        const findResult = this.cart.filter((x) => {
          return  x.goods_name === this.goods.name 
        })
        return findResult
      }
    },
    watch:{
      // cart:{
      //   handler(newval,oldval){
      //     if(newval.length !== oldval.length){
      //      let delitem = oldval.filter(item =>{
      //         return !newval.find(item2 => item2 === item)
      //       })
      //     }
      //     //购物车数据变化。更新页面信息
      //      this.updategoodsinfo()
      //      console.log('侦听')
      //   },
      //   deep: true
      // }
    },
    mounted() {
      this.goodsState = this.checked
      this.updategoodsinfo()
    },
    
	}
</script>

<style lang="scss" >
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
    .goods-item-left {
        margin-right: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .good-img {
          width: 100px;
          height: 100px;
          display: block;
          border-radius: 20rpx;
        }
        
    }
    .goods-item-right {
      flex:1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-top: 6rpx;
      padding-right: 20rpx;
      align-items: flex-start;
      .goods-name {
        flex: 1;
        font-weight: 600;
        font-size: 28rpx;
      }
      .tag-box{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .tag-item {
          margin: 6rpx;
        }
      }
      .goods-price-box{
        align-self: stretch;
        // width: 150px;
        font-size: 16px;
        font-weight: 600;
        color: #c00000;
        display: flex;
        justify-content: space-between;
        .price-icon {
          font-size: 12px;
        }
      }
    }
  }
</style>
