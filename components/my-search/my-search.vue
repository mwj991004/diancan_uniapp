<template>
	<view class="my-search-container" :style="{'background': bgcolor}">
     <view class="my-search-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandler">
       <!-- 使用uni-ui提供的图标组件 -->
       <uni-icons type= "search" size="17"></uni-icons>
       <text class="placeholder">搜索</text>
     </view>
	</view>
</template>

<script>
	export default {
    props:{
      //背景颜色
      bgcolor:{
        type:String,
        default:'#c00000'
      },
      //圆角尺寸
      radius:{
        type:Number,
        default:18
      }
    },
		data() {
			return {
				
			};
		},
    methods:{
      //点击了模拟的input输入框
      searchBoxHandler(){
        //触发外界通过@click绑定的click事件处理函数
        this.$emit('click')
      }
    }
	}
</script>

<style lang="scss">
.my-search-container {
  height: 50px;
  // background-color: #C00000;
  display: flex;
  align-items: center;
  padding: 0 10px;
  
  .my-search-box {
    height: 36px;
    background-color: #FFFFFF;
    // border-radius: 18px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>
