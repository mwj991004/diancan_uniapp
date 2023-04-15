<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    this.globalData.navBarHeight = systemInfo.statusBarHeight + 44;
    this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.menuTop = menuButtonInfo.top ;
    this.globalData.menuHeight = menuButtonInfo.height;
    console.log(this.globalData)
	},
 
	onShow: function() {
		console.log('App Show');
    
	},
	onHide: function() {
		console.log('App Hide');
	},
  
  // globalData是全局变量对象。数据都是根据当前机型进行计算，这样的方式兼容大部分机器
  globalData: {
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
  }
};
</script>

<style>
  @import "/wxcomponents/vant/dist/common/index.wxss";
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
