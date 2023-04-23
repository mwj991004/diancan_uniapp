<template>
	<view>
		<form  >
      <!--姓名--> 
      <van-cell-group custom-class="cell-group">
        <text class="label">昵称：</text>
        <van-field
          :value="userinfo.nickName"
          placeholder="请输入用户名"
          :border="false"
          @change="onNickNameChange"
          class="input"
        />
      </van-cell-group >
      
      <!--性别--> 
      <van-radio-group :value="userinfo.sex" custom-class="cell-group " class="cell-group"  @change="onSexChange">
        <text class="label">性别：</text>
        <view class="van-radio-group">
          <van-radio custom-class="sex-item" checked-color="#4a90e2"  name="男">男</van-radio>
          <van-radio custom-class="sex-item" checked-color="#4a90e2" name="女">女</van-radio>
        </view>
      </van-radio-group>
      <van-cell-group custom-class="cell-group">
        <text class="label">电话：</text>
        <van-field
          :value="userinfo.phone"
          placeholder="请输入电话号码"
          :border="false"
          @change="onPhoneChange"
          class="input"
        />
      </van-cell-group >
      <van-cell-group custom-class="cell-group" >
        <text class="label"   >生日：</text>
        <view class="birthBox" @click="showPopup">
          <van-field
          :value="userinfo.birthday"
          placeholder="生日当天,全场五折!"
          :border="false"
          class="input"
          />
        </view>
        
        <van-popup :show="show" :z-index="1000000"  position="bottom" custom-style="height: 80%;" @close="onClose">
          <van-datetime-picker
            type="date"
            :value=" currentDate"
            :min-date="minDate"
            :max-date = "maxDate"
            :formatter=" formatter "
            @input="onBirthInput"
            @confirm ="onClose"
            @cancel ="onClose"
          />
        </van-popup>
        
      </van-cell-group >
        
      <button class="submit-btn" @click="formSubmit"   type="primary">保存</button>
		</form>
    
	</view>
  
</template>

<script>
  // 按需导入 mapState 辅助函数
  import { mapState, mapMutations } from 'vuex'
  //第三方包，格式化时间的
  import moment from 'moment';
	export default {
		data() {
			return {
        minDate: new Date('1900-1-1').getTime(),
        maxDate: new Date().getTime(),
        currentDate: new Date().getTime(),
        show: false,
        formatter(type, value) {
          if (type === 'year') {
            return `${value}年`;
          }
          if (type === 'month') {
            return `${value}月`;
          }
          return value;
        },
			}
		},
    computed:{
      // 调用 mapState 辅助方法，把 m_user 模块中的数据映射到当前用组件中使用
      ...mapState('m_user', ['redirectInfo','userinfo']),
      
    },
    methods:{

      // 2. 调用 mapMutations 辅助方法，把 m_user 模块中的 updateUserInfo 映射到当前组件中使用
      ...mapMutations('m_user', ['updateUserInfo','updateRedirectInfo']),      
      //修改昵称的函数
      onNickNameChange(event) {
          // event.detail 为当前输入的值
          this.userinfo.nickName = event.detail
      },
      //修改性别的函数
      onSexChange(event) {
          // event.detail 为当前输入的值
          this.userinfo.sex = event.detail
      },
      // 修改电话的函数
      onPhoneChange(event) {
          // event.detail 为当前输入的值
          this.userinfo.phone = event.detail
      },
      //修改生日的函数
      onBirthInput(event) {
          // event.detail 为当前输入的值
          this.currentDate = event.detail
      },
      //打开生日弹框的函数
      showPopup() {
        this.show = true 
      },
      //关闭生日弹框的函数
      onClose(val) {
        this.show = false 
        this.userinfo.birthday = moment(val.detail).format("YYYY-MM-DD") 
      },
      //提交按钮
      async formSubmit(){

        
        const result = await uni.$api.me.postUserInfo(this.userinfo)
        if(result.meta.status === 200){
          console.log('返回')
          //返回到个人中心页
         this.navigateBack()
          
        }else{
          uni.$showMsg('更新失败')
        }
        //提交数据到服务器
        
        
        
        //获取上一个页面的对象
        // var pages=getCurrentPages()
        // var prevPage=pages[pages.length-2]
        // //调用上一个页面的setData()方法，把数据存储到上一个页面中去
        // prevPage.setData({
        //   username:formData.username,
        //   gender:formData.gender
        // })

      },
      // 返回登录之前的页面
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    },
    onLoad: function (options) {
      //获取用户信息
      uni.$api.me.getUserInfo().then(res => {
        this.updateUserInfo({
        ...this.userinfo,
        ...res
        })
      }) 
    },
  }
</script>

<style lang="scss">
  page{
    font-size: 32rpx;
  }
  .cell-group{
    display: flex;
    align-items: center;
    margin: 10px ;
    padding: 10px;
    .input{
      flex: 1;
    }
  }
  .van-radio-group{
    display: flex;
    .van-radio-group{
      margin:0 30px 0 10px;
      
      display: flex;
      .sex-item{
        width: 80px;
      }
    }
  }
  .birthBox{
    flex: 1;

  }
  
    // 确认按钮样式
  .submit-btn{
    margin: 20px ;
  }
</style>
