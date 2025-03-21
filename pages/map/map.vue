<template>
  <view class="map-container">
    <map
      id="myMap"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :scale="scale"
      @regionchange="onRegionChange"
      @markertap="onMarkerTap"
      @callouttap="onCalloutTap"
      style="width: 100%; height: 300px;"
      :show-location="true"
    ></map>
    <view class="controls">
      <button @click="moveToLocation" class="uni-btn">定位到当前位置</button>
      <button @click="searchNearby" class="uni-btn">搜索附近</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      latitude: 39.909, // 默认纬度
      longitude: 116.39742, // 默认经度
      scale: 14, // 缩放级别，取值范围为 5-18
      markers: [{
        id: 1,
        latitude: 39.909,
        longitude: 116.39742,
        title: '标记点1',
        iconPath: '/static/location.png', // 需要提前准备图标
        width: 30,
        height: 30,
        callout: {
          content: '这是一个标记点',
          color: '#000000',
          fontSize: 14,
          borderRadius: 4,
          bgColor: '#ffffff',
          padding: 8,
          display: 'ALWAYS'
        }
      }]
    }
  },
  onLoad() {
    // 获取当前位置
    this.getLocation();
  },
  methods: {
    getLocation() {
      uni.getLocation({
        type: 'gcj02', // 腾讯地图使用的是国测局坐标(GCJ-02)
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          
          // 更新标记点位置
          if (this.markers.length > 0) {
            this.markers[0].latitude = res.latitude;
            this.markers[0].longitude = res.longitude;
            this.markers[0].callout.content = '当前位置';
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
      // 重新获取位置并移动地图
      this.getLocation();
    },
    searchNearby() {
      // 使用腾讯地图搜索附近的POI
      uni.showLoading({
        title: '搜索中...'
      });
      
      // 这里示范如何添加多个标记点
      // 实际项目中可能需要调用腾讯地图WebService API
      setTimeout(() => {
        this.markers = [
          {
            id: 1,
            latitude: this.latitude,
            longitude: this.longitude,
            title: '当前位置',
            iconPath: '/static/location.png',
            width: 30,
            height: 30,
            callout: {
              content: '当前位置',
              color: '#000000',
              fontSize: 14,
              borderRadius: 4,
              bgColor: '#ffffff',
              padding: 8,
              display: 'ALWAYS'
            }
          },
          {
            id: 2,
            latitude: this.latitude + 0.01,
            longitude: this.longitude + 0.01,
            title: '附近地点1',
            iconPath: '/static/poi.png',
            width: 25,
            height: 25,
            callout: {
              content: '附近地点1',
              color: '#000000',
              fontSize: 14,
              borderRadius: 4,
              bgColor: '#ffffff',
              padding: 8,
              display: 'BYCLICK'
            }
          },
          {
            id: 3,
            latitude: this.latitude - 0.01,
            longitude: this.longitude - 0.01,
            title: '附近地点2',
            iconPath: '/static/poi.png',
            width: 25,
            height: 25,
            callout: {
              content: '附近地点2',
              color: '#000000',
              fontSize: 14,
              borderRadius: 4,
              bgColor: '#ffffff',
              padding: 8,
              display: 'BYCLICK'
            }
          }
        ];
        
        uni.hideLoading();
      }, 1500);
    },
    onRegionChange(e) {
      console.log('地图区域变化', e);
    },
    onMarkerTap(e) {
      console.log('点击了标记点', e);
      const markerId = e.markerId;
      const marker = this.markers.find(item => item.id === markerId);
      
      if (marker) {
        uni.showToast({
          title: `点击了: ${marker.title}`,
          icon: 'none'
        });
      }
    },
    onCalloutTap(e) {
      console.log('点击了标记点气泡', e);
    }
  }
}
</script>

<style lang="scss">
.map-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.controls {
  padding: $uni-spacing-row-base;
}
.uni-btn {
  background-color: $uni-color-primary;
  color: $uni-text-color-inverse;
  margin: $uni-spacing-col-base 0;
}
</style> 