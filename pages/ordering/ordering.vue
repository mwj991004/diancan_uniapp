<template>
	<view>
    <my-navgation-bar  :default-data="defaultData"></my-navgation-bar>
	</view>
</template>

<script>
  const app = getApp();
  import { mapState,mapMutations } from 'vuex'
	export default {
		data() {
			return {
				// 组件参数设置，传递到组件
				defaultData: {
				  title: "我主页", // 导航栏标题
          "h1":"888"
				}
			};
		},
    computed: {
        // 调用 mapState 方法，把 m_home 模块中的 consumptionMethod映射到当前页面中，作为计算属性来使用
        // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
        ...mapState('m_home', ['consumptionMethod']),
    },
    methods:{
       ...mapMutations('m_home', ['updateConsumptionMethod']),
    },
    onLoad() {
    }
	}
</script>

<style lang="scss">

</style>
