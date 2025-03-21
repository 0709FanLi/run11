<template>
  <view class="login-container">
    <!-- 全屏背景图 -->
    <image class="page-bg" src="/static/login-bg.png" mode="aspectFill"></image>
    
    <!-- 登录表单区域 -->
    <view class="login-form">
      <view class="form-item">
        <text class="form-label">登录</text>
        <view class="form-input-line"></view>
      </view>
      
      <view class="form-item phone-input">
        <input type="number" v-model="phone" maxlength="11" placeholder="输入手机号" />
      </view>
      
      <view class="form-item code-input">
        <input type="number" v-model="code" maxlength="6" placeholder="验证码" />
        <text class="code-btn" :class="{ 'counting': counting }" @click="getVerifyCode">
          {{ counting ? `${countDown}秒后重发` : '获取验证码' }}
        </text>
      </view>
      
      <button class="login-btn" @click="handleLogin">登录/注册</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '18768880709', // 默认手机号
      code: '',
      counting: false,
      countDown: 60
    }
  },
  onLoad() {
    // 确保背景图已加载
    this.preloadImage();
  },
  methods: {
    preloadImage() {
      // 预加载背景图片
      uni.getImageInfo({
        src: '/static/login-bg.png',
        success: (res) => {
          console.log('背景图加载成功', res);
        },
        fail: (err) => {
          console.error('背景图加载失败', err);
          // 尝试使用不带斜杠的路径
          uni.getImageInfo({
            src: 'static/login-bg.png',
            success: (res) => {
              console.log('使用alternate路径加载成功');
              // 如果这个路径成功，修改模板中的路径
              document.querySelector('.page-bg').src = 'static/login-bg.png';
            },
            fail: (errInner) => {
              console.error('所有路径都加载失败', errInner);
            }
          });
        }
      });
    },
    
    getVerifyCode() {
      if (!/^1\d{10}$/.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      this.counting = true;
      this.countDown = 60;
      
      // 模拟发送验证码
      // 随机模拟成功或失败
      const isSuccess = Math.random() > 0.2; // 80%概率成功
      
      if (!isSuccess) {
        uni.showToast({
          title: '验证码发送失败，请重试',
          icon: 'none'
        });
        this.counting = false;
        return;
      }
      
      // 成功情况下不显示提示
      console.log('验证码发送成功');
      
      // 倒计时
      const timer = setInterval(() => {
        this.countDown--;
        if (this.countDown <= 0) {
          this.counting = false;
          clearInterval(timer);
        }
      }, 1000);
    },
    
    handleLogin() {
      if (!/^1\d{10}$/.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      if (!this.code || this.code.length !== 6) {
        uni.showToast({
          title: '请输入6位验证码',
          icon: 'none'
        });
        return;
      }
      
      // 模拟登录/注册处理
      uni.showLoading({
        title: '处理中...'
      });
      
      // 模拟检查手机号是否注册过
      setTimeout(() => {
        const isRegistered = Math.random() > 0.5; // 随机模拟是否已注册
        
        if (isRegistered) {
          // 已注册，直接登录
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          });
        } else {
          // 未注册，自动注册
          uni.showToast({
            title: '注册成功',
            icon: 'success'
          });
        }
        
        // 保存登录状态
        uni.setStorageSync('isLoggedIn', true);
        uni.setStorageSync('userInfo', {
          phone: this.phone,
          points: 100, // 初始积分
          avatarUrl: '/static/default-avatar.png',
          nickname: '跑步达人',
          gender: '男'
        });
        
        // 延迟跳转到首页
        setTimeout(() => {
          uni.hideLoading();
          uni.reLaunch({
            url: '/pages/index/index'
          });
        }, 1000);
      }, 1500);
    }
  }
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  justify-content: center;
}

.page-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover; /* 确保图片覆盖整个区域 */
}

.login-form {
  position: relative;
  padding: 30px 20px;
  z-index: 2;
  margin: 20px;
  background-color: rgba(0, 0, 0, 0.2); /* 给表单添加轻微的透明背景 */
  border-radius: 15px;
  backdrop-filter: blur(2px); /* 轻微模糊效果 */
}

.form-item {
  margin-bottom: 25px;
}

.form-label {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
  display: block;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); /* 增强文字阴影 */
}

.form-input-line {
  height: 2px;
  background-color: rgba(255, 255, 255, 0.6);
  margin: 10px 0 25px;
}

.phone-input, .code-input {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding: 12px 15px;
  background-color: rgba(0, 0, 0, 0.2); /* 轻微暗色背景提高可读性 */
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.code-input {
  position: relative;
}

.code-btn {
  position: absolute;
  right: 15px;
  color: #ffffff;
  font-size: 14px;
  padding: 5px 0;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5); /* 添加文字阴影 */
  
  &.counting {
    color: rgba(255, 255, 255, 0.7);
  }
}

.login-btn {
  width: 100%;
  height: 55px;
  line-height: 55px;
  text-align: center;
  border-radius: 28px;
  margin-top: 40px;
  font-size: 18px;
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: #fff;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

input {
  font-size: 16px;
  width: 100%;
  color: #ffffff;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}
</style> 