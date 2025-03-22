<template>
  <view class="points-container">
    <!-- 积分展示区域 -->
    <view class="points-header">
      <view class="points-card">
        <view class="points-title">我的积分</view>
        <view class="points-value">{{ userInfo.points }}</view>
        <view class="points-desc">每次完成跑步可获得5积分</view>
      </view>
    </view>
    
    <!-- 积分兑换商品区域 -->
    <view class="points-exchange">
      <view class="section-title">积分兑换</view>
      
      <view class="product-list">
        <view 
          class="product-item" 
          v-for="(item, index) in products" 
          :key="index"
          @click="selectProduct(item)"
        >
          <image :src="item.image" mode="aspectFill" class="product-image"></image>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <view class="product-points">
              <text class="points-icon">积分</text>
              <text class="points-num">{{ item.points }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 地址选择弹窗 -->
    <uni-popup ref="addressPopup" type="bottom" v-if="showAddressDialog">
      <view class="address-popup">
        <view class="popup-header">
          <text class="popup-title">选择收货地址</text>
          <text class="popup-close" @click="closeAddressPopup">×</text>
        </view>
        
        <scroll-view scroll-y="true" class="address-list">
          <view 
            class="address-item" 
            v-for="(address, index) in addresses" 
            :key="index"
            @click="selectAddress(address)"
            :class="{ 'selected': selectedAddress && selectedAddress.id === address.id }"
          >
            <view class="address-info">
              <view class="address-line">
                <text class="address-name">{{ address.name }}</text>
                <text class="address-phone">{{ address.phone }}</text>
              </view>
              <view class="address-detail">{{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}</view>
            </view>
            <view class="address-check" v-if="selectedAddress && selectedAddress.id === address.id">
              <text class="check-icon">✓</text>
            </view>
          </view>
        </scroll-view>
        
        <view class="popup-footer">
          <button class="add-address-btn" @click="addNewAddress">添加新地址</button>
          <button class="confirm-btn" @click="confirmExchange" :disabled="!selectedAddress">确认兑换</button>
        </view>
      </view>
    </uni-popup>
    
    <!-- 兑换成功弹窗 -->
    <uni-popup ref="successPopup" type="center" v-if="showSuccessDialog">
      <view class="success-popup">
        <image src="/static/success.png" class="success-icon"></image>
        <text class="success-title">兑换成功</text>
        <text class="success-desc">商品将在3-5个工作日内发出</text>
        <button class="success-btn" @click="closeSuccessPopup">确定</button>
      </view>
    </uni-popup>
    
    <!-- 如果使用遮罩层，也需要添加条件控制 -->
    <view class="mask" v-if="showAddressDialog || showSuccessDialog" @click="closeAllDialogs"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        points: 0
      },
      products: [
        {
          id: 1,
          name: '运动水杯',
          points: 100,
          image: '/static/products/bottle.jpg'
        },
        {
          id: 2,
          name: '运动毛巾',
          points: 150,
          image: '/static/products/towel.jpg'
        },
        {
          id: 3,
          name: '跑步腰包',
          points: 200,
          image: '/static/products/bag.jpg'
        },
        {
          id: 4,
          name: '运动袜',
          points: 80,
          image: '/static/products/socks.jpg'
        },
        {
          id: 5,
          name: '运动护腕',
          points: 120,
          image: '/static/products/wristband.jpg'
        },
        {
          id: 6,
          name: '运动耳机',
          points: 300,
          image: '/static/products/headphone.jpg'
        }
      ],
      addresses: [
        {
          id: 1,
          name: '张三',
          phone: '13800138000',
          province: '北京市',
          city: '北京市',
          district: '海淀区',
          detail: '中关村科技园区123号'
        },
        {
          id: 2,
          name: '李四',
          phone: '13900139000',
          province: '上海市',
          city: '上海市',
          district: '浦东新区',
          detail: '张江高科技园区456号'
        }
      ],
      selectedProduct: null,
      selectedAddress: null,
      showAddressDialog: false,
      showSuccessDialog: false,
      selectedPrize: null,
      address: {
        name: '',
        phone: '',
        detail: ''
      }
    }
  },
  onLoad() {
    // 获取用户信息
    const userInfoStorage = uni.getStorageSync('userInfo');
    if (userInfoStorage) {
      this.userInfo = userInfoStorage;
    }
  },
  methods: {
    selectProduct(product) {
      if (this.userInfo.points < product.points) {
        uni.showToast({
          title: '积分不足',
          icon: 'none'
        });
        return;
      }
      
      this.selectedProduct = product;
      this.selectedAddress = null; // 重置选择的地址
      this.showAddressDialog = true;
    },
    
    closeAddressPopup() {
      this.$refs.addressPopup.close();
    },
    
    selectAddress(address) {
      this.selectedAddress = address;
    },
    
    addNewAddress() {
      // 这里只是模拟添加地址的功能
      uni.showToast({
        title: '添加地址功能开发中',
        icon: 'none'
      });
    },
    
    confirmExchange() {
      if (!this.selectedProduct || !this.selectedAddress) {
        uni.showToast({
          title: '请选择收货地址',
          icon: 'none'
        });
        return;
      }
      
      // 关闭地址选择弹窗
      this.$refs.addressPopup.close();
      
      // 显示加载中
      uni.showLoading({
        title: '处理中...'
      });
      
      // 模拟网络请求
      setTimeout(() => {
        // 扣除积分
        const userInfo = uni.getStorageSync('userInfo');
        userInfo.points -= this.selectedProduct.points;
        uni.setStorageSync('userInfo', userInfo);
        this.userInfo = userInfo;
        
        // 关闭加载
        uni.hideLoading();
        
        // 显示成功弹窗
        this.showSuccessDialog = true;
      }, 1500);
    },
    
    closeSuccessPopup() {
      this.$refs.successPopup.close();
    },
    
    closeAddressDialog() {
      this.showAddressDialog = false;
    },
    
    closeAllDialogs() {
      this.showAddressDialog = false;
      this.showSuccessDialog = false;
    }
  }
}
</script>

<style lang="scss">
.points-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30px;
}

.points-header {
  background: linear-gradient(135deg, #FF6B6B, #FFB88C);
  padding: 30px 20px;
}

.points-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.points-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.points-value {
  font-size: 36px;
  font-weight: bold;
  color: #FF6B6B;
  margin-bottom: 10px;
}

.points-desc {
  font-size: 14px;
  color: #999;
}

.points-exchange {
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product-item {
  width: 48%;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.product-image {
  width: 100%;
  height: 120px;
}

.product-info {
  padding: 10px;
}

.product-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.product-points {
  display: flex;
  align-items: center;
}

.points-icon {
  font-size: 12px;
  color: #fff;
  background-color: #FF6B6B;
  padding: 2px 5px;
  border-radius: 3px;
  margin-right: 5px;
}

.points-num {
  font-size: 16px;
  color: #FF6B6B;
  font-weight: bold;
}

.address-popup {
  background-color: #fff;
  border-radius: 16px 16px 0 0;
  min-height: 400px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.popup-close {
  font-size: 24px;
  color: #999;
}

.address-list {
  flex: 1;
  padding: 0 20px;
  max-height: 50vh;
}

.address-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &.selected {
    background-color: rgba(255, 107, 107, 0.05);
  }
}

.address-info {
  flex: 1;
}

.address-line {
  display: flex;
  margin-bottom: 5px;
}

.address-name {
  font-weight: bold;
  margin-right: 10px;
}

.address-phone {
  color: #666;
}

.address-detail {
  color: #333;
  font-size: 14px;
  line-height: 1.4;
}

.address-check {
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  color: #FF6B6B;
  font-weight: bold;
}

.popup-footer {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
}

.add-address-btn {
  width: 48%;
  height: 40px;
  line-height: 40px;
  border: 1px solid #FF6B6B;
  color: #FF6B6B;
  border-radius: 20px;
  background-color: #fff;
  font-size: 14px;
}

.confirm-btn {
  width: 48%;
  height: 40px;
  line-height: 40px;
  background-color: #FF6B6B;
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  
  &:disabled {
    background-color: #ccc;
  }
}

.success-popup {
  background-color: #fff;
  border-radius: 10px;
  width: 280px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
}

.success-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.success-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
}

.success-btn {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #FF6B6B;
  color: #fff;
  border-radius: 20px;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style> 