<template>
  <view class="profile-container">
    <!-- 头部用户信息 -->
    <view class="user-header">
      <view class="user-info" @click="navigateToEdit">
        <image :src="userInfo.avatarUrl" class="user-avatar"></image>
        <view class="user-detail">
          <text class="user-nickname">{{ userInfo.nickname }}</text>
          <text class="user-phone">{{ formatPhone(userInfo.phone) }}</text>
        </view>
        <view class="edit-icon">
          <text class="iconfont">&#xe632;</text>
        </view>
      </view>
    </view>
    
    <!-- 跑步统计 -->
    <view class="stats-section">
      <view class="stats-item">
        <text class="stats-value">{{ runStats.totalDistance }}</text>
        <text class="stats-label">总里程(km)</text>
      </view>
      <view class="stats-item">
        <text class="stats-value">{{ runStats.totalDuration }}</text>
        <text class="stats-label">总时长(h)</text>
      </view>
      <view class="stats-item">
        <text class="stats-value">{{ runStats.totalCalories }}</text>
        <text class="stats-label">消耗(kcal)</text>
      </view>
    </view>
    
    <!-- 功能列表 -->
    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-title">个人设置</view>
        <view class="menu-list">
          <view class="menu-item" @click="navigateToEdit">
            <view class="menu-icon personal-icon">
              <text class="iconfont">&#xe608;</text>
            </view>
            <view class="menu-content">
              <text class="menu-label">个人信息</text>
            </view>
            <text class="menu-arrow">&#xe633;</text>
          </view>
          
          <view class="menu-item" @click="showHealthInfo">
            <view class="menu-icon health-icon">
              <text class="iconfont">&#xe635;</text>
            </view>
            <view class="menu-content">
              <text class="menu-label">健康信息收集清单</text>
            </view>
            <text class="menu-arrow">&#xe633;</text>
          </view>
          
          <view class="menu-item" @click="openSettings">
            <view class="menu-icon settings-icon">
              <text class="iconfont">&#xe617;</text>
            </view>
            <view class="menu-content">
              <text class="menu-label">设置</text>
            </view>
            <text class="menu-arrow">&#xe633;</text>
          </view>
        </view>
      </view>
      
      <view class="menu-group">
        <view class="menu-title">关于我们</view>
        <view class="menu-list">
          <view class="menu-item" @click="showAbout">
            <view class="menu-icon about-icon">
              <text class="iconfont">&#xe612;</text>
            </view>
            <view class="menu-content">
              <text class="menu-label">关于应用</text>
            </view>
            <text class="menu-arrow">&#xe633;</text>
          </view>
          
          <view class="menu-item" @click="showPrivacy">
            <view class="menu-icon privacy-icon">
              <text class="iconfont">&#xe636;</text>
            </view>
            <view class="menu-content">
              <text class="menu-label">隐私政策</text>
            </view>
            <text class="menu-arrow">&#xe633;</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="logout-section">
      <button class="logout-btn" @click="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        nickname: '跑步达人',
        phone: '13800138000',
        avatarUrl: '/static/default-avatar.png',
        gender: '男'
      },
      runStats: {
        totalDistance: '0.0',
        totalDuration: '0.0',
        totalCalories: '0'
      }
    }
  },
  onShow() {
    // 每次显示页面时更新用户信息
    const userInfoStorage = uni.getStorageSync('userInfo');
    if (userInfoStorage) {
      this.userInfo = userInfoStorage;
    }
    
    // 模拟获取跑步统计数据
    this.getRunStats();
  },
  methods: {
    formatPhone(phone) {
      if (!phone) return '';
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    },
    
    navigateToEdit() {
      uni.navigateTo({
        url: '/pages/profile/edit'
      });
    },
    
    getRunStats() {
      // 这里模拟获取跑步数据
      // 实际应用中应该从服务器或本地存储获取
      this.runStats = {
        totalDistance: (Math.random() * 10).toFixed(1),
        totalDuration: (Math.random() * 5).toFixed(1),
        totalCalories: Math.floor(Math.random() * 1000)
      };
    },
    
    showHealthInfo() {
      uni.showModal({
        title: '健康信息收集清单',
        content: '我们收集您的运动数据，包括跑步距离、时间和卡路里消耗等信息，以提供更好的健康分析服务。',
        confirmText: '了解更多',
        cancelText: '关闭',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/health/detail'
            });
          }
        }
      });
    },
    
    openSettings() {
      uni.showToast({
        title: '设置功能开发中',
        icon: 'none'
      });
    },
    
    showAbout() {
      uni.showModal({
        title: '关于应用',
        content: '跑步达人 v1.0.0\n一款专注于记录跑步数据、激励健康生活的应用。',
        showCancel: false,
        confirmText: '我知道了'
      });
    },
    
    showPrivacy() {
      uni.showModal({
        title: '隐私政策',
        content: '我们重视您的隐私保护，所有数据仅用于改善用户体验，不会向第三方泄露您的个人信息。',
        confirmText: '查看详情',
        cancelText: '关闭',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/privacy/policy'
            });
          }
        }
      });
    },
    
    logout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('isLoggedIn');
            uni.removeStorageSync('userInfo');
            
            uni.reLaunch({
              url: '/pages/login/login'
            });
          }
        }
      });
    }
  }
}
</script>

<style lang="scss">
/* 引入图标字体 */
@font-face {
  font-family: 'iconfont';
  src: url('https://at.alicdn.com/t/font_2331156_mxwwsyv3qo.ttf') format('truetype');
}

.iconfont {
  font-family: 'iconfont';
}

.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30px;
}

/* 用户头部信息 */
.user-header {
  background: linear-gradient(135deg, #FF6B6B, #FFB88C);
  padding: 40px 20px 30px;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  position: relative;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.user-detail {
  margin-left: 15px;
}

.user-nickname {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.user-phone {
  font-size: 14px;
  opacity: 0.9;
}

.edit-icon {
  position: absolute;
  right: 10px;
  font-size: 20px;
}

/* 统计信息 */
.stats-section {
  margin: -20px 15px 15px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  padding: 15px 0;
}

.stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #f0f0f0;
  
  &:last-child {
    border-right: none;
  }
}

.stats-value {
  font-size: 18px;
  font-weight: bold;
  color: #FF6B6B;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 12px;
  color: #666;
}

/* 菜单列表 */
.menu-section {
  margin: 0 15px;
}

.menu-group {
  margin-bottom: 15px;
}

.menu-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 15px 5px 10px;
}

.menu-list {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 55px;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: #f5f5f5;
  }
  
  &:last-child:after {
    display: none;
  }
}

.menu-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #fff;
  font-size: 18px;
}

.personal-icon {
  background-color: #4facfe;
}

.health-icon {
  background-color: #38ef7d;
}

.settings-icon {
  background-color: #6a11cb;
}

.about-icon {
  background-color: #f5af19;
}

.privacy-icon {
  background-color: #00cdac;
}

.menu-content {
  flex: 1;
}

.menu-label {
  font-size: 16px;
  color: #333;
}

.menu-arrow {
  color: #ccc;
  font-family: 'iconfont';
  font-size: 16px;
}

/* 退出登录 */
.logout-section {
  margin: 30px 15px;
}

.logout-btn {
  background-color: #fff;
  color: #FF6B6B;
  border-radius: 10px;
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
</style>
