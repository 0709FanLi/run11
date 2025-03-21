<template>
  <view class="edit-container">
    <view class="edit-form">
      <view class="form-item avatar-item">
        <text class="form-label">头像</text>
        <view class="avatar-wrapper" @click="chooseAvatar">
          <image :src="userInfo.avatarUrl" class="avatar-image"></image>
          <view class="avatar-edit">
            <text class="edit-icon">&#xe614;</text>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">昵称</text>
        <input 
          type="text" 
          class="form-input" 
          v-model="userInfo.nickname" 
          placeholder="请输入昵称"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="gender-selector">
          <view 
            class="gender-option" 
            :class="{ 'active': userInfo.gender === '男' }"
            @click="userInfo.gender = '男'"
          >
            <text class="gender-icon">&#xe643;</text>
            <text class="gender-text">男</text>
          </view>
          <view 
            class="gender-option" 
            :class="{ 'active': userInfo.gender === '女' }"
            @click="userInfo.gender = '女'"
          >
            <text class="gender-icon">&#xe612;</text>
            <text class="gender-text">女</text>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">手机号</text>
        <text class="form-text">{{ formatPhone(userInfo.phone) }}</text>
      </view>
      
      <view class="form-item">
        <text class="form-label">身高 (cm)</text>
        <input 
          type="number" 
          class="form-input" 
          v-model="userInfo.height" 
          placeholder="请输入身高"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">体重 (kg)</text>
        <input 
          type="digit" 
          class="form-input" 
          v-model="userInfo.weight" 
          placeholder="请输入体重"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">生日</text>
        <picker 
          mode="date" 
          :value="userInfo.birthday" 
          start="1950-01-01" 
          end="2023-12-31" 
          @change="onBirthdayChange"
          class="form-picker"
        >
          <view class="picker-value">
            {{ userInfo.birthday || '请选择出生日期' }}
          </view>
        </picker>
      </view>
    </view>
    
    <view class="button-area">
      <button class="save-btn" @click="saveUserInfo">保存</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        nickname: '',
        phone: '',
        avatarUrl: '/static/default-avatar.png',
        gender: '男',
        height: '',
        weight: '',
        birthday: ''
      }
    }
  },
  onLoad() {
    // 获取用户信息
    const userInfoStorage = uni.getStorageSync('userInfo');
    if (userInfoStorage) {
      // 复制一份避免直接修改
      this.userInfo = JSON.parse(JSON.stringify(userInfoStorage));
      
      // 确保有这些属性
      this.userInfo.height = this.userInfo.height || '';
      this.userInfo.weight = this.userInfo.weight || '';
      this.userInfo.birthday = this.userInfo.birthday || '';
    }
  },
  methods: {
    formatPhone(phone) {
      if (!phone) return '';
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    },
    
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          
          // 实际应用中这里应上传到服务器
          // 这里简单处理，直接使用本地路径
          this.userInfo.avatarUrl = tempFilePath;
          
          uni.showToast({
            title: '头像已更新',
            icon: 'success'
          });
        }
      });
    },
    
    onBirthdayChange(e) {
      this.userInfo.birthday = e.detail.value;
    },
    
    validateForm() {
      if (!this.userInfo.nickname) {
        uni.showToast({
          title: '请输入昵称',
          icon: 'none'
        });
        return false;
      }
      
      // 身高体重验证
      if (this.userInfo.height && (isNaN(this.userInfo.height) || Number(this.userInfo.height) < 50 || Number(this.userInfo.height) > 250)) {
        uni.showToast({
          title: '请输入有效的身高',
          icon: 'none'
        });
        return false;
      }
      
      if (this.userInfo.weight && (isNaN(this.userInfo.weight) || Number(this.userInfo.weight) < 20 || Number(this.userInfo.weight) > 200)) {
        uni.showToast({
          title: '请输入有效的体重',
          icon: 'none'
        });
        return false;
      }
      
      return true;
    },
    
    saveUserInfo() {
      if (!this.validateForm()) {
        return;
      }
      
      // 获取原始用户信息
      const originalUserInfo = uni.getStorageSync('userInfo') || {};
      
      // 合并更新
      const updatedUserInfo = {
        ...originalUserInfo,
        nickname: this.userInfo.nickname,
        gender: this.userInfo.gender,
        avatarUrl: this.userInfo.avatarUrl,
        height: this.userInfo.height,
        weight: this.userInfo.weight,
        birthday: this.userInfo.birthday
      };
      
      // 保存更新后的信息
      uni.setStorageSync('userInfo', updatedUserInfo);
      
      uni.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      });
    }
  }
}
</script>

<style lang="scss">
.edit-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30px;
}

.edit-form {
  margin: 15px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.form-item {
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.avatar-item {
  padding: 20px 15px;
}

.form-label {
  width: 80px;
  font-size: 16px;
  color: #333;
}

.form-input {
  flex: 1;
  height: 24px;
  font-size: 16px;
}

.form-text {
  flex: 1;
  font-size: 16px;
  color: #666;
}

.form-picker {
  flex: 1;
}

.picker-value {
  font-size: 16px;
  color: #333;
}

.avatar-wrapper {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  position: relative;
}

.avatar-image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.avatar-edit {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.edit-icon {
  font-family: 'iconfont';
  font-size: 14px;
}

.gender-selector {
  flex: 1;
  display: flex;
  justify-content: space-around;
}

.gender-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  border-radius: 5px;
  
  &.active {
    background-color: rgba(255, 107, 107, 0.1);
    color: #FF6B6B;
  }
}

.gender-icon {
  font-family: 'iconfont';
  font-size: 24px;
  margin-bottom: 5px;
}

.gender-text {
  font-size: 14px;
}

.button-area {
  margin: 30px 15px;
}

.save-btn {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: #fff;
  border-radius: 10px;
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
}
</style>