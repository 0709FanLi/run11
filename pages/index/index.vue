<template>
  <view class="content">
    <!-- 地图部分 -->
    <view class="map-section">
      <map
        id="runMap"
        provider="qqmap"
        :latitude="latitude"
        :longitude="longitude"
        :markers="markers"
        :polyline="polyline"
        :scale="scale"
        style="width: 100%; height: 65vh;"
        :show-location="true"
        :show-compass="true"
        :enable-poi="false"
        :enable-building="true"
        :show-scale="false"
        :enable-zoom="true"
        :enable-rotate="true"
        :include-points="includePoints"
        @regionchange="onRegionChange"
        @markertap="onMarkerTap"
      >
        <!-- 地图控件 -->
        <cover-view class="map-controls">
          <cover-view class="map-btn location-btn" @click="moveToLocation">
            <cover-image src="/static/icons/location.png" class="btn-icon"></cover-image>
          </cover-view>
        </cover-view>
      </map>
    </view>
    
    <!-- 跑步信息和按钮 -->
    <view class="run-section" :class="{ 'running': isRunning }">
      <view v-if="isRunning" class="run-info">
        <view class="info-item">
          <text class="info-value">{{ formatDuration }}</text>
          <text class="info-label">时间</text>
        </view>
        <view class="info-item">
          <text class="info-value">{{ distance.toFixed(2) }}</text>
          <text class="info-label">距离(公里)</text>
        </view>
        <view class="info-item">
          <text class="info-value">{{ calories.toFixed(0) }}</text>
          <text class="info-label">卡路里</text>
        </view>
      </view>
      
      <view class="run-button-wrapper" :class="{ 'pulse': !isRunning }">
        <button class="run-button" :class="{ 'small': isRunning }" @click="toggleRun">
          {{ isRunning ? '结束跑步' : '开始跑步' }}
        </button>
      </view>
    </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      latitude: 39.909, // 默认纬度
      longitude: 116.39742, // 默认经度
      scale: 16, // 缩放级别
      markers: [{
        id: 1,
        latitude: 39.909,
        longitude: 116.39742,
        title: '当前位置',
        iconPath: '/static/location.png',
        width: 30,
        height: 30
      }],
      polyline: [], // 跑步轨迹
      isRunning: false, // 是否正在跑步
      startTime: null, // 开始时间
      duration: 0, // 持续时间（秒）
      distance: 0, // 距离（公里）
      calories: 0, // 卡路里
      timer: null, // 计时器
      locationChangeListener: null, // 位置监听器
      locationList: [], // 位置记录
      pace: '0\'00"', // 配速
      customMapStyle: 'amap://styles/fresh', // 使用自定义地图样式
      includePoints: [],
      positionUpdateTimer: null, // 保存位置更新定时器
      lastKnownPosition: null, // 上次知道的位置
      mapContext: null // 地图上下文
    }
  },
  computed: {
    formatDuration() {
      const hours = Math.floor(this.duration / 3600);
      const minutes = Math.floor((this.duration % 3600) / 60);
      const seconds = this.duration % 60;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  },
  onLoad() {
    // 检查登录状态
    const isLoggedIn = uni.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      uni.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    // 尝试恢复上次保存的位置状态
    const lastPositionData = uni.getStorageSync('lastPosition');
    if (lastPositionData) {
      this.lastKnownPosition = JSON.parse(lastPositionData);
      this.latitude = this.lastKnownPosition.latitude;
      this.longitude = this.lastKnownPosition.longitude;
      
      // 更新标记点位置
      this.markers = [{
        id: 1,
        latitude: this.latitude,
        longitude: this.longitude,
        title: '当前位置',
        iconPath: '/static/location.png',
        width: 30,
        height: 30
      }];
    }
    
    // 隐藏导航栏
    try {
      uni.hideNavigationBar();
    } catch (e) {
      console.log('隐藏导航栏失败', e);
    }
    
    // 调整页面布局以适应底部安全区域
    this.adjustPageLayout();
    
    // 延迟后尝试定位
    setTimeout(() => {
      this.getLocationAndCenter();
    }, 200);
  },
  onShow() {
    // 确保导航栏隐藏
    setTimeout(() => {
      uni.hideNavigationBar();
    }, 300);
    
    // 开始非跑步状态下的位置更新
    if (!this.isRunning) {
      this.startPositionUpdateTimer();
    }
  },
  onHide() {
    // 停止位置更新定时器
    this.clearPositionUpdateTimer();
  },
  onUnload() {
    // 清理监听器和计时器
    this.clearListeners();
    this.clearPositionUpdateTimer();
  },
  methods: {
    adjustPageLayout() {
      // 获取系统信息，调整页面布局
      uni.getSystemInfo({
        success: (res) => {
          console.log('系统信息:', res);
          
          // 设置底部安全区域高度
          let safeBottom = 70; // 默认值，包括tabbar高度
          if (res.safeAreaInsets && res.safeAreaInsets.bottom > 0) {
            safeBottom = res.safeAreaInsets.bottom + 60; // 安全区域 + tabbar高度
          }
          
          // 设置CSS变量
          if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--safe-bottom', `${safeBottom}px`);
          }
          
          // 保存状态栏高度
          this.statusBarHeight = res.statusBarHeight || 20;
        }
      });
    },
    
    getLocationAndCenter() {
      uni.showLoading({
        title: '定位中...'
      });
      
      const locationTimeout = setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '定位超时，请手动点击定位按钮',
          icon: 'none',
          duration: 2000
        });
      }, 8000); // 8秒超时
      
      uni.getLocation({
        type: 'gcj02',
        isHighAccuracy: true, // 开启高精度定位
        success: (res) => {
          clearTimeout(locationTimeout);
          
          console.log('定位成功:', res);
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          
          // 保存当前位置状态
          this.lastKnownPosition = {
            latitude: res.latitude,
            longitude: res.longitude,
            timestamp: Date.now()
          };
          uni.setStorageSync('lastPosition', JSON.stringify(this.lastKnownPosition));
          
          // 更新标记点位置
          this.markers = [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            title: '当前位置',
            iconPath: '/static/location.png',
            width: 30,
            height: 30
          }];
          
          // 确保地图移动到当前位置
          setTimeout(() => {
            if (this.mapContext) {
              this.mapContext.moveToLocation({
                latitude: res.latitude,
                longitude: res.longitude,
                success: () => {
                  console.log('地图已经移动到定位点');
                },
                fail: (err) => {
                  console.error('地图移动失败', err);
                }
              });
            }
            
            uni.hideLoading();
            
            // 开始定期更新位置
            if (!this.isRunning) {
              this.startPositionUpdateTimer();
            }
          }, 500);
        },
        fail: (err) => {
          clearTimeout(locationTimeout);
          console.error('获取位置失败', err);
          uni.hideLoading();
          uni.showToast({
            title: '获取位置失败，请检查定位权限',
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    
    getLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          
          // 更新标记点位置
          if (this.markers.length > 0) {
            this.markers[0].latitude = res.latitude;
            this.markers[0].longitude = res.longitude;
          }
        },
        fail: (err) => {
          console.error('获取位置失败', err);
          uni.showToast({
            title: '获取位置失败，请检查定位权限',
            icon: 'none'
          });
        }
      });
    },
    
    moveToLocation() {
      
      uni.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          
          // 更新标记点位置
          this.markers = [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            title: '当前位置',
            iconPath: '/static/location.png',
            width: 30,
            height: 30
          }];
          
          // 使用地图上下文API强制移动到位置
          const mapContext = uni.createMapContext('runMap');
          if (mapContext) {
            mapContext.moveToLocation({
              latitude: res.latitude,
              longitude: res.longitude
            });
          }
          
          uni.hideLoading();
          uni.showToast({
            title: '已定位到当前位置',
            icon: 'none',
            duration: 1000
          });
        },
        fail: (err) => {
          console.error('获取位置失败', err);
          uni.hideLoading();
          uni.showToast({
            title: '获取位置失败，请检查定位权限',
            icon: 'none'
          });
        }
      });
    },
    
    toggleRun() {
      if (this.isRunning) {
        // 结束跑步
        this.stopRun();
      } else {
        // 开始跑步
        this.startRun();
      }
    },
    
    startRun() {
      this.isRunning = true;
      
      // 停止普通的位置更新定时器
      this.clearPositionUpdateTimer();
      
      this.startTime = new Date();
      this.duration = 0;
      this.distance = 0;
      this.calories = 0;
      this.locationList = [];
      
      // 放大地图层级以查看更详细路径
      this.scale = 18;
      if (this.mapContext) {
        this.mapContext.setScale({
          scale: 18
        });
      }
      
      // 初始化轨迹线
      this.polyline = [{
        points: [],
        color: '#FF6B6B',
        width: 8,
        arrowLine: true,
        borderWidth: 1,
        borderColor: '#FF8E53'
      }];
      
      // 开始计时
      this.timer = setInterval(() => {
        this.duration++;
        // 每分钟消耗约10卡路里（这是个估算值）
        this.calories = (this.duration / 60) * 10;
        
        // 更新配速
        if (this.distance > 0) {
          const paceMinutes = Math.floor((this.duration / 60) / this.distance);
          const paceSeconds = Math.floor(((this.duration / 60) / this.distance - paceMinutes) * 60);
          this.pace = `${paceMinutes}'${paceSeconds.toString().padStart(2, '0')}"`;
        }
      }, 1000);
      
      // 开始记录位置
      this.startLocationTracking();
      
      uni.showToast({
        title: '开始跑步!',
        icon: 'success'
      });
    },
    
    stopRun() {
      this.isRunning = false;
      
      // 停止计时
      clearInterval(this.timer);
      this.timer = null;
      
      // 停止位置记录
      this.clearListeners();
      
      // 更新积分
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        userInfo.points = (userInfo.points || 0) + 5; // 跑步奖励5积分
        uni.setStorageSync('userInfo', userInfo);
      }
      
      // 使用toast提示完成
      uni.showToast({
        title: '跑步结束，获得5积分',
        icon: 'success',
        duration: 2000
      });
      
      // 恢复地图层级
      this.scale = 16;
      if (this.mapContext) {
        this.mapContext.setScale({
          scale: 16
        });
      }
      
      // 重新开始普通的位置更新定时器
      this.startPositionUpdateTimer();
    },
    
    startLocationTracking() {
      uni.startLocationUpdate({
        success: (res) => {
          console.log('开始监听位置变化');
          
          this.locationChangeListener = (res) => {
            const { latitude, longitude } = res;
            
            this.locationList.push({ latitude, longitude });
            
            if (this.locationList.length > 1) {
              const lastLoc = this.locationList[this.locationList.length - 2];
              const currentLoc = { latitude, longitude };
              const segmentDistance = this.calculateDistance(lastLoc, currentLoc);
              this.distance += segmentDistance;
            }
            
            // 更新路径样式
            this.polyline = [{
              points: this.locationList,
              color: '#FF6B6B',
              width: 8,
              arrowLine: true,
              borderWidth: 1,
              borderColor: '#FF8E53',
              level: 'abovelabels'
            }];
            
            // 更新地图中心点并保持缩放级别
            this.latitude = latitude;
            this.longitude = longitude;
            this.scale = 20; // 保持最大缩放级别
          };
          
          uni.onLocationChange(this.locationChangeListener);
        },
        fail: (err) => {
          console.error('开始监听位置失败', err);
        }
      });
    },
    
    calculateDistance(loc1, loc2) {
      // 使用简化的公式计算两点之间距离（公里）
      const R = 6371; // 地球半径（公里）
      const dLat = this.deg2rad(loc2.latitude - loc1.latitude);
      const dLon = this.deg2rad(loc2.longitude - loc1.longitude);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(loc1.latitude)) * Math.cos(this.deg2rad(loc2.latitude)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return distance;
    },
    
    deg2rad(deg) {
      return deg * (Math.PI/180);
    },
    
    clearListeners() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      
      if (this.locationChangeListener) {
        uni.offLocationChange(this.locationChangeListener);
        this.locationChangeListener = null;
        uni.stopLocationUpdate();
      }
    },
    
    closeFinishPopup() {
      this.$refs.finishPopup.close();
    },

    onRegionChange(e) {
      // Implementation of onRegionChange method
    },

    onMarkerTap(e) {
      // Implementation of onMarkerTap method
    },

    // 开始位置更新定时器 - 非跑步状态下每5秒更新一次
    startPositionUpdateTimer() {
      // 先清除已有的定时器
      this.clearPositionUpdateTimer();
      
      // 如果正在跑步状态，不启动此定时器
      if (this.isRunning) {
        return;
      }
      
      this.positionUpdateTimer = setInterval(() => {
        // 静默更新位置，不显示加载中
        uni.getLocation({
          type: 'gcj02',
          isHighAccuracy: true,
          success: (res) => {
            console.log('定时位置更新:', res);
            this.latitude = res.latitude;
            this.longitude = res.longitude;
            
            // 保存当前位置状态
            this.lastKnownPosition = {
              latitude: res.latitude,
              longitude: res.longitude,
              timestamp: Date.now()
            };
            uni.setStorageSync('lastPosition', JSON.stringify(this.lastKnownPosition));
            
            // 更新标记点位置
            this.markers[0].latitude = res.latitude;
            this.markers[0].longitude = res.longitude;
            
            // 如果地图上下文存在，移动地图位置
            if (this.mapContext) {
              this.mapContext.moveToLocation({
                latitude: res.latitude,
                longitude: res.longitude
              });
            }
          },
          fail: (err) => {
            console.error('定时位置更新失败', err);
          }
        });
      }, 5000); // 每5秒执行一次
    },
    
    // 清除位置更新定时器
    clearPositionUpdateTimer() {
      if (this.positionUpdateTimer) {
        clearInterval(this.positionUpdateTimer);
        this.positionUpdateTimer = null;
      }
    }
  }
}
</script>

<style lang="scss">
page {
  --safe-bottom: 70px; /* 默认底部安全区域高度 */
}

.content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  padding-top: 0;
}

.map-section {
  flex: 1;
  position: relative;
}

.map-controls {
  position: absolute;
  bottom: 40px; /* 增加底部间距，确保不会被遮挡 */
  right: 20px;
  z-index: 100;
}

.map-btn {
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
}

.btn-icon {
  width: 24px;
  height: 24px;
}

.run-section {
  padding: 15px 20px;
  padding-bottom: calc(15px + var(--safe-bottom)); /* 适配底部安全区域 */
  background-color: #fff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
  transition: all 0.3s ease;
  
  &.running {
    padding: 10px 15px;
    padding-bottom: calc(15px + var(--safe-bottom)); /* 适配底部安全区域 */
  }
}

.run-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-value {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.info-label {
  font-size: 14px;
  color: #888;
  margin-top: 3px;
}

.run-button-wrapper {
  display: flex;
  justify-content: center;
  margin: 5px 0 10px;
  
  &.pulse {
    animation: pulse 2s infinite;
  }
}

.run-button {
  width: 130px;
  height: 130px;
  border-radius: 65px;
  background-color: #FF6B6B;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 15px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
  
  &.small {
    width: 90px;
    height: 90px;
    border-radius: 45px;
    font-size: 15px;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
}

.finish-popup {
  background-color: #fff;
  border-radius: 10px;
  width: 280px;
  padding: 20px;
}

.finish-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.finish-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.finish-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.finish-content {
  margin-bottom: 20px;
}

.finish-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  
  &.highlight {
    color: #FF6B6B;
    font-weight: bold;
  }
}

.finish-label {
  color: #666;
}

.finish-value {
  font-weight: bold;
  color: #333;
}

.finish-btn {
  background-color: #FF6B6B;
  color: #fff;
  border-radius: 20px;
  height: 40px;
  line-height: 40px;
}

/* 修改地图上的版权信息 */
::v-deep .amap-copyright,
::v-deep .amap-logo,
::v-deep [class*="Label"],
::v-deep [class*="logo"],
::v-deep [class*="attribution"],
::v-deep [class*="copyright"] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

/* 添加一个定位加载时的样式 */
.loading-location {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
}
</style>