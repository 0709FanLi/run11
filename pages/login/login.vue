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
        <input type="number" v-model="verificationCode" maxlength="6" placeholder="验证码" />
        <text class="code-btn" :class="{ 'counting': counting }" @click="getVerificationCode">
          {{ counting ? `${countDown}秒后重发` : '获取验证码' }}
        </text>
      </view>
      
      <button class="login-btn" @click="login">登录/注册</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '18768880709', // 默认手机号
      verificationCode: '', // 用户输入的验证码
      defaultCode: '888888', // 默认验证码
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
    
    getVerificationCode() {
      // 验证手机号
      if (!this.phone || !/^1\d{10}$/.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      // 显示默认验证码（实际应用中应该通过短信发送）
      uni.showToast({
        title: '默认验证码：' + this.defaultCode,
        icon: 'none',
        duration: 3000
      });
      
      // 开始倒计时逻辑...
      this.counting = true;
      this.countDown = 60;
      
      // 倒计时
      const timer = setInterval(() => {
        this.countDown--;
        if (this.countDown <= 0) {
          this.counting = false;
          clearInterval(timer);
        }
      }, 1000);
    },
    
    login() {
      // 验证手机号
      if (!this.phone || !/^1\d{10}$/.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      // 验证验证码
      if (!this.verificationCode) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        });
        return;
      }
      
      // 检查验证码是否匹配默认验证码
      if (this.verificationCode !== this.defaultCode) {
        uni.showToast({
          title: '验证码错误',
          icon: 'none'
        });
        return;
      }
      
      // 验证通过，执行登录逻辑
      uni.showLoading({
        title: '登录中...'
      });
      
      // 模拟登录请求
      setTimeout(() => {
        // 存储登录状态
        uni.setStorageSync('isLoggedIn', true);
        
        // 创建用户信息（实际应用中应该从后端获取）
        const userInfo = {
          id: '1001',
          name: '用户' + this.phone.substring(7),
          phone: this.phone,
          avatar: '/static/avatar.png',
          points: 0
        };
        
        // 存储用户信息
        uni.setStorageSync('userInfo', userInfo);
        
        uni.hideLoading();
        
        // 登录成功，跳转到首页
        uni.switchTab({
          url: '/pages/index/index'
        });
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